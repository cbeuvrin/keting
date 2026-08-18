import { MetadataRoute } from 'next';
import { articles as staticArticles } from '@/lib/blog-data';
import { CASE_STUDY_SLUGS, CASE_STUDIES_PUBLISHED_DATE } from '@/lib/case-studies';
import { EN_ARTICLE_SLUGS } from '@/lib/blog-en';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ketingmedia.com';

// Revalida cada hora: el sitemap refleja altas/bajas de artículos en la DB sin
// necesidad de un redeploy (antes era estático y quedaba desfasado).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Obtener artículos de Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: dbArticles } = await supabase
        .from('articles')
        .select('slug, date');

    // 2. Definir rutas estáticas principales
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${SITE_URL}/desarrollo-web`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/desarrollo-de-software`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/automatizacion-de-procesos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/en`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/en/desarrollo-web`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/en/desarrollo-de-software`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/en/automatizacion-de-procesos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/software-para-eventos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/en/software-para-eventos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/portafolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/en/portafolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/casos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/en/case-studies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/en/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/nosotros/carlos-beuvrin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/en/about/carlos-beuvrin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.75 },
        { url: `${SITE_URL}/en/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.65 },
        { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/en/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${SITE_URL}/aviso-de-privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${SITE_URL}/terminos-y-condiciones`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${SITE_URL}/en/aviso-de-privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
        { url: `${SITE_URL}/en/terminos-y-condiciones`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    ];

    // 3. Casos de éxito — 9 en ES (/casos/[slug]) + 9 en EN (/en/case-studies/[slug]).
    const caseStudyRoutes: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.flatMap((slug) => [
        {
            url: `${SITE_URL}/casos/${slug}`,
            lastModified: new Date(CASE_STUDIES_PUBLISHED_DATE),
            changeFrequency: 'yearly' as const,
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/en/case-studies/${slug}`,
            lastModified: new Date(CASE_STUDIES_PUBLISHED_DATE),
            changeFrequency: 'yearly' as const,
            priority: 0.7,
        },
    ]);

    // 4 y 5. Blog ES: artículos estáticos (lib/blog-data.ts) + artículos de
    // Supabase, en un solo recorrido y DEDUPLICADOS por slug.
    //
    // Ambas fuentes sirven la misma ruta /blog/[slug], así que un slug presente
    // en las dos se emitía dos veces en el sitemap. Hoy los conjuntos son
    // disjuntos y no se nota, pero en cuanto se migre un artículo estático a la
    // DB (o el cron genere un slug que ya existe en el repo) Google recibe URLs
    // duplicadas. Los estáticos van primero: si hay colisión, gana el repo.
    const seenEsBlogSlugs = new Set<string>();
    const blogEsRoutes: MetadataRoute.Sitemap = [];

    for (const slug of [
        ...staticArticles.map((article) => article.slug),
        ...(dbArticles || []).map((article) => article.slug),
    ]) {
        if (!slug || seenEsBlogSlugs.has(slug)) continue;
        seenEsBlogSlugs.add(slug);
        blogEsRoutes.push({
            url: `${SITE_URL}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    }

    // 6. Blog EN — subconjunto curado que vive en el repo (lib/blog-en/), no en Supabase.
    const blogEnRoutes: MetadataRoute.Sitemap = EN_ARTICLE_SLUGS.map((slug) => ({
        url: `${SITE_URL}/en/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.65,
    }));

    // Retonar unión de todas las rutas
    return [...staticRoutes, ...caseStudyRoutes, ...blogEsRoutes, ...blogEnRoutes];
}
