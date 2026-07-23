"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { CornerButton } from "@/components/ui/corner-button";
import { Sparkles, TrendingUp, Smartphone, Zap } from "lucide-react";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";

export function DigitalSolutions() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);
    // Alto 150% (no 100%) para que el relleno cubra los descendentes de la "g"
    // que sobresalen de la caja de línea ajustada.
    const titleFill = useTransform(scrollYProgress, [0.1, 0.5], ["0% 150%", "100% 150%"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius }}
            className="relative z-20 mx-auto min-h-[60vh] md:h-[51vh] py-16 md:py-0 bg-[#F5F5F0] text-[#333333] shadow-2xl font-heading flex items-center justify-center mb-40 overflow-hidden"
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
            {/* Asterisco decorativo */}
            <span className="absolute top-[8%] right-[5%] text-[6rem] sm:text-[10rem] md:text-[16rem] text-black/[0.05] select-none font-light leading-none rotate-12 pointer-events-none">*</span>

            <div className="container mx-auto px-6 md:px-12 h-full flex items-center relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center text-center md:text-left items-center md:items-start"
                    >
                        {/* Eyebrow editorial */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center gap-3 mb-4 md:mb-6"
                        >
                            <span className="block w-10 h-px bg-black/40" />
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                                {t.digital.eyebrow}
                            </span>
                        </motion.div>
                        <motion.h2
                            style={{
                                color: "rgba(182, 182, 182, 0.2)",
                                backgroundImage: "linear-gradient(to right, #000000, #000000)",
                                backgroundSize: titleFill,
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                backgroundPosition: "0 0",
                            }}
                            className="text-4xl md:text-7xl font-bold mb-2 tracking-tight"
                        >
                            {t.digital.title} <span className="font-[family-name:var(--font-playfair)] italic font-normal">{t.digital.titleItalic}</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-sm md:text-base text-gray-400 font-light mb-8 tracking-wide italic"
                        >
                            {t.digital.subtitle}
                        </motion.p>

                        <div className="w-full h-px bg-gray-300 mb-8 max-w-[100px] md:max-w-none"></div>

                        <p
                            className="text-gray-600 leading-relaxed font-light"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            {t.digital.description}
                        </p>
                    </motion.div>

                    {/* Animated Grid */}
                    <motion.div
                        className="relative flex justify-center items-center h-full"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <motion.div
                            className="grid grid-cols-2 gap-4 w-[200px] md:w-[240px]"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1, // Fast stagger
                                        delayChildren: 0.2
                                    }
                                }
                            }}
                        >
                            {[
                                { icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />, label: "IA" },
                                { icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />, label: "Escala" },
                                { icon: <Smartphone className="w-6 h-6 md:w-8 md:h-8" />, label: "Apps" },
                                { icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />, label: "Velocidad" }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={{
                                        hidden: { scale: 0, opacity: 0 },
                                        visible: {
                                            scale: 1,
                                            opacity: 1,
                                            transition: { type: "spring", stiffness: 260, damping: 20 }
                                        }
                                    }}
                                    className="aspect-square bg-black rounded-[1.5rem] shadow-lg flex flex-col items-center justify-center p-2 text-white"
                                >
                                    {/* Contenido eliminado a petición del usuario */}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                </div>
            </div>
            <CornerButton href={enHref("/desarrollo-de-software", isEn)} iconColor="border-black text-black" bareArrowOnMobile className="bottom-4 right-4 md:bottom-8 md:right-8" />
        </motion.section>
    );
}
