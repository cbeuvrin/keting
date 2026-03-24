"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { Monitor, ShoppingBag, BarChart3 } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { CornerButton } from "@/components/ui/corner-button";
import { ScrollArrow } from "@/components/ui/scroll-arrow";

export function Services() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"] // Extend range to cover full passage
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "90%"]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "2rem"]);

    // Parallax Effect for Description ONLY
    // "Delayed Entry" - Starts lower (+60px), stays there a bit, then slides UP to 0px (Final position)
    // Does NOT go above 0px (negative), so it won't cross the line.
    const descY = useTransform(scrollYProgress, [0, 0.6], [60, 0], { ease: cubicBezier(0.8, 0, 1, 1) });

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius }}
            className="relative z-20 -mt-[100vh] mb-40 mx-auto min-h-screen md:min-h-0 md:h-[51vh] pt-32 pb-24 md:py-0 bg-[#222222] text-white shadow-2xl font-heading flex items-start md:items-center justify-center snap-start"
        >
            <div className="container mx-auto px-6 md:px-12 h-full flex items-start md:items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start md:items-center w-full h-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center items-center md:items-start px-4 md:px-0 text-center md:text-left"
                    >
                        <Link href="/webdesing" className="block group cursor-pointer w-full">
                            <motion.h2
                                initial={{ backgroundSize: "0% 100%" }}
                                whileInView={{ backgroundSize: "100% 100%" }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 1.2, ease: [0.1, 0.5, 0.5, 1], delay: 0.3 }}
                                style={{
                                    color: "rgba(182, 182, 182, 0.2)",
                                    backgroundImage: "linear-gradient(to right, #b6b6b6, #b6b6b6)",
                                    backgroundRepeat: "no-repeat",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    backgroundPosition: "0 0",
                                }}
                                className="text-4xl md:text-7xl font-bold mb-4 md:mb-8 tracking-tight group-hover:scale-105 transition-transform origin-center md:origin-left text-center md:text-left"
                            >
                                Diseño web
                            </motion.h2>

                            {/* Animated Separator */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "120px" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                className="h-px bg-gray-500 mb-8 mx-auto md:mx-0"
                            />

                            {/* Description - Parallax Applied Here */}
                            <motion.p
                                style={{
                                    y: descY,
                                    fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)"
                                }}
                                className="text-gray-300 leading-relaxed font-light text-left"
                            >
                                Desarrollamos <strong className="text-white font-bold">e-commerce</strong>, <strong className="text-white font-bold">plataformas</strong> y <strong className="text-white font-bold">landing pages</strong>. Fusionamos diseño estético con estrategias SEO para escalar tu negocio.
                            </motion.p>
                        </Link>
                    </motion.div>

                    {/* Image/Mockup - Mobile: Shopping Bag, Desktop: Phone */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center h-full"
                    >
                        {/* Mobile: Shopping Bag Image */}
                        <img
                            src="/shopping-bag.png"
                            alt="Shopping bag mockup"
                            className="md:hidden w-full max-w-[350px] h-auto object-contain"
                            style={{ borderRadius: '30px' }}
                        />

                        {/* Desktop: Premium iPhone Mockup with Video */}
                        <div className="hidden md:block relative w-[300px] h-[610px] -my-[110px] rotate-6 hover:rotate-0 transition-transform duration-500 group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3.5rem] overflow-hidden">

                            {/* iPhone Frame (Bezel) */}
                            <div className="absolute inset-0 bg-[#0f0f0f] border-[6px] border-[#1a1a1a] rounded-[3.5rem] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]">

                                {/* Inner Screen Container */}
                                <div className="absolute inset-[3px] bg-black rounded-[3rem] overflow-hidden">
                                    <video
                                        src="/videos-raros/bideo3.mov"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Glass Reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />

                                    {/* Dynamic Island */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[100px] h-7 bg-black rounded-full flex items-center justify-between px-4 ring-1 ring-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                    </div>
                                </div>

                                {/* Side Buttons */}
                                {/* Action Button */}
                                <div className="absolute left-[-10px] top-24 w-[4px] h-8 bg-[#1a1a1a] rounded-r-sm ring-1 ring-white/10" />
                                {/* Volume Up */}
                                <div className="absolute left-[-10px] top-36 w-[4px] h-12 bg-[#1a1a1a] rounded-r-sm ring-1 ring-white/10" />
                                {/* Volume Down */}
                                <div className="absolute left-[-10px] top-52 w-[4px] h-12 bg-[#1a1a1a] rounded-r-sm ring-1 ring-white/10" />
                                {/* Power Button */}
                                <div className="absolute right-[-10px] top-40 w-[4px] h-20 bg-[#1a1a1a] rounded-l-sm ring-1 ring-white/10" />
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
            <CornerButton href="/webdesing" iconColor="border-white text-white" />
            <ScrollArrow />
        </motion.section>
    );
}
