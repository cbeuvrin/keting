"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";
import { INK, P } from "../palette";
import { Cobweb, HW_FONT, HwCornerButton, HwEyebrow, Peek } from "./hw-ui";

// Versión Halloween de components/layout/digital-solutions.tsx. Misma tarjeta,
// mismos textos y mismos efectos (se encoge y redondea con el scroll, el título
// se rellena, los cuadros entran escalonados y giran al tocarlos). Cambia el
// disfraz: calcomanía morada con borde crema y sombra dura, letra Gluten, y los
// cuatro cuadros negros pasan a ser íconos de app de Halloween.
//
// Igual que en el original, los cuatro cuadros son UN solo enlace con cuatro
// piezas dentro: cuatro anclas idénticas se anunciarían cuatro veces seguidas
// a un lector de pantalla sin aportar nada.

const ink = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;

// Lo que cambia al pasar el mouse por un ícono es CSS puro: aparece/desaparece
// con opacidad (vale con movimiento reducido) o se mueve con transición (no).
const onHover = "opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100";
const offHover = "transition-opacity duration-200 group-hover/tile:opacity-0";

/** Calabaza: al pasar el mouse se le prende la vela de adentro. */
function PumpkinIcon() {
    return (
        <>
            <path d="M47 35 C47 28 46 24 49 19 L56 21 C53 26 53 30 54 35 Z" fill={P.moss} {...ink} strokeWidth={3} />
            <path d="M50 34 C30 31 15 42 15 60 C15 78 29 87 50 87 C71 87 85 78 85 60 C85 42 70 31 50 34 Z" fill={P.pumpkin} {...ink} />
            {/* Sombra plana del lado derecho y costillas de calabaza. */}
            <path d="M66 36 C78 42 83 52 83 62 C83 74 74 83 62 86 C71 76 73 52 66 36 Z" fill={P.pumpkinDeep} />
            <path
                d="M34 38 C25 48 26 74 37 85 M66 38 C75 48 74 74 63 85"
                fill="none"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path d="M22 54 Q23 47 28 43" fill="none" stroke={P.cream} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
            <g className={offHover}>
                <path d="M31 56 L39 46 L45 57 Z M55 57 L61 46 L69 56 Z" fill={P.mouth} {...ink} strokeWidth={2.5} />
                <path d="M31 65 C37 78 63 78 69 65 L63 68 L58 64 L53 69 L47 64 L42 69 L37 64 Z" fill={P.mouth} {...ink} strokeWidth={2.5} />
            </g>
            <g className={onHover}>
                <path d="M31 56 L39 46 L45 57 Z M55 57 L61 46 L69 56 Z" fill={P.mustard} {...ink} strokeWidth={2.5} />
                <path
                    d="M31 65 C37 78 63 78 69 65 L63 68 L58 64 L53 69 L47 64 L42 69 L37 64 Z"
                    fill={P.mustard}
                    {...ink}
                    strokeWidth={2.5}
                />
            </g>
        </>
    );
}

/** Fantasma: al pasar el mouse abre la boca y se sonroja. */
function GhostIcon() {
    return (
        <>
            <path
                d="M27 85 C28 62 27 50 31 40 C35 28 43 20 51 20 C60 20 67 28 70 40 C73 51 72 63 73 85 L66 79 L59 87 L51 79 L43 87 L35 79 Z"
                fill={P.bone}
                {...ink}
            />
            <path d="M34 78 C32 64 32 50 36 40 C38 34 42 29 46 26 C40 34 38 46 39 58 C40 66 41 72 42 80 Z" fill={P.boneShade} />
            {/* Bracitos que asoman del borde de la sábana. */}
            <path d="M29 58 Q20 60 19 52 M71 58 Q80 60 81 52" fill="none" {...ink} strokeWidth={3} />
            <ellipse cx="43" cy="49" rx="4" ry="5.5" fill={INK} />
            <ellipse cx="59" cy="49" rx="4" ry="5.5" fill={INK} />
            <circle cx="44.4" cy="47" r="1.4" fill={P.cream} />
            <circle cx="60.4" cy="47" r="1.4" fill={P.cream} />
            <ellipse className={offHover} cx="51" cy="63" rx="3" ry="3.6" fill={P.mouth} {...ink} strokeWidth={2} />
            <g className={onHover}>
                <ellipse cx="51" cy="65" rx="6.5" ry="7.5" fill={P.mouth} {...ink} strokeWidth={2.5} />
                <ellipse cx="36" cy="58" rx="4.5" ry="2.6" fill={P.roseLight} />
                <ellipse cx="66" cy="58" rx="4.5" ry="2.6" fill={P.roseLight} />
            </g>
        </>
    );
}

/** Caldero: al pasar el mouse las burbujas suben. */
function CauldronIcon() {
    return (
        <>
            <g className="transition-transform duration-300 group-hover/tile:-translate-y-[7px] motion-reduce:transition-none">
                <circle cx="37" cy="30" r="5.5" fill={P.tealLight} {...ink} strokeWidth={2.5} />
                <circle cx="57" cy="22" r="4.5" fill={P.tealLight} {...ink} strokeWidth={2.5} />
                <circle cx="66" cy="33" r="3" fill={P.tealLight} {...ink} strokeWidth={2} />
            </g>
            {/* Patitas, detrás de la olla. */}
            <path d="M30 78 L26 89 M70 78 L74 89" fill="none" {...ink} strokeWidth={4} />
            <path d="M22 45 C29 36 36 43 42 39 C50 33 58 43 66 37 C72 35 77 40 79 45 Z" fill={P.sage} {...ink} strokeWidth={3} />
            <path d="M20 50 H80 C83 70 72 85 50 85 C28 85 17 70 20 50 Z" fill={P.charcoal} {...ink} />
            <path d="M68 56 C71 68 66 77 57 81" fill="none" stroke={P.lilac} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path
                d="M16 44 H84 Q87 44 87 48 V50 Q87 54 83 54 H17 Q13 54 13 50 V48 Q13 44 16 44 Z"
                fill={P.lilacDeep}
                {...ink}
                strokeWidth={3}
            />
            <path d="M20 48 H44" stroke={P.cream} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </>
    );
}

/** Murciélago frente a la luna: al pasar el mouse abre los ojos y enseña los colmillos. */
function BatIcon() {
    return (
        <>
            <circle cx="64" cy="34" r="17" fill={P.bone} {...ink} strokeWidth={3} />
            <circle cx="58" cy="30" r="3" fill={P.boneShade} />
            <circle cx="69" cy="40" r="2.2" fill={P.boneShade} />
            <g className="transition-transform duration-300 [transform-box:fill-box] [transform-origin:50%_40%] group-hover/tile:scale-y-[0.8] motion-reduce:transition-none">
                <path
                    d="M50 55 C44 48 32 46 17 49 C22 53 22 60 17 64 C25 61 31 63 34 70 C38 65 45 66 50 71 C55 66 62 65 66 70 C69 63 75 61 83 64 C78 60 78 53 83 49 C68 46 56 48 50 55 Z"
                    fill={P.charcoal}
                    {...ink}
                    strokeWidth={3}
                />
            </g>
            <path
                d="M42 50 L41 41 L47 47 L53 47 L59 41 L58 50 C60 60 56 68 50 68 C44 68 40 60 42 50 Z"
                fill={P.charcoal}
                {...ink}
                strokeWidth={3}
            />
            <path
                d="M44 51 Q46 49 48 51 M52 51 Q54 49 56 51"
                className={offHover}
                fill="none"
                stroke={P.mustard}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <g className={onHover}>
                <circle cx="46" cy="52" r="2.6" fill={P.mustard} />
                <circle cx="54" cy="52" r="2.6" fill={P.mustard} />
                <path
                    d="M47 58 L48.2 62 L49.4 58 M50.6 58 L51.8 62 L53 58"
                    fill={P.cream}
                    stroke={P.cream}
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />
            </g>
        </>
    );
}

// Cada ícono con su fondo de calcomanía, su esquina chueca y su inclinación.
const APPS: { bg: string; radius: string; tilt: number; Icon: () => ReactNode }[] = [
    { bg: P.teal, radius: "1.6rem 1.1rem 1.7rem 1rem", tilt: -3, Icon: PumpkinIcon },
    { bg: P.navyDeep, radius: "1.2rem 1.7rem 1.1rem 1.6rem", tilt: 2.5, Icon: GhostIcon },
    { bg: P.mustard, radius: "1.1rem 1.6rem 1.3rem 1.8rem", tilt: 2, Icon: CauldronIcon },
    { bg: P.lilac, radius: "1.7rem 1.2rem 1.6rem 1.1rem", tilt: -2.5, Icon: BatIcon },
];

/** Murciélago grande y tenue: sustituye al asterisco decorativo del original. */
function BigBat({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 120 70" className={className}>
            <path
                d="M60 28 C52 14 34 8 6 14 C16 20 16 32 8 40 C22 36 30 40 34 52 C42 44 52 46 60 58 C68 46 78 44 86 52 C90 40 98 36 112 40 C104 32 104 20 114 14 C86 8 68 14 60 28 Z M52 26 L50 12 L58 20 L62 20 L70 12 L68 26 Z"
                fill={P.cream}
            />
        </svg>
    );
}

export function HwDigitalSolutions() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const reduce = useReducedMotion();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    // Esquinas desiguales de calcomanía recortada a mano, en vez de las 4 iguales del original.
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem 0rem 0rem 0rem", "3.4rem 2.2rem 3.8rem 2rem"]);
    // Alto 150% (no 100%) para que el relleno cubra los descendentes de la "g"
    // que sobresalen de la caja de línea ajustada.
    const titleFill = useTransform(scrollYProgress, [0.1, 0.5], ["0% 150%", "100% 150%"]);
    // La palabra de acento lleva debajo del relleno una capa opaca del tono
    // "vacío" (mostaza al 18% sobre el morado): sin ella se transparentaba el
    // crema del h2 y la palabra salía en dos colores a media carga. Va en
    // bloque, del ancho del h2, para que su relleno avance a la misma x que el
    // de la primera línea, como en el original.
    const accentFill = useTransform(titleFill, (v) => `${v}, 100% 150%`);
    const href = enHref("/desarrollo-de-software", isEn);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius }}
            className="relative z-20 mx-auto mb-40 flex min-h-[60vh] items-center justify-center border-[3px] border-[#f3ecd9]/90 bg-[#4a3350] pb-20 pt-16 text-[#f3ecd9] shadow-[10px_10px_0_#d98a4f] md:pb-20 md:pt-16"
        >
            {/* Fondo decorativo recortado a la tarjeta. La tarjeta en sí no lleva
                overflow-hidden para que las calabacitas y los fantasmitas puedan salirse. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(243,236,217,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(243,236,217,0.8) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <BigBat className="absolute right-[5%] top-[3%] w-[4.5rem] md:top-[8%] rotate-12 select-none opacity-[0.1] sm:w-[6rem] md:w-[9rem]" />
                {/* Hasta ~1800px el párrafo baja casi hasta el borde: la telaraña se achica para no cruzarlo. */}
                <Cobweb
                    corner="bl"
                    size={150}
                    opacity={0.3}
                    className="max-md:h-[110px] max-md:w-[110px] md:max-[1800px]:h-[96px] md:max-[1800px]:w-[96px]"
                />
            </div>

            {/* Calabacitas sentadas sobre el borde de arriba de la tarjeta. */}
            <Peek id="calabacitas" width={120} className="absolute bottom-[calc(100%-4px)] left-[9%] md:w-[150px] md:h-auto" />

            <div className="container relative mx-auto flex h-full items-center px-6 md:px-12">
                <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
                    {/* Text Content */}
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
                            <HwEyebrow>{t.digital.eyebrow}</HwEyebrow>
                        </motion.div>
                        <motion.h2
                            style={{
                                color: "rgba(243, 236, 217, 0.16)",
                                backgroundImage: `linear-gradient(to right, ${P.cream}, ${P.cream})`,
                                backgroundSize: titleFill,
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                backgroundPosition: "0 0",
                            }}
                            className={`${HW_FONT} mb-2 text-4xl font-bold leading-[1.05] md:text-7xl`}
                        >
                            {t.digital.title} {/* La palabra de acento se rellena en mostaza al mismo ritmo que el resto. */}
                            <motion.span
                                style={{
                                    color: "transparent",
                                    backgroundImage: `linear-gradient(to right, ${P.mustard}, ${P.mustard}), linear-gradient(#644a55, #644a55)`,
                                    backgroundSize: accentFill,
                                    backgroundRepeat: "no-repeat",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    backgroundPosition: "0 0",
                                }}
                                className="block font-semibold"
                            >
                                {t.digital.titleItalic}
                            </motion.span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className={`${HW_FONT} mb-8 text-sm tracking-wide text-[#f3ecd9]/65 md:text-base`}
                        >
                            {t.digital.subtitle}
                        </motion.p>

                        {/* Costura punteada en vez de la rayita gris. */}
                        <div className="mb-8 w-full max-w-[100px] border-t-2 border-dashed border-[#f3ecd9]/35 md:max-w-none" />

                        <p
                            className="leading-relaxed text-[#f3ecd9]/80"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            {t.digital.description}
                        </p>
                    </motion.div>

                    {/* Animated Grid */}
                    <motion.div
                        className="relative flex h-full flex-col items-center justify-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        {/* Los fantasmitas se asoman por encima de los íconos: van en el
                            flujo (no absolutos) para que el conjunto quepa centrado en la
                            tarjeta, y el margen negativo mete su dobladillo detrás. */}
                        <Peek id="fantasmitas" width={140} delay="0.3s" className="relative z-0 -mb-4 md:h-auto md:w-[200px]" />
                        <Link
                            href={href}
                            aria-label={`${t.digital.title} ${t.digital.titleItalic}`}
                            className="relative z-10 block cursor-pointer rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#f3ecd9]"
                        >
                            <motion.div
                                className="grid w-[200px] grid-cols-2 gap-4 md:w-[240px]"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1,
                                            delayChildren: 0.2,
                                        },
                                    },
                                }}
                            >
                                {APPS.map(({ bg, radius, tilt, Icon }, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={{
                                            hidden: { scale: 0, opacity: 0 },
                                            visible: {
                                                scale: 1,
                                                opacity: 1,
                                                transition: { type: "spring", stiffness: 260, damping: 20 },
                                            },
                                        }}
                                    >
                                        {/* La inclinación va en su propia capa para no pelear con el giro del toque. */}
                                        <div style={{ rotate: `${tilt}deg` }}>
                                            <motion.div
                                                // El giro es la respuesta al clic; el hundimiento y
                                                // la elevación son la pista de que se puede pulsar.
                                                whileHover={reduce ? undefined : { y: -6, scale: 1.04 }}
                                                whileTap={reduce ? undefined : { rotate: 360, scale: 0.92 }}
                                                transition={{
                                                    rotate: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                                                    default: { type: "spring", stiffness: 400, damping: 22 },
                                                }}
                                                className="group/tile aspect-square border-[3px] border-[#1c1a1e] shadow-[5px_5px_0_#1c1a1e]"
                                                style={{ backgroundColor: bg, borderRadius: radius }}
                                            >
                                                <svg aria-hidden="true" viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                                                    <Icon />
                                                </svg>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </div>
            <HwCornerButton href={href} label={t.halloween.dare} />
        </motion.section>
    );
}
