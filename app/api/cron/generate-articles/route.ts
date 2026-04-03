import { NextResponse } from 'next/server';
import { ArticleGenerator } from '@/lib/ai/article-generator';
import { MultimediaSearch } from '@/lib/ai/multimedia-search';
import { seedTopics } from '@/lib/ai/topics';
import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!; 

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: Request) {
    // 1. Verificación de seguridad
    const { searchParams } = new URL(request.url);
    if (searchParams.get('key') !== CRON_SECRET) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const generator = new ArticleGenerator(GEMINI_API_KEY);
    const multimedia = new MultimediaSearch(UNSPLASH_ACCESS_KEY, YOUTUBE_API_KEY);

    try {
        // 2. Obtener slugs ya existentes para evitar duplicados
        const { data: existingArticles } = await supabase.from('articles').select('slug');
        const existingSlugs = new Set(existingArticles?.map(a => a.slug) || []);

        // 3. Filtrar temas semilla que aún no se han publicado
        const pendingTopics = seedTopics.filter(t => !existingSlugs.has(slugify(t.prompt)));

        // 4. Elegir hasta 5 temas para hoy
        let todaysJobs: string[] = [];

        if (pendingTopics.length > 0) {
            // Usamos los temas de la lista proporcionada por el usuario
            todaysJobs = pendingTopics.slice(0, 5).map(t => t.prompt);
        } else {
            // Si ya usamos todos los temas semillas, pedimos a la IA que genere 5 tendencias actuales
            console.log("Semilla agotada. Pidiendo a IA generar 5 tendencias...");
            todaysJobs = await generator.generateTrends();
        }

        const results = [];

        // 5. Ejecutar la generación
        for (const topic of todaysJobs) {
            try {
                console.log(`Procesando artículo diario: ${topic}`);
                const article = await generator.generateFullArticle(topic);
                const imageUrl = await multimedia.searchImage(`premium dark technology ${topic}`);
                const youtubeId = await multimedia.searchYouTubeVideo(topic);

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

                if (error) throw error;
                results.push({ topic, status: 'success', slug: article.slug });

            } catch (err: any) {
                console.error(`Fallo en artículo ${topic}:`, err.message);
                results.push({ topic, status: 'error', message: err.message });
            }
        }

        return NextResponse.json({ 
            date: new Date().toISOString(),
            processed: results.length,
            summary: results 
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Función helper local
function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
