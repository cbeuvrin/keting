import { NextResponse } from 'next/server';
import { ArticleGenerator } from '@/lib/ai/article-generator';
import { MultimediaSearch } from '@/lib/ai/multimedia-search';
import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request: Request) {
    try {
        const { topic } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "El tema es obligatorio" }, { status: 400 });
        }

        const generator = new ArticleGenerator(GEMINI_API_KEY);
        const multimedia = new MultimediaSearch(UNSPLASH_ACCESS_KEY, YOUTUBE_API_KEY);

        // A. Generar contenido (2500+ palabras por secciones)
        const article = await generator.generateFullArticle(topic);

        // B. Enriquecer con multimedia
        const imageUrl = await multimedia.searchImage(`premium ${topic}`);
        const youtubeId = await multimedia.searchYouTubeVideo(topic);

        // C. Guardar en Supabase
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
                color: "#F5F5F5", // Default premium gray
                accent: "#000000"
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ 
            success: true, 
            title: article.title, 
            slug: article.slug 
        });

    } catch (err: any) {
        console.error("Error en Manual Generate:", err);
        return NextResponse.json({ 
            error: "Fallo en la generación AI: " + (err.message || 'Error desconocido') 
        }, { status: 500 });
    }
}
