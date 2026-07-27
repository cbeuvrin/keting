"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CornerButton } from "@/components/ui/corner-button";
import { useLang } from "@/lib/i18n/lang-context";

export function Toogo() {
    const { t } = useLang();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    const mobileWidth = "100%"; // Fixed at 100% for mobile
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);
    // Alto 150% (no 100%) para que el relleno cubra los descendentes de la "g"
    // que sobresalen de la caja de línea ajustada (leading-[0.9]).
    const titleFillProgress = useTransform(scrollYProgress, [0.1, 0.5], ["0% 150%", "100% 150%"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ 
                width: typeof window !== 'undefined' && window.innerWidth < 768 ? mobileWidth : width, 
                borderRadius: typeof window !== 'undefined' && window.innerWidth < 768 ? "0rem" : borderRadius 
            }}
            className="relative z-20 mx-auto min-h-[60vh] md:h-[51vh] py-16 md:py-0 bg-[#E8E8E0] text-[#1a2332] md:shadow-2xl font-heading flex flex-col md:flex-row items-center justify-center mb-20 md:mb-40 w-full overflow-x-hidden"
        >
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(26,35,50,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,50,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <div className="container mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-center relative">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center text-left items-start w-full"
                    >
                        {/* Eyebrow editorial */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center gap-3 mb-4 md:mb-6"
                        >
                            <span className="block w-10 h-px bg-[#1a2332]/40" />
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1a2332]/60 font-sans">
                                {t.toogo.eyebrow}
                            </span>
                        </motion.div>
                        <motion.h2
                            style={{
                                color: "rgba(26, 35, 50, 0.1)",
                                backgroundImage: "linear-gradient(to right, #1a2332, #1a2332)",
                                backgroundSize: titleFillProgress,
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                backgroundPosition: "0 0",
                            }}
                            className="text-6xl md:text-7xl font-bold mb-8 tracking-tight text-left w-full leading-[0.9]"
                        >
                            toogo.<br className="md:hidden" /><span className="font-[family-name:var(--font-playfair)] italic font-normal">store</span>
                            <span className="inline-block ml-2 md:ml-3 text-2xl md:text-4xl align-top rotate-12 text-[#1a2332]/30">*</span>
                        </motion.h2>

                        <div 
                            className="w-full h-px mb-8 bg-black/20"
                        />

                        <p
                            style={{ 
                                fontSize: "clamp(1.1rem, 1rem + 1vw, 1.3rem)" 
                            }}
                            className="leading-relaxed font-light text-left w-full text-gray-700"
                        >
                            {t.toogo.bodyPre}<strong className="font-bold text-[#1a2332]">Toogo</strong>{t.toogo.bodyPost}
                        </p>
                    </motion.div>

                    {/* Toogo Character Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center h-full w-full mt-8 md:mt-0"
                    >
                        <div className="relative w-[280px] h-[280px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center justify-center p-8">
                            <img
                                src="/toogo-character.png"
                                alt="Toogo Character"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
            <CornerButton
                href="https://www.toogo.store"
                iconColor="border-black text-black"
                bareArrowOnMobile
                className="bottom-4 right-4 md:bottom-8 md:right-8"
            />
        </motion.section>
    );
}
