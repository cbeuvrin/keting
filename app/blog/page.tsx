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
            
            {/* Hero Section */}
            <section className="relative pt-40 pb-16 bg-[#F9F9F9]">
                <div className="container mx-auto px-6 md:px-12">
                    <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[3px] uppercase text-gray-400 mb-10">
                        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                            <Home size={10} /> Inicio
                        </Link>
                        <span>/</span>
                        <span className="text-black">Explorar</span>
                    </nav>
                    
                    <div className="max-w-4xl">
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-8">
                            Nuestra <br />
                            <span className="italic font-light text-gray-300">Inteligencia</span>
                        </h1>
                        <p className="max-w-xl text-gray-500 text-lg md:text-xl font-light leading-relaxed">
                            Estrategias, diseño y tecnología premium para marcas que no se conforman con lo convencional.
                        </p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="container mx-auto px-6 md:px-12 mt-20">
                    <div className="flex flex-wrap items-center gap-3 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-2 mr-4 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                            <Filter size={12} /> Filtrar:
                        </div>
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-500 border-2 ${
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
            <div className="container mx-auto px-6 md:px-12 py-20 space-y-32">
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
                            transition={{ duration: 0.8, delay: catIdx * 0.1 }}
                            className="relative"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-black/20 mb-2">
                                        <Sparkles size={16} />
                                        <span className="text-[10px] font-bold tracking-[4px] uppercase">Sección {String(catIdx + 1).padStart(2, '0')}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
                                        {cat}
                                    </h2>
                                </div>
                                <p className="text-gray-400 font-light text-sm max-w-xs md:text-right">
                                    Explora lo último en {cat.toLowerCase()} y cómo impacta en el ecosistema digital premium.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                                {articlesInCat.map((article, i) => (
                                    <div key={`${cat}-${article.id}`} className="relative">
                                        <Link href={`/blog/${article.slug}`}>
                                            <motion.article
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                whileHover={{ 
                                                    rotate: 0, 
                                                    scale: 1.02, 
                                                    zIndex: 50,
                                                    boxShadow: "0 40px 80px -20px rgba(0,0,0,0.15)"
                                                }}
                                                transition={{ 
                                                    type: "spring", 
                                                    stiffness: 260, 
                                                    damping: 20
                                                }}
                                                style={{
                                                    backgroundColor: article.color || "#000000",
                                                    color: article.accent || "#FFFFFF",
                                                }}
                                                className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer flex flex-col group border border-black/5"
                                            >
                                                {/* Image Layer */}
                                                <div
                                                    className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-1000"
                                                    style={{
                                                        backgroundImage: `url(${article.image || '/images/blog/placeholder.png'})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                                
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                                                {/* Top Info */}
                                                <div className="p-8 pb-0 z-10">
                                                    <div
                                                        className="inline-block text-[9px] font-black tracking-[3px] uppercase px-4 py-1.5 rounded-full mb-6"
                                                        style={{ backgroundColor: article.accent, color: article.color }}
                                                    >
                                                        {cat}
                                                    </div>
                                                </div>

                                                {/* Main Content */}
                                                <div className="mt-auto p-8 z-10">
                                                    <h3 className="text-xl md:text-2xl font-bold leading-[1.1] mb-4 tracking-tight">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-xs leading-relaxed line-clamp-2 opacity-60 font-light mb-6">
                                                        {article.excerpt}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between pt-6 border-t border-current/10">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Lectura</span>
                                                            <span className="text-[11px] font-medium opacity-80">{article.date}</span>
                                                        </div>
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                                                            style={{ backgroundColor: article.accent, color: article.color }}
                                                        >
                                                            <ArrowRight size={16} />
                                                        </div>
                                                    </div>
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
