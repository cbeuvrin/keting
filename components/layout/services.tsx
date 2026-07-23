"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { Monitor, ShoppingBag, BarChart3 } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CornerButton } from "@/components/ui/corner-button";
import { ScrollArrow } from "@/components/ui/scroll-arrow";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";

export function Services() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const width = useTransform(scrollYProgress, [0, 0.5], ["100%", "80%"]);
    const mobileWidth = "100%"; // Fixed at 100% for mobile
    const borderRadius = useTransform(scrollYProgress, [0, 0.5], ["0rem", "3rem"]);

    // Parallax Effect for Description ONLY
    const descY = useTransform(scrollYProgress, [0, 0.6], [60, 0], { ease: cubicBezier(0.8, 0, 1, 1) });
    const titleFill = useTransform(scrollYProgress, [0, 0.4], ["0% 100%", "100% 100%"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? mobileWidth : width, borderRadius: borderRadius }}
            className="relative z-20 mb-40 mx-auto min-h-[60vh] md:h-[51vh] py-16 md:py-0 md:bg-[#222222] text-[#222222] md:text-white md:shadow-2xl font-heading flex items-center justify-center snap-start w-full overflow-x-hidden md:overflow-visible"
        >
            {/* Grid background sutil (sólo en desktop con bg dark) */}
            <div
                className="absolute inset-0 hidden md:block opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <div className="container mx-auto px-6 md:px-12 h-full flex items-start md:items-center relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start md:items-center w-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center items-start text-left w-full"
                    >
                        <Link href={enHref("/desarrollo-web", isEn)} className="block group cursor-pointer w-full">
                            {/* Eyebrow editorial */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="flex items-center gap-3 mb-4 md:mb-6"
                            >
                                <span className="block w-10 h-px bg-black/40 md:bg-white/40" />
                                <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 md:text-white/60 font-sans">
                                    {t.services.eyebrow}
                                </span>
                            </motion.div>
                            <motion.h2
                                style={{
                                    color: "rgba(128, 128, 128, 0.3)",
                                    backgroundImage: "linear-gradient(to right, var(--title-fill, #ffffff), var(--title-fill, #ffffff))",
                                    backgroundSize: titleFill,
                                    backgroundRepeat: "no-repeat",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    backgroundPosition: "0 0",
                                }}
                                className="text-6xl md:text-7xl font-bold mb-4 md:mb-8 tracking-tight group-hover:scale-105 transition-transform origin-left text-left w-full [--title-fill:#000000] md:[--title-fill:#ffffff]"
                            >
                                {t.services.title} <span className="font-[family-name:var(--font-playfair)] italic font-normal">{t.services.titleItalic}</span>
                                <span className="inline-block ml-2 md:ml-3 text-3xl md:text-4xl align-top rotate-12 text-black/30 md:text-white/30">*</span>
                            </motion.h2>

                            {/* Animated Separator */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                className="h-px bg-black md:bg-gray-500 mb-8 mx-auto md:mx-0"
                            />

                            {/* Description - Parallax Applied Here */}
                            <motion.p
                                style={{
                                    y: descY,
                                    fontSize: "clamp(1.1rem, 1rem + 1vw, 1.3rem)"
                                }}
                                className="text-gray-600 md:text-gray-300 leading-relaxed font-light text-left w-full"
                            >
                                {t.services.descIntro}{" "}
                                {t.services.descTags.map((tag, i) => (
                                    <span key={tag}>
                                        <strong className="text-black md:text-white font-bold">{tag}</strong>
                                        {i < t.services.descTags.length - 2 ? ", " : i === t.services.descTags.length - 2 ? ` ${t.common.and} ` : ""}
                                    </span>
                                ))}
                                {t.services.descTail}
                            </motion.p>
                        </Link>
                    </motion.div>

                    {/* Desktop Only Image/Mockup */}
                    <motion.div
                        className="hidden md:flex relative justify-center items-center h-full"
                    >
                        {/* Desktop: Premium iPhone Mockup with Video */}
                        <div className="relative w-[300px] h-[610px] -my-[110px] rotate-6 hover:rotate-0 transition-transform duration-500 group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3.5rem] overflow-hidden">

                            {/* iPhone Frame (Bezel) */}
                            <div className="absolute inset-0 bg-[#0f0f0f] border-[6px] border-[#1a1a1a] rounded-[3.5rem] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]">

                                {/* Inner Screen Container */}
                                <div className="absolute inset-[3px] bg-black rounded-[3rem] overflow-hidden">
                                    {/* H.264/mp4: el .mov original era HEVC (no reproduce en
                                        Chrome/Firefox → pantalla negra) y pesaba 40MB. */}
                                    <video
                                        src="/videos-raros/bideo3.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                        aria-label="Demo de diseño web y marketing digital por Keting Media"
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
            <CornerButton href={enHref("/desarrollo-web", isEn)} iconColor="border-black md:border-white text-black md:text-white" />
            <ScrollArrow />
        </motion.section>
    );
}
