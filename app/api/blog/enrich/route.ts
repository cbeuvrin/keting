
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enrichArticle } from '@/lib/blog-enrichment';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
    // Auth: solo admin (evita abuso de IA y escrituras no autorizadas).
    if (!isAuthorizedAdmin(request)) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // El cliente se crea AQUÍ, no al importar el módulo: createClient lanza si
    // faltan las env vars, y Next importa la ruta al recolectar datos en el
    // build → tumbaba el build entero ("supabaseUrl is required").
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: "Supabase env missing" }, { status: 500 });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    try {
        // 1. Fetch articles that need enrichment (those with default images or missing YouTube IDs)
        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, title, image, youtube_id, category')
            .or('image.ilike.%default%,image.ilike.%unsplash%,youtube_id.is.null');

        if (error) throw error;
        if (!articles || articles.length === 0) {
            return NextResponse.json({ message: "No articles need enrichment." });
        }

        const results = [];
        
        // 2. Process each article
        for (const article of articles) {
            console.log(`Enriching: ${article.title}`);
            
            const enrichment = await enrichArticle(article.title, article.category, article.image);
            
            if (Object.keys(enrichment).length > 0) {
                const { error: updateError } = await supabase
                    .from('articles')
                    .update(enrichment)
                    .eq('id', article.id);
                
                if (!updateError) {
                    results.push({ id: article.id, title: article.title, status: "enriched" });
                }
            }
        }

        return NextResponse.json({ 
            message: `Enrichment complete. Processed ${results.length} articles.`,
            results 
        });

    } catch (error: any) {
        console.error("Enrichment API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
