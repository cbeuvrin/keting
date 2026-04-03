"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { articles as staticArticles } from "@/lib/blog-data";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper for random tilt that stays persistent during the session (not on every re-render)
const getStableRandomTilt = (index: number) => {
    return ((index * 137 + 31) % 20) - 10; // Random tilt between -10 and 10 degrees
};

export default function BlogPage() {
    const [mounted, setMounted] = useState(false);
    const [articles, setArticles] = useState(staticArticles);

    useEffect(() => {
        setMounted(true);
        const fetchDynamicArticles = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) {
                // Mix static and dynamic, putting dynamic ones first if wanted
                setArticles([...data, ...staticArticles]);
            }
        };
        fetchDynamicArticles();
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-white text-black font-heading">
            <Header />
            
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 bg-[#FAFAFA]">
                <div className="container mx-auto px-6 md:px-12">
                    <nav className="flex items-center gap-2 text-xs font-bold tracking-[2px] uppercase text-gray-400 mb-8">
                        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                            <Home size={12} /> Inicio
                        </Link>
                        <span>/</span>
                        <span className="text-black">Blog</span>
                    </nav>
                    
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
                        Pensamientos <br />
                        <span className="italic font-light text-gray-400">digitales</span>
                    </h1>
                    <p className="max-w-xl text-gray-500 text-lg md:text-xl font-light leading-relaxed">
                        Exploramos la intersección entre el diseño, la tecnología y los negocios para ayudarte a escalar tu marca.
                    </p>
                </div>
                
                {/* Gradient blend to next white section */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Grid Section */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {articles.map((article, i) => (
                            <div key={article.id} className="relative">
                                <Link href={`/blog/${article.slug}`}>
                                    <motion.article
                                        initial={{ opacity: 0, y: 20, rotate: getStableRandomTilt(i) }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        whileHover={{ 
                                            rotate: 0, 
                                            scale: 1.05, 
                                            zIndex: 50,
                                            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.15)"
                                        }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 260, 
                                            damping: 20,
                                            opacity: { duration: 0.5 },
                                            y: { duration: 0.5 }
                                        }}
                                        style={{
                                            backgroundColor: article.color,
                                            color: article.accent,
                                        }}
                                        className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl cursor-pointer flex flex-col"
                                    >
                                        {/* Category tag */}
                                        <div
                                            className="absolute top-6 left-6 text-[10px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full z-10"
                                            style={{ backgroundColor: article.accent, color: article.color }}
                                        >
                                            {article.category}
                                        </div>

                                        {/* Big decorative number */}
                                        <div
                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-[100px] font-black leading-none opacity-[0.05] pointer-events-none select-none"
                                            style={{ color: article.accent }}
                                        >
                                            {String(article.id).padStart(2, "0")}
                                        </div>

                                        {/* Content */}
                                        <div className="mt-auto p-7 flex flex-col gap-3 relative z-10">
                                            <h3
                                                className="text-xl font-bold leading-tight tracking-tight"
                                                style={{ color: article.accent }}
                                            >
                                                {article.title}
                                            </h3>
                                            <p
                                                className="text-sm leading-relaxed line-clamp-3 opacity-70"
                                                style={{ color: article.accent }}
                                            >
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between mt-2 pt-4" style={{ borderTop: `1px solid ${article.accent}22` }}>
                                                <span className="text-xs opacity-60 font-medium">
                                                    {article.author} · {article.date}
                                                </span>
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                                                    style={{ backgroundColor: article.accent, color: article.color }}
                                                >
                                                    <ExternalLink size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
