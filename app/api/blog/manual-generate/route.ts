import { NextResponse } from 'next/server';
import { ArticleGenerator } from '@/lib/ai/article-generator';
import { MultimediaSearch } from '@/lib/ai/multimedia-search';
import { createClient } from '@supabase/supabase-js';

// Permitir hasta 120 segundos (Vercel Pro / local dev)
export const maxDuration = 120;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

export async function POST(request: Request) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Falta la variable GEMINI_API_KEY en el servidor." }, { status: 500 });
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: "Faltan las variables de Supabase en el servidor." }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    try {
        const { topic } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "El tema es obligatorio" }, { status: 400 });
        }

        const generator = new ArticleGenerator(GEMINI_API_KEY);
        const multimedia = new MultimediaSearch(GEMINI_API_KEY, YOUTUBE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // A. Generar contenido del artículo
        console.log(`[manual-generate] Generando artículo: "${topic}"`);
        const article = await generator.generateFullArticle(topic);

        // B. Generar imagen con Gemini y guardar en Supabase Storage (URL permanente)
        console.log(`[manual-generate] Generando imagen para: "${article.title}"`);
        const imageUrl = await multimedia.generateAndStoreImage(article.title, article.category, article.slug);

        // C. Buscar video de YouTube
        const youtubeId = YOUTUBE_API_KEY
            ? await multimedia.searchYouTubeVideo(topic)
            : null;

        // D. Guardar artículo completo en Supabase
        const { data, error } = await supabase
            .from('articles')
            .insert([{
                slug: article.slug,
                category: article.category,
                title: article.title,
                excerpt: (article.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...'),
                author: article.author,
                date: article.date,
                image: imageUrl,
                youtube_id: youtubeId,
                content: article.content,
                word_count: article.wordCount,
                color: "#F5F5F5",
                accent: "#000000"
            }])
            .select()
            .single();

        if (error) {
            console.error("[manual-generate] Supabase error:", error);
            throw new Error(`Error de base de datos: ${error.message}`);
        }

        console.log(`[manual-generate] Artículo publicado: "${article.title}" con imagen permanente: ${imageUrl}`);

        return NextResponse.json({ 
            success: true, 
            title: article.title, 
            slug: article.slug,
            hasImage: imageUrl !== '/images/blog/default.png',
            hasVideo: !!youtubeId,
            imageUrl,
        });

    } catch (err: any) {
        console.error("[manual-generate] Error completo:", err);
        return NextResponse.json({ 
            error: err.message || 'Error desconocido en la generación AI'
        }, { status: 500 });
    }
}

