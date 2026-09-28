"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/lib/i18n/lang-context";
import { v } from "../palette";
import { Cobweb, Drips, HW, HW_FONT, HwCornerButton, HwEyebrow, Peek } from "./hw-ui";

// Versión Halloween de components/layout/toogo.tsx: misma tarjeta que se
// encoge y redondea al hacer scroll, mismo título que se rellena, misma
// mascota que gira al tocarla. Cambian la letra, la caja (calcomanía morada
// con sombra dura) y lo decorativo. La mascota es de marca: no se le dibuja
// nada encima, solo se enmarca como calcomanía con telaraña en la esquina.

/** Murcielaguito en lugar del asterisco del título. */
function Bat({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 40 24" className={className}>
            <path
                d="M20 20 Q15 12 4 10 Q9 14 7 18 Q12 16 14 20 Q17 17 20 20 Q23 17 26 20 Q28 16 33 18 Q31 14 36 10 Q25 12 20 20 Z"
                fill="currentColor"
            />
            <path d="M18 13.5 L18.6 11 L19.6 13 Z M22 13.5 L21.4 11 L20.4 13 Z" fill="currentColor" />
        </svg>
    );
}

/** Estrellita de 4 puntas que titila (se apaga con movimiento reducido vía .hw-scene). */
function Twinkle({ size, delay, className = "" }: { size: number; delay: string; className?: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            width={size}
            height={size}
            className={`hw-scene pointer-events-none absolute ${className}`}
        >
            <g className="hw-twinkle" style={v({ "--bd": delay, "--td": "3.2s" })}>
                <path d="M10 0 Q11 9 20 10 Q11 11 10 20 Q9 11 0 10 Q9 9 10 0 Z" fill="currentColor" />
            </g>
        </svg>
    );
}

/**
 * Telaraña de tinta para la esquina de la calcomanía, con una arañita que
 * cuelga de su hilo y se mece. La de hw-ui es crema (para el fondo oscuro);
 * sobre el papel hueso hace falta en tinta.
 */
function StickerWeb() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 150"
            className="hw-scene pointer-events-none absolute right-0 top-0 h-[105px] w-[70px] md:h-[120px] md:w-[80px]"
        >
            <g transform="translate(100 0) scale(-1 1)" fill="none" stroke={HW.ink} strokeLinecap="round" opacity="0.6">
                <path strokeWidth="1.1" d="M0 0 L100 8 M0 0 L92 40 M0 0 L70 70 M0 0 L40 92 M0 0 L8 100" />
                <g strokeWidth="1">
                    <path d="M20 1.6 Q16 7 18.4 8 Q14 13 14 14 Q9 16 7 18.4 Q5 16 1.6 20" />
                    <path d="M42 3.4 Q34 12 38.6 16.8 Q30 24 29.4 29.4 Q22 32 16.8 38.6 Q10 36 3.4 42" />
                    <path d="M66 5.3 Q54 18 60.7 26.4 Q48 38 46.2 46.2 Q36 50 26.4 60.7 Q16 56 5.3 66" />
                </g>
            </g>
            {/* La arañita cuelga del radio largo; su hilo sale de la telaraña. */}
            <g className="hw-sway" style={v({ "--o": "50% 0%", "--sw": "7deg", "--sd": "3.8s" })}>
                <path d="M72 30 V112" stroke={HW.ink} strokeWidth="1.2" opacity="0.7" />
                <g stroke={HW.ink} strokeWidth="2.2" strokeLinecap="round" fill="none">
                    <path d="M66 114 Q58 110 56 104 M66 118 Q56 118 53 114 M66 122 Q57 126 55 132 M78 114 Q86 110 88 104 M78 118 Q88 118 91 114 M78 122 Q87 126 89 132" />
                </g>
                <ellipse cx="72" cy="119" rx="8" ry="9" fill={HW.ink} />
                <circle cx="72" cy="109.5" r="4.6" fill={HW.ink} />
                <circle cx="70.2" cy="109" r="1.3" fill={HW.cream} />
                <circle cx="73.8" cy="109" r="1.3" fill={HW.cream} />
            </g>
        </svg>
    );
}

export function HwToogo() {
    const reduce = useReducedMotion();
    const { t } = useLang();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    // Igual que el original se redondea al encogerse, pero con esquinas
    // desiguales (recortada a mano). Sin girar la tarjeta: inclinada, el
    // párrafo se ve chueco y borroso; lo chueco lo pone la calcomanía.
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem 0rem 0rem 0rem", "3.4rem 2.3rem 3.9rem 2rem"]);
    // El relleno del título va por palabra (cada una lleva su color), una
    // tras otra. Alto 150% para cubrir los descendentes de la "g".
    const fillToogo = useTransform(scrollYProgress, [0.1, 0.36], ["0% 150%", "100% 150%"]);
    const fillStore = useTransform(scrollYProgress, [0.34, 0.5], ["0% 150%", "100% 150%"]);

    const fillBase = {
        backgroundRepeat: "no-repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundPosition: "0 0",
    } as const;

    return (
        <motion.section
            ref={containerRef}
            // En móvil la tarjeta va a todo lo ancho y sin esquinas, como en el
            // original; con clases !important en vez de leer window al pintar,
            // que en el servidor no existe y desajusta la hidratación.
            style={{ width, borderRadius }}
            className="relative z-20 mx-auto mb-0 flex min-h-[60vh] w-full flex-col items-center justify-center border-y-[3px] border-[#1c1a1e] bg-[#4a3350] py-16 text-[#f3ecd9] max-md:pb-28 max-md:w-full! max-md:transform-none! max-md:rounded-none! md:mb-40 md:h-auto md:min-h-[51vh] md:flex-row md:border-[3px] md:py-14 md:shadow-[10px_12px_0_#d8b36a]"
        >
            {/* Fondo: puntitos crema muy tenues en vez de la cuadrícula, estrellitas y una telaraña. Recortado aquí y no en la sección para que los chorreados puedan colgar por debajo. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                <div
                    className="absolute inset-0 opacity-[0.09]"
                    style={{
                        backgroundImage: "radial-gradient(#f3ecd9 1.2px, transparent 1.6px)",
                        backgroundSize: "30px 30px",
                    }}
                />
                <Cobweb corner="tl" size={88} opacity={0.3} className="hidden md:block" />
                <Cobweb corner="tr" size={110} opacity={0.28} className="md:hidden" />
                <div className="text-[#d8b36a]">
                    <Twinkle size={14} delay="0s" className="left-[84%] top-[24%] opacity-70 md:left-[46%] md:top-[14%]" />
                    <Twinkle size={9} delay="1.1s" className="left-[6%] bottom-[16%] opacity-60 md:left-[40%] md:bottom-[18%]" />
                    <Twinkle size={11} delay="2s" className="right-[8%] top-[31%] opacity-60 md:right-[30%] md:top-[12%]" />
                </div>
            </div>

            <div className="container relative mx-auto flex h-full flex-col items-center px-6 md:flex-row md:px-12">
                <div className="flex w-full flex-col items-center gap-8 md:grid md:grid-cols-2 md:gap-12">
                    {/* Texto */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex w-full flex-col items-start justify-center text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mb-4 md:mb-6"
                        >
                            <HwEyebrow>{t.toogo.eyebrow}</HwEyebrow>
                        </motion.div>
                        {/* En Gluten "toogo.store" es más ancho que en la letra del original:
                            en tableta se parte a propósito en dos renglones y desde lg va
                            en uno, con un tamaño que cabe en la columna. */}
                        <h2
                            className={`${HW_FONT} mb-8 w-full text-left text-6xl font-bold leading-[0.95] tracking-tight text-[#f3ecd9] lg:whitespace-nowrap lg:text-[length:clamp(2.75rem,5.5vw_-_0.6rem,4.5rem)]`}
                        >
                            <motion.span
                                className="inline-block pb-[0.12em]"
                                style={{
                                    ...fillBase,
                                    color: "rgba(243, 236, 217, 0.13)",
                                    backgroundImage: `linear-gradient(to right, ${HW.cream}, ${HW.cream})`,
                                    backgroundSize: fillToogo,
                                }}
                            >
                                toogo.
                            </motion.span>
                            <br className="lg:hidden" />
                            <span className="whitespace-nowrap">
                                <motion.span
                                    className="inline-block pb-[0.12em] font-medium"
                                    style={{
                                        ...fillBase,
                                        color: "rgba(216, 179, 106, 0.16)",
                                        backgroundImage: `linear-gradient(to right, ${HW.mustard}, ${HW.mustard})`,
                                        backgroundSize: fillStore,
                                    }}
                                >
                                    store
                                </motion.span>
                                <Bat className="ml-1.5 inline-block h-6 w-9 rotate-12 align-top text-[#f3ecd9]/45 md:ml-2 md:h-7 md:w-10" />
                            </span>
                        </h2>

                        {/* Costura punteada en lugar de la raya fina. */}
                        <div className="mb-8 w-full border-t-2 border-dashed border-[#f3ecd9]/30" />

                        <p
                            style={{ fontSize: "clamp(1.1rem, 1rem + 1vw, 1.3rem)" }}
                            className="w-full text-left font-light leading-relaxed text-[#f3ecd9]/80"
                        >
                            {t.toogo.bodyPre}
                            <strong className="font-bold text-[#f3ecd9]">Toogo</strong>
                            {t.toogo.bodyPost}
                        </p>
                    </motion.div>

                    {/* Mascota de Toogo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mt-8 flex h-full w-full items-center justify-center md:mt-0"
                    >
                        <div className="relative">
                            {/* La brujita y el gato se asoman por detrás de la calcomanía, uno por cada lado. */}
                            <Peek
                                id="bruja-bolita"
                                width={128}
                                flip
                                className="absolute -left-[90px] top-[14px] z-0 -rotate-[16deg] max-md:-left-[52px] max-md:h-auto max-md:w-[92px] md:max-xl:-left-[48px] md:max-xl:h-auto md:max-xl:w-[96px]"
                                delay="0.4s"
                            />
                            <Peek
                                id="gato-negro"
                                width={176}
                                className="absolute -right-[106px] bottom-[-6px] z-0 max-md:-top-[90px] max-md:bottom-auto max-md:right-[6px] max-md:h-auto max-md:w-[132px] md:max-xl:-right-[52px] md:max-xl:h-auto md:max-xl:w-[120px]"
                                delay="1.3s"
                            />

                            {/* Toda la calcomanía lleva a toogo.store; la vuelta al tocarla es la del original. */}
                            <motion.a
                                href="https://www.toogo.store"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t.halloween.toogoLink}
                                style={{ rotate: -3 }}
                                whileHover={reduce ? undefined : { y: -10, scale: 1.03 }}
                                whileTap={reduce ? undefined : { rotate: 360, scale: 0.95 }}
                                transition={{
                                    rotate: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                                    default: { type: "spring", stiffness: 300, damping: 20 },
                                }}
                                className="relative z-10 flex h-[280px] w-[280px] cursor-pointer md:max-lg:h-[220px] md:max-lg:w-[220px] md:max-lg:p-6 items-center justify-center rounded-[2.4rem_1.7rem_2.8rem_1.5rem] border-[3px] border-[#1c1a1e] bg-[#ece3cf] p-8 shadow-[9px_9px_0_#d98a4f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b36a]"
                            >
                                {/* Costura de calcomanía: el filo recortado. */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-[9px] rounded-[2rem_1.3rem_2.4rem_1.1rem] border-2 border-dashed border-[#1c1a1e]/25"
                                />
                                <StickerWeb />
                                <img
                                    src="/toogo-character.png"
                                    alt={t.halloween.toogoMascot}
                                    className="relative h-full w-full object-contain pointer-events-none"
                                />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* La sombra mostaza de la tarjeta escurre por abajo. */}
            <Drips color={HW.mustard} className="left-[calc(10%+10px)] top-[calc(100%+10px)] hidden h-7 w-[36%] md:block" />

            {/* En móvil va a la izquierda, lejos de la calcomanía y del chat flotante. La
                etiqueta se oculta a la vista en móvil pero sigue nombrando el enlace. */}
            <HwCornerButton
                href="https://www.toogo.store"
                label={t.halloween.dare}
                className="bottom-6! max-md:left-6! max-md:right-auto! md:bottom-8! md:right-8! max-sm:[&>span:first-child]:sr-only max-sm:[&>span:first-child]:inline"
            />
        </motion.section>
    );
}
