"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";
import { Cobweb, Drips, HW_FONT, HwCornerButton, HwEyebrow, Peek } from "./hw-ui";

// Versión Halloween de components/layout/automation-home.tsx. Mismo esqueleto
// y mismos efectos (encoge con el scroll, relleno del título, emblema que
// flota con órbitas girando); el disfraz es el laboratorio de Frankenstein:
// automatizar = una máquina que le da vida a algo. El emblema "IA" pasa a ser
// el generador del laboratorio (tornillos, rayo, chispas) y la criatura se
// asoma por el borde de la tarjeta, junto a él.

/** Rayo de trazo redondo, el mismo en el fondo, en el generador y en las etiquetas. */
function Bolt({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
            <path d="M14 1.5 L4.5 13.5 H11 L9 22.5 L19.5 9.5 H13 Z" fill={fill} strokeLinejoin="round" />
        </svg>
    );
}

/** Chispa de cuatro puntas: sustituye a los asteriscos del original. */
function Spark({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
            <path d="M12 1 Q13.2 10.8 23 12 Q13.2 13.2 12 23 Q10.8 13.2 1 12 Q10.8 10.8 12 1 Z" fill="currentColor" />
        </svg>
    );
}

/** Tornillo de esquina del generador: cabeza hueso con ranura de tinta. */
function Rivet({ className = "", slot = 35 }: { className?: string; slot?: number }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`pointer-events-none absolute h-4 w-4 md:h-5 md:w-5 ${className}`}>
            <circle cx="10" cy="10" r="7.5" fill="#ece3cf" stroke="#1c1a1e" strokeWidth="2.2" />
            <path d="M5.5 10 H14.5" stroke="#1c1a1e" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${slot} 10 10)`} />
        </svg>
    );
}

// Puntada inclinada de la costura (se repite a lo largo de la rayita divisoria).
const STITCH = `url("data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12"><path d="M5 2 L11 10" stroke="rgba(243,236,217,0.55)" stroke-width="2" stroke-linecap="round"/></svg>',
)}")`;

/** Relleno del título al scrollear (misma técnica del original: fondo recortado al texto). */
function textFill(size: MotionValue<string>, color: string, ghost: string) {
    return {
        color: ghost,
        backgroundImage: `linear-gradient(to right, ${color}, ${color})`,
        backgroundSize: size,
        backgroundRepeat: "no-repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundPosition: "0 0",
    } as const;
}

// Tonos de las etiquetas (sombra dura distinta en cada una, un poco chuecas).
const TAG_STYLES = [
    { shadow: "shadow-[3px_3px_0_#4f8c80]", tilt: "-rotate-3" },
    { shadow: "shadow-[3px_3px_0_#d8b36a]", tilt: "rotate-2" },
    { shadow: "shadow-[3px_3px_0_#8e7cb3]", tilt: "-rotate-1" },
];

export function HwAutomationHome() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const reduced = useReducedMotion();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    // Esquinas desiguales de calcomanía: cada una se redondea distinto.
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem 0rem 0rem 0rem", "3.2rem 2.2rem 3.6rem 1.9rem"]);
    // La sombra dura aparece conforme la franja se vuelve tarjeta.
    const boxShadow = useTransform(scrollYProgress, [0, 1], ["0px 0px 0px rgba(79,140,128,1)", "12px 14px 0px rgba(79,140,128,1)"]);
    // Alto 150% para que el relleno cubra los descendentes (misma trampa que
    // en toogo/digital-solutions).
    const titleFill = useTransform(scrollYProgress, [0.1, 0.5], ["0% 150%", "100% 150%"]);

    const href = enHref("/automatizacion-de-procesos", isEn);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius, boxShadow }}
            className="relative z-20 mx-auto mb-40 flex min-h-[60vh] items-center justify-center overflow-hidden border-[3px] border-[#f3ecd9]/85 bg-[#1f1b22] pb-28 pt-16 font-heading text-[#f3ecd9] md:h-auto md:min-h-[51vh] md:py-16 md:pb-24"
        >
            {/* Cuadrícula de libreta de laboratorio, en crema muy tenue */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(243,236,217,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(243,236,217,0.9) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            {/* El asterisco gigante del original: aquí un rayo */}
            <Bolt
                fill="#f3ecd9"
                className="pointer-events-none absolute bottom-[6%] left-[4%] h-24 w-24 -rotate-12 select-none opacity-[0.06] sm:h-40 sm:w-40 md:h-56 md:w-56"
            />
            <Cobweb corner="tr" size={150} opacity={0.3} className="h-20 w-20 md:h-[150px] md:w-[150px]" />

            <div className="container relative mx-auto flex h-full items-center px-6 md:px-12">
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
                            <HwEyebrow>{t.automationHome.eyebrow}</HwEyebrow>
                        </motion.div>

                        <h2
                            // Gluten es más ancha que la letra del original: el tamaño sigue al ancho
                            // de la columna para que "Automatización" no se meta bajo el generador.
                            className={`${HW_FONT} mb-2 text-[length:clamp(1.6rem,8.4vw_-_0.2rem,2.4rem)] font-bold leading-[1.05] text-[#f3ecd9] md:text-[length:clamp(1.6rem,4.2vw_-_0.4rem,4.5rem)]`}
                        >
                            {/* Cada parte lleva su propio relleno: si fuera el del h2, se colaría crema
                            en la palabra mostaza mientras se llena. */}
                            <motion.span style={textFill(titleFill, "#f3ecd9", "rgba(243, 236, 217, 0.14)")} className="inline-block">
                                {t.automationHome.title}
                            </motion.span>{" "}
                            <motion.span
                                style={textFill(titleFill, "#d8b36a", "rgba(216, 179, 106, 0.2)")}
                                className="inline-block font-medium"
                            >
                                {t.automationHome.titleItalic}
                            </motion.span>
                        </h2>

                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className={`${HW_FONT} mb-8 text-base text-[#b3a3cf] md:text-lg`}
                        >
                            {t.automationHome.subtitle}
                        </motion.p>

                        {/* La rayita divisoria del original, cosida como cicatriz */}
                        <div
                            aria-hidden="true"
                            className="mb-8 h-3 w-full max-w-[100px] md:max-w-none"
                            style={{
                                backgroundImage: `linear-gradient(rgba(243,236,217,0.35), rgba(243,236,217,0.35)), ${STITCH}`,
                                backgroundSize: "100% 2px, 16px 12px",
                                backgroundPosition: "0 50%, 0 0",
                                backgroundRepeat: "no-repeat, repeat-x",
                            }}
                        />

                        <p
                            className="font-light leading-relaxed text-[#f3ecd9]/75"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            {t.automationHome.description}
                        </p>
                    </motion.div>

                    {/* Emblema IA — el generador del laboratorio, flotando con sus órbitas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mt-8 flex h-full w-full flex-col items-center justify-center md:mt-0 md:pt-14"
                    >
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative isolate"
                        >
                            {/* El ojo alado ronda el generador, curioso */}
                            <Peek
                                id="ojo-alado"
                                width={84}
                                delay="-1.2s"
                                className="absolute -left-4 -top-16 z-20 lg:-left-20 lg:-top-10"
                            />

                            {/* Electrodos del generador con el arco chisporroteando entre ellos */}
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 120 60"
                                className="pointer-events-none absolute bottom-full right-[12%] -mb-1 h-[48px] w-[96px] md:h-[62px] md:w-[124px]"
                            >
                                <path d="M14 58 V22 M106 58 V22" stroke="#1c1a1e" strokeWidth="11" strokeLinecap="round" />
                                <path d="M14 58 V22 M106 58 V22" stroke="#d3c8ae" strokeWidth="5" strokeLinecap="round" />
                                <circle cx="14" cy="18" r="7" fill="#ece3cf" stroke="#1c1a1e" strokeWidth="3" />
                                <circle cx="106" cy="18" r="7" fill="#ece3cf" stroke="#1c1a1e" strokeWidth="3" />
                                <motion.path
                                    d="M22 18 L36 8 L46 24 L60 6 L72 24 L84 10 L98 18"
                                    fill="none"
                                    stroke="#d8b36a"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    animate={reduced ? undefined : { opacity: [1, 0.25, 1, 0.6, 1] }}
                                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.path
                                    d="M22 18 L34 26 L48 12 L60 28 L74 12 L86 24 L98 18"
                                    fill="none"
                                    stroke="#f3ecd9"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ opacity: 0.2 }}
                                    animate={reduced ? undefined : { opacity: [0.2, 1, 0.1, 0.8, 0.2] }}
                                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                                />
                            </svg>

                            {/* La criatura se asoma por detrás del generador, del lado del texto (en tablet no cabe: va abajo) */}
                            <Peek
                                id="frankenstein"
                                width={150}
                                delay="-0.6s"
                                className="absolute bottom-6 z-[-1] hidden h-auto w-[130px] -rotate-6 lg:-left-[72px] lg:block xl:-left-24 xl:w-[150px]"
                            />

                            <Link href={href} aria-label={t.halloween.automationLink} className="group relative block">
                                <div className="relative flex h-[230px] w-[230px] cursor-pointer items-center justify-center rounded-[2.6rem_2rem_2.8rem_1.8rem] border-[3px] border-[#1c1a1e] bg-[#2f4a3c] shadow-[8px_8px_0_#d8b36a] md:h-[280px] md:w-[280px]">
                                    {/* Órbita exterior: anillo eléctrico con una chispa */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-4 rounded-full border-2 border-dashed border-[#f3ecd9]/25"
                                    >
                                        <Spark className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 text-[#d8b36a]" />
                                    </motion.div>
                                    {/* Órbita interior en sentido contrario, con un rayito */}
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-9 rounded-full border border-[#f3ecd9]/15"
                                    >
                                        <Bolt
                                            fill="#f3ecd9"
                                            className="absolute -bottom-2.5 left-1/2 h-5 w-5 -translate-x-1/2 opacity-70"
                                        />
                                    </motion.div>

                                    {/* IA al centro */}
                                    <span
                                        className={`${HW_FONT} select-none text-6xl leading-none text-[#f3ecd9] transition-transform duration-500 group-hover:scale-105 md:text-7xl`}
                                    >
                                        IA
                                    </span>

                                    {/* El destello del original: un rayo que late */}
                                    <motion.span
                                        animate={reduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.12, 0.9] }}
                                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute right-5 top-5 text-[#d8b36a]"
                                    >
                                        <Bolt className="h-6 w-6" />
                                    </motion.span>

                                    <Rivet className="left-2.5 top-2.5" />
                                    <Rivet className="bottom-2.5 left-2.5" slot={-20} />
                                    <Rivet className="bottom-2.5 right-2.5" slot={70} />

                                    {/* Baba verde que escurre del generador */}
                                    <Drips color="#2f4a3c" className="left-[12%] top-full -mt-[3px] h-5 w-[62%]" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Etiquetas: calcomanías chiquitas en vez del pie en mono */}
                        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-7">
                            {t.automationHome.tags.map((tag, i) => (
                                <li
                                    key={tag}
                                    className={`${HW_FONT} rounded-[0.9rem_0.6rem_1rem_0.5rem] border-2 border-[#f3ecd9]/70 bg-[#1f1b22] px-3 py-1 text-xs text-[#f3ecd9]/90 md:text-sm ${TAG_STYLES[i % TAG_STYLES.length].shadow} ${TAG_STYLES[i % TAG_STYLES.length].tilt}`}
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* En móvil y tablet se asoma por la esquina de abajo a la izquierda */}
            <Peek id="frankenstein" width={112} delay="-0.6s" className="absolute -bottom-12 left-[9%] z-10 lg:hidden" />

            <HwCornerButton href={href} label={t.halloween.dare} className="bottom-4 right-4 md:bottom-8 md:right-8" />
        </motion.section>
    );
}
