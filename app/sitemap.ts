import { MetadataRoute } from 'next';
import { articles as staticArticles } from '@/lib/blog-data';
import { CASE_STUDY_SLUGS, CASE_STUDIES_PUBLISHED_DATE } from '@/lib/case-studies';
import { EN_ARTICLES } from '@/lib/blog-en';
import { createClient } from '@supabase/supabase-js';
import { toIsoDate } from '@/lib/blog-utils';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ketingmedia.com';

// Se genera en cada petición. La versión anterior declaraba `revalidate = 3600`
// contando con que se refrescara sola cada hora, y no lo hacía: medido en
// producción, el sitemap llevaba 21 horas devolviendo el contenido del último
// deploy, y `revalidatePath("/sitemap.xml")` tampoco lo alcanzaba —el endpoint
// respondía 200 pero el <lastmod> no se movía—. El efecto era que cada
// artículo nuevo quedaba fuera del sitemap hasta que alguien tocara código.
//
// El costo de generarlo siempre es una consulta a Supabase por petición, y el
// sitemap lo piden los rastreadores unas cuantas veces al día. Barato a cambio
// de que un artículo publicado esté listado en el momento.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Obtener artículos de Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: dbArticles } = await supabase
        .from('articles')
        .select('slug, date, created_at, updated_at');

    // 2. Rutas fijas, SIN <lastmod>. Antes llevaban `new Date()` (igual que el blog EN): 33 de las 92
    // URLs se anunciaban como "cambiadas hoy" en cada petición. No hay una fecha
    // real de su última edición (el sitemap corre en Vercel, sin git), y una
    // fecha falsa es peor que ninguna: Google aprende a ignorar el lastmod del
    // sitio entero, incluido el de los artículos, que ahora sí es real.
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
        { url: `${SITE_URL}/desarrollo-web`, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/desarrollo-de-software`, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/automatizacion-de-procesos`, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/en`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/en/desarrollo-web`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/en/desarrollo-de-software`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/en/automatizacion-de-procesos`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/software-para-eventos`, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/en/software-para-eventos`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/portafolio`, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${SITE_URL}/en/portafolio`, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${SITE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/en/about`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/nosotros/carlos-beuvrin`, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/en/about/carlos-beuvrin`, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/contacto`, changeFrequency: 'yearly', priority: 0.75 },
        { url: `${SITE_URL}/en/contact`, changeFrequency: 'yearly', priority: 0.65 },
        { url: `${SITE_URL}/aviso-de-privacidad`, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${SITE_URL}/terminos-y-condiciones`, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${SITE_URL}/en/aviso-de-privacidad`, changeFrequency: 'yearly', priority: 0.2 },
        { url: `${SITE_URL}/en/terminos-y-condiciones`, changeFrequency: 'yearly', priority: 0.2 },
    ];

    // 3. Casos individuales del portafolio, en español e inglés.
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
    //
    // <lastmod> es la fecha real del artículo: su última edición si la hay
    // (`updated_at`, que pone un trigger en Supabase) y si no la de publicación.
    // Antes era `new Date()` para todos, así que cada petición anunciaba los 25
    // artículos como "cambiados hoy" — Google aprende a ignorar un lastmod que
    // siempre miente, y entonces tampoco ve las actualizaciones de verdad.
    const seenEsBlogSlugs = new Set<string>();
    const blogEsRoutes: MetadataRoute.Sitemap = [];

    for (const { slug, lastmod } of [
        ...staticArticles.map((article) => ({ slug: article.slug, lastmod: toIsoDate(article.date) })),
        ...(dbArticles || []).map((article) => ({
            slug: article.slug,
            lastmod: toIsoDate(article.updated_at) ?? toIsoDate(article.date) ?? toIsoDate(article.created_at),
        })),
    ]) {
        if (!slug || seenEsBlogSlugs.has(slug)) continue;
        seenEsBlogSlugs.add(slug);
        blogEsRoutes.push({
            url: `${SITE_URL}/blog/${slug}`,
            ...(lastmod ? { lastModified: lastmod } : {}),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    }

    // 6. Blog EN — subconjunto curado que vive en el repo (lib/blog-en/), no en
    // Supabase. Su fecha es la que lleva cada artículo en el repo.
    const blogEnRoutes: MetadataRoute.Sitemap = EN_ARTICLES.map((article) => {
        const lastmod = toIsoDate(article.date);
        return {
            url: `${SITE_URL}/en/blog/${article.slug}`,
            ...(lastmod ? { lastModified: lastmod } : {}),
            changeFrequency: 'monthly' as const,
            priority: 0.65,
        };
    });

    // 7. Índices del blog: cambian cuando cambia un artículo, así que su fecha
    // es la del artículo más reciente de su idioma.
    const masReciente = (rutas: MetadataRoute.Sitemap) =>
        rutas.map((r) => r.lastModified as string | undefined).filter(Boolean).sort().pop();
    const blogIndexRoutes: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/blog`, lastModified: masReciente(blogEsRoutes), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/en/blog`, lastModified: masReciente(blogEnRoutes), changeFrequency: 'weekly', priority: 0.7 },
    ];

    return [...staticRoutes, ...blogIndexRoutes, ...caseStudyRoutes, ...blogEsRoutes, ...blogEnRoutes];
}
