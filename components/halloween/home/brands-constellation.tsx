"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLang } from "@/lib/i18n/lang-context";
import { Cobweb, Drips, HW, HW_FONT, HwEyebrow, Peek } from "./hw-ui";
import { v } from "../palette";

// Versión Halloween de components/layout/brands-constellation.tsx.
//
// Mismo muro de marcas: tres cintas de logos en direcciones y velocidades
// distintas, los asteriscos que giran con el scroll y la línea con las cifras
// al pie. El disfraz: letra Gluten, estrellitas y murciélagos en lugar de
// asteriscos, un subrayado de cera que escurre y, al pie, una repisa con velas
// derretidas y el hombre lobo asomándose. La luz de las velas tiñe el fondo
// como un salón en penumbra.
//
// ⚠️ Los logos son de clientes reales: se muestran igual que en el home (mismo
// filtro, misma opacidad) y nada se dibuja encima de ellos.

const logos = [
    { src: "/logos-clientes/2.png", alt: "Nike Strength" },
    { src: "/logos-clientes/3.png", alt: "DiDi" },
    { src: "/logos-clientes/1.png", alt: "Suzuki" },
    { src: "/logos-clientes/6.png", alt: "WSO" },
    { src: "/logos-clientes/4.png", alt: "Iudex" },
    { src: "/logos-clientes/7.png", alt: "Toogo" },
    { src: "/logos-clientes/9.png", alt: "Ivan Ivanovich" },
    { src: "/logos-clientes/10.png", alt: "Uhthoff 1905" },
    { src: "/logos-clientes/11.png", alt: "360 Protective" },
    { src: "/logos-clientes/12.png", alt: "Blindajes" },
];

// Mezclamos para que cada fila tenga orden distinto
const rowA = [...logos, ...logos];
const rowB = [...logos.slice(3), ...logos.slice(0, 3), ...logos.slice(3), ...logos.slice(0, 3)];
const rowC = [...logos.slice(6), ...logos.slice(0, 6), ...logos.slice(6), ...logos.slice(0, 6)];

/** Estrella de 4 puntas un poco chueca, dibujada a mano. Sustituye a los asteriscos grandes. */
function Sparkle({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
            <path d="M51 2 Q55 41 98 49 Q57 56 49 98 Q43 58 3 51 Q44 44 51 2 Z" fill="currentColor" />
        </svg>
    );
}

/** Murcielaguito de silueta (el mismo de Testimonios): el asterisco chico junto al título. */
function Bat({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 64 34" className={className}>
            <path
                d="M32 30 Q28 22 24 21 Q20 13 6 9 Q11 15 9 21 Q15 18 17 24 Q21 21 24 26 Q27 24 32 30 Q37 24 40 26 Q43 21 47 24 Q49 18 55 21 Q53 15 58 9 Q44 13 40 21 Q36 22 32 30 Z"
                fill="currentColor"
            />
            {/* Orejitas: sin ellas parece una gaviota. */}
            <path d="M29 20 L28.5 14.5 L31 18 L33 18 L35.5 14.5 L35 20 Z" fill="currentColor" />
        </svg>
    );
}

/** Murciélago que revolotea (se queda quieto con movimiento reducido: hw-scene lo apaga). */
function FlyingBat({ className = "", delay = "0s", size = 34 }: { className?: string; delay?: string; size?: number }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 64 34" width={size} className={`hw-scene pointer-events-none absolute h-auto ${className}`}>
            <g className="hw-float" style={v({ "--fd": "2.8s", "--fa": "-8px", "--bd": delay })}>
                <path
                    d="M32 30 Q28 22 24 21 Q20 13 6 9 Q11 15 9 21 Q15 18 17 24 Q21 21 24 26 Q27 24 32 30 Q37 24 40 26 Q43 21 47 24 Q49 18 55 21 Q53 15 58 9 Q44 13 40 21 Q36 22 32 30 Z M29 20 L28.5 14.5 L31 18 L33 18 L35.5 14.5 L35 20 Z"
                    fill={HW.cream}
                />
            </g>
        </svg>
    );
}

/**
 * Halo cálido de una vela sobre la pared. Titila un poco (opacidad) para que
 * la luz del salón no se sienta pegada; con movimiento reducido se queda fija.
 */
function CandleGlow({ className = "", delay = 0 }: { className?: string; delay?: number }) {
    const reduce = useReducedMotion();
    return (
        <motion.div
            aria-hidden="true"
            className={`pointer-events-none absolute rounded-full ${className}`}
            style={{ background: "radial-gradient(closest-side, rgba(217,138,79,0.22), rgba(216,179,106,0.08) 55%, transparent)" }}
            animate={reduce ? undefined : { opacity: [0.85, 1, 0.9, 1, 0.8, 0.95, 0.85] }}
            transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
        />
    );
}

// El svg de Peek ocupa también el aire de arriba (la llama crece al reaccionar);
// que ese aire no le robe el hover a los logos: solo el monstruo recibe el mouse.
const PEEK_HIT = "pointer-events-none [&_.hw-monster]:pointer-events-auto";

export function HwBrandsConstellation() {
    const { t } = useLang();
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    // Estrellas giratorias (los asteriscos de la original)
    const rotateA = useTransform(smooth, [0, 1], [0, 540]);
    const rotateB = useTransform(smooth, [0, 1], [0, -720]);

    return (
        <section ref={ref} className="relative snap-start overflow-clip bg-[#141216] pb-20 pt-20 text-[#f3ecd9] md:pb-24 md:pt-24">
            {/* Papel tapiz de salón: un rombito tenue en lugar de la retícula de la original */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(243,236,217,0.9) 1.2px, transparent 1.8px), radial-gradient(circle, rgba(216,179,106,0.9) 0.8px, transparent 1.4px)",
                    backgroundSize: "80px 80px, 80px 80px",
                    backgroundPosition: "0 0, 40px 40px",
                }}
            />

            {/* Penumbra cálida a la altura de la repisa; se apaga antes de la orilla de abajo para no dejar corte con la sección siguiente */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%]"
                style={{ background: "radial-gradient(ellipse 65% 45% at 50% 62%, rgba(216,179,106,0.07), transparent)" }}
            />

            <Cobweb corner="tr" size={180} opacity={0.26} className="h-[110px] w-[110px] md:h-[180px] md:w-[180px]" />

            {/* Luz de las velas de la repisa. Va antes que las cintas de logos para
                quedar detrás de ellos (la luz no los tiñe); la caja de altura cero
                marca la altura de las llamas y se alinea con el contenedor. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[10.5rem] md:bottom-[12.5rem]">
                <div className="relative mx-auto h-0 max-w-7xl px-6 md:px-12 lg:px-20">
                    <div className="relative h-0">
                        <CandleGlow className="left-[-104px] top-[-144px] h-72 w-72 md:left-[-190px] md:top-[-208px] md:h-[26rem] md:w-[26rem]" />
                        <CandleGlow
                            className="right-[-56px] top-[-128px] h-64 w-64 md:right-[-20px] md:top-[-192px] md:h-[24rem] md:w-[24rem]"
                            delay={1.1}
                        />
                    </div>
                </div>
            </div>

            {/* Estrellas */}
            <motion.span
                style={{ rotate: rotateA }}
                className="pointer-events-none absolute left-[3%] top-[8%] inline-block origin-center select-none text-[#f3ecd9]/[0.05]"
            >
                <Sparkle className="h-[4.5rem] w-[4.5rem] sm:h-[7rem] sm:w-[7rem] md:h-[12rem] md:w-[12rem]" />
            </motion.span>
            <motion.span
                style={{ rotate: rotateB }}
                className="pointer-events-none absolute bottom-[10%] right-[5%] inline-block origin-center select-none text-[#d8b36a]/[0.06]"
            >
                <Sparkle className="h-[3.75rem] w-[3.75rem] sm:h-[6rem] sm:w-[6rem] md:h-[9.5rem] md:w-[9.5rem]" />
            </motion.span>

            <div className="relative mx-auto mb-10 max-w-7xl px-6 md:mb-14 md:px-12 lg:px-20">
                {/* Murciélagos en el hueco a la derecha del título */}
                <div aria-hidden="true" className="pointer-events-none absolute right-4 top-0 hidden h-44 w-60 md:block lg:right-10">
                    <FlyingBat className="left-8 top-14" size={44} delay="-0.4s" />
                    <FlyingBat className="left-36 top-0" size={30} delay="-1.6s" />
                    <FlyingBat className="right-0 top-24" size={24} delay="-2.3s" />
                </div>

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-6 md:mb-8"
                >
                    <HwEyebrow>{t.brands.eyebrow}</HwEyebrow>
                </motion.div>

                {/* Título — mismo tamaño que las otras secciones del home */}
                <h2 className={`${HW_FONT} text-4xl font-normal leading-[1.1] text-[#f3ecd9] md:text-7xl`}>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                    >
                        {t.brands.title1} <span className="text-[#d8b36a]">{t.brands.titleItalic}</span>
                    </motion.span>
                    {/* El renglón dispara también el subrayado (variantes): el subrayado arranca
                        con ancho cero y, observado por sí solo, en móvil nunca se trazaba. */}
                    <motion.span
                        initial="hidden"
                        whileInView="shown"
                        variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0 } }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                    >
                        {t.brands.title2Pre}{" "}
                        <span className="relative inline-block">
                            {t.brands.title2Underlined}
                            {/* Subrayado de cera: se traza igual que el de la original y escurre */}
                            <motion.span
                                aria-hidden="true"
                                variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                                transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute -bottom-1.5 left-0 right-0 block h-[4px] origin-left rounded-full bg-[#d8b36a] md:-bottom-2 md:h-[6px]"
                            >
                                <Drips color={HW.mustard} className="left-[6%] top-[calc(100%-2px)] h-[9px] w-[88%] md:h-[14px]" />
                            </motion.span>
                        </span>
                        <Bat className="ml-2 inline-block h-5 w-9 rotate-12 align-top text-[#f3ecd9]/35 md:ml-3 md:h-8 md:w-14" />
                    </motion.span>
                </h2>
            </div>

            {/* Triple marquee — 3 filas, direcciones alternadas, distintas velocidades */}
            {/* Las orillas se desvanecen con máscara y no con franjas del color del fondo:
                así la luz de las velas sigue pasando por detrás en las orillas. Va por encima
                de la repisa: si la llama de una vela crece al reaccionar, pasa por detrás de
                los logos y nunca encima. */}
            <div className="relative z-[1] -my-2 space-y-0 [mask-image:linear-gradient(to_right,transparent,#000_4rem,#000_calc(100%-4rem),transparent)] md:-my-3 md:[mask-image:linear-gradient(to_right,transparent,#000_8rem,#000_calc(100%-8rem),transparent)]">
                <MarqueeRow logos={rowA} direction={-1} duration={50} size="md" />
                <MarqueeRow logos={rowB} direction={1} duration={70} size="lg" />
                <MarqueeRow logos={rowC} direction={-1} duration={60} size="sm" />
            </div>

            {/* Repisa con velas + cifras (la línea y el contador de la original) */}
            <div className="relative mx-auto mt-32 max-w-7xl px-6 md:mt-40 md:px-12 lg:px-20">
                {/* Quien observa la entrada es la repisa y no la línea: la línea arranca
                    con scaleX 0 (ancho cero) y en móvil nunca "entraba" a la vista. */}
                <motion.div className="relative mb-6" initial="hidden" whileInView="shown" viewport={{ once: true, margin: "-10%" }}>
                    {/* Dos velas a la izquierda, sentadas en la repisa */}
                    <div className="pointer-events-none absolute bottom-[1px] left-1 flex items-end gap-1 md:left-2 md:gap-2">
                        <Peek id="vela-derretida" width={80} delay="-0.8s" className={`block h-auto w-[60px] md:w-[80px] ${PEEK_HIT}`} />
                        <Peek
                            id="vela-derretida"
                            width={58}
                            delay="-2.1s"
                            flip
                            className={`block h-auto w-[44px] md:w-[58px] ${PEEK_HIT}`}
                        />
                    </div>

                    {/* El hombre lobo se asoma por detrás de la repisa; el recorte lo hace
                        esta envoltura (Peek dibuja fuera de su caja) y el padding deja aire
                        para las ondas de su aullido. */}
                    <div className="pointer-events-none absolute bottom-[1px] right-0 flex items-end md:right-[6%]">
                        <Peek
                            id="vela-derretida"
                            width={50}
                            delay="-1.4s"
                            className={`mr-1 block h-auto w-[36px] md:w-[50px] ${PEEK_HIT}`}
                        />
                        <div className="overflow-hidden px-5 pt-6">
                            <Peek
                                id="hombre-lobo"
                                width={170}
                                crop={0.12}
                                delay="-0.6s"
                                className={`block h-auto w-[104px] md:w-[170px] ${PEEK_HIT}`}
                            />
                        </div>
                    </div>

                    <motion.div
                        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-[3px] w-full origin-left rounded-full bg-[#f3ecd9]/25"
                    />
                </motion.div>
                <div
                    className={`${HW_FONT} flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#f3ecd9]/50 md:text-xs`}
                >
                    <span>{t.brands.stat1}</span>
                    <span>{t.brands.stat2}</span>
                    <span>{t.brands.stat3}</span>
                </div>
            </div>
        </section>
    );
}

function MarqueeRow({
    logos,
    direction,
    duration,
    size,
}: {
    logos: { src: string; alt: string }[];
    direction: 1 | -1;
    duration: number;
    size: "sm" | "md" | "lg";
}) {
    const heights = {
        sm: "h-14 sm:h-20 md:h-28",
        md: "h-16 sm:h-24 md:h-36",
        lg: "h-20 sm:h-28 md:h-44",
    };
    const widths = {
        sm: "w-32 sm:w-44 md:w-64",
        md: "w-36 sm:w-52 md:w-80",
        lg: "w-44 sm:w-64 md:w-96",
    };

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex w-max gap-2 md:gap-4"
                animate={{ x: direction === -1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {logos.map((logo, i) => (
                    <div key={i} className={`flex flex-shrink-0 items-center justify-center ${heights[size]} ${widths[size]}`}>
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            width={300}
                            height={300}
                            className="max-h-full max-w-full object-contain opacity-70 transition-opacity duration-500 hover:opacity-100"
                            style={{ filter: "invert(1)" }}
                            draggable={false}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
