import { articles } from "@/lib/blog-data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2 } from "lucide-react";
import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/blog/view-tracker";

// Generate static params for all articles
export async function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const article = articles.find(a => a.slug.trim() === slug.trim());
    
    if (!article) return { title: "Artículo no encontrado - Keting Media" };

    return {
        title: `${article.title} - Blog de Keting Media`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            authors: [article.author],
            publishedTime: article.date,
        }
    };
}

import { NewsletterForm } from "@/components/blog/newsletter-form";
import { createClient } from '@supabase/supabase-js';
import { getCategoryImage } from "@/lib/blog-utils";

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

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black font-heading overflow-hidden">
            <Header />

            {/* View Tracker - Increments views in Supabase */}
            {isDbArticle && article.id && <ViewTracker articleId={article.id} />}

            <article className="pt-32 pb-20 relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-gradient-to-bl from-gray-100 to-transparent -z-10 blur-3xl opacity-50" />
                <style dangerouslySetInnerHTML={{ __html: `
                    .blog-content h2 { font-size: 2.5rem; font-weight: 700; margin-top: 4rem; margin-bottom: 2rem; letter-spacing: -0.05em; border-left: 4px solid #000; padding-left: 1.5rem; line-height: 1; }
                    .blog-content p { font-size: 1.25rem; line-height: 2; color: #374151; margin-bottom: 2.5rem; font-weight: 300; }
                    .blog-content img { width: 100%; border-radius: 2.5rem; margin: 4rem 0; box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.15); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                    .blog-content img:hover { transform: scale(1.02); }
                    .blog-content strong { color: #000; font-weight: 700; }
                    .blog-content ul { margin-bottom: 3rem; space-y: 4; }
                    .blog-content li { font-size: 1.125rem; margin-bottom: 1rem; color: #4B5563; position: relative; padding-left: 1.5rem; }
                    .blog-content li::before { content: "—"; position: absolute; left: 0; color: #9CA3AF; font-weight: bold; }
                    .blog-hero-img { transition: transform 0.8s ease; }
                    .blog-hero-img:hover { transform: scale(1.05); }
                `}} />

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
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                {article.author[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Autor</p>
                                <p className="text-sm font-medium">{article.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="text-gray-400" size={20} />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Publicado</p>
                                <p className="text-sm font-medium">{article.date}</p>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all text-sm font-medium">
                                <Share2 size={16} /> Compartir
                            </button>
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
                        <div className="blog-content max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>

                        <aside className="space-y-12">
                            <div className="p-8 bg-[#FAFAFA] rounded-3xl">
                                <h4 className="text-lg font-bold mb-4">Suscríbete al newsletter</h4>
                                <p className="text-sm text-gray-500 mb-6 font-light">
                                    Recibe los mejores consejos sobre diseño y negocios una vez por semana.
                                </p>
                                <NewsletterForm />
                            </div>

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
                            href={`/blog/${articles[(articles.indexOf(article) + 1) % articles.length].slug}`}
                            className="group"
                        >
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight group-hover:text-gray-500 transition-colors">
                                {articles[(articles.indexOf(article) + 1) % articles.length].title}
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
