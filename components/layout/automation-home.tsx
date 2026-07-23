"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { CornerButton } from "@/components/ui/corner-button";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";

// Sección de servicio "03 · Automatización con IA" en el home. Mismo lenguaje
// que DigitalSolutions (encoge con el scroll, relleno del título al scrollear)
// + a la derecha un emblema "IA" propio: tarjeta negra flotante con órbitas de
// asteriscos girando (marca de la casa; no usamos logos de terceros).
export function AutomationHome() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);
    // Alto 150% para que el relleno cubra los descendentes (misma trampa que
    // en toogo/digital-solutions).
    const titleFill = useTransform(scrollYProgress, [0.1, 0.5], ["0% 150%", "100% 150%"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius }}
            className="relative z-20 mx-auto min-h-[60vh] md:h-[51vh] py-16 md:py-0 bg-[#EDEDE6] text-[#1d1d1f] shadow-2xl font-heading flex items-center justify-center mb-40 overflow-hidden"
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
            <span className="absolute bottom-[6%] left-[4%] text-[6rem] sm:text-[10rem] md:text-[15rem] text-black/[0.05] select-none font-light leading-none -rotate-12 pointer-events-none">*</span>

            <div className="container mx-auto px-6 md:px-12 h-full flex items-center relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">

                    {/* Texto */}
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
                                {t.automationHome.eyebrow}
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
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight"
                        >
                            {t.automationHome.title}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">{t.automationHome.titleItalic}</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-sm md:text-base text-gray-400 font-light mb-8 tracking-wide italic"
                        >
                            {t.automationHome.subtitle}
                        </motion.p>

                        <div className="w-full h-px bg-gray-300 mb-8 max-w-[100px] md:max-w-none" />

                        <p
                            className="text-gray-600 leading-relaxed font-light"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            {t.automationHome.description}
                        </p>
                    </motion.div>

                    {/* Emblema IA — tarjeta negra flotante con órbitas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex flex-col items-center justify-center h-full w-full mt-8 md:mt-0"
                    >
                        <Link href={enHref("/automatizacion-de-procesos", isEn)} aria-label="Conocer el servicio de automatización con IA">
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-[230px] h-[230px] md:w-[280px] md:h-[280px] bg-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer group"
                            >
                                {/* Órbita exterior con asterisco */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-4 rounded-full border border-white/10"
                                >
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white/80 text-2xl font-light select-none">*</span>
                                </motion.div>
                                {/* Órbita interior en sentido contrario */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-9 rounded-full border border-white/[0.06]"
                                >
                                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-white/40 text-lg font-light select-none">*</span>
                                </motion.div>

                                {/* IA al centro */}
                                <span className="font-serif italic text-6xl md:text-7xl text-white leading-none select-none group-hover:scale-105 transition-transform duration-500">
                                    IA
                                </span>

                                {/* Destello pulsando */}
                                <motion.span
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-5 right-5 text-white/70"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </motion.span>
                            </motion.div>
                        </Link>

                        {/* Caption mono */}
                        <div className="mt-6 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-black/40">
                            {t.automationHome.tags.join(" · ")}
                        </div>
                    </motion.div>
                </div>
            </div>

            <CornerButton href={enHref("/automatizacion-de-procesos", isEn)} iconColor="border-black text-black" bareArrowOnMobile className="bottom-4 right-4 md:bottom-8 md:right-8" />
        </motion.section>
    );
}
