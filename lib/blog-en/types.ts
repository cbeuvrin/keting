// Forma de un artículo del blog EN. Vive en el repo (no en Supabase): es un
// subconjunto curado y traducido/adaptado de artículos ES, versionado en git.
// `esSlug` conecta cada artículo con su original en español para el hreflang
// recíproco (ver lib/i18n/routes.ts → BLOG_SLUG_PAIRS).
export interface EnArticle {
    slug: string;
    esSlug: string;
    title: string;
    excerpt: string;
    content: string; // HTML — se pasa por sanitizeHtml antes de renderizar
    category: string;
    date: string;
    image: string;
    author: string;
    wordCount: number;
    readTime: number; // minutos, calculado a partir de wordCount
}
