"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { CornerButton } from "@/components/ui/corner-button";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref, caseStudiesHref } from "@/lib/i18n/routes";

// Cada cuadro apunta a donde de verdad se habla de ese tema, no todos al mismo
// sitio: cuatro cuadros que llevan a la misma página son cuatro veces el mismo
// enlace, y el visitante lo nota a la segunda.
//
// "__CASOS__" es un centinela: el índice de casos cambia de slug entre idiomas
// ("/casos" vs "/en/case-studies"), así que no puede pasar por enHref y se
// resuelve con caseStudiesHref más abajo.
const CUADROS = [
    { key: "ia", href: "/automatizacion-de-procesos" },
    { key: "escala", href: "__CASOS__" },
    { key: "apps", href: "/desarrollo-de-software" },
    { key: "velocidad", href: "/desarrollo-web" },
] as const;

export function DigitalSolutions() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const reduce = useReducedMotion();
    const c = t.digital.cuadros;
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
                            {/* Cuadros deliberadamente vacíos: Carlos los quiere sin icono
                                ni etiqueta. Lo que sí son ahora es enlaces reales —antes no
                                llevaban a ninguna parte— y giran al pulsarlos.
                                Sin texto visible, el `aria-label` NO es opcional: es lo
                                único que le dice a un lector de pantalla adónde va cada uno.
                                Los cuatro destinos son distintos a propósito. */}
                            {CUADROS.map((item, idx) => (
                                <motion.div
                                    key={item.key}
                                    variants={{
                                        hidden: { scale: 0, opacity: 0 },
                                        visible: {
                                            scale: 1,
                                            opacity: 1,
                                            transition: { type: "spring", stiffness: 260, damping: 20 }
                                        }
                                    }}
                                >
                                    <motion.a
                                        href={item.href === "__CASOS__" ? caseStudiesHref(isEn) : enHref(item.href, isEn)}
                                        aria-label={c[`${item.key}Aria`]}
                                        // El giro es la respuesta al clic; el hundimiento y
                                        // la elevación son la pista de que se puede pulsar.
                                        // En táctil no hay hover, así que sin el whileTap el
                                        // cuadro no daría ninguna señal de ser un botón.
                                        whileHover={reduce ? undefined : { y: -6, scale: 1.04 }}
                                        whileTap={reduce ? undefined : { rotate: 360, scale: 0.92 }}
                                        transition={{ rotate: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, default: { type: "spring", stiffness: 400, damping: 22 } }}
                                        className="block aspect-square bg-black rounded-[1.5rem] shadow-lg cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    />
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
