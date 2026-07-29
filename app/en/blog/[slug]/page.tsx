import { EN_ARTICLES, EN_ARTICLE_SLUGS, getEnArticle } from "@/lib/blog-en";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorBio } from "@/components/blog/author-bio";
import { ArticleCTA } from "@/components/blog/article-cta";
import { ShareButton } from "@/components/blog/share-button";
import { BlogContentStyles } from "@/components/blog/blog-content-styles";
import { AUTHOR } from "@/lib/author";
import { AUTHOR_ABOUT } from "@/lib/about-content";
import { getCategoryImage } from "@/lib/blog-utils";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { getEsBlogSlug, authorHref } from "@/lib/i18n/routes";

// Página de artículo del blog EN — mismo diseño que /blog/[slug] (ES) pero
// leyendo de lib/blog-en/ (repo, no Supabase). No hay ViewTracker: esos
// artículos no viven en la tabla `articles` de Supabase, así que no hay un
// `id` de fila al que sumarle vistas.
export async function generateStaticParams() {
    return EN_ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const article = getEnArticle(slug);

    if (!article) return { title: "Article not found - Keting Media" };

    const description = article.excerpt.slice(0, 160);
    const image = article.image && article.image.startsWith("http") ? article.image : undefined;

    // hreflang recíproco: el slug ES vive en article.esSlug (fuente única de
    // verdad, ver lib/blog-en/types.ts) — sin necesidad de recorrer el mapa.
    const esSlug = article.esSlug ?? getEsBlogSlug(slug);

    return {
        title: `${article.title} - Keting Media Blog`,
        description,
        alternates: {
            canonical: `/en/blog/${slug}`,
            ...(esSlug
                ? {
                      languages: {
                          "es-MX": `/blog/${esSlug}`,
                          en: `/en/blog/${slug}`,
                      },
                  }
                : {}),
        },
        openGraph: {
            title: article.title,
            description,
            url: `/en/blog/${slug}`,
            type: "article",
            authors: [article.author],
            ...(article.date ? { publishedTime: article.date } : {}),
            ...(image ? { images: [{ url: image }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}

export default async function EnArticlePage({ params }: { params: any }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const article = getEnArticle(slug);
    if (!article) {
        notFound();
    }

    const idx = EN_ARTICLES.findIndex((a) => a.slug === article.slug);
    const nextArticle = EN_ARTICLES[(idx + 1) % EN_ARTICLES.length];

    // Schema Article en inglés — mismo propósito que en /blog/[slug]: ayuda a
    // Google y a las IA a entender autoría, fecha e imagen. AUTHOR.jobTitle
    // está en español a propósito (schema ES); aquí usamos el rol ya
    // traducido de AUTHOR_ABOUT.en (misma fuente que /en/about/carlos-beuvrin).
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
            jobTitle: AUTHOR_ABOUT.en.roleLabel,
            url: `https://ketingmedia.com/en/about/carlos-beuvrin`,
            sameAs: [AUTHOR.linkedin],
        },
        publisher: {
            "@type": "Organization",
            name: "Keting Media",
            logo: { "@type": "ImageObject", url: "https://ketingmedia.com/keting-logo.png" },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://ketingmedia.com/en/blog/${article.slug}`,
        },
    };

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black font-heading overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <Header />

            <article className="pt-32 pb-20 relative">
                <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-gradient-to-bl from-gray-100 to-transparent -z-10 blur-3xl opacity-50" />
                <BlogContentStyles />

                <div className="container mx-auto px-6 md:px-12">
                    <Link
                        href="/en/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors mb-12 group"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to blog
                    </Link>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-black text-white text-[10px] font-bold tracking-[2px] uppercase rounded-full">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Clock size={12} />
                            <span>{article.readTime} min read</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 max-w-5xl">
                        {(() => {
                            const words = article.title.split(" ");
                            const splitPoint = Math.ceil(words.length / 2);
                            const first = words.slice(0, splitPoint).join(" ");
                            const second = words.slice(splitPoint).join(" ");
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
                        <Link href={authorHref(true)} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 transition-colors group-hover:bg-black group-hover:text-white">
                                {article.author[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Author</p>
                                <p className="text-sm font-medium group-hover:underline underline-offset-4 decoration-1">{article.author}</p>
                            </div>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Calendar className="text-gray-400" size={20} />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Published</p>
                                <p className="text-sm font-medium">{article.date}</p>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <ShareButton title={article.title} />
                        </div>
                    </div>

                    <div className="w-full h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden mb-20 relative shadow-2xl bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getCategoryImage(article)}
                            alt={article.title}
                            className="w-full h-full object-cover blog-hero-img"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-20">
                        <div className="max-w-none min-w-0">
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
                            />
                            <ArticleCTA title={article.title} />
                            <AuthorBio />
                        </div>

                        <aside className="space-y-12">
                            <div>
                                <h4 className="text-lg font-bold mb-6">Related articles</h4>
                                <div className="space-y-6">
                                    {EN_ARTICLES.filter((a) => a.slug !== article.slug)
                                        .slice(0, 3)
                                        .map((related) => (
                                            <Link key={related.slug} href={`/en/blog/${related.slug}`} className="group block">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                    {related.category}
                                                </p>
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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mb-8">Next read</p>
                        <Link href={`/en/blog/${nextArticle.slug}`} className="group">
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight group-hover:text-gray-500 transition-colors">
                                {nextArticle.title}
                            </h2>
                            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                                Read now <ArrowRight size={14} />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
