"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, ArrowDown, Sparkles, Plus } from "lucide-react";
import { ContactModal } from "@/components/pricing/contact-modal";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";

/* ==========================================================================
   1. HERO BAJADA — Editorial gigante con mezcla de pesos, italics, deco
   Vuelta al estilo grande + entrada hacia arriba con mask reveal por bloque
   + asteriscos flotando + stats al final + mejor distribución asimétrica.
   ========================================================================== */

export function HeroBajada() {
    const { t } = useLang();
    const s = t.softwarePage.heroBajada;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    // Cada asterisco gira con distinta velocidad y dirección
    const rotate1 = useTransform(smooth, [0, 1], [0, 720]);   // 2 vueltas horarias
    const rotate2 = useTransform(smooth, [0, 1], [0, -540]);  // 1.5 vueltas anti-horarias
    const rotate3 = useTransform(smooth, [0, 1], [0, 900]);   // 2.5 vueltas horarias

    return (
        <section ref={ref} className="bg-[#FAFAFA] relative py-32 md:py-44 px-6 md:px-12 lg:px-24 overflow-hidden">

            {/* Grid background muy sutil */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Asteriscos decorativos: giran con el scroll (cada uno distinta dirección/velocidad) */}
            <motion.span
                style={{ rotate: rotate1 }}
                className="absolute top-8 left-[4%] text-[10rem] md:text-[18rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center"
            >*</motion.span>
            <motion.span
                style={{ rotate: rotate2 }}
                className="absolute top-[24%] right-[5%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center"
            >*</motion.span>
            <motion.span
                style={{ rotate: rotate3 }}
                className="absolute bottom-[14%] right-[10%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center"
            >*</motion.span>

            <div className="max-w-7xl mx-auto relative">

                {/* Eyebrow con línea + badge 02 */}
                <div className="flex items-center justify-between mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3"
                    >
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                            {s.eyebrow}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                    >
                        <span className="font-serif italic text-2xl md:text-3xl text-white">
                            02
                        </span>
                    </motion.div>
                </div>

                {/* BLOQUE 1 — alineado izquierda, gigante */}
                <div className="mb-16 md:mb-24 max-w-5xl uppercase leading-[1]">
                    <RiseText delay={0}>
                        <span className="block text-4xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#1d1d1f]">
                            {s.h1a}
                        </span>
                    </RiseText>
                    <RiseText delay={0.12}>
                        <span className="block text-5xl md:text-8xl lg:text-[8.5rem] font-[family-name:var(--font-playfair)] italic font-normal normal-case tracking-tight text-[#1d1d1f]">
                            {s.h1accent}
                        </span>
                    </RiseText>
                    <RiseText delay={0.24}>
                        <span className="block text-3xl md:text-5xl lg:text-6xl font-light mt-2 md:mt-4 tracking-tight text-[#1d1d1f]">
                            {s.h1bPre}{" "}
                            <span className="relative inline-block font-normal">
                                {s.h1bWord}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left"
                                />
                            </span>.
                        </span>
                    </RiseText>
                </div>

                {/* BLOQUE 2 — alineado a la derecha, más pequeño */}
                <div className="mb-16 md:mb-24 max-w-md ml-auto text-right leading-[1.15]">
                    <RiseText delay={0.1}>
                        <span className="block text-xl md:text-2xl lg:text-3xl font-light italic text-[#1d1d1f]">
                            {s.sub1}
                        </span>
                    </RiseText>
                    <RiseText delay={0.2}>
                        <span className="block text-xl md:text-3xl lg:text-4xl font-medium mt-1 tracking-tight text-[#1d1d1f]">
                            {s.sub2Pre}{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10">{s.sub2Word}</span>
                                <span className="absolute inset-x-0 bottom-0.5 md:bottom-1 h-2 md:h-2.5 bg-[#1d1d1f]/12 -z-0" />
                            </span>
                        </span>
                    </RiseText>
                    <RiseText delay={0.32}>
                        <span className="block text-lg md:text-2xl lg:text-3xl font-light italic mt-1 text-[#1d1d1f]/50">
                            {s.sub3}
                        </span>
                    </RiseText>
                </div>

                {/* iPad 3D — rota desde perspectiva hacia frente con el scroll */}
                <Ipad3D imgAlt={s.imgAlt} />

                {/* BLOQUE 3 — vuelve a izquierda, mezcla */}
                <div className="mb-16 md:mb-20 max-w-6xl leading-[1.05]">
                    <RiseText delay={0.05}>
                        <span className="block text-4xl md:text-6xl lg:text-7xl font-light uppercase tracking-tight text-[#1d1d1f]">
                            {s.p1Pre}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">
                                {s.p1Word}
                            </span>
                            <motion.span
                                initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                                whileInView={{ opacity: 1, rotate: 18, scale: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-block ml-2 text-3xl md:text-5xl align-top text-[#1d1d1f]/40"
                            >
                                *
                            </motion.span>
                        </span>
                    </RiseText>
                    <RiseText delay={0.18}>
                        <span className="block text-2xl md:text-4xl lg:text-5xl font-light italic mt-4 md:mt-6 text-[#1d1d1f]/70 max-w-4xl">
                            {s.p2}
                        </span>
                    </RiseText>
                    <RiseText delay={0.3}>
                        <span className="block text-3xl md:text-5xl lg:text-6xl font-normal mt-2 md:mt-3 tracking-tight text-[#1d1d1f]">
                            {s.p3Pre}{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 font-[family-name:var(--font-playfair)] italic">{s.p3Word}</span>
                                <span className="absolute inset-x-0 bottom-1 md:bottom-2 h-3 md:h-4 bg-[#1d1d1f]/15 -z-0" />
                            </span>{" "}
                            {s.p3End}
                        </span>
                    </RiseText>
                </div>

                {/* Línea divisoria animada de izquierda a derecha */}
                <div className="mt-12 md:mt-16 max-w-2xl">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-px bg-[#1d1d1f]/25 w-full origin-left"
                    />
                </div>

                {/* Stats finales */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-3 gap-6 md:gap-10 max-w-2xl pt-10"
                >
                    <Stat number={s.stat1num} label={s.stat1label} />
                    <Stat number={s.stat2num} label={s.stat2label} />
                    <Stat number={s.stat3num} label={s.stat3label} />
                </motion.div>

            </div>
        </section>
    );
}

/* Bloque de texto que sube desde abajo con mask (overflow-hidden + translateY) */
function RiseText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <div className="overflow-hidden">
            <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
}

function Stat({ number, label }: { number: string; label: string }) {
    return (
        <div>
            <div className="text-3xl md:text-5xl font-light text-[#1d1d1f] mb-1 leading-none">{number}</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#1d1d1f]/50 font-mono">{label}</div>
        </div>
    );
}

/* iPad 3D: arranca girado en perspectiva y se endereza al hacer scroll */
function Ipad3D({ imgAlt }: { imgAlt: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end 60%"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.6 });

    // Empieza inclinado 3D, se endereza (sin opacidad para que sea opaco siempre)
    const rotateY = useTransform(smooth, [0, 1], [-45, 0]);
    const rotateX = useTransform(smooth, [0, 1], [12, 0]);
    const scale = useTransform(smooth, [0, 1], [0.85, 1]);

    return (
        <div
            ref={ref}
            className="relative mb-16 md:mb-24 flex justify-center py-12 md:py-16"
            style={{ perspective: "1200px" }}
        >
            {/* Líneas resaltadas + puntos viajando (detrás del iPad) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                {/* Línea 1 — superior */}
                <div className="absolute top-[28%] left-0 right-0 h-px bg-[#1d1d1f]/25" />
                <motion.div
                    className="absolute top-[28%] -translate-y-1/2 w-2 h-2 rounded-full bg-[#1d1d1f] shadow-[0_0_10px_rgba(29,29,31,0.5)]"
                    animate={{ left: ["-2%", "102%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                {/* Línea 2 — inferior */}
                <div className="absolute top-[72%] left-0 right-0 h-px bg-[#1d1d1f]/25" />
                <motion.div
                    className="absolute top-[72%] -translate-y-1/2 w-2 h-2 rounded-full bg-[#1d1d1f] shadow-[0_0_10px_rgba(29,29,31,0.5)]"
                    animate={{ left: ["102%", "-2%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <motion.div
                style={{
                    rotateY,
                    rotateX,
                    scale,
                    transformStyle: "preserve-3d",
                    zIndex: 10,
                }}
                className="relative w-full max-w-xs md:max-w-md lg:max-w-md"
            >
                {/* Sombra proyectada al piso */}
                <div
                    className="absolute -bottom-6 left-[10%] right-[10%] h-8 bg-[#1d1d1f]/20 blur-2xl rounded-full"
                    style={{ transform: "translateZ(-50px)" }}
                />
                <img
                    src="/soluciones/suzuki-ipad.png"
                    alt={imgAlt}
                    className="relative w-full h-auto drop-shadow-2xl"
                    draggable={false}
                />
            </motion.div>
        </div>
    );
}

/* ==========================================================================
   2. NUESTRO ENFOQUE — Sticky title + scrolling paragraphs
   Recupera el layout original pero con estilo editorial (pesos, italics,
   Playfair, asteriscos giratorios, rise-up). Título nuevo más atractivo.
   ========================================================================== */

export function NuestroEnfoque() {
    const { t } = useLang();
    const s = t.softwarePage.nuestroEnfoque;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    // Asteriscos giran con el scroll
    const rotateA = useTransform(smooth, [0, 1], [0, -600]);
    const rotateB = useTransform(smooth, [0, 1], [0, 720]);

    // Indicador activo
    const activeIndex = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);
    const [active, setActive] = useState(0);
    useEffect(() => activeIndex.on("change", (v) => setActive(Math.round(v))), [activeIndex]);

    const progressWidth = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

    return (
        <section ref={ref} className="bg-[#F5F5F7] relative overflow-clip" style={{ minHeight: "195vh" }}>

            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Asteriscos decorativos giratorios */}
            <motion.span
                style={{ rotate: rotateA }}
                className="absolute top-[8%] right-[5%] text-[10rem] md:text-[18rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>
            <motion.span
                style={{ rotate: rotateB }}
                className="absolute bottom-[15%] left-[3%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32 relative">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 relative">

                    {/* === IZQUIERDA · STICKY === */}
                    <div className="md:col-span-6 md:sticky md:top-32 md:self-start">

                        {/* Eyebrow + badge 03 */}
                        <div className="flex items-center justify-between mb-10 md:mb-14">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="flex items-center gap-3"
                            >
                                <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                                <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                                    {s.eyebrow}
                                </span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.7 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                            >
                                <span className="font-serif italic text-xl md:text-2xl text-white">03</span>
                            </motion.div>
                        </div>

                        {/* TÍTULO — Primero entendemos. Después construimos. */}
                        <div className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f]">
                            <RiseText delay={0}>
                                <span className="block text-4xl md:text-6xl lg:text-7xl font-light">
                                    {s.h2aPre}{" "}
                                    <span className="relative inline-block font-normal">
                                        {s.h2aWord}
                                        <motion.span
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true, margin: "-10%" }}
                                            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left"
                                        />
                                    </span>.
                                </span>
                            </RiseText>
                            <RiseText delay={0.15}>
                                <span className="block text-4xl md:text-6xl lg:text-7xl font-light mt-2 md:mt-4">
                                    {s.h2bPre}{" "}
                                    <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">{s.h2bWord}</span>
                                    <motion.span
                                        initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                                        whileInView={{ opacity: 1, rotate: 18, scale: 1 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block ml-2 text-2xl md:text-4xl align-top text-[#1d1d1f]/40"
                                    >*</motion.span>
                                    <span className="lowercase">.</span>
                                </span>
                            </RiseText>
                        </div>

                        {/* Indicador 01/02 con barra de progreso */}
                        <div className="hidden md:flex items-center gap-4 mt-12">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-mono transition-colors duration-500 ${active === 0 ? "text-[#1d1d1f]" : "text-[#1d1d1f]/30"}`}>01</span>
                                <span className="text-[#1d1d1f]/30">/</span>
                                <span className={`text-sm font-mono transition-colors duration-500 ${active === 1 ? "text-[#1d1d1f]" : "text-[#1d1d1f]/30"}`}>02</span>
                            </div>
                            <div className="h-px w-32 bg-[#1d1d1f]/20 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-[#1d1d1f]"
                                    style={{ width: progressWidth }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* === DERECHA · PÁRRAFOS QUE SUBEN === */}
                    <div className="md:col-span-6 space-y-[35vh] md:space-y-[60vh] mt-12 md:mt-24">

                        <RichParagraph index={0} active={active}>
                            <p className="text-xl md:text-2xl lg:text-3xl font-light leading-[1.3] text-[#1d1d1f]">
                                {s.p1Pre1}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.p1Word1}</span>{" "}
                                {s.p1Pre2}{" "}
                                <span className="font-normal">{s.p1Bold}</span>.
                            </p>
                            <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/65 mt-5 max-w-md">
                                {s.p1sub}
                            </p>
                        </RichParagraph>

                        <RichParagraph index={1} active={active}>
                            <p className="text-xl md:text-2xl lg:text-3xl font-light leading-[1.3] text-[#1d1d1f]">
                                {s.p2Pre}{" "}
                                <span className="relative inline-block font-normal">
                                    <span className="relative z-10">{s.p2Highlight}</span>
                                    <span className="absolute inset-x-0 bottom-0 md:bottom-1 h-2 md:h-3 bg-[#1d1d1f]/12 -z-0" />
                                </span>
                                {s.p2Mid}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic">{s.p2Word}</span>.
                            </p>
                            <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/65 mt-5 max-w-md">
                                {s.p2subPre}{" "}
                                <span className="text-[#1d1d1f] font-normal">{s.p2subBold1}</span>{s.p2subMid1}{" "}
                                <span className="text-[#1d1d1f] font-normal">{s.p2subBold2}</span> {s.p2subMid2}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic text-[#1d1d1f]">{s.p2subWord}</span>.
                            </p>
                        </RichParagraph>

                    </div>
                </div>
            </div>
        </section>
    );
}

function RichParagraph({ index, active, children }: { index: number; active: number; children: React.ReactNode }) {
    const isActive = active === index;
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-25%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-50"}`}
        >
            <div className="flex items-center gap-3 mb-6">
                <span className={`text-xs font-mono uppercase tracking-[0.3em] transition-colors duration-500 ${isActive ? "text-[#1d1d1f]" : "text-[#1d1d1f]/40"}`}>
                    {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`block h-px transition-all duration-700 ${isActive ? "w-12 bg-[#1d1d1f]" : "w-6 bg-[#1d1d1f]/30"}`} />
            </div>
            {children}
        </motion.div>
    );
}

/* ==========================================================================
   3. DÓNDE LO APLICAMOS — (intacta, el cliente la aprobó)
   ========================================================================== */

type Vertical = {
    title: string;        // parte principal con HoverLetters
    accent?: string;      // sufijo en Playfair italic
    arrow?: boolean;      // flecha decorativa al final
    dark?: boolean;
    body: React.ReactNode;
};

export function DondeLoAplicamos() {
    const { t } = useLang();
    const s = t.softwarePage.dondeLoAplicamos;
    const v = s.verticals;
    const verticals: Vertical[] = [
        {
            title: v[0].title,
            arrow: true,
            body: (
                <>
                    {v[0].bodyPre}{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{v[0].bodyAccent}</span>
                    {v[0].bodyMid}
                    {" "}
                    <span className="relative inline-block font-normal text-[#1d1d1f]">
                        <span className="relative z-10">{v[0].bodyHighlight}</span>
                        <span className="absolute inset-x-0 bottom-0 h-2 bg-[#1d1d1f]/12 -z-0" />
                    </span>.
                </>
            ),
        },
        {
            title: v[1].title,
            accent: v[1].accent,
            dark: true,
            body: (
                <>
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-white">{v[1].bodyAccent}</span>
                    {v[1].bodyMid}
                    {" "}
                    <span className="underline decoration-2 underline-offset-4 decoration-white/60 font-normal text-white">{v[1].bodyUnderline}</span>.
                </>
            ),
        },
        {
            title: v[2].title,
            arrow: true,
            body: (
                <>
                    {v[2].bodyPre}{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{v[2].bodyAccent}</span> {v[2].bodyMid}{" "}
                    <span className="font-normal text-[#1d1d1f]">{v[2].bodyBold1}</span> {v[2].bodyMid2}{" "}
                    <span className="font-normal text-[#1d1d1f]">{v[2].bodyBold2}</span>.
                </>
            ),
        },
        {
            title: v[3].title,
            accent: v[3].accent,
            body: (
                <>
                    {v[3].bodyPre}{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{v[3].bodyAccent}</span>
                    {v[3].bodyMid}
                    {" "}
                    <span className="line-through decoration-[#1d1d1f]/60 text-[#1d1d1f]/50">{v[3].bodyStrike}</span>.
                </>
            ),
        },
        {
            title: v[4].title,
            arrow: true,
            dark: true,
            body: (
                <>
                    {v[4].bodyPre}
                    <span className="block mt-3 text-white font-normal">
                        {v[4].bodyLine2Pre}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic">{v[4].bodyLine2Accent}</span>{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10">{v[4].bodyLine2Highlight}</span>
                            <span className="absolute inset-x-0 bottom-0 h-2 bg-white/15 -z-0" />
                        </span>.
                    </span>
                </>
            ),
        },
        {
            title: v[5].title,
            accent: v[5].accent,
            body: (
                <>
                    {v[5].bodyPre}{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{v[5].bodyAccent}</span>{" "}
                    {v[5].bodyEnd}
                </>
            ),
        },
    ];

    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    const rotateA = useTransform(smooth, [0, 1], [0, 540]);
    const rotateB = useTransform(smooth, [0, 1], [0, -700]);

    return (
        <section ref={ref} className="bg-[#FAFAFA] relative py-32 md:py-44 px-6 md:px-12 lg:px-24 overflow-clip">

            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Asteriscos giratorios */}
            <motion.span
                style={{ rotate: rotateA }}
                className="absolute top-[6%] left-[3%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>
            <motion.span
                style={{ rotate: rotateB }}
                className="absolute bottom-[8%] right-[6%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto relative">

                {/* Eyebrow + badge 04 */}
                <div className="flex items-center justify-between mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3"
                    >
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                            {s.eyebrow}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                    >
                        <span className="font-serif italic text-2xl md:text-3xl text-white">04</span>
                    </motion.div>
                </div>

                {/* Título editorial */}
                <div className="mb-6 md:mb-8 uppercase leading-[1] tracking-tight text-[#1d1d1f] max-w-6xl">
                    <RiseText delay={0}>
                        <span className="block text-4xl md:text-7xl lg:text-8xl font-light">
                            {s.h2aPre}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">{s.h2aWord}</span>
                        </span>
                    </RiseText>
                    <RiseText delay={0.12}>
                        <span className="block text-4xl md:text-7xl lg:text-8xl font-light mt-2 md:mt-3">
                            {s.h2bPre}{" "}
                            <span className="relative inline-block font-normal">
                                {s.h2bWord}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left"
                                />
                            </span>
                        </span>
                    </RiseText>
                    <RiseText delay={0.24}>
                        <span className="block text-3xl md:text-5xl lg:text-6xl font-light italic mt-3 md:mt-5 text-[#1d1d1f]/60">
                            {s.h2c}
                        </span>
                    </RiseText>
                </div>

                {/* Bajada compacta */}
                <RiseText delay={0.1}>
                    <p className="text-sm md:text-base text-[#1d1d1f]/70 font-light leading-relaxed max-w-3xl mb-4 md:mb-6">
                        {s.bajadaPre}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{s.bajadaAccent}</span>{" "}
                        {s.bajadaMid}{" "}
                        <span className="text-[#1d1d1f] font-normal">{s.bajadaBold}</span>.
                    </p>
                </RiseText>

                {/* Línea divisoria animada */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-black/10 origin-left mb-0"
                />

                {/* Lista de verticales con hover por letra */}
                <div>
                    {verticals.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 ${i === 0 ? "pt-6 md:pt-8" : "pt-8 md:pt-12"} pb-8 md:pb-12 border-b border-black/10 group cursor-default ${v.dark ? "bg-[#1d1d1f] text-white px-6 md:px-10 -mx-6 md:-mx-10 border-b-transparent" : ""}`}
                        >
                            <div className={`md:col-span-1 text-xs font-mono tracking-[0.2em] ${v.dark ? "text-white/40" : "text-[#1d1d1f]/40"}`}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <h3 className={`md:col-span-4 text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight font-heading leading-none flex items-baseline flex-wrap gap-x-3 ${v.dark ? "text-white" : "text-[#111]"}`}>
                                <span>
                                    <HoverLetters text={v.title} />
                                </span>
                                {v.accent && (
                                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[0.85em] opacity-80">
                                        {v.accent}
                                    </span>
                                )}
                                {v.arrow && (
                                    <span
                                        className={`text-[0.7em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-30 group-hover:opacity-100 group-hover:translate-x-2 ${v.dark ? "text-white" : "text-[#1d1d1f]"}`}
                                    >
                                        →
                                    </span>
                                )}
                            </h3>
                            <p className={`md:col-span-7 text-base md:text-lg font-light leading-relaxed ${v.dark ? "text-white/75" : "text-[#1d1d1f]/70"}`}>
                                {v.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* Letras que flotan hacia arriba con stagger al hacer hover sobre el grupo */
function HoverLetters({ text }: { text: string }) {
    return (
        <span className="inline-block">
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5"
                    style={{
                        transitionDelay: i * 25 + "ms",
                        whiteSpace: char === " " ? "pre" : "normal",
                    }}
                >
                    {char === " " ? " " : char}
                </span>
            ))}
        </span>
    );
}

/* ==========================================================================
   4. APPS HIPERPERSONALIZADAS — Manifiesto + iPhone con sway continuo
   No es un sector como los de la lista — es la firma del estudio.
   ========================================================================== */

export function AppsHiperpersonalizadas() {
    const { t } = useLang();
    const s = t.softwarePage.appsHiperpersonalizadas;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    const rotateAst = useTransform(smooth, [0, 1], [0, 540]);

    // iPhone — entrada con escala + opacidad ligada al scroll
    const phoneScale = useTransform(smooth, [0.1, 0.5], [0.85, 1]);
    const phoneOpacity = useTransform(smooth, [0.05, 0.3, 1], [0, 1, 1]);

    return (
        <section ref={ref} className="bg-[#1a1a1a] text-white relative py-32 md:py-44 px-6 md:px-12 lg:px-24 overflow-clip">

            {/* Grid background blanco sobre dark */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[12%] left-[5%] text-[8rem] md:text-[14rem] text-white/[0.06] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto relative">

                {/* Eyebrow + badge 05 */}
                <div className="flex items-center justify-between mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3"
                    >
                        <span className="block w-12 h-px bg-white/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-sans">
                            {s.eyebrow}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center"
                    >
                        <span className="font-serif italic text-2xl md:text-3xl text-[#1a1a1a]">05</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Texto editorial */}
                    <div className="lg:col-span-7">
                        <div className="uppercase leading-[0.95] tracking-tight text-white">
                            <RiseText delay={0}>
                                <span className="block text-5xl md:text-7xl lg:text-8xl font-light">
                                    {s.h2a}
                                </span>
                            </RiseText>
                            <RiseText delay={0.12}>
                                <span className="block text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 md:mt-3 tracking-tight">
                                    {s.h2accent}
                                    <motion.span
                                        initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                                        whileInView={{ opacity: 1, rotate: 18, scale: 1 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block ml-2 text-2xl md:text-4xl align-top text-white/40 not-italic"
                                    >*</motion.span>
                                </span>
                            </RiseText>
                        </div>

                        <RiseText delay={0.1}>
                            <p className="text-base md:text-lg lg:text-xl text-white/75 font-light leading-relaxed max-w-xl mt-10 md:mt-12">
                                {s.bodyPre1}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal text-white">{s.bodyWord1}</span>{" "}
                                {s.bodyPre2}{" "}
                                <span className="bg-white text-[#1a1a1a] px-2 py-0.5 font-normal">{s.bodyMarca}</span>{s.bodyMid1}{" "}
                                <span className="bg-white text-[#1a1a1a] px-2 py-0.5 font-normal">{s.bodyFlujo}</span>{" "}
                                {s.bodyMid2}{" "}
                                <span className="bg-white text-[#1a1a1a] px-2 py-0.5 font-normal">{s.bodyLogica}</span>
                                {s.bodyPre3}{" "}
                                <span className="font-normal text-white">{s.bodyBold}</span>.{" "}
                                {s.bodyPre4}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic">{s.bodyWord2}</span>{s.bodyEnd}
                            </p>
                        </RiseText>

                        <RiseText delay={0.25}>
                            <div className="flex flex-wrap items-center gap-3 mt-10 md:mt-12">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
                                    {s.chipsLabel}
                                </span>
                                {[s.chip1, s.chip2, s.chip3, s.chip4].map((chip, i) => (
                                    <span
                                        key={chip}
                                        className="text-xs md:text-sm font-mono uppercase tracking-widest border border-white/20 px-3 py-1.5 rounded-full text-white/80"
                                        style={{ transitionDelay: `${i * 50}ms` }}
                                    >
                                        {chip}
                                    </span>
                                ))}
                            </div>
                        </RiseText>
                    </div>

                    {/* iPhone Toogo con tilt 3D cursor-tracked */}
                    <div className="lg:col-span-5 flex justify-center items-center">
                        <motion.div
                            style={{ scale: phoneScale, opacity: phoneOpacity }}
                            className="relative"
                        >
                            <Tilt3DPhone imgAlt={s.imgAlt} />

                            {/* Tag flotante cliente */}
                            <div className="absolute -top-2 -right-4 bg-white text-[#1a1a1a] text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full z-20 pointer-events-none">
                                {s.floatTag}
                            </div>

                            {/* Dot indicador "diseño único" */}
                            <div className="absolute -bottom-2 -left-2 flex items-center gap-2 z-20 pointer-events-none">
                                <motion.span
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="block w-2 h-2 rounded-full bg-emerald-400"
                                />
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono">
                                    {s.floatDot}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* iPhone con tilt 3D cursor-tracked: el teléfono rota en perspective según
   donde está el cursor sobre él. Spring suavizado para que el movimiento se
   sienta orgánico. Fallback: en mobile/touch, oscilación sutil continua. */
function Tilt3DPhone({ imgAlt }: { imgAlt: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const rotX = useMotionValue(0);
    const rotY = useMotionValue(0);
    const springX = useSpring(rotX, { stiffness: 120, damping: 18, mass: 0.5 });
    const springY = useSpring(rotY, { stiffness: 120, damping: 18, mass: 0.5 });

    // Mientras no hay hover, oscilación lenta continua (fallback + ambient)
    useEffect(() => {
        let frame: number;
        let t = 0;
        const tick = () => {
            t += 0.008;
            // Solo aplicar si no hay cursor activo
            if (!ref.current?.matches(":hover")) {
                rotY.set(Math.sin(t) * 14);
                rotX.set(Math.cos(t * 0.7) * 6);
            }
            frame = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(frame);
    }, [rotX, rotY]);

    const handleMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;   // 0..1
        const y = (e.clientY - rect.top) / rect.height;   // 0..1
        // rotateY positivo = mira a la derecha; rotateX positivo = inclina hacia atrás (top va atrás)
        rotY.set((x - 0.5) * 40);    // ±20deg
        rotX.set((0.5 - y) * 30);    // ±15deg
    };

    const handleLeave = () => {
        // El bucle ambient retomará el control automáticamente
    };

    return (
        <div style={{ perspective: "1400px" }} className="inline-block">
            <motion.div
                ref={ref}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{
                    rotateX: springX,
                    rotateY: springY,
                    transformStyle: "preserve-3d",
                }}
                className="relative cursor-grab active:cursor-grabbing"
            >
                {/* Sombra al piso (queda en el plano del piso) */}
                <div
                    className="absolute -bottom-8 left-[10%] right-[10%] h-8 bg-[#1d1d1f]/25 blur-2xl rounded-full"
                    style={{ transform: "translateZ(-60px)" }}
                />
                <img
                    src="/soluciones/iphone-toogo.png"
                    alt={imgAlt}
                    className="relative w-full h-auto max-w-[240px] md:max-w-[280px] drop-shadow-2xl pointer-events-none"
                    draggable={false}
                />
            </motion.div>
        </div>
    );
}

/* ==========================================================================
   5. CASOS DE ÉXITO — Header introductorio antes de los casos
   ========================================================================== */

export function CasosDeExitoIntro() {
    const { t } = useLang();
    const s = t.softwarePage.casosDeExitoIntro;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateAst = useTransform(smooth, [0, 1], [0, 480]);

    return (
        <section ref={ref} className="bg-[#FAFAFA] relative py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-clip">

            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[18%] right-[8%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto relative">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 mb-10 md:mb-14"
                >
                    <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                    <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                        {s.eyebrow}
                    </span>
                </motion.div>

                <div className="uppercase leading-[1] tracking-tight text-[#1d1d1f]">
                    <RiseText delay={0}>
                        <span className="block text-4xl md:text-6xl lg:text-7xl font-light">
                            {s.h2aPre}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">{s.h2aWord}</span>
                        </span>
                    </RiseText>
                    <RiseText delay={0.12}>
                        <span className="block text-4xl md:text-6xl lg:text-7xl font-light mt-2 md:mt-3">
                            {s.h2bPre}{" "}
                            <span className="relative inline-block font-normal">
                                {s.h2bWord}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left"
                                />
                            </span>.
                        </span>
                    </RiseText>
                </div>

                {/* Indicador de scroll: círculo con flecha (estilo hero) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-16 md:mt-24 flex justify-start"
                >
                    <motion.div
                        animate={{ y: ["-15%", "0%", "-15%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1d1d1f] shadow-xl flex items-center justify-center"
                    >
                        <ArrowDown className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

/* ==========================================================================
   5. GOBERNIA SHOWCASE — Mac Studio con efecto pin + parallax + reveal mask
   Distinto al iPad: la pantalla escala desde dentro mientras la sección se
   queda pinneada, con paneles laterales que se separan revelando contexto.
   ========================================================================== */

export function GoberniaShowcase() {
    const { t } = useLang();
    const s = t.softwarePage.goberniaShowcase;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.6 });

    // Imagen entra de la derecha, gira un poco y se asienta al centro
    const x = useTransform(smooth, [0, 0.55], ["30%", "0%"]);
    const rotate = useTransform(smooth, [0, 0.55], [6, 0]);
    const scale = useTransform(smooth, [0, 0.55, 1], [0.9, 1, 1.05]);
    const opacity = useTransform(smooth, [0, 0.2, 0.9, 1], [0, 1, 1, 0.85]);

    // Texto izquierdo: aparece más tarde con leve parallax inverso
    const textY = useTransform(smooth, [0.1, 0.8], ["20%", "-20%"]);
    const textOpacity = useTransform(smooth, [0.15, 0.35, 0.85, 1], [0, 1, 1, 0.4]);

    // Asteriscos giratorios para mantener armonía
    const rotateAst = useTransform(smooth, [0, 1], [0, 540]);

    return (
        <section ref={ref} className="bg-[#FAFAFA] relative overflow-clip" style={{ minHeight: "180vh" }}>

            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[10%] left-[5%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="sticky top-0 h-screen flex flex-col px-6 md:px-12 lg:px-24 py-16 md:py-20">
                <div className="max-w-7xl mx-auto w-full relative">

                    {/* Eyebrow + badge 05 — al inicio con padding */}
                    <div className="flex items-center justify-between mb-12 md:mb-16">
                        <div className="flex items-center gap-3">
                            <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                            <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                                {s.eyebrow}
                            </span>
                        </div>

                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                            <span className="font-serif italic text-2xl md:text-3xl text-white">06</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full relative flex-1 flex items-center">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center w-full">

                        {/* Texto izquierdo con parallax */}
                        <motion.div
                            style={{ y: textY, opacity: textOpacity }}
                            className="md:col-span-5 relative z-10"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-[#1d1d1f] mb-6">
                                {s.h2Pre}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.h2Accent}</span>{" "}
                                {s.h2Mid}{" "}
                                <span className="relative inline-block font-normal">
                                    {s.h2Highlight}
                                    <span className="absolute inset-x-0 bottom-0 md:bottom-1 h-2 md:h-2.5 bg-[#1d1d1f]/12 -z-0" />
                                </span>.
                            </h2>
                            <p className="text-base md:text-lg text-[#1d1d1f]/70 font-light leading-relaxed max-w-md">
                                {s.bodyPre}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{s.bodyAccent}</span>{" "}
                                {s.bodyEnd}
                            </p>
                            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono">
                                <span className="block w-8 h-px bg-[#1d1d1f]/30" />
                                {s.tag}
                            </div>
                        </motion.div>

                        {/* Mac Studio con scroll effect lateral + scale */}
                        <motion.div
                            style={{ x, rotate, scale, opacity }}
                            className="md:col-span-7 relative"
                        >
                            <div className="absolute -inset-x-8 -bottom-8 h-12 bg-[#1d1d1f]/10 blur-3xl rounded-full pointer-events-none" />
                            <img
                                src="/soluciones/gobernia-imac.png"
                                alt={s.imgAlt}
                                className="relative w-full h-auto drop-shadow-2xl"
                                draggable={false}
                            />

                            {/* Etiqueta flotante */}
                            <div className="absolute top-4 right-4 bg-[#1d1d1f] text-white text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                                {s.badge}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ==========================================================================
   IVAN IVANOVICH SHOWCASE — LMS a medida (software). Captura web en marco de
   navegador; entra desde la izquierda (variación respecto a Gobernia).
   ========================================================================== */

export function IvanShowcase() {
    const { t } = useLang();
    const s = t.softwarePage.ivanShowcase;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.6 });

    const x = useTransform(smooth, [0, 0.55], ["-26%", "0%"]);
    const rotate = useTransform(smooth, [0, 0.55], [-5, 0]);
    const scale = useTransform(smooth, [0, 0.55, 1], [0.9, 1, 1.05]);
    const opacity = useTransform(smooth, [0, 0.2, 0.9, 1], [0, 1, 1, 0.85]);

    const textY = useTransform(smooth, [0.1, 0.8], ["20%", "-20%"]);
    const textOpacity = useTransform(smooth, [0.15, 0.35, 0.85, 1], [0, 1, 1, 0.4]);
    const rotateAst = useTransform(smooth, [0, 1], [0, -540]);

    return (
        <section ref={ref} className="bg-[#FAFAFA] relative overflow-clip" style={{ minHeight: "180vh" }}>

            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[12%] right-[5%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="sticky top-0 h-screen flex flex-col px-6 md:px-12 lg:px-24 py-16 md:py-20">
                <div className="max-w-7xl mx-auto w-full relative">
                    <div className="flex items-center justify-between mb-12 md:mb-16">
                        <div className="flex items-center gap-3">
                            <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                            <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                                {s.eyebrow}
                            </span>
                        </div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                            <span className="font-serif italic text-2xl md:text-3xl text-white">07</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full relative flex-1 flex items-center">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center w-full">

                        {/* Captura web en marco de navegador (entra desde la izquierda) */}
                        <motion.div
                            style={{ x, rotate, scale, opacity }}
                            className="md:col-span-7 relative order-2 md:order-1"
                        >
                            <div className="absolute -inset-x-8 -bottom-8 h-12 bg-[#1d1d1f]/10 blur-3xl rounded-full pointer-events-none" />
                            <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#1a1a1a] ring-1 ring-black/10 shadow-2xl" style={{ padding: "0.4rem" }}>
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#222] rounded-t-lg md:rounded-t-xl">
                                    <span className="block w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                    <span className="block w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                                    <span className="block w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                    <div className="flex-1 mx-2 md:mx-4 h-5 rounded bg-white/5 flex items-center px-3">
                                        <span className="text-[10px] md:text-xs text-white/50 font-mono truncate">{s.url}</span>
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-b-lg md:rounded-b-xl">
                                    <img
                                        src="/portafolio/screenshots/ivanivanovich.jpg"
                                        alt={s.imgAlt}
                                        className="block w-full h-auto"
                                        draggable={false}
                                    />
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 bg-[#1d1d1f] text-white text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                                {s.badge}
                            </div>
                        </motion.div>

                        {/* Texto con explicación técnica del LMS */}
                        <motion.div
                            style={{ y: textY, opacity: textOpacity }}
                            className="md:col-span-5 relative z-10 order-1 md:order-2"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-[#1d1d1f] mb-6">
                                {s.h2Pre}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.h2Accent}</span>.
                            </h2>
                            <p className="text-base md:text-lg text-[#1d1d1f]/70 font-light leading-relaxed max-w-md">
                                {s.bodyPre}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{s.bodyAccent}</span>{" "}
                                {s.bodyMid}{" "}
                                <strong className="font-semibold text-[#1d1d1f]">{s.bodyStrong}</strong> {s.bodyEnd}
                            </p>
                            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono">
                                <span className="block w-8 h-px bg-[#1d1d1f]/30" />
                                {s.tag}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ==========================================================================
   5. DIDIS SHOWCASE — iPad con reveal-from-bottom + contador live + parallax
   Distinto a Gobernia: aquí el iPad sube como elevándose mientras un contador
   tickea en tiempo real y un texto a la izquierda hace parallax inverso.
   ========================================================================== */

export function DidisShowcase() {
    const { t } = useLang();
    const s = t.softwarePage.didisShowcase;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.6 });

    // iPad sube desde abajo como saliendo de un slot
    const imageY = useTransform(smooth, [0.1, 0.55], ["120%", "0%"]);
    const imageScale = useTransform(smooth, [0.1, 0.55, 1], [0.9, 1, 1.04]);
    const imageOpacity = useTransform(smooth, [0.1, 0.3, 0.9, 1], [0, 1, 1, 0.85]);

    // Contador live que tickea con el scroll
    const counterMV = useTransform(smooth, [0.2, 0.75], [0, 1247]);
    const [count, setCount] = useState(0);
    useEffect(() => counterMV.on("change", (v) => setCount(Math.round(v))), [counterMV]);

    // Texto en parallax inverso
    const textY = useTransform(smooth, [0.1, 0.9], ["15%", "-25%"]);
    const textOpacity = useTransform(smooth, [0.15, 0.35, 0.85, 1], [0, 1, 1, 0.4]);

    // Asterisco giratorio para armonía
    const rotateAst = useTransform(smooth, [0, 1], [0, -480]);

    return (
        <section ref={ref} className="bg-[#1a1a1a] text-white relative overflow-clip md:min-h-[200vh]">

            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[8%] right-[6%] text-[10rem] md:text-[16rem] text-white/[0.05] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="md:sticky md:top-0 md:h-screen flex flex-col px-6 md:px-12 lg:px-24 pt-8 md:pt-12 pb-24 md:pb-28">
                <div className="max-w-7xl mx-auto w-full relative">

                    {/* Eyebrow + badge 06 — al inicio con padding */}
                    <div className="flex items-center justify-between mb-8 md:mb-10">
                        <div className="flex items-center gap-3">
                            <span className="block w-12 h-px bg-white/40" />
                            <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-sans">
                                {s.eyebrow}
                            </span>
                        </div>

                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center">
                            <span className="font-serif italic text-2xl md:text-3xl text-[#1a1a1a]">08</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full relative flex-1 flex items-start md:items-center">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 items-center w-full">

                        {/* Texto + contador a la izquierda */}
                        <motion.div
                            style={{ y: textY, opacity: textOpacity }}
                            className="md:col-span-5 relative z-10"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-white mb-6">
                                {s.h2Pre}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.h2Accent}</span>{s.h2Mid}{" "}
                                <span className="relative inline-block font-normal">
                                    {s.h2Highlight}
                                    <span className="absolute inset-x-0 bottom-0 md:bottom-1 h-2 md:h-2.5 bg-white/15 -z-0" />
                                </span>{" "}
                                {s.h2End}
                            </h2>
                            <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-md mb-10">
                                {s.bodyPre}{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal text-white">{s.bodyAccent}</span>{" "}
                                {s.bodyEnd}
                            </p>

                            {/* Contador LIVE */}
                            <div className="border-t border-white/10 pt-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <motion.span
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="block w-2 h-2 rounded-full bg-emerald-400"
                                    />
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono">
                                        {s.liveLabel}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl md:text-6xl lg:text-7xl font-light tabular-nums leading-none">
                                        {count.toLocaleString()}
                                    </span>
                                    <span className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono">
                                        {s.counterSuffix}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* iPad — sube desde abajo (mask reveal) */}
                        <div className="md:col-span-7 relative flex justify-center items-center">
                            <div
                                className="relative overflow-hidden flex items-center justify-center"
                                style={{
                                    width: "min(75vw, 380px, 48vh)",
                                    height: "min(100vw, 507px, 64vh)",
                                }}
                            >
                                <motion.div
                                    style={{ y: imageY, scale: imageScale, opacity: imageOpacity }}
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    {/* Sombra al piso */}
                                    <div className="absolute -inset-x-6 -bottom-6 h-10 bg-black/40 blur-3xl rounded-full pointer-events-none" />
                                    <img
                                        src="/soluciones/ipad-didis-3.png"
                                        alt={s.imgAlt}
                                        className="relative max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
                                        draggable={false}
                                    />
                                </motion.div>
                            </div>

                            {/* Etiqueta flotante en la esquina */}
                            <div className="absolute top-4 left-4 bg-white text-[#1a1a1a] text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                                {s.badge}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ==========================================================================
   6. IA COMO ALIADO — Toggle Estándar ↔ Con IA
   El usuario flippea el toggle y ve cambiar el mockup.
   ========================================================================== */

export function IaComoAliado() {
    const { t } = useLang();
    const s = t.softwarePage.iaComoAliado;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateA = useTransform(smooth, [0, 1], [0, 600]);
    const rotateB = useTransform(smooth, [0, 1], [0, -480]);

    const [withAI, setWithAI] = useState(false);

    return (
        <section ref={ref} className="bg-[#FAFAFA] relative py-32 md:py-44 px-6 md:px-12 lg:px-24 overflow-clip">

            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Asteriscos giratorios */}
            <motion.span
                style={{ rotate: rotateA }}
                className="absolute top-[8%] left-[4%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>
            <motion.span
                style={{ rotate: rotateB }}
                className="absolute bottom-[10%] right-[5%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto relative">

                {/* Eyebrow + badge 07 */}
                <div className="flex items-center justify-between mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3"
                    >
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                            {s.eyebrow}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                    >
                        <span className="font-serif italic text-2xl md:text-3xl text-white">09</span>
                    </motion.div>
                </div>

                {/* Título editorial */}
                <div className="mb-10 md:mb-14 uppercase leading-[1] tracking-tight text-[#1d1d1f] max-w-6xl">
                    <RiseText delay={0}>
                        <span className="block text-4xl md:text-7xl lg:text-8xl font-light">
                            {s.h2a}
                        </span>
                    </RiseText>
                    <RiseText delay={0.12}>
                        <span className="block text-5xl md:text-8xl lg:text-9xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-1 md:mt-2">
                            {s.h2accent}
                        </span>
                    </RiseText>
                    <RiseText delay={0.24}>
                        <span className="block text-4xl md:text-7xl lg:text-8xl font-light mt-1 md:mt-2">
                            {s.h2bPre}{" "}
                            <span className="relative inline-block font-normal">
                                {s.h2bWord}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left"
                                />
                            </span>.
                        </span>
                    </RiseText>
                </div>

                {/* Bajada con riqueza */}
                <RiseText delay={0.15}>
                    <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed max-w-3xl mb-4">
                        {s.bajadaPre}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{s.bajadaAccent}</span>{" "}
                        {s.bajadaMid}{" "}
                        <span className="bg-[#1d1d1f] text-white px-2 py-0.5 font-normal">{s.bajadaHighlight}</span>{" "}
                        {s.bajadaEnd}
                    </p>
                </RiseText>
                <RiseText delay={0.3}>
                    <p className="text-sm md:text-base text-[#1d1d1f]/60 font-light italic max-w-3xl mb-12 md:mb-16">
                        {s.toggleHint}
                    </p>
                </RiseText>

                {/* Toggle grande */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-center md:justify-start mb-10"
                >
                    <button
                        onClick={() => setWithAI(!withAI)}
                        className="relative bg-[#1a1a1a] rounded-full p-1.5 flex items-center w-72 md:w-80 cursor-pointer group"
                        aria-label={s.toggleAriaLabel}
                    >
                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            className={`absolute top-1.5 bottom-1.5 ${withAI ? "right-1.5 left-1/2" : "left-1.5 right-1/2"} bg-white rounded-full`}
                        />
                        <div className={`relative z-10 flex-1 text-center py-3 text-sm font-medium transition-colors duration-300 ${!withAI ? "text-[#1a1a1a]" : "text-white/60"}`}>
                            {s.toggleStd}
                        </div>
                        <div className={`relative z-10 flex-1 text-center py-3 text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-1.5 ${withAI ? "text-[#1a1a1a]" : "text-white/60"}`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            {s.toggleAi}
                        </div>
                    </button>
                </motion.div>

                {/* Mockup de plataforma */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative bg-[#1a1a1a] rounded-2xl p-6 md:p-10 text-white overflow-hidden"
                >
                    {/* Top bar */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                        <div className="flex-1 mx-4 h-7 bg-white/5 rounded flex items-center px-3">
                            <span className="text-xs text-white/40 font-mono">
                                {withAI ? s.searchAi : s.searchStd}
                            </span>
                            {withAI && <Sparkles className="w-3 h-3 text-white/60 ml-auto" />}
                        </div>
                    </div>

                    {/* Contenido — cambia según el modo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <MockCard
                            label={s.card1label}
                            value={withAI ? s.card1valAi : s.card1valStd}
                            badge={withAI ? s.card1badge : null}
                            note={withAI ? s.card1noteAi : s.card1noteStd}
                        />
                        <MockCard
                            label={withAI ? s.card2labelAi : s.card2labelStd}
                            value={withAI ? s.card2valAi : s.card2valStd}
                            badge={withAI ? s.card2badge : null}
                            note={withAI ? s.card2noteAi : s.card2noteStd}
                        />
                        <MockCard
                            label={withAI ? s.card3labelAi : s.card3labelStd}
                            value={withAI ? s.card3valAi : s.card3valStd}
                            badge={withAI ? s.card3badge : null}
                            note={withAI ? s.card3noteAi : s.card3noteStd}
                        />
                    </div>

                    <div className="mt-6 md:mt-8 bg-white/[0.03] border border-white/5 rounded-lg p-4 md:p-5">
                        <div className="flex items-start gap-3">
                            {withAI && (
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-mono">
                                    {withAI ? s.panelLabelAi : s.panelLabelStd}
                                </p>
                                <p className="text-sm md:text-base font-light leading-relaxed">
                                    {withAI ? s.panelBodyAi : s.panelBodyStd}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Etiqueta de modo */}
                    <div className="absolute top-6 right-6 text-xs font-mono uppercase tracking-widest text-white/30">
                        {withAI ? s.modeAi : s.modeStd}
                    </div>
                </motion.div>

                {/* Línea divisoria animada */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-black/10 origin-left mt-12 md:mt-16 mb-8 md:mb-10"
                />

                <RiseText delay={0}>
                    <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f] font-light leading-relaxed max-w-3xl">
                        {s.closingPre}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.closingAccent}</span>{s.closingMid}{" "}
                        <span className="bg-[#1d1d1f] text-white px-2 py-0.5 font-normal">{s.closingHighlight}</span>.
                    </p>
                </RiseText>
            </div>
        </section>
    );
}

function MockCard({ label, value, badge, note }: { label: string; value: string; badge: string | null; note: string }) {
    return (
        <motion.div
            layout
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/[0.03] border border-white/5 rounded-lg p-5"
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-white/40 font-mono">{label}</p>
                {badge && (
                    <span className="text-[10px] font-mono uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-2xl md:text-3xl font-normal font-heading mb-1">{value}</p>
            <p className="text-xs text-white/40 font-light">{note}</p>
        </motion.div>
    );
}

/* ==========================================================================
   6. CIERRE — Marquee gigante + botón magnético
   ========================================================================== */

export function Cierre() {
    const { t } = useLang();
    const s = t.softwarePage.cierre;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateAst = useTransform(smooth, [0, 1], [0, 720]);

    // Marquee row 1 — derecha a izquierda, normal
    // Marquee row 2 — izquierda a derecha, italic Playfair más pequeño (contra-marquee)

    return (
        <section ref={ref} className="bg-[#F5F5F7] relative py-32 md:py-44 overflow-clip">

            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[12%] right-[8%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative">

                {/* Eyebrow + badge 08 */}
                <div className="flex items-center justify-between mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3"
                    >
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                            {s.eyebrow}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                    >
                        <span className="font-serif italic text-2xl md:text-3xl text-white">10</span>
                    </motion.div>
                </div>
            </div>

            {/* Marquee dual - 2 líneas pegadas con direcciones opuestas */}
            <div className="overflow-hidden mb-12 md:mb-16 select-none">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col"
                >
                    {/* Fila 1 — derecha a izquierda, font-light grande */}
                    <div className="overflow-hidden py-2">
                        <motion.div
                            className="flex gap-8 md:gap-12 whitespace-nowrap leading-[1] w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                        >
                            {Array.from({ length: 14 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="text-[16vw] md:text-[12vw] font-light uppercase tracking-tighter font-heading text-[#1d1d1f] inline-flex items-center"
                                >
                                    {s.marquee1}
                                    <span className="inline-block ml-3 text-[0.5em] rotate-12 text-[#1d1d1f]/40">*</span>
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Fila 2 — izquierda a derecha, Playfair italic, ligeramente más chica */}
                    <div className="overflow-hidden py-3">
                        <motion.div
                            className="flex gap-10 md:gap-16 whitespace-nowrap leading-[1.1] w-max"
                            animate={{ x: ["-50%", "0%"] }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        >
                            {Array.from({ length: 14 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="text-[14vw] md:text-[10vw] font-[family-name:var(--font-playfair)] italic font-normal tracking-tight text-[#1d1d1f]/70 inline-block pr-2"
                                >
                                    {s.marquee2}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* CTA + email + descripción */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                <div className="md:col-span-6">
                    <RiseText delay={0}>
                        <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f] font-light leading-relaxed max-w-xl">
                            {s.pPre}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.pAccent}</span>
                            {s.pMid}{" "}
                            <span className="bg-[#1d1d1f] text-white px-2 py-0.5 font-normal">{s.pHighlight}</span>.
                        </p>
                    </RiseText>
                    <RiseText delay={0.15}>
                        <p className="text-sm md:text-base text-[#1d1d1f]/60 font-light italic max-w-xl mt-4">
                            {s.pSub}
                        </p>
                    </RiseText>
                </div>

                <div className="md:col-span-6 flex flex-col md:items-end gap-6">
                    <MagneticButton />
                    <motion.a
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        href="mailto:info@ketingmedia.com"
                        className="group inline-flex items-center gap-2 text-base text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors duration-300 font-light"
                    >
                        info@ketingmedia.com
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </motion.a>
                </div>
            </div>
        </section>
    );
}

function MagneticButton() {
    const { t } = useLang();
    const ref = useRef<HTMLButtonElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isContactOpen, setIsContactOpen] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.3;
        const dy = (e.clientY - cy) * 0.3;
        setPos({ x: dx, y: dy });
    };

    const handleMouseLeave = () => setPos({ x: 0, y: 0 });

    return (
        <>
            <motion.button
                ref={ref}
                onClick={() => setIsContactOpen(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ x: pos.x, y: pos.y }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-10 py-6 rounded-full text-lg md:text-xl font-medium hover:bg-black transition-colors duration-300"
            >
                {t.softwarePage.cierre.cta}
                <Plus className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
            </motion.button>
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}

/* ==========================================================================
   INTEGRACIÓN DE SISTEMAS Y APIs — bloque de servicio visible (SEO/AEO)
   Captura la keyword "integración de sistemas" con su propio encabezado.
   ========================================================================== */

export function IntegracionSistemas() {
    const { t } = useLang();
    const s = t.softwarePage.integracionSistemas;
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const href = enHref("/automatizacion-de-procesos", isEn);

    return (
        <section className="relative bg-[#FAFAFA] py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />
            <div className="max-w-4xl mx-auto relative">
                <div className="flex items-center gap-3 mb-6">
                    <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                        {s.eyebrow}
                    </span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5 text-[#1d1d1f]">
                    {s.h2a}{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.h2accent}</span>
                </h3>
                <p className="text-base md:text-lg text-[#1d1d1f]/60 font-light max-w-2xl leading-relaxed">
                    {s.bodyPre}{" "}
                    <a href={href} className="font-medium text-[#1d1d1f] underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity">
                        {s.bodyLink}
                    </a>
                    {s.bodyEnd}
                </p>
            </div>
        </section>
    );
}
