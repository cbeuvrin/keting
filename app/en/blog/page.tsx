import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EN_ARTICLES } from "@/lib/blog-en";
import { getCategoryImage } from "@/lib/blog-utils";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";

// Índice del blog EN — subconjunto curado de artículos que viven en el repo
// (lib/blog-en/), no en Supabase (plan GEO 4.5). A diferencia de /blog (que
// trae cientos de artículos de Supabase y necesita filtros client-side), este
// índice es un server component simple: son pocos artículos y no hace falta
// interactividad, así que no se paga el costo de un "use client" ni el riesgo
// de filtrar datos bilingües al HTML.
export const metadata: Metadata = {
    title: "Blog · Custom Software, Web & AI Insights · Keting Media",
    description:
        "Guides and analysis on custom software development, web and mobile apps, e-commerce, and applied AI — written for companies evaluating nearshore development in Mexico.",
    alternates: {
        canonical: "/en/blog",
        languages: {
            "es-MX": "/blog",
            en: "/en/blog",
            "x-default": "/blog",
        },
    },
    openGraph: {
        title: "Blog · Keting Media",
        description:
            "Guides and analysis on custom software, web and mobile apps, e-commerce, and applied AI.",
        url: "/en/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog · Keting Media",
        description: "Guides and analysis on custom software, web, apps, and applied AI.",
    },
};

export default function EnBlogPage() {
    const articles = EN_ARTICLES;
    const [featured, ...rest] = articles;

    return (
        <main className="min-h-screen bg-[#F0F2F5] text-black font-sans selection:bg-blue-100">
            <JsonLd data={breadcrumb("Blog", "/en/blog")} />
            <Header />

            <section className="pt-32 pb-16 px-6 sm:px-12 bg-[#F0F2F5]">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="flex items-center justify-center gap-3 mb-5">
                            <span className="block w-10 h-px bg-black/30" />
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50">
                                Blog
                            </span>
                            <span className="block w-10 h-px bg-black/30" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
                            Ideas on{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                                software
                            </span>
                            , web & AI
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                            Guides and analysis on custom software development, web and mobile apps,
                            e-commerce, and applied AI — written by the Keting Media team for US
                            companies evaluating nearshore development in Mexico.
                        </p>
                    </div>

                    {featured && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <ArticleCard article={featured} large />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                {rest.slice(0, 2).map((article) => (
                                    <ArticleCard key={article.slug} article={article} />
                                ))}
                            </div>
                        </div>
                    )}

                    {rest.length > 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {rest.slice(2).map((article) => (
                                <ArticleCard key={article.slug} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}

function ArticleCard({ article, large = false }: { article: (typeof EN_ARTICLES)[number]; large?: boolean }) {
    const imageUrl = getCategoryImage(article, 800);

    return (
        <Link href={`/en/blog/${article.slug}`} className="block h-full group">
            <div
                className={`relative w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-gray-800 to-gray-900 ${
                    large ? "h-[420px] lg:h-full min-h-[420px]" : "h-[260px]"
                }`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-7 md:p-8 flex flex-col justify-end">
                    <span className="self-start bg-white text-blue-600 border border-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm mb-4">
                        {article.category}
                    </span>
                    <h2
                        className={`font-heading font-medium text-white leading-[0.95] tracking-tighter mb-4 group-hover:text-blue-100 transition-colors ${
                            large ? "text-2xl md:text-4xl" : "text-lg md:text-xl"
                        }`}
                    >
                        {article.title}
                    </h2>
                    <div className="flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-widest opacity-80">
                        <span>{article.date}</span>
                        <span>·</span>
                        <span>{article.readTime} min read</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
