import { articles } from "@/lib/blog-data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/blog/view-tracker";
import { AuthorBio } from "@/components/blog/author-bio";
import { ArticleCTA } from "@/components/blog/article-cta";
import { ShareButton } from "@/components/blog/share-button";
import { BlogContentStyles } from "@/components/blog/blog-content-styles";
import { AUTHOR } from "@/lib/author";
import { getEnBlogSlug, authorHref } from "@/lib/i18n/routes";

// Revalida cada hora: los artículos de la DB (altas, ediciones, bajas) se
// reflejan sin necesidad de un redeploy. Antes la página quedaba cacheada
// indefinidamente y servía contenido viejo.
export const revalidate = 3600;

// Generate static params for all articles
export async function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Busca primero en los artículos estáticos; si no está, en Supabase (los
    // artículos generados por IA viven solo en la DB). Sin esto, todos esos
    // posts heredaban el título "Artículo no encontrado" en Google.
    type ArticleMeta = { title: string; excerpt?: string; author?: string; date?: string; image?: string };
    let article: ArticleMeta | undefined = articles.find(a => a.slug.trim() === slug.trim());

    if (!article) {
        const { data } = await supabase
            .from('articles')
            .select('title, excerpt, author, date, image')
            .eq('slug', slug)
            .single();
        if (data) article = data as ArticleMeta;
    }

    if (!article) return { title: "Artículo no encontrado - Keting Media" };

    // Algunos artículos de IA guardaron JSON crudo en el excerpt (p.ej. "title:…,
    // category:…"). Si viene malformado, usa un fallback limpio basado en el título.
    let rawDesc = article.excerpt || "";
    const looksMalformed = rawDesc.trim().startsWith("{") || /\b(title|category|content)\s*:/i.test(rawDesc);
    if (!rawDesc || looksMalformed) {
        rawDesc = `${article.title}. Análisis y estrategia por Keting Media — diseño y desarrollo de software, web y apps.`;
    }
    const description = rawDesc.replace(/[{}[\]"]/g, "").replace(/\s+/g, " ").trim().slice(0, 160);
    const image = article.image && article.image.startsWith('http') ? article.image : undefined;

    // hreflang recíproco: solo si este artículo ya tiene traducción en el
    // blog EN (lib/blog-en/) — evita apuntar el alternate a un artículo
    // distinto o al índice cuando no existe una traducción real.
    const enSlug = getEnBlogSlug(slug);

    return {
        title: `${article.title} - Blog de Keting Media`,
        description,
        alternates: {
            canonical: `/blog/${slug}`,
            ...(enSlug
                ? {
                      languages: {
                          "es-MX": `/blog/${slug}`,
                          en: `/en/blog/${enSlug}`,
                      },
                  }
                : {}),
        },
        openGraph: {
            title: article.title,
            description,
            url: `/blog/${slug}`,
            type: 'article',
            ...(article.author ? { authors: [article.author] } : {}),
            ...(article.date ? { publishedTime: article.date } : {}),
            ...(image ? { images: [{ url: image }] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}

import { createClient } from '@supabase/supabase-js';
import { getCategoryImage } from "@/lib/blog-utils";
import { sanitizeHtml } from "@/lib/sanitize-html";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface BlogArticle {
    id: any;
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    image: string;
    content: string;
    youtube_id?: string;
    accent: string;
    color: string;
    views?: number;
}

export default async function ArticlePage({ params }: { params: any }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    let article: BlogArticle | undefined = articles.find(a => a.slug.trim() === slug.trim());
    let isDbArticle = false;

    if (!article) {
        const { data } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (data) {
            article = data as BlogArticle;
            isDbArticle = true;
        }
    } else {
        // If it's a static article, check if it's mirrored in DB for views
        const { data } = await supabase
            .from('articles')
            .select('id, views')
            .eq('slug', slug)
            .single();
        if (data) {
            article = { ...article, id: data.id, views: data.views };
            isDbArticle = true;
        }
    }

    if (!article) {
        notFound();
    }

    // "Siguiente lectura": el artículo puede venir solo de la DB (no está en la
    // lista estática), así que buscamos por slug y caemos al primero distinto.
    const idx = articles.findIndex(a => a.slug.trim() === article!.slug.trim());
    const nextArticle =
        idx === -1
            ? (articles.find(a => a.slug.trim() !== article!.slug.trim()) ?? articles[0])
            : articles[(idx + 1) % articles.length];

    // Schema Article: ayuda a Google y a las IA a entender autoría, fecha e imagen
    // del artículo (mejora indexación y citabilidad).
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: article.image ? [article.image] : undefined,
        datePublished: article.date,
        author: {
            "@type": "Person",
            name: AUTHOR.name,
            jobTitle: AUTHOR.jobTitle,
            url: `https://ketingmedia.com/nosotros/carlos-beuvrin`,
            sameAs: [AUTHOR.linkedin],
        },
        publisher: {
            "@type": "Organization",
            name: "Keting Media",
            logo: { "@type": "ImageObject", url: "https://ketingmedia.com/keting-logo.png" },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://ketingmedia.com/blog/${article.slug}`,
        },
    };

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black font-heading overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <Header />

            {/* View Tracker - Increments views in Supabase */}
            {isDbArticle && article.id && <ViewTracker articleId={article.id} />}

            <article className="pt-32 pb-20 relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-gradient-to-bl from-gray-100 to-transparent -z-10 blur-3xl opacity-50" />
                <BlogContentStyles />

                <div className="container mx-auto px-6 md:px-12">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors mb-12 group"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Volver al blog
                    </Link>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-black text-white text-[10px] font-bold tracking-[2px] uppercase rounded-full">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Clock size={12} />
                            <span>5 min lectura</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 max-w-5xl">
                        {(() => {
                            const words = article.title.split(' ');
                            const splitPoint = Math.ceil(words.length / 2);
                            const first = words.slice(0, splitPoint).join(' ');
                            const second = words.slice(splitPoint).join(' ');
                            return (
                                <>
                                    {first} <br />
                                    <span className="italic font-light text-gray-400">{second}</span>
                                </>
                            );
                        })()}
                    </h1>

                    <div className="flex flex-wrap items-center gap-8 py-8 border-y border-gray-100 mb-16">
                        {/* Enlaza al perfil del autor: su nombre aparece en cada
                            artículo y es una vía natural a /nosotros/carlos-beuvrin. */}
                        <Link href={authorHref(false)} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 transition-colors group-hover:bg-black group-hover:text-white">
                                {article.author[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Autor</p>
                                <p className="text-sm font-medium group-hover:underline underline-offset-4 decoration-1">{article.author}</p>
                            </div>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Calendar className="text-gray-400" size={20} />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Publicado</p>
                                <p className="text-sm font-medium">{article.date}</p>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <ShareButton title={article.title} />
                        </div>
                    </div>

                    <div 
                        className="w-full h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden mb-20 relative shadow-2xl bg-gray-100"
                    >
                        <img 
                            src={getCategoryImage(article)} 
                            alt={article.title} 
                            className="w-full h-full object-cover blog-hero-img" 
                        />
                    </div>

                    {article.youtube_id && (
                        <div className="w-full aspect-video rounded-[2rem] overflow-hidden mb-20 shadow-2xl">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${article.youtube_id}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-20">
                        {/* min-w-0: por defecto un hijo de grid no se encoge por debajo del
                            ancho de su contenido, así que un enlace largo, una palabra sin
                            puntos de corte o una tabla estiraban esta columna más allá de la
                            pantalla — y el overflow-hidden del <main> recortaba el texto en
                            móvil (pasaba en TODOS los artículos, no solo los que llevan tabla). */}
                        <div className="max-w-none min-w-0">
                            {/* La clase blog-content va SOLO en el HTML del artículo: sus reglas
                                de img/p/etc. (width:100%, etc.) rompían la caja de autor. */}
                            <div className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
                            <ArticleCTA title={article.title} />
                            <AuthorBio />
                        </div>

                        <aside className="space-y-12">
                            <div>
                                <h4 className="text-lg font-bold mb-6">Artículos relacionados</h4>
                                <div className="space-y-6">
                                    {articles.filter(a => a.id !== article.id).slice(0, 3).map(related => (
                                        <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{related.category}</p>
                                            <h5 className="text-sm font-bold group-hover:text-gray-600 transition-colors leading-tight">
                                                {related.title}
                                            </h5>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            <section className="py-32 bg-[#FAFAFA] border-t border-gray-100">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mb-8">Siguiente lectura</p>
                        <Link
                            href={`/blog/${nextArticle.slug}`}
                            className="group"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight group-hover:text-gray-500 transition-colors">
                                {nextArticle.title}
                            </h2>
                            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                                Leer ahora <ArrowRight size={14} />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
