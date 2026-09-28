"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";
import { Cobweb, HW, HW_FONT, HwCornerButton, HwEyebrow, Peek } from "./hw-ui";

// Versión Halloween de components/layout/events-home.tsx ("04 · Eventos").
// Misma gramática que el original (encoge al scrollear, relleno del título,
// credencial flotando con barrido de escaneo), disfrazada de fiesta de
// monstruos: papel picado colgando, la credencial se vuelve boleto de hueso
// con perforación y calcomanía, y el esqueleto baila junto a la puerta
// mientras el dulce de maíz se asoma por detrás del boleto.

// Fondo de la tarjeta: los recortes del papel picado y la ranura del cordón
// se pintan de este color para que parezcan agujeros.
const CARD = "#1f1b22";

// Muescas de la perforación del boleto: se recortan con máscara (agujero de
// verdad, deja ver a los monstruos de atrás) en vez de pintarlas encima.
// NOTCH_Y = distancia del borde inferior del boleto a la línea punteada; sale
// de pb-5 (20) + alto fijo del pie (38) + borde (3) − media línea (1).
const NOTCH_R = 10;
const NOTCH_Y = 60;
const notchAt = (x: string) =>
    `radial-gradient(circle at ${x} calc(100% - ${NOTCH_Y}px), transparent ${NOTCH_R}px, #000 ${NOTCH_R + 0.5}px)`;
const TICKET_MASK = `${notchAt("0")} left / 51% 100% no-repeat, ${notchAt("100%")} right / 51% 100% no-repeat`;

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

// Banderitas del papel picado: color y cuánto se mece cada una, para que no
// se muevan todas al mismo compás.
const FLAGS = [HW.rose, HW.mustard, HW.lilac, HW.teal, HW.pumpkin, HW.rose, HW.lilac, HW.mustard, HW.teal, HW.pumpkin, HW.rose];

/** Altura del cordel (px) en la posición t∈[0,1]: la misma curva que el path de abajo. */
const sag = (t: number) => 4 + 64 * t * (1 - t);

/** Una banderita de papel picado con recortes (calaverita, flores y orilla). */
function Flag({ color }: { color: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 44 56" className="h-full w-full overflow-visible">
            <path
                d="M3 3 Q22 5 41 3 L41 46 L37 52 L33 46 L29 52 L25 46 L22 52 L19 46 L15 52 L11 46 L7 52 L3 46 Z"
                fill={color}
                stroke={HW.ink}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <g fill={CARD}>
                {/* Orilla calada de triangulitos. */}
                <path d="M8 8 L10 11 L12 8 Z M16 8.4 L18 11.4 L20 8.4 Z M24 8.4 L26 11.4 L28 8.4 Z M32 8 L34 11 L36 8 Z" />
                {/* Calaverita: cráneo calado con los ojos y la nariz del color del papel. */}
                <path d="M22 17 C15 17 12 22 12.5 27 C13 31 15 32 16 33 L16 37 L28 37 L28 33 C29 32 31 31 31.5 27 C32 22 29 17 22 17 Z" />
                {/* Florecitas en las esquinas. */}
                <circle cx="8" cy="41" r="2.2" />
                <circle cx="36" cy="41" r="2.2" />
            </g>
            <g fill={color}>
                <ellipse cx="18" cy="26" rx="3" ry="3.3" />
                <ellipse cx="26" cy="26" rx="3" ry="3.3" />
                <path d="M22 29 L20.5 32 L23.5 32 Z" />
                <path d="M19 34 v3 M22 34 v3 M25 34 v3" stroke={color} strokeWidth="1.4" />
            </g>
        </svg>
    );
}

/** Murcielaguito de un solo trazo, en lugar del asterisco decorativo del original. */
function Bat({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 40 24" className={className}>
            <path
                d="M20 20 Q15 12 4 10 Q9 14 7 18 Q12 16 14 20 Q17 17 20 20 Q23 17 26 20 Q28 16 33 18 Q31 14 36 10 Q25 12 20 20 Z M18 11 Q18 8 19 7 L20 9 L21 7 Q22 8 22 11 Q22 14 20 14 Q18 14 18 11 Z"
                fill={color}
            />
        </svg>
    );
}

/** Calcomanía de calabacita pegada chueca en el boleto (con su orilla blanca de sticker). */
function PumpkinSticker({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 48 48" className={className}>
            <path
                d="M24 6 C31 6 34 9 36 11 C43 11 46 19 45 27 C44 37 38 43 30 43 L18 43 C10 43 4 37 3 27 C2 19 5 11 12 11 C14 9 17 6 24 6 Z"
                fill={HW.cream}
                stroke={HW.ink}
                strokeWidth="1.6"
            />
            <path
                d="M24 13 C29 12 33 13 35 16 C40 16 42 22 41.5 27 C41 34 37 39 30 39 L18 39 C11 39 7 34 6.5 27 C6 22 8 16 13 16 C15 13 19 12 24 13 Z"
                fill={HW.pumpkin}
                stroke={HW.ink}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M18 16.5 C15 22 15 32 18 38.5 M30 16.5 C33 22 33 32 30 38.5"
                fill="none"
                stroke="#b0643a"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path d="M23 13 Q22 9 25 7" fill="none" stroke={HW.moss} strokeWidth="3" strokeLinecap="round" />
            {/* Carita: ojos triangulares y sonrisa chimuela en tinta. */}
            <path d="M15 24 L19 20 L21 25 Z M33 24 L29 20 L27 25 Z" fill={HW.ink} />
            <path d="M15 29 Q24 36 33 29 Q30 34 24 34.5 Q18 34 15 29 Z" fill={HW.ink} />
        </svg>
    );
}

export function HwEventsHome() {
    const { t } = useLang();
    const e = t.eventsHome;
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const reduced = useReducedMotion();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    // Esquinas desiguales de calcomanía recortada a mano: cada una llega a un
    // radio distinto, y la sombra dura aparece a la par que se encoge.
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem 0rem 0rem 0rem", "3.4rem 2.2rem 3.8rem 1.8rem"]);
    const boxShadow = useTransform(scrollYProgress, [0, 1], ["0px 0px 0px #8e7cb3", "10px 10px 0px #8e7cb3"]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, -0.6]);
    // Alto 150% para que el relleno cubra los descendentes (misma trampa que en
    // toogo/automation-home).
    const titleFill = useTransform(scrollYProgress, [0.1, 0.5], ["0% 150%", "100% 150%"]);

    // Cada palabra lleva su propio relleno (la de acento en mostaza): si el
    // relleno fuera del h2, se vería crema debajo de la palabra mostaza.
    const fill = (rgb: string) => ({
        color: `rgba(${rgb}, 0.2)`,
        backgroundImage: `linear-gradient(to right, rgb(${rgb}), rgb(${rgb}))`,
        backgroundSize: titleFill,
        backgroundRepeat: "no-repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundPosition: "0 0",
    });

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius, boxShadow, rotate, backgroundColor: CARD }}
            className="relative z-20 mx-auto mb-40 flex min-h-[60vh] items-center justify-center overflow-hidden border-[3px] border-[#f3ecd9]/85 pt-28 pb-20 text-[#f3ecd9] md:h-auto md:min-h-[60vh] md:pt-24 md:pb-20"
        >
            {/* Cielo de noche: puntitos en lugar de la cuadrícula del original. */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: "radial-gradient(circle, #f3ecd9 1.2px, transparent 1.6px)",
                    backgroundSize: "44px 44px",
                }}
            />

            {/* Papel picado de la fiesta colgando de un cordel de orilla a orilla. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[72px]">
                <svg viewBox="0 0 100 72" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <path
                        d="M0 4 Q50 68 100 4"
                        fill="none"
                        stroke={HW.cream}
                        strokeOpacity="0.55"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
                {FLAGS.map((color, i) => {
                    const tt = (i + 0.5) / FLAGS.length;
                    return (
                        <motion.div
                            key={i}
                            className={`absolute h-[40px] w-[32px] -translate-x-1/2 md:h-[44px] md:w-[36px] xl:h-[52px] xl:w-[42px] ${i % 2 ? "hidden md:block" : ""}`}
                            style={{ left: `${tt * 100}%`, top: sag(tt) - 3, originY: 0 }}
                            animate={reduced ? undefined : { rotate: [-5, 5, -5] }}
                            transition={{ duration: 2.6 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.17 }}
                        >
                            <Flag color={color} />
                        </motion.div>
                    );
                })}
            </div>

            {/* El asterisco gigante del original, ahora un murciélago a contraluz. */}
            <Bat
                color={HW.cream}
                className="pointer-events-none absolute top-[13%] right-[1.5%] w-[7rem] rotate-12 opacity-[0.06] select-none sm:w-[10rem] md:w-[14rem]"
            />
            {/* Anclada fuera de la esquina para que los hilos no crucen el párrafo. */}
            <Cobweb corner="bl" size={104} opacity={0.3} className="hidden md:block md:-bottom-3 md:-left-3" />
            <Cobweb corner="bl" size={96} opacity={0.28} className="md:hidden" />

            <div className="relative container mx-auto flex h-full items-center px-6 md:px-12">
                <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
                    {/* Texto */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center justify-center text-center md:items-start md:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mb-4 md:mb-6"
                        >
                            <HwEyebrow>{e.eyebrow}</HwEyebrow>
                        </motion.div>

                        {/* Desde lg el tamaño sigue al ancho de la columna (≈0.4vw − 75px con la
                        tarjeta encogida) para que "Software para" quepa en una línea: con Gluten
                        mide ~8 veces el tamaño de letra. Tope en 3.8rem como el original. */}
                        <h2
                            className={`${HW_FONT} mb-3 text-[1.95rem] leading-[1.08] font-bold sm:text-4xl md:text-[2.6rem] lg:text-[clamp(2.6rem,calc(4.76vw-8.9px),3.8rem)]`}
                        >
                            <motion.span style={fill("243, 236, 217")}>{e.title}</motion.span>{" "}
                            <motion.span style={fill("216, 179, 106")} className="inline-block -rotate-2">
                                {e.titleItalic}
                            </motion.span>
                        </h2>

                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="mb-8 text-sm font-light tracking-wide text-[#f3ecd9]/55 italic md:text-base"
                        >
                            {e.subtitle}
                        </motion.p>

                        {/* Costura punteada en vez de la rayita. */}
                        <div className="mb-8 w-full max-w-[100px] border-t-2 border-dashed border-[#f3ecd9]/20 md:max-w-none" />

                        <p
                            className="leading-relaxed font-light text-[#f3ecd9]/70"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            {e.description}
                        </p>
                    </motion.div>

                    {/* Boleto de la fiesta — la credencial con QR de la puerta */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mt-14 flex h-full w-full flex-col items-center justify-center md:mt-0"
                    >
                        <div className="relative">
                            {/* El esqueleto baila junto a la puerta, medio escondido tras el boleto. En
                            móvil no cabe a los lados: se asoma por arriba del boleto. En tableta
                            va chico para no invadir la columna del título. */}
                            <Peek
                                id="esqueleto"
                                width={124}
                                delay="-0.6s"
                                className="absolute top-[-72px] left-[10px] z-0 h-auto w-[84px] md:top-auto md:bottom-[-6px] md:left-[-44px] md:w-[62px] lg:left-[-104px] lg:w-[124px]"
                            />

                            {/* Y del otro lado, el dulce de maíz se asoma por detrás del boleto saludando. */}
                            <Peek
                                id="dulce-maiz"
                                width={84}
                                delay="-1.1s"
                                className="absolute right-[-46px] bottom-[-4px] z-0 h-auto w-[54px] md:right-[-44px] lg:right-[-62px] lg:w-[84px]"
                            />

                            <Link href={enHref("/software-para-eventos", isEn)} aria-label={e.badgeAria} className="relative z-10 block">
                                <motion.div
                                    animate={{ y: [0, -12, 0], rotate: [-1.2, 1.2, -1.2] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative cursor-pointer"
                                    // Sombra dura como drop-shadow del contenedor: una box-shadow en el
                                    // boleto quedaría recortada por su máscara.
                                    style={{ filter: "drop-shadow(7px 7px 0 #d98a4f)" }}
                                >
                                    <div
                                        className="relative z-10 w-[210px] rounded-[1.6rem_1.1rem_1.8rem_1rem] border-[3px] border-[#1c1a1e] bg-[#ece3cf] px-5 pt-7 pb-5 text-[#1c1a1e] md:w-[248px]"
                                        style={{ mask: TICKET_MASK, WebkitMask: TICKET_MASK }}
                                    >
                                        {/* Ranura del cordón, perforada. */}
                                        <span
                                            className="absolute top-3 left-1/2 h-[9px] w-14 -translate-x-1/2 rounded-full border-2 border-[#1c1a1e]"
                                            style={{ backgroundColor: CARD }}
                                        />

                                        <div className="mb-4 flex items-center justify-between">
                                            <span className={`${HW_FONT} text-[11px] tracking-[0.24em] text-[#1c1a1e]/60 uppercase`}>
                                                {e.badgeLabel}
                                            </span>
                                            <Bat color={HW.plum} className="h-4 w-7 opacity-70" />
                                        </div>

                                        {/* QR dibujado con CSS: sin imagen que cargar y nítido a
                                        cualquier tamaño. aria-hidden porque no codifica nada. */}
                                        <div
                                            aria-hidden
                                            className="relative mx-auto grid w-fit gap-[2px] rounded-[0.7rem_0.5rem_0.8rem_0.4rem] border-2 border-dashed border-[#1c1a1e]/35 bg-[#f3ecd9] p-2.5"
                                            style={{ gridTemplateColumns: "repeat(9, 12px)" }}
                                        >
                                            {QR.flatMap((row, y) =>
                                                row
                                                    .split("")
                                                    .map((bit, x) => (
                                                        <span
                                                            key={`${y}-${x}`}
                                                            className={`h-3 w-3 rounded-[3px] ${bit === "1" ? "bg-[#1c1a1e]" : "bg-transparent"}`}
                                                        />
                                                    )),
                                            )}
                                            {/* Calcomanía pegada en la esquina del QR, como las de la fiesta. */}
                                            <PumpkinSticker className="absolute -bottom-4 -left-5 h-10 w-10 -rotate-12" />
                                        </div>

                                        {/* Barrido de escaneo: lo que hace el lector en la puerta */}
                                        <motion.span
                                            aria-hidden
                                            animate={{ top: ["18%", "62%", "18%"], opacity: [0, 0.9, 0] }}
                                            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
                                            className="absolute right-5 left-5 h-[3px] rounded-full bg-[#d98a4f]"
                                        />

                                        {/* Contorno de tinta de las muescas: aros centrados en la orilla; la
                                        máscara se come su mitad de afuera y deja el arco que bordea el hueco. */}
                                        {["-left-[15.5px]", "-right-[15.5px]"].map((side) => (
                                            <span
                                                key={side}
                                                aria-hidden
                                                className={`absolute ${side} h-[25px] w-[25px] rounded-full border-[3px] border-[#1c1a1e]`}
                                                style={{ bottom: NOTCH_Y - 3 - 12.5 }}
                                            />
                                        ))}

                                        {/* Perforación del boleto: línea punteada entre las dos muescas. Alto fijo
                                        para que la máscara (NOTCH_Y) caiga justo en la línea. */}
                                        <div className="mt-4 flex h-[38px] items-center justify-between border-t-2 border-dashed border-[#1c1a1e]/30 pt-3">
                                            <span className={`${HW_FONT} text-[11px] tracking-[0.2em] text-[#1c1a1e]/60 uppercase`}>
                                                {e.badgeStatus}
                                            </span>
                                            <span className="h-2.5 w-2.5 rounded-full border-2 border-[#1c1a1e] bg-[#76a07a]" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>

                        <div
                            className={`${HW_FONT} mt-7 flex flex-wrap items-center justify-center gap-x-2 text-[10px] tracking-[0.16em] md:gap-x-3 md:text-sm md:tracking-[0.22em] text-[#f3ecd9]/55 uppercase`}
                        >
                            {e.tags.map((tag, i) => (
                                <span key={tag} className="flex items-center gap-2 md:gap-3">
                                    {i > 0 && <span className="text-[#d8b36a]">✦</span>}
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <HwCornerButton href={enHref("/software-para-eventos", isEn)} label={t.halloween.dare} />
        </motion.section>
    );
}
