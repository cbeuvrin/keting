"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authorHref } from "@/lib/i18n/routes";
import { useRef } from "react";
import { useLang } from "@/lib/i18n/lang-context";
import { Cobweb, HW_FONT, HwEyebrow, Peek } from "./hw-ui";
import { v } from "../palette";

// Versión Halloween de components/layout/about-us.tsx.
//
// Misma estructura, mismos textos y mismo parallax del "About" de fondo. El
// disfraz: letra Gluten en títulos y acentos, la foto de Carlos como polaroid
// pegada con cinta (con telaraña en la esquina, nunca encima de él) y la
// Catrina y la calaverita asomándose por detrás, como guiño a México.

/** Estrellita de 4 puntas: sustituye al asterisco del título. */
function Sparkle({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
            <path d="M12 1.5 Q13.4 10.2 22.5 12 Q13.4 13.8 12 22.5 Q10.6 13.8 1.5 12 Q10.6 10.2 12 1.5 Z" fill="currentColor" />
        </svg>
    );
}

/** Murciélago que revolotea sobre el fondo (quieto con movimiento reducido: hw-scene lo apaga). */
function FlyingBat({ className = "", delay = "0s", size = 34 }: { className?: string; delay?: string; size?: number }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 64 34" width={size} className={`hw-scene pointer-events-none absolute h-auto ${className}`}>
            <g className="hw-float" style={v({ "--fd": "3.1s", "--fa": "-9px", "--bd": delay })}>
                <path
                    d="M32 30 Q28 22 24 21 Q20 13 6 9 Q11 15 9 21 Q15 18 17 24 Q21 21 24 26 Q27 24 32 30 Q37 24 40 26 Q43 21 47 24 Q49 18 55 21 Q53 15 58 9 Q44 13 40 21 Q36 22 32 30 Z M29 20 L28.5 14.5 L31 18 L33 18 L35.5 14.5 L35 20 Z"
                    fill="#f3ecd9"
                />
            </g>
        </svg>
    );
}

/** Subrayado a mano, un poco ondulado: reemplaza la raya recta bajo el año. */
function Squiggle({ className = "", color = "#d98a4f" }: { className?: string; color?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`}>
            <path
                d="M2 6 Q10 2 18 5.5 T34 5 T50 5.5 T66 4.8 T82 5.6 T98 4.5"
                fill="none"
                stroke={color}
                strokeWidth="2.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export function HwAboutUs() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const reduce = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Igual que la original: el "About" de fondo viaja de -20% a 20% de su ancho.
    const x = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    // Las palabras que la original resalta en sans negra: aquí en Gluten crema.
    const strong = `${HW_FONT} not-italic font-normal text-[#f3ecd9]`;

    // La estrellita va pegada a la última palabra del título para que nunca quede sola en un renglón.
    const titlePost = t.aboutUs.titlePost;
    const accent = <span className="text-[#d8b36a] [text-shadow:4px_4px_0_#4a3350]">{t.aboutUs.titleAccent}</span>;
    const sparkle = <Sparkle className="ml-2 inline-block h-5 w-5 rotate-12 align-top text-[#d8b36a]/80 md:ml-3 md:h-8 md:w-8" />;

    return (
        <section
            ref={sectionRef}
            className="relative z-20 w-full overflow-hidden bg-[#141216] pb-16 pt-14 text-[#f3ecd9] md:pb-24 md:pt-48"
        >
            {/* Cuadrícula sutil, en crema en vez de negro */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(243,236,217,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(243,236,217,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            {/* "About" gigante de fondo con parallax */}
            <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full select-none items-center justify-center overflow-hidden opacity-[0.045]">
                <motion.h2
                    style={{ x }}
                    className={`${HW_FONT} whitespace-nowrap text-[20rem] font-normal leading-none text-[#f3ecd9] md:text-[40rem]`}
                >
                    About
                </motion.h2>
            </div>

            <Cobweb corner="tl" size={150} opacity={0.22} className="h-[96px] w-[96px] md:h-[150px] md:w-[150px]" />
            <FlyingBat className="right-[12%] top-10 md:right-[46%] md:top-24" size={30} delay="-0.8s" />
            <FlyingBat className="right-[4%] top-24 hidden md:block md:right-[40%] md:top-36" size={20} delay="-2.1s" />

            <div className="container relative z-10 mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-12 md:gap-16">
                    {/* Columna izquierda: saludo + bio */}
                    <div className="space-y-8 md:col-span-12 lg:col-span-7">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <HwEyebrow>{t.aboutUs.eyebrow}</HwEyebrow>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`${HW_FONT} mb-2 text-[2.6rem] font-normal leading-[1.08] text-[#f3ecd9] md:text-7xl`}
                            >
                                {t.aboutUs.titlePre}
                                {titlePost ? (
                                    <>
                                        {accent}
                                        {titlePost.startsWith(" ") ? " " : ""}
                                        <span className="whitespace-nowrap">
                                            {titlePost.trim()}
                                            {sparkle}
                                        </span>
                                    </>
                                ) : (
                                    <span className="whitespace-nowrap">
                                        {accent}
                                        {sparkle}
                                    </span>
                                )}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="max-w-3xl text-xl font-normal leading-[1.55] text-[#f3ecd9]/70 md:text-2xl"
                            >
                                {t.aboutUs.subPre}
                                <span className={`${HW_FONT} text-[#d8b36a]`}>{t.aboutUs.subCountry}</span>
                                {t.aboutUs.subMid}
                                <span className={`${HW_FONT} relative inline-block text-[#f3ecd9]`}>
                                    {t.aboutUs.subYear}
                                    <Squiggle className="-bottom-1.5 left-[-4%] h-2.5 w-[108%]" />
                                </span>
                                {t.aboutUs.subMid2}
                                {/* La "píldora" negra de la original, como calcomanía chiquita */}
                                <span
                                    className={`${HW_FONT} mx-0.5 inline-block rounded-[0.7rem_0.45rem_0.8rem_0.4rem] border-2 border-[#1c1a1e] bg-[#8e7cb3] px-2.5 pb-0 pt-1 leading-tight text-[#1c1a1e] shadow-[3px_3px_0_#d8b36a]`}
                                    style={{ rotate: "-4deg" }}
                                >
                                    {t.aboutUs.subPill}
                                </span>
                                {t.aboutUs.subEnd}
                            </motion.p>
                        </div>

                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                            >
                                <HwEyebrow>{t.aboutUs.quoteEyebrow}</HwEyebrow>
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="max-w-2xl text-base font-light italic leading-[1.8] text-[#f3ecd9]/65 md:text-lg lg:text-xl"
                            >
                                <span className={`${HW_FONT} mr-1 align-top text-3xl not-italic leading-none text-[#d8b36a] md:text-4xl`}>
                                    &ldquo;
                                </span>
                                {t.aboutUs.quotePre}
                                <span className={strong}>{t.aboutUs.quoteBrands}</span>
                                {t.aboutUs.quoteMid1}
                                {/* La original subraya "negocio": aquí es una costura punteada */}
                                <span
                                    className={`${strong} underline decoration-[#d8b36a]/80 decoration-dashed decoration-2 underline-offset-[6px]`}
                                >
                                    {t.aboutUs.quoteBusiness}
                                </span>
                                {t.aboutUs.quoteMid2}
                                <span className={strong}>{t.aboutUs.quoteDesign}</span>
                                {t.aboutUs.quoteEnd}
                                <span className={`${HW_FONT} ml-1 align-top text-3xl not-italic leading-none text-[#d8b36a] md:text-4xl`}>
                                    &rdquo;
                                </span>
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex justify-end pr-4 md:pr-12"
                            >
                                <Link
                                    href={authorHref(isEn)}
                                    className={`${HW_FONT} text-lg text-[#f3ecd9] underline-offset-4 transition-colors hover:text-[#d8b36a] hover:underline md:text-xl`}
                                >
                                    — Carlos Beuvrin
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Columna derecha: la foto como polaroid */}
                    <div className="flex justify-center md:col-span-12 lg:col-span-5 lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="relative mt-28 w-[78%] max-w-[300px] flex-shrink-0 lg:mr-6 lg:mt-12"
                        >
                            {/* La Catrina se asoma por detrás, arriba a la izquierda: va antes de la foto para quedar debajo */}
                            <div className="absolute bottom-[calc(100%-2.25rem)] -left-[12%] w-[58%]">
                                <Peek id="catrina" width={190} delay="-0.7s" className="h-auto w-full" />
                            </div>
                            {/* La calaverita, abajo a la derecha, también desde atrás */}
                            <div className="absolute -bottom-[14%] -right-[22%] w-[38%] lg:-bottom-[12%] lg:-right-[30%] lg:w-[42%]">
                                <Peek id="calavera-dulce" width={130} delay="-1.6s" className="h-auto w-full" style={{ rotate: "14deg" }} />
                            </div>

                            <motion.div
                                // La inclinación va en style (no en clase) para que el hover la pueda enderezar.
                                style={{ rotate: -3 }}
                                whileHover={reduce ? undefined : { rotate: -0.5 }}
                                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                className="relative rounded-[0.9rem_0.6rem_1.1rem_0.5rem] border-2 border-[#1c1a1e] bg-[#ece3cf] p-3 pb-14 shadow-[8px_8px_0_#d98a4f] md:p-3.5 md:pb-16"
                            >
                                {/* La foto lleva al perfil: es el elemento que más invita a pulsar. */}
                                <Link
                                    href={authorHref(isEn)}
                                    className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[0.35rem] border-2 border-[#1c1a1e] bg-black"
                                >
                                    <img
                                        src="/carlos-beuvrin.png"
                                        alt={t.aboutUs.imageAlt}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                                        style={{ objectPosition: "center 5%" }}
                                        loading="lazy"
                                    />
                                    {/* Telaraña en la esquina de arriba a la derecha: sobre el fondo negro de la foto, lejos de su cara */}
                                    <Cobweb corner="tr" size={96} opacity={0.5} className="h-[70px] w-[70px] md:h-[96px] md:w-[96px]" />
                                </Link>

                                {/* Cinta que sostiene la polaroid */}
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rotate-[4deg] rounded-[3px] border-2 border-[#1c1a1e] bg-[#d8b36a]/90 [background-image:repeating-linear-gradient(90deg,transparent_0_7px,rgba(28,26,30,0.12)_7px_9px)]"
                                />

                                {/* Garabatos de la franja blanca: cempasúchil y estrellitas, como marcados con plumón */}
                                <div aria-hidden="true" className="absolute bottom-2.5 left-4 flex items-end gap-1.5 md:bottom-3">
                                    <Peek id="cempasuchil" width={46} className="h-auto w-[38px] md:w-[46px]" />
                                    <Sparkle className="mb-1 h-3.5 w-3.5 text-[#cf6f7e]" />
                                    <Sparkle className="mb-4 h-2.5 w-2.5 text-[#4f8c80]" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
