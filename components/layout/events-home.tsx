"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CornerButton } from "@/components/ui/corner-button";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";

// Sección de servicio "04 · Eventos" en el home. Misma gramática que
// AutomationHome y Toogo (encoge al scrollear, relleno del título), pero en
// oscuro: es la única tarjeta oscura entre dos claras, y un evento pasa de
// noche — la credencial es lo que ilumina.
//
// El emblema no es un icono genérico: es una credencial con QR, que es
// exactamente el objeto que se construyó para Los DiDis (lector de QR en la
// puerta). El barrido de escaneo es la única animación que se permite además
// de la flotación, y termina en el contador de accesos.

// Patrón del QR fijo, no aleatorio: Math.random() daría un dibujo distinto en
// el servidor y en el cliente y React marcaría desajuste de hidratación.
// 9×9, con las tres esquinas de posicionamiento de un QR real.
const QR: readonly string[] = [
    "111010111",
    "100010001",
    "101010101",
    "100000001",
    "111011011",
    "000110010",
    "101011101",
    "100010001",
    "111011111",
];

export function EventsHome() {
    const { t } = useLang();
    const e = t.eventsHome;
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);
    // Alto 150% para que el relleno cubra los descendentes (misma trampa que en
    // toogo/automation-home).
    const titleFill = useTransform(scrollYProgress, [0.1, 0.5], ["0% 150%", "100% 150%"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius }}
            className="relative z-20 mx-auto min-h-[60vh] md:h-[51vh] py-16 md:py-0 bg-[#141414] text-white shadow-2xl font-heading flex items-center justify-center mb-40 overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <span className="absolute top-[8%] right-[4%] text-[6rem] sm:text-[10rem] md:text-[15rem] text-white/[0.05] select-none font-light leading-none rotate-12 pointer-events-none">*</span>

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
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center gap-3 mb-4 md:mb-6"
                        >
                            <span className="block w-10 h-px bg-white/40" />
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/50 font-sans">
                                {e.eyebrow}
                            </span>
                        </motion.div>

                        {/* ⚠️ El relleno del título va de gris a blanco (al revés que en
                            las secciones claras), porque el fondo es oscuro. */}
                        <motion.h2
                            style={{
                                color: "rgba(255, 255, 255, 0.18)",
                                backgroundImage: "linear-gradient(to right, #ffffff, #ffffff)",
                                backgroundSize: titleFill,
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                backgroundPosition: "0 0",
                            }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight"
                        >
                            {e.title}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">{e.titleItalic}</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-sm md:text-base text-white/45 font-light mb-8 tracking-wide italic"
                        >
                            {e.subtitle}
                        </motion.p>

                        <div className="w-full h-px bg-white/15 mb-8 max-w-[100px] md:max-w-none" />

                        <p
                            className="text-white/65 leading-relaxed font-light"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            {e.description}
                        </p>
                    </motion.div>

                    {/* Credencial con QR — el objeto real de la puerta */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex flex-col items-center justify-center h-full w-full mt-8 md:mt-0"
                    >
                        <Link href={enHref("/software-para-eventos", isEn)} aria-label={e.badgeAria}>
                            <motion.div
                                animate={{ y: [0, -12, 0], rotate: [-1.2, 1.2, -1.2] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-[210px] md:w-[248px] bg-[#FAFAF7] text-[#141414] rounded-[1.25rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.65)] cursor-pointer group overflow-hidden pt-7 pb-5 px-5"
                            >
                                {/* Ranura del cordón */}
                                <span className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-[5px] rounded-full bg-[#141414]/15" />

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-[#141414]/45">
                                        {e.badgeLabel}
                                    </span>
                                    <span className="text-lg font-light leading-none text-[#141414]/35 select-none">*</span>
                                </div>

                                {/* QR dibujado con CSS: sin imagen que cargar y nítido a
                                    cualquier tamaño. aria-hidden porque no codifica nada. */}
                                <div
                                    aria-hidden
                                    className="grid gap-[2px] mx-auto w-fit p-2.5 bg-white rounded-md"
                                    style={{ gridTemplateColumns: "repeat(9, 12px)" }}
                                >
                                    {QR.flatMap((row, y) =>
                                        row.split("").map((bit, x) => (
                                            <span
                                                key={`${y}-${x}`}
                                                className={`h-3 w-3 rounded-[1px] ${bit === "1" ? "bg-[#141414]" : "bg-transparent"}`}
                                            />
                                        ))
                                    )}
                                </div>

                                {/* Barrido de escaneo: lo que hace el lector en la puerta */}
                                <motion.span
                                    aria-hidden
                                    animate={{ top: ["18%", "62%", "18%"], opacity: [0, 0.9, 0] }}
                                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
                                    className="absolute left-5 right-5 h-[2px] bg-[#141414]/70"
                                />

                                <div className="mt-4 pt-3 border-t border-dashed border-[#141414]/20 flex items-baseline justify-between">
                                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#141414]/45">
                                        {e.badgeStatus}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>
                            </motion.div>
                        </Link>

                        <div className="mt-6 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/35">
                            {e.tags.join(" · ")}
                        </div>
                    </motion.div>
                </div>
            </div>

            <CornerButton
                href={enHref("/software-para-eventos", isEn)}
                iconColor="border-white text-white"
                bareArrowOnMobile
                className="bottom-4 right-4 md:bottom-8 md:right-8"
            />
        </motion.section>
    );
}
