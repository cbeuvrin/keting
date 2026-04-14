import { MetadataRoute } from 'next';
import { articles as staticArticles } from '@/lib/blog-data';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://keting.com.mx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Obtener artículos de Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: dbArticles } = await supabase
        .from('articles')
        .select('slug, date');

    // 2. Definir rutas estáticas principales
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/soluciones-digitales`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/webdesing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
    ];

    // 3. Procesar artículos estáticos (lib/blog-data.ts)
    const blogStaticRoutes: MetadataRoute.Sitemap = staticArticles.map((article) => ({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: new Date(), // O podrías parsear article.date si tuviera formato ISO
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // 4. Procesar artículos de la Base de Datos
    const blogDbRoutes: MetadataRoute.Sitemap = (dbArticles || []).map((article) => ({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Retonar unión de todas las rutas
    return [...staticRoutes, ...blogStaticRoutes, ...blogDbRoutes];
}
