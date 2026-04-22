"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, Home, Filter, Sparkles, Eye, User, Calendar, ChevronDown } from "lucide-react";
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

export default function BlogPage() {
    const [mounted, setMounted] = useState(false);
    const [dbArticles, setDbArticles] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
        const combined = [...dbArticles, ...staticArticles];
        
        // Ensure uniqueness by slug to avoid duplicates between DB and static data
        const uniqueArticlesMap = new Map();
        combined.forEach(art => {
            if (!uniqueArticlesMap.has(art.slug)) {
                uniqueArticlesMap.set(art.slug, art);
            }
        });

        const uniqueList = Array.from(uniqueArticlesMap.values());

        // Add pseudo-random views for visual consistency with the request if not present
        return uniqueList.map(art => ({
            ...art,
            views: (art.views !== undefined && art.views !== null) ? art.views : Math.floor(Math.random() * 5000) + 500,
            category: Array.isArray(art.category) ? art.category : art.category.split(',').map((c: string) => c.trim())
        })).sort((a, b) => {
            const dateA = new Date(a.created_at || a.date).getTime();
            const dateB = new Date(b.created_at || b.date).getTime();
            return dateB - dateA;
        });
    }, [dbArticles]);

    // Filtered articles based on category
    const filteredArticles = useMemo(() => {
        if (activeCategory === "Todos") return allArticles;
        return allArticles.filter(article => 
            article.category.some((cat: string) => cat.toLowerCase() === activeCategory.toLowerCase())
        );
    }, [allArticles, activeCategory]);

    // Most read articles (sorted by views)
    const mostReadArticles = useMemo(() => {
        return [...allArticles].sort((a, b) => b.views - a.views).slice(0, 9);
    }, [allArticles]);

    if (!mounted) return null;

    const availableCategories = ["Todos", ...categories];

    return (
        <main className="min-h-screen bg-[#F0F2F5] text-black font-sans selection:bg-blue-100">
            <Header />
            
            {/* Filter Bar / Navigation */}
            <section className="pt-32 pb-6 px-6 sm:px-12 bg-[#F0F2F5]">
                <div className="container mx-auto">
                    {/* Desktop Filters */}
                    <div className="hidden md:flex flex-wrap items-center justify-center gap-2 mb-12">
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                                    activeCategory === cat 
                                    ? "bg-black border-black text-white shadow-md" 
                                    : "bg-white border-transparent text-gray-500 hover:border-gray-300 hover:text-black"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Filters Dropdown */}
                    <div className="md:hidden relative mb-12 flex justify-center">
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="flex items-center justify-between w-full max-w-[280px] px-6 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-bold uppercase tracking-widest text-black"
                        >
                            <div className="flex items-center gap-2">
                                <Filter size={14} className="opacity-70" />
                                <span>{activeCategory}</span>
                            </div>
                            <motion.div
                                animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={16} className="opacity-40" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {isCategoryOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full mt-2 w-full max-w-[280px] bg-white border border-gray-100 rounded-3xl shadow-2xl p-4 z-50 max-h-[400px] overflow-y-auto grid grid-cols-1 gap-1"
                                >
                                    {availableCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setActiveCategory(cat);
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                                                activeCategory === cat
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Section 1: Recent Articles Grid (Image 1 Style) */}
            <section className="pb-20 px-6 sm:px-12 bg-[#F0F2F5]">
                <div className="container mx-auto">
                    {filteredArticles.length >= 4 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
                            {/* Big Featured (Left) */}
                            <div className="lg:col-span-7 h-[400px] lg:h-full group">
                                <FeaturedCard article={filteredArticles[0]} size="lg" />
                            </div>

                            {/* Right Column Grid */}
                            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-2 gap-6 h-full">
                                {/* Top Right (Medium) */}
                                <div className="sm:col-span-2 h-[300px] lg:h-auto group">
                                    <FeaturedCard article={filteredArticles[1]} size="md" />
                                </div>
                                {/* Bottom Right 1 */}
                                <div className="h-[300px] lg:h-auto group">
                                    <FeaturedCard article={filteredArticles[2]} size="sm" />
                                </div>
                                {/* Bottom Right 2 */}
                                <div className="h-[300px] lg:h-auto group">
                                    <FeaturedCard article={filteredArticles[3]} size="sm" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map(article => (
                                <div key={article.slug} className="h-[400px]">
                                    <FeaturedCard article={article} size="md" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section 2: "Los más leídos" (Image 2 Style) */}
            <section className="py-20 px-6 sm:px-12 bg-white">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-extrabold mb-10 tracking-tight text-gray-900">Los más leídos</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Grid of Large Cards (Left & Middle Columns) */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mostReadArticles.slice(0, 4).map((article) => (
                                <VerticalCard key={article.slug} article={article} />
                            ))}
                        </div>

                        {/* List of Small Items (Right Column) */}
                        <div className="lg:col-span-4 space-y-6">
                            {mostReadArticles.slice(4, 9).map((article) => (
                                <HorizontalItem key={article.slug} article={article} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// --- Components ---

interface CardProps {
    article: any;
    size?: "lg" | "md" | "sm";
}

// Smart image fallback based on article category
function getCategoryImage(article: any): string {
    if (article.image && article.image !== '/images/blog/default.png' && !article.image.includes('default')) {
        return article.image;
    }
    // Map categories to local images
    const categoryMap: Record<string, string> = {
        'Diseño Web':           '/images/blog/minimalism.png',
        'Diseño web':           '/images/blog/minimalism.png',
        'Marketing':            '/images/blog/identity-ai.png',
        'Estrategia Digital':   '/images/blog/landing.png',
        'Inteligencia Artificial': '/images/blog/animations.png',
        'Aplicaciones':         '/images/blog/app-sales.png',
        'Posicionamiento':      '/images/blog/checklist.png',
        'Ventas':               '/images/blog/landing.png',
        'E-commerce':           '/images/blog/app-sales.png',
        'SEO':                  '/images/blog/geo-optimization.png',
        'GEO':                  '/images/blog/geo-optimization.png',
    };
    const cats = Array.isArray(article.category) ? article.category : [article.category];
    for (const cat of cats) {
        const match = Object.keys(categoryMap).find(k => cat?.toLowerCase().includes(k.toLowerCase()));
        if (match) return categoryMap[match];
    }
    // Final fallback: cycle through available images based on article id/slug
    const fallbacks = [
        '/images/blog/minimalism.png',
        '/images/blog/typography.png',
        '/images/blog/landing.png',
        '/images/blog/animations.png',
        '/images/blog/identity-ai.png',
        '/images/blog/react-nextjs.png',
        '/images/blog/checklist.png',
        '/images/blog/app-sales.png',
        '/images/blog/geo-optimization.png',
    ];
    const idx = Math.abs((article.id || article.slug?.length || 0)) % fallbacks.length;
    return fallbacks[idx];
}

function FeaturedCard({ article, size }: CardProps) {
    const isLarge = size === "lg";
    const imageUrl = getCategoryImage(article);
    
    return (
        <Link href={`/blog/${article.slug}`} className="block h-full w-full">
            <div className="relative h-full w-full rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Background Image using img tag for better compatibility */}
                <img
                    src={imageUrl}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {article.category.slice(0, 1).map((cat: string) => (
                            <span key={cat} className="bg-white text-blue-600 border border-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                                {cat}
                            </span>
                        ))}
                    </div>
                    
                    <h3 className={`${isLarge ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'} font-heading font-medium text-white leading-[0.95] tracking-tighter mb-6 group-hover:text-blue-100 transition-colors`}>
                        {article.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 border border-white/40 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                            <Eye size={12} className="opacity-70" /> {article.views}
                        </span>
                        <span className="flex items-center gap-1.5 opacity-80"><User size={12} /> {article.author}</span>
                        <span className="flex items-center gap-1.5 opacity-80"><Calendar size={12} /> {article.date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function VerticalCard({ article }: { article: any }) {
    return (
        <Link href={`/blog/${article.slug}`} className="block group">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="relative h-56 w-full overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${article.image || '/images/blog/placeholder.png'})` }}
                    />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-4">
                        <span className="bg-white text-blue-600 border border-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                            {article.category[0]}
                        </span>
                    </div>
                    <h4 className="text-xl font-heading font-medium text-gray-900 leading-[0.95] tracking-tighter mb-6 group-hover:text-blue-600 transition-colors flex-grow">
                        {article.title}
                    </h4>
                    <div className="flex items-center gap-3 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-full">
                            <Eye size={12} className="opacity-50" /> {article.views}
                        </span>
                        <span className="flex items-center gap-1.5"><User size={12} className="opacity-50" /> {article.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="opacity-50" /> {article.date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function HorizontalItem({ article }: { article: any }) {
    return (
        <Link href={`/blog/${article.slug}`} className="block group">
            <div className="flex gap-4 items-center">
                <div className="relative h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${article.image || '/images/blog/placeholder.png'})` }}
                    />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                    <div className="mb-2">
                        <span className="bg-white text-blue-600 border border-blue-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                            {article.category[0]}
                        </span>
                    </div>
                    <h5 className="text-[13px] font-heading font-medium text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 tracking-tight">
                        {article.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-3 text-gray-500 text-[9px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.2 border border-gray-200 px-2.5 py-1 rounded-full">
                            <Eye size={10} className="opacity-50" /> {article.views}
                        </span>
                        <span>{article.author}</span>
                        <span>{article.date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
