"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";
import { caseStudyHref } from "@/lib/i18n/routes";
import { TESTIMONIALS } from "@/lib/testimonials";

// Sección de testimonios. Se usa en el home y en /desarrollo-web.
//
// Conserva el diseño editorial anterior —filas anchas separadas por línea
// discontinua, cifra gigante a la izquierda, cita en el centro, cliente y
// etiquetas a la derecha, con parallax— pero con testimonios REALES.
//
// La versión que sustituye traía tres inventados atribuidos a empresas que sí
// existen (NuRange Coffee, Escapely, Butcher Bird), con métricas de resultado
// que nadie dijo. Venían de una plantilla; se retiraron el 2026-08-03 tras
// confirmar Carlos que no eran clientes suyos.
//
// Las citas van SIN TRADUCIR en inglés a propósito: son palabras de personas
// reales, no copy nuestro. Se traduce el marco —eyebrow, titular, etiquetas y
// la leyenda de las métricas—, nunca la cita.
export function Testimonials() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const lang = isEn ? "en" : "es";
    const c = t.testimonials;

    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // ⚠️ Un solo par de transformaciones para todas las filas. La versión
    // anterior creaba un useTransform DENTRO del map — hooks dentro de un bucle,
    // que solo funcionaba porque la lista tenía exactamente tres elementos fijos.
    // Con una lista que crece cada vez que llega un testimonio, eso rompe React.
    const yStat = useTransform(scrollYProgress, [0, 1], [40, -40], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });
    const yQuote = useTransform(scrollYProgress, [0, 1], [20, -20], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });

    if (TESTIMONIALS.length === 0) return null;

    return (
        <section ref={containerRef} className="relative z-20 py-24 md:py-32 bg-[#FAFAFA] text-[#111111] overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="mb-16 md:mb-20 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6"
                    >
                        <span className="block w-10 h-px bg-black/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                            {c.eyebrow}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-5xl font-normal tracking-tight mb-4 font-heading text-[#111]"
                    >
                        {c.title}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                            {c.titleItalic}
                        </span>
                        <span className="inline-block ml-2 text-xl md:text-3xl align-top rotate-12 text-black/30">*</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="text-gray-500 text-base md:text-lg font-light max-w-3xl"
                    >
                        {c.note}
                    </motion.p>
                </div>

                <div className="flex flex-col">
                    {TESTIMONIALS.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                            className={`py-10 md:py-12 flex flex-col md:flex-row gap-8 md:gap-16 border-t border-dashed border-[#d5d5d5] ${
                                index === TESTIMONIALS.length - 1 ? "border-b" : ""
                            }`}
                        >
                            {/* Cifra */}
                            <motion.div style={{ y: yStat }} className="md:w-1/4 flex flex-col items-start text-left pt-2">
                                {item.metric ? (
                                    <>
                                        <span className="text-[4.5rem] md:text-[6.5rem] font-normal tracking-tighter leading-[0.8] mb-4 text-[#111]">
                                            {item.metric.value}
                                        </span>
                                        <span className="text-[10px] md:text-[11px] text-[#666] uppercase tracking-[0.2em] font-mono font-medium">
                                            {item.metric.label[lang]}
                                        </span>
                                    </>
                                ) : (
                                    // Sin caso publicado no hay cifra verificada. Antes que
                                    // inventar una para cuadrar la columna, va el asterisco
                                    // de la marca y la etiqueta del proyecto.
                                    <>
                                        <span
                                            className="text-[4.5rem] md:text-[6.5rem] font-light leading-[0.8] mb-4 text-black/15 select-none"
                                            aria-hidden="true"
                                        >
                                            *
                                        </span>
                                        <span className="text-[10px] md:text-[11px] text-[#666] uppercase tracking-[0.2em] font-mono font-medium">
                                            {item.project}
                                        </span>
                                    </>
                                )}
                            </motion.div>

                            {/* Cita */}
                            <motion.div style={{ y: yQuote }} className="md:w-1/2 flex items-start pt-4">
                                <p className="text-lg md:text-[1.125rem] leading-[1.8] text-[#333] font-medium tracking-tight italic">
                                    <span className="text-3xl text-black/30 leading-none align-top mr-1">&ldquo;</span>
                                    {item.text}
                                    <span className="text-3xl text-black/30 leading-none align-top ml-1">&rdquo;</span>
                                </p>
                            </motion.div>

                            {/* Cliente */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="md:w-1/4 flex flex-col md:items-start justify-start pt-4"
                            >
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-1 text-[#111]">
                                    {item.name}
                                </h4>
                                <p className="text-[13px] text-[#888] mb-5 font-light">
                                    {item.role}, {item.company}
                                </p>

                                {item.tags && (
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags[lang].map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] md:text-[11px] px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.15)] text-[#555] uppercase font-mono tracking-wider bg-white/50"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Solo enlaza quien tiene caso publicado. */}
                                {item.caseSlug && (
                                    <Link
                                        href={caseStudyHref(item.caseSlug, isEn)}
                                        className="inline-flex items-center gap-2 mt-5 text-[10px] uppercase tracking-[0.2em] text-black/45 hover:text-black transition-colors"
                                    >
                                        <span className="block w-5 h-px bg-black/25" />
                                        {c.readCase}
                                    </Link>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
