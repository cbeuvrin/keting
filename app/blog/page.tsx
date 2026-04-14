"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, Home, Filter, Sparkles } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { articles as staticArticles } from "@/lib/blog-data";
import { useEffect, useState, useMemo } from "react";
import { createClient } from '@supabase/supabase-js';
import { categories } from "@/lib/ai/topics";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper for random tilt
const getStableRandomTilt = (index: number) => {
    return ((index * 137 + 31) % 10) - 5; // Reduced tilt for better alignment in groups
};

export default function BlogPage() {
    const [mounted, setMounted] = useState(false);
    const [dbArticles, setDbArticles] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("Todos");

    useEffect(() => {
        setMounted(true);
        const fetchDynamicArticles = async () => {
            const { data } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) {
                setDbArticles(data);
            }
        };
        fetchDynamicArticles();
    }, []);

    // Combine and normalize articles
    const allArticles = useMemo(() => {
        return [...dbArticles, ...staticArticles];
    }, [dbArticles]);

    // Grouping logic: an article can belong to multiple categories if they are comma-separated
    const groupedArticles = useMemo(() => {
        const groups: Record<string, any[]> = {};
        
        categories.forEach(cat => {
            groups[cat] = allArticles.filter(article => {
                const articleCats = article.category.split(',').map((c: string) => c.trim().toLowerCase());
                return articleCats.includes(cat.toLowerCase()) || article.category.toLowerCase() === cat.toLowerCase();
            });
        });

        return groups;
    }, [allArticles]);

    if (!mounted) return null;

    const availableCategories = ["Todos", ...categories];

    return (
        <main className="min-h-screen bg-white text-black font-heading">
            <Header />
            
            {/* Filter Bar */}
            <section className="relative pt-40 pb-16 bg-[#F9F9F9]">
                <div className="container mx-auto px-6 md:px-12">
                    <nav className="flex items-center justify-start gap-2 text-[10px] font-bold tracking-[3px] uppercase text-gray-400 mb-10">
                        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                            <Home size={10} /> Inicio
                        </Link>
                        <span>/</span>
                        <span className="text-black">Explorar</span>
                    </nav>
                    
                    <div className="max-w-4xl text-left">
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-8">
                            Nuestra <br />
                            <span className="italic font-light text-gray-300">Inteligencia</span>
                        </h1>
                        <p className="max-w-xl text-gray-500 text-lg md:text-xl font-light leading-relaxed">
                            Estrategias, diseño y tecnología premium para marcas que no se conforman con lo convencional.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-6 md:px-12 mt-20">
                    <div className="flex flex-nowrap md:flex-wrap items-center justify-center gap-3 pb-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
                        <div className="hidden md:flex items-center gap-2 mr-4 text-gray-400 uppercase text-[10px] font-bold tracking-widest whitespace-nowrap">
                            <Filter size={12} /> Filtrar:
                        </div>
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-500 border-2 whitespace-nowrap ${
                                    activeCategory === cat 
                                    ? "bg-black border-black text-white shadow-lg scale-105" 
                                    : "bg-transparent border-gray-100 text-gray-400 hover:border-black hover:text-black"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categorized Sections */}
            <div className="container mx-auto px-6 md:px-12 py-20 space-y-40">
                {categories.map((cat, catIdx) => {
                    const articlesInCat = groupedArticles[cat] || [];
                    const isVisible = activeCategory === "Todos" || activeCategory === cat;

                    if (articlesInCat.length === 0 || !isVisible) return null;

                    return (
                        <motion.section 
                            key={cat}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-2 text-black/10 mb-4">
                                        <Sparkles size={16} />
                                        <span className="text-[10px] font-black tracking-[5px] uppercase">Sección {String(catIdx + 1).padStart(2, '0')}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
                                        {(() => {
                                            const words = cat.split(' ');
                                            if (words.length > 1) {
                                                return (
                                                    <>
                                                        {words[0]} <span className="italic font-light text-gray-300 normal-case">{words.slice(1).join(' ')}</span>
                                                    </>
                                                );
                                            }
                                            return cat;
                                        })()}
                                    </h2>
                                </div>
                                <div className="h-px bg-gray-100 flex-grow mx-8 hidden lg:block mb-4" />
                                <p className="text-gray-400 font-light text-[10px] uppercase tracking-widest max-w-[200px] md:text-right leading-relaxed">
                                    {catIdx + 1} / {categories.length} — {cat}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                                {articlesInCat.map((article, i) => (
                                    <div key={`${cat}-${article.id}`} className="perspective-1000">
                                        <Link href={`/blog/${article.slug}`}>
                                            <motion.article
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                whileHover={{ 
                                                    rotateY: 5,
                                                    rotateX: -5,
                                                    y: -10,
                                                    zIndex: 50,
                                                    boxShadow: "0 50px 100px -20px rgba(0,0,0,0.2)"
                                                }}
                                                transition={{ 
                                                    type: "spring", 
                                                    stiffness: 300, 
                                                    damping: 15
                                                }}
                                                style={{
                                                    backgroundColor: article.color || "#000000",
                                                    color: article.accent || "#FFFFFF",
                                                }}
                                                className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer flex flex-col group border border-white/5"
                                            >
                                                {/* Image Layer */}
                                                <div
                                                    className="absolute inset-0 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000"
                                                    style={{
                                                        backgroundImage: `url(${article.image || '/images/blog/placeholder.png'})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                                
                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                                                {/* Top Tags */}
                                                <div className="p-10 pb-0 z-10 flex flex-wrap gap-2">
                                                    {article.category.split(',').map((tag: string) => (
                                                        <div
                                                            key={tag}
                                                            className="inline-block text-[10px] font-black tracking-[3px] uppercase px-4 py-2 rounded-full backdrop-blur-md"
                                                            style={{ 
                                                                backgroundColor: article.accent === "#000000" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)", 
                                                                color: article.accent,
                                                                border: `1px solid ${article.accent}33`
                                                            }}
                                                        >
                                                            {tag.trim()}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Content */}
                                                <div className="mt-auto p-10 z-10 relative">
                                                    <div className="flex items-center gap-3 mb-4 opacity-60">
                                                        <span className="text-[10px] font-bold uppercase tracking-[3px]">{article.date}</span>
                                                        <div className="w-1 h-1 rounded-full bg-current" />
                                                        <span className="text-[10px] font-bold uppercase tracking-[3px]">{article.author}</span>
                                                    </div>
                                                    <h3 className="text-2xl md:text-2xl font-bold leading-[1.1] mb-6 tracking-tighter" style={{ color: article.accent }}>
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-xs leading-relaxed line-clamp-2 opacity-80 font-light max-w-[90%]" style={{ color: article.accent }}>
                                                        {article.excerpt}
                                                    </p>
                                                </div>
                                            </motion.article>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    );
                })}

                {/* Empty State */}
                {categories.every(cat => (groupedArticles[cat]?.length === 0 || (activeCategory !== "Todos" && activeCategory !== cat))) && (
                    <div className="py-40 text-center">
                        <p className="text-gray-400 text-xl font-light italic">No se encontraron artículos en esta categoría.</p>
                        <button 
                            onClick={() => setActiveCategory("Todos")}
                            className="mt-6 text-black font-bold uppercase tracking-widest text-xs border-b-2 border-black pb-1"
                        >
                            Ver todo el contenido
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
