"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselItem {
    id: number;
    title: string;
    category: string;
    year: string;
    description: string;
    color: string;
    logo?: string;
    // Hero properties
    heroTitle?: string;
    heroDescription?: string;
    heroImage?: string;
}

interface ExpandingCarouselProps {
    items: CarouselItem[];
    activeIndex: number;
    onIndexChange: (index: number) => void;
}

export function ExpandingCarousel({ items, activeIndex, onIndexChange }: ExpandingCarouselProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Reset expansion state when index changes
    useEffect(() => {
        setIsExpanded(false);
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [activeIndex]);

    const handleNext = () => {
        onIndexChange((activeIndex + 1) % items.length);
    };

    const handlePrev = () => {
        onIndexChange((activeIndex - 1 + items.length) % items.length);
    };

    const ITEM_HEIGHT = 80;
    const GAP = 24;

    // Calculate offset to center the active item vertically
    const yOffset = activeIndex * (ITEM_HEIGHT + GAP);

    return (
        <div className="relative w-full h-full min-h-[600px] flex items-center justify-end pr-10">

            {/* 
                Expanded Card Layer (Unmasked)
                - Positioned absolutely relative to the main container.
                - Centered vertically (top-1/2 -translate-y-1/2).
                - To the LEFT of the pill.
                - Z-index higher than the pill.
            */}
            <AnimatePresence>
                {isExpanded && items[activeIndex] && (
                    <motion.div
                        key={`expanded-card-${items[activeIndex].id}`}
                        initial={{ opacity: 0, scale: 0.8, x: 40 }} // Start slightly to the right (near the pill)
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 40 }} // Exit back towards the pill
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute right-[200px] top-1/2 -translate-y-1/2 bg-neutral-900 rounded-[2rem] p-6 shadow-2xl w-[260px] h-[340px] flex flex-col z-50 pointer-events-auto border border-white/10"
                    // right-[200px]: 120px pill + 80px gap
                    >
                        <div className="w-full flex justify-end mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                                style={{ backgroundColor: items[activeIndex].color }}
                            >
                                {items[activeIndex].logo ? <img src={items[activeIndex].logo} alt="" className="w-6 h-6 object-contain" /> : <span className="text-xs">{items[activeIndex].title.substring(0, 2)}</span>}
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-auto"
                        >
                            <h3 className="text-2xl font-bold text-white leading-tight mb-2">{items[activeIndex].title}</h3>
                            <p className="text-sm text-gray-400 mb-6">{items[activeIndex].category} / {items[activeIndex].year}</p>

                            <div className="flex gap-2">
                                <span className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-gray-300 bg-white/5">
                                    Figma
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold flex items-center gap-1">
                                    +3
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* 
                Glassmorphism Vertical Pill 
                - Tall and narrow.
            */}
            <div className="relative w-[120px] h-[500px] rounded-[60px] border border-white/20 bg-white/5 backdrop-blur-md flex flex-col items-center justify-between py-8 shadow-2xl z-40">

                {/* Navigation - Top */}
                <button
                    onClick={handlePrev}
                    className="z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors border border-white/10 flex-shrink-0"
                >
                    <ChevronUp className="w-6 h-6" />
                </button>

                {/* 
                    Track Wrapper 
                    - Vertical Masking
                */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[340px] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                    }}
                >
                    {/* Actual Interactive Track */}
                    <div className="w-full h-full flex flex-col items-center justify-center pointer-events-auto">
                        <motion.div
                            className="flex flex-col items-center gap-6 absolute top-1/2"
                            animate={{ y: -yOffset }}
                            transition={{ type: "spring", stiffness: 200, damping: 30, mass: 1 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {items.map((item, index) => {

                                    const isActive = index === activeIndex;
                                    // Only collapse if expanded. 
                                    // Actually, if expanded, we visually hide this circle so the card "replaces" it.
                                    const shouldHideCircle = isActive && isExpanded;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={false}
                                            animate={{
                                                scale: isActive ? 1 : 0.8,
                                                opacity: shouldHideCircle ? 0 : (isActive ? 1 : 0.4),
                                                // opacity 0 effectively hides it, letting the Card Layer take over
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="relative flex-shrink-0 flex items-center justify-center w-20 h-20"
                                            onClick={() => onIndexChange(index)}
                                        >
                                            <div
                                                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer bg-neutral-800"
                                                style={{ backgroundColor: item.color }}
                                            >
                                                {item.logo ? <img src={item.logo} alt="" className="w-10 h-10 object-contain opacity-90" /> : <span className="text-white font-bold text-sm">{item.title.substring(0, 2)}</span>}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Navigation - Bottom */}
                <button
                    onClick={handleNext}
                    className="z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors border border-white/10 flex-shrink-0"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
