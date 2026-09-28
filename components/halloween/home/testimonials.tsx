"use client";

import { useId, useRef } from "react";
import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";
import { caseStudyHref } from "@/lib/i18n/routes";
import { TESTIMONIALS } from "@/lib/testimonials";
import { Cobweb, HW_FONT, HwEyebrow, Peek } from "./hw-ui";
import { v } from "../palette";

// Versión Halloween de components/layout/testimonials.tsx.
//
// Misma estructura, mismo contenido y mismo parallax que la original: filas
// anchas con la cifra a la izquierda, la cita al centro y el cliente a la
// derecha. Cambia el disfraz: letra Gluten, cifras en mostaza, etiquetas como
// calcomanías chicas y las líneas discontinuas convertidas en costuras.
//
// ⚠️ Las citas son de clientes reales: el texto sale tal cual de
// lib/testimonials.ts y no se toca aquí (ni se traduce).

/** Murcielaguito de silueta. Sustituye a los asteriscos de la marca. */
function Bat({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 64 34" className={className}>
            <path
                d="M32 30 Q28 22 24 21 Q20 13 6 9 Q11 15 9 21 Q15 18 17 24 Q21 21 24 26 Q27 24 32 30 Q37 24 40 26 Q43 21 47 24 Q49 18 55 21 Q53 15 58 9 Q44 13 40 21 Q36 22 32 30 Z"
                fill={fill}
            />
            {/* Orejitas: sin ellas parece una gaviota. */}
            <path d="M29 20 L28.5 14.5 L31 18 L33 18 L35.5 14.5 L35 20 Z" fill={fill} />
        </svg>
    );
}

/** Murciélagos que revolotean (se quedan quietos con movimiento reducido: hw-scene lo apaga). */
function FlyingBat({ className = "", delay = "0s", size = 34 }: { className?: string; delay?: string; size?: number }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 64 34" width={size} className={`hw-scene pointer-events-none absolute h-auto ${className}`}>
            <g className="hw-float" style={v({ "--fd": "2.8s", "--fa": "-8px", "--bd": delay })}>
                <path
                    d="M32 30 Q28 22 24 21 Q20 13 6 9 Q11 15 9 21 Q15 18 17 24 Q21 21 24 26 Q27 24 32 30 Q37 24 40 26 Q43 21 47 24 Q49 18 55 21 Q53 15 58 9 Q44 13 40 21 Q36 22 32 30 Z M29 20 L28.5 14.5 L31 18 L33 18 L35.5 14.5 L35 20 Z"
                    fill="#f3ecd9"
                />
            </g>
        </svg>
    );
}

/**
 * Costura punteada en lugar de la línea discontinua del original. Es un patrón
 * SVG (no un degradado) para que cada puntada tenga sus propias puntas redondas
 * y un leve desnivel, como cosida a mano, sin deformarse al cambiar el ancho.
 * `knot` agrega una puntada en cruz al arranque. La máscara desvanece el final
 * para que la puntada que queda cortada no termine en seco.
 */
function Seam({ knot = false }: { knot?: boolean }) {
    const id = useId();
    return (
        <svg aria-hidden="true" className="block h-2 w-full [mask-image:linear-gradient(90deg,#000_calc(100%-16px),transparent)]">
            <defs>
                <pattern id={id} x={knot ? 16 : 0} width="60" height="8" patternUnits="userSpaceOnUse">
                    <path
                        d="M3 4.3 L12 3.6 M23 3.8 L32.5 4.4 M43 4.5 L51 3.7"
                        stroke="#f3ecd9"
                        strokeOpacity="0.34"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        fill="none"
                    />
                </pattern>
            </defs>
            <rect x={knot ? 16 : 0} width="100%" height="8" fill={`url(#${id})`} />
            {knot && <path d="M1.5 1 L8 7 M8 1 L1.5 7" stroke="#d8b36a" strokeOpacity="0.8" strokeWidth="2.6" strokeLinecap="round" />}
        </svg>
    );
}

/**
 * Flecha de "↑ 5x". Gluten no trae "↑" y el navegador la cambiaba por una
 * flecha delgada de otra letra; esta va dibujada con el mismo trazo y la misma
 * sombra ciruela que la cifra.
 */
function MetricArrow() {
    const d = "M12 30 Q11.2 18 12 5 M4.5 12.5 Q8.5 9 12 4.5 Q15.5 9 19.5 12.5";
    return (
        <svg aria-hidden="true" viewBox="0 0 26 34" className="mr-[0.08em] inline-block h-[0.74em] w-[0.57em] overflow-visible">
            <path
                d={d}
                transform="translate(2 2)"
                stroke="#4a3350"
                strokeWidth="4.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path d={d} stroke="#d8b36a" strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

/** Separa la flecha inicial de la cifra (el dato de lib/testimonials.ts no se toca). */
function MetricValue({ value }: { value: string }) {
    const m = value.match(/^↑\s*(.*)$/);
    if (!m) return <>{value}</>;
    return (
        <>
            <MetricArrow />
            <span className="sr-only">↑ </span>
            {m[1]}
        </>
    );
}

// Las etiquetas rotan tono, sombra e inclinación para que parezcan pegadas a mano.
const TAG_STYLES = [
    { box: "bg-[#ece3cf] text-[#1c1a1e] shadow-[3px_3px_0_#d8b36a]", tilt: -2 },
    { box: "bg-[#4a3350] text-[#f3ecd9] shadow-[3px_3px_0_#8e7cb3]", tilt: 1.5 },
    { box: "bg-[#2f4a3c] text-[#f3ecd9] shadow-[3px_3px_0_#4f8c80]", tilt: -1 },
] as const;
const TAG_RADII = ["rounded-[0.9rem_0.55rem_1rem_0.5rem]", "rounded-[0.55rem_1rem_0.6rem_0.95rem]", "rounded-[1rem_0.7rem_0.5rem_0.9rem]"];

export function HwTestimonials() {
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

    // Un solo par de transformaciones para todas las filas (ver la original:
    // nada de hooks dentro del map).
    const yStat = useTransform(scrollYProgress, [0, 1], [40, -40], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });
    const yQuote = useTransform(scrollYProgress, [0, 1], [20, -20], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });

    if (TESTIMONIALS.length === 0) return null;

    return (
        <section ref={containerRef} className="relative z-20 overflow-hidden bg-[#1b171e] py-24 text-[#f3ecd9] md:py-32">
            <Cobweb corner="tl" size={170} opacity={0.28} className="h-[110px] w-[110px] md:h-[170px] md:w-[170px]" />
            <Cobweb corner="br" size={130} opacity={0.22} className="h-[90px] w-[90px] md:h-[130px] md:w-[130px]" />

            {/* El hombre invisible se asoma desde el borde, a medias, como quien
                escucha lo que dicen de él: "no lo decimos nosotros". El recorte lo
                hace el overflow-hidden de la sección. */}
            <div className="pointer-events-none absolute right-[-50px] top-[3.25rem] w-[104px] origin-bottom-right -rotate-[10deg] md:right-[-66px] md:top-[6.5rem] md:w-[150px] lg:right-[-58px] lg:w-[170px]">
                <div className="pointer-events-auto">
                    <Peek id="hombre-invisible" width={170} flip delay="-1.2s" className="block h-auto w-full" />
                </div>
                <FlyingBat className="-left-16 top-6 hidden md:block" size={26} delay="-0.6s" />
            </div>

            <div className="container relative mx-auto max-w-7xl px-6 md:px-12">
                <div className="relative mb-16 text-center md:mb-20 md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-4 flex justify-center md:mb-6 md:justify-start"
                    >
                        <HwEyebrow>{c.eyebrow}</HwEyebrow>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className={`${HW_FONT} mb-4 text-4xl font-normal leading-[1.1] text-[#f3ecd9] md:text-6xl`}
                    >
                        {c.title} <span className="text-[#d8b36a]">{c.titleItalic}</span>
                        <Bat className="ml-2 inline-block h-5 w-9 rotate-12 align-top text-[#d8b36a]/80 md:h-7 md:w-12" />
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-3xl text-base font-light text-[#f3ecd9]/65 md:text-lg"
                    >
                        {c.note}
                    </motion.p>
                </div>

                <div className="flex flex-col">
                    {TESTIMONIALS.map((item, index) => {
                        const isLast = index === TESTIMONIALS.length - 1;
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                            >
                                <Seam knot={index === 0} />
                                {/* La última fila deja aire abajo: ahí se asoma la momia. */}
                                <div
                                    className={`flex flex-col gap-8 py-10 md:flex-row md:gap-16 md:py-12 ${isLast ? "pb-28 md:pb-32" : ""}`}
                                >
                                    {/* Cifra */}
                                    <motion.div style={{ y: yStat }} className="flex flex-col items-start pt-2 text-left md:w-1/4">
                                        {item.metric ? (
                                            <>
                                                <span
                                                    className={`${HW_FONT} mb-4 whitespace-nowrap text-[4.25rem] font-normal leading-[0.9] text-[#d8b36a] [text-shadow:4px_4px_0_#4a3350] md:text-[5.25rem] lg:text-[5.75rem]`}
                                                >
                                                    <MetricValue value={item.metric.value} />
                                                </span>
                                                <span
                                                    className={`${HW_FONT} text-[11px] uppercase tracking-[0.2em] text-[#f3ecd9]/60 md:text-xs`}
                                                >
                                                    {item.metric.label[lang]}
                                                </span>
                                            </>
                                        ) : (
                                            // Sin caso publicado no hay cifra verificada. Como en la
                                            // original, el hueco no se rellena con un número: va un
                                            // murcielaguito (el asterisco de esta versión) y el proyecto.
                                            <>
                                                <Bat className="mb-5 h-9 w-16 -rotate-6 text-[#d8b36a]/35 md:h-10 md:w-[4.5rem]" />
                                                <span
                                                    className={`${HW_FONT} text-[11px] uppercase tracking-[0.2em] text-[#f3ecd9]/60 md:text-xs`}
                                                >
                                                    {item.project}
                                                </span>
                                            </>
                                        )}
                                    </motion.div>

                                    {/* Cita */}
                                    <motion.div style={{ y: yQuote }} className="flex items-start pt-4 md:w-1/2">
                                        <p className="text-lg font-medium italic leading-[1.8] tracking-tight text-[#f3ecd9]/90 md:text-[1.125rem]">
                                            <span className={`${HW_FONT} mr-1 text-3xl not-italic leading-[0] text-[#d8b36a]`}>
                                                &ldquo;
                                            </span>
                                            {item.text}
                                            <span className={`${HW_FONT} ml-1 text-3xl not-italic leading-[0] text-[#d8b36a]`}>
                                                &rdquo;
                                            </span>
                                        </p>
                                    </motion.div>

                                    {/* Cliente */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: index * 0.2 }}
                                        className="flex flex-col justify-start pt-4 md:w-1/4 md:items-start"
                                    >
                                        <h4 className={`${HW_FONT} mb-1 text-base font-normal uppercase tracking-[0.12em] text-[#f3ecd9]`}>
                                            {item.name}
                                        </h4>
                                        <p className="mb-5 text-[13px] font-light text-[#f3ecd9]/55">
                                            {item.role}, {item.company}
                                        </p>

                                        {item.tags && (
                                            <div className="flex flex-wrap gap-x-2.5 gap-y-3">
                                                {item.tags[lang].map((tag, i) => {
                                                    const s = TAG_STYLES[(i + index) % TAG_STYLES.length];
                                                    return (
                                                        <span
                                                            key={tag}
                                                            className={`${HW_FONT} border-2 border-[#1c1a1e] px-3 pb-1 pt-1.5 text-[11px] uppercase leading-none tracking-[0.08em] md:text-xs ${s.box} ${TAG_RADII[i % TAG_RADII.length]}`}
                                                            style={{ rotate: `${s.tilt}deg` }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Solo enlaza quien tiene caso publicado. */}
                                        {item.caseSlug && (
                                            <Link
                                                href={caseStudyHref(item.caseSlug, isEn)}
                                                className={`${HW_FONT} group mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d8b36a]/80 transition-colors hover:text-[#d8b36a]`}
                                            >
                                                <span className="block h-[2px] w-5 rounded-full bg-[#d8b36a]/50 transition-[width] duration-300 group-hover:w-8 motion-reduce:transition-none" />
                                                {c.readCase}
                                            </Link>
                                        )}
                                    </motion.div>
                                </div>
                                {isLast && (
                                    // La momia se asoma por detrás de la última costura. Peek
                                    // dibuja fuera de su caja (overflow visible), así que el
                                    // recorte lo hace esta envoltura; el padding deja aire
                                    // para que tirite y suelte la venda sin cortarse.
                                    <div className="relative">
                                        <Seam />
                                        <div className="absolute bottom-[2px] left-[-1.5rem] overflow-hidden px-6 pt-8 md:left-[2%]">
                                            <Peek
                                                id="momia"
                                                width={150}
                                                crop={0.3}
                                                delay="-0.4s"
                                                className="block h-auto w-[112px] md:w-[150px]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
