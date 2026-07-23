"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/lib/i18n/lang-context";

export function AboutUs() {
    const { t } = useLang();
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to horizontal movement
    // Moves from -20% to 20% of its width
    const x = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section
            ref={sectionRef}
            className="relative z-20 w-full pt-32 pb-12 md:pt-48 md:pb-20 bg-white text-black font-heading overflow-hidden"
        >
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            {/* Background Text - Subtle background "About" with parallax */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
                <motion.h2
                    style={{ x }}
                    className="text-[20rem] md:text-[40rem] font-bold text-black leading-none whitespace-nowrap"
                >
                    About
                </motion.h2>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Content section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">

                    {/* Left Column: Greeting + Bio */}
                    <div className="md:col-span-12 lg:col-span-7 space-y-8">
                        <div className="space-y-6">
                            {/* Eyebrow editorial */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <span className="block w-10 h-px bg-black/40" />
                                <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                                    {t.aboutUs.eyebrow}
                                </span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl md:text-7xl font-bold mb-2 tracking-tight text-[#1a1a1a]"
                            >
                                {t.aboutUs.titlePre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{t.aboutUs.titleAccent}</span>{t.aboutUs.titlePost}
                                <span className="inline-block ml-2 md:ml-3 text-2xl md:text-4xl align-top rotate-12 text-black/30">*</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-xl md:text-2xl text-gray-600 font-normal leading-snug max-w-3xl"
                            >
                                {t.aboutUs.subPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal text-black">{t.aboutUs.subCountry}</span>{t.aboutUs.subMid}<span className="relative inline-block text-black font-medium">
                                    {t.aboutUs.subYear}
                                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-black/70" />
                                </span>{t.aboutUs.subMid2}<span className="bg-black text-white px-2 py-0.5 font-medium">{t.aboutUs.subPill}</span>{t.aboutUs.subEnd}
                            </motion.p>
                        </div>

                        <div className="space-y-4">
                            {/* Eyebrow editorial para la cita */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                className="flex items-center gap-3"
                            >
                                <span className="block w-8 h-px bg-black/40" />
                                <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                                    {t.aboutUs.quoteEyebrow}
                                </span>
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-base md:text-lg lg:text-xl text-gray-500 leading-relaxed font-light max-w-2xl font-[family-name:var(--font-playfair)] italic"
                            >
                                <span className="text-3xl md:text-4xl text-black/40 leading-none align-top mr-1">&ldquo;</span>
                                {t.aboutUs.quotePre}<span className="not-italic font-sans font-medium text-black">{t.aboutUs.quoteBrands}</span>{t.aboutUs.quoteMid1}<span className="not-italic font-sans font-medium text-black underline decoration-2 underline-offset-4 decoration-black/40">{t.aboutUs.quoteBusiness}</span>{t.aboutUs.quoteMid2}<span className="not-italic font-sans font-medium text-black">{t.aboutUs.quoteDesign}</span>{t.aboutUs.quoteEnd}
                                <span className="text-3xl md:text-4xl text-black/40 leading-none align-top ml-1">&rdquo;</span>
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex justify-end pr-4 md:pr-12"
                            >
                                <span className="text-lg md:text-xl font-medium text-[#1a1a1a] tracking-tight italic">
                                    — Carlos Beuvrin
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Profile Image */}
                    <div className="md:col-span-12 lg:col-span-5 flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="relative w-full aspect-[3/4] max-w-[320px] bg-black rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
                        >
                            <img
                                src="/carlos-beuvrin.png"
                                alt={t.aboutUs.imageAlt}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: "center 5%" }}
                                loading="lazy"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
