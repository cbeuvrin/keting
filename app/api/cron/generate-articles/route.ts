import { NextResponse } from 'next/server';
import { ArticleGenerator } from '@/lib/ai/article-generator';
import { MultimediaSearch } from '@/lib/ai/multimedia-search';
import { seedTopics } from '@/lib/ai/topics';
import { createClient } from '@supabase/supabase-js';

// Vercel Pro: permitir hasta 120s para la generación IA + imagen
export const maxDuration = 120;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
    // 1. Verificación de seguridad
    const { searchParams } = new URL(request.url);
    if (searchParams.get('key') !== CRON_SECRET) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Validar variables de entorno críticas
    if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: 'Faltan variables de entorno en Vercel.' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const generator = new ArticleGenerator(GEMINI_API_KEY);
    // Imagen 4.0 → Supabase Storage: URL permanente desde el primer día
    const multimedia = new MultimediaSearch(GEMINI_API_KEY, YOUTUBE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    try {
        // 3. Obtener slugs existentes para evitar duplicados
        const { data: existingArticles } = await supabase.from('articles').select('slug');
        const existingSlugs = new Set(existingArticles?.map(a => a.slug) || []);

        // 4. Elegir 1 tema: primero de la semilla, luego IA si ya se agotó
        const pendingTopics = seedTopics.filter(t => !existingSlugs.has(slugify(t.prompt)));

        let todayTopic: string;

        if (pendingTopics.length > 0) {
            todayTopic = pendingTopics[0].prompt;
            console.log(`[cron] Usando tema semilla: "${todayTopic}"`);
        } else {
            console.log('[cron] Semilla agotada — IA generando tema nuevo...');
            const trends = await generator.generateTrends();
            const freshTrends = trends.filter((t: string) => !existingSlugs.has(slugify(t)));
            todayTopic = freshTrends[0] || trends[0];
            console.log(`[cron] Tema IA: "${todayTopic}"`);
        }

        // 5. Generar el artículo completo
        console.log(`[cron] Generando artículo: "${todayTopic}"`);
        const article = await generator.generateFullArticle(todayTopic);

        // 6. Generar imagen con Imagen 4.0 → sube a Supabase Storage → URL permanente
        console.log(`[cron] Generando imagen con Imagen 4.0 para: "${article.title}"`);
        const imageUrl = await multimedia.generateAndStoreImage(article.title, article.category, article.slug);

        // 7. Buscar video de YouTube
        const youtubeId = YOUTUBE_API_KEY
            ? await multimedia.searchYouTubeVideo(todayTopic)
            : null;

        // 8. Guardar en Supabase
        const { error } = await supabase.from('articles').insert([{
            slug: article.slug,
            category: article.category,
            title: article.title,
            excerpt: (article.content.substring(0, 200).replace(/<[^>]*>?/gm, '') + '...'),
            author: article.author,
            date: article.date,
            image: imageUrl,
            youtube_id: youtubeId,
            content: article.content,
            word_count: article.wordCount,
            color: "#F9F9F9",
            accent: "#000000"
        }]);

        if (error) throw new Error(`Supabase: ${error.message}`);

        console.log(`[cron] ✅ Publicado: "${article.title}" | Imagen: ${imageUrl}`);

        return NextResponse.json({
            date: new Date().toISOString(),
            status: 'success',
            title: article.title,
            slug: article.slug,
            wordCount: article.wordCount,
            imageUrl,
        });

    } catch (err: any) {
        console.error('[cron] ❌ Error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Helper: normaliza acentos y convierte a slug (igual que ArticleGenerator)
function slugify(text: string) {
    return text.toString().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
