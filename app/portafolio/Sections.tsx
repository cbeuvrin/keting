"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { ContactModal } from "@/components/pricing/contact-modal";

/* ==========================================================================
   Utilidades editoriales
   ========================================================================== */

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

function GridBg({ light = false }: { light?: boolean }) {
    return (
        <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
                backgroundImage: light
                    ? "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)"
                    : "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
            }}
        />
    );
}

function SpinAsterisk({ progress, top, left, right, bottom, size = "[10rem] md:text-[16rem]", reverse = false, light = false }: any) {
    const rot = useTransform(progress, [0, 1], reverse ? [0, -600] : [0, 600]);
    return (
        <motion.span
            style={{ rotate: rot, top, left, right, bottom }}
            className={`absolute text-${size} ${light ? "text-white/[0.06]" : "text-[#1d1d1f]/[0.07]"} select-none font-light leading-none inline-block origin-center pointer-events-none`}
        >
            *
        </motion.span>
    );
}

/* ==========================================================================
   1. HERO
   ========================================================================== */

export function PortafolioHero() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateA = useTransform(smooth, [0, 1], [0, 540]);
    const rotateB = useTransform(smooth, [0, 1], [0, -720]);

    return (
        <section ref={ref} className="bg-[#FAFAFA] relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 lg:px-24 overflow-clip">
            <GridBg />

            <motion.span style={{ rotate: rotateA }} className="absolute top-[12%] left-[4%] text-[10rem] md:text-[18rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none">*</motion.span>
            <motion.span style={{ rotate: rotateB }} className="absolute bottom-[10%] right-[5%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none">*</motion.span>

            <div className="max-w-7xl mx-auto relative">

                {/* Eyebrow + badge 01 */}
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
                            Portafolio
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                    >
                        <span className="font-serif italic text-2xl md:text-3xl text-white">01</span>
                    </motion.div>
                </div>

                {/* Título editorial */}
                <div className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] max-w-6xl">
                    <RiseText delay={0}>
                        <span className="block text-5xl md:text-8xl lg:text-9xl font-light">
                            Marcas
                        </span>
                    </RiseText>
                    <RiseText delay={0.12}>
                        <span className="block text-5xl md:text-8xl lg:text-9xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 md:mt-3 tracking-tight">
                            premium,
                        </span>
                    </RiseText>
                    <RiseText delay={0.24}>
                        <span className="block text-4xl md:text-7xl lg:text-8xl font-light mt-2 md:mt-3">
                            una sola{" "}
                            <span className="relative inline-block font-normal">
                                firma
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left"
                                />
                            </span>
                            <motion.span
                                initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                                whileInView={{ opacity: 1, rotate: 18, scale: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-block ml-2 text-3xl md:text-5xl align-top text-[#1d1d1f]/40"
                            >*</motion.span>
                            <span>.</span>
                        </span>
                    </RiseText>
                </div>

                <RiseText delay={0.15}>
                    <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed max-w-2xl mt-10 md:mt-12">
                        Diseño y desarrollo web a medida para{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">marcas premium</span>{" "}
                        que necesitaban algo más que una plantilla. Cada proyecto fue concebido desde cero — visualmente, técnicamente y estratégicamente.
                    </p>
                </RiseText>

                {/* Stats finales */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-[#1d1d1f]/25 origin-left mt-14 md:mt-20 max-w-2xl"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-2 gap-6 md:gap-10 max-w-2xl pt-8"
                >
                    <div>
                        <div className="text-3xl md:text-5xl font-light text-[#1d1d1f] mb-1 leading-none">100%</div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-[#1d1d1f]/50 font-mono">A medida</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-5xl font-light text-[#1d1d1f] mb-1 leading-none">∞</div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-[#1d1d1f]/50 font-mono">Industrias</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* ==========================================================================
   2. INTRO — Logos en grid antes de los casos
   ========================================================================== */

const projectsLogos = [
    { name: "Iudex", short: "Legal · IA" },
    { name: "Smile Better", short: "Salud dental" },
    { name: "Gobernia", short: "Governance · IA" },
    { name: "Happtek", short: "Audio premium" },
    { name: "Barmored Security", short: "Blindaje automotriz" },
    { name: "Toogo", short: "SaaS E-commerce" },
    { name: "Rosymar González", short: "Joyería" },
    { name: "Ivan Ivanovich", short: "Protección ejecutiva" },
];

export function PortafolioIntro() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateAst = useTransform(smooth, [0, 1], [0, 480]);

    return (
        <section ref={ref} className="bg-[#F5F5F7] relative py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-clip">
            <GridBg />
            <motion.span style={{ rotate: rotateAst }} className="absolute top-[18%] right-[8%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none">*</motion.span>

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
                        Las marcas
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-end mb-16 md:mb-20">
                    <div className="md:col-span-7 uppercase leading-[1] tracking-tight text-[#1d1d1f]">
                        <RiseText delay={0}>
                            <span className="block text-4xl md:text-6xl lg:text-7xl font-light">
                                Las marcas que{" "}
                                <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">confiaron</span>.
                            </span>
                        </RiseText>
                    </div>
                </div>

                {/* Grid 3×2 con los nombres y eyebrows */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#1d1d1f]/10">
                    {projectsLogos.map((p, i) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="border-b border-[#1d1d1f]/10 md:border-r last:border-r-0 [&:nth-child(3n)]:md:border-r-0 py-8 md:py-10 px-2 md:px-6 group cursor-default"
                        >
                            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#1d1d1f]/40 mb-3">
                                {String(i + 1).padStart(2, "0")} / {p.short}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-normal tracking-tight font-heading text-[#111] leading-none group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                {p.name}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ==========================================================================
   Componente CaseCard reusable — un caso por proyecto
   ========================================================================== */

type CaseProps = {
    badge: string;
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    titleBottom?: string;
    body: React.ReactNode;
    tags: string[];
    palette: string[];        // colores HEX
    font: string;             // tipografía principal
    fontStyle?: "serif" | "sans" | "display";  // para renderizado del nombre
    metric?: { value: string; label: string };
    url: string;
    image: string;
    imageAlt: string;
    dark?: boolean;
    effect?: "tilt" | "slide" | "rise" | "float";
};

function CaseCard({
    badge, eyebrow, titleTop, titleAccent, titleBottom, body, tags, palette, font, fontStyle = "sans", metric, url, image, imageAlt, dark = false, effect = "slide",
}: CaseProps) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateAst = useTransform(smooth, [0, 1], [0, 540]);

    // Efectos scroll-driven distintos por proyecto
    const tiltY = useTransform(smooth, [0, 0.6], [-25, 0]);
    const tiltX = useTransform(smooth, [0, 0.6], [10, 0]);
    const slideX = useTransform(smooth, [0, 0.55], ["18%", "0%"]);
    const slideRot = useTransform(smooth, [0, 0.55], [5, 0]);
    const riseY = useTransform(smooth, [0.1, 0.55], ["50%", "0%"]);
    const opacity = useTransform(smooth, [0.05, 0.3, 0.9, 1], [0, 1, 1, 0.9]);
    const scale = useTransform(smooth, [0, 0.6], [0.92, 1]);

    let imageMotion: any = {};
    let perspective = false;
    if (effect === "tilt") {
        imageMotion = { rotateY: tiltY, rotateX: tiltX, scale, opacity };
        perspective = true;
    } else if (effect === "slide") {
        imageMotion = { x: slideX, rotate: slideRot, scale, opacity };
    } else if (effect === "rise") {
        imageMotion = { y: riseY, scale, opacity };
    } else if (effect === "float") {
        imageMotion = { scale, opacity };
    }

    const accentColor = dark ? "text-white" : "text-[#1d1d1f]";
    const bgColor = dark ? "bg-[#1a1a1a]" : "bg-[#FAFAFA]";
    const altBgColor = dark ? "bg-[#F5F5F7]" : "bg-[#F5F5F7]";

    return (
        <section
            ref={ref}
            className={`${bgColor} ${dark ? "text-white" : "text-[#1d1d1f]"} relative py-32 md:py-44 px-6 md:px-12 lg:px-24 overflow-clip`}
        >
            <GridBg light={dark} />
            <motion.span style={{ rotate: rotateAst }} className={`absolute top-[10%] ${effect === "slide" ? "right-[6%]" : "left-[5%]"} text-[8rem] md:text-[14rem] ${dark ? "text-white/[0.06]" : "text-[#1d1d1f]/[0.07]"} select-none font-light leading-none inline-block origin-center pointer-events-none`}>*</motion.span>

            <div className="max-w-7xl mx-auto relative">

                {/* Eyebrow + badge */}
                <div className="flex items-center justify-between mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3"
                    >
                        <span className={`block w-12 h-px ${dark ? "bg-white/40" : "bg-[#1d1d1f]/40"}`} />
                        <span className={`text-xs uppercase tracking-[0.3em] ${dark ? "text-white/60" : "text-[#1d1d1f]/60"} font-sans`}>
                            {eyebrow}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${dark ? "bg-white" : "bg-[#1d1d1f]"} flex items-center justify-center`}
                    >
                        <span className={`font-serif italic text-2xl md:text-3xl ${dark ? "text-[#1a1a1a]" : "text-white"}`}>{badge}</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Texto */}
                    <div className={`lg:col-span-5 ${effect === "slide" ? "order-1" : ""}`}>
                        <div className={`uppercase leading-[1] tracking-tight ${accentColor}`}>
                            <RiseText delay={0}>
                                <span className="block text-3xl md:text-5xl lg:text-6xl font-light">{titleTop}</span>
                            </RiseText>
                            <RiseText delay={0.12}>
                                <span className="block text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 tracking-tight">
                                    {titleAccent}
                                </span>
                            </RiseText>
                            {titleBottom && (
                                <RiseText delay={0.24}>
                                    <span className="block text-3xl md:text-5xl lg:text-6xl font-light mt-2">{titleBottom}</span>
                                </RiseText>
                            )}
                        </div>

                        <RiseText delay={0.1}>
                            <p className={`text-base md:text-lg ${dark ? "text-white/75" : "text-[#1d1d1f]/75"} font-light leading-relaxed max-w-md mt-8 md:mt-10`}>
                                {body}
                            </p>
                        </RiseText>

                        {/* Tags */}
                        <RiseText delay={0.25}>
                            <div className="flex flex-wrap gap-2 mt-8">
                                {tags.map((t) => (
                                    <span
                                        key={t}
                                        className={`text-xs font-mono uppercase tracking-widest border ${dark ? "border-white/20 text-white/80" : "border-[#1d1d1f]/20 text-[#1d1d1f]/80"} px-3 py-1.5 rounded-full`}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </RiseText>

                        {/* Spec sheet: Paleta + Tipografía */}
                        <RiseText delay={0.3}>
                            <div className={`grid grid-cols-2 gap-6 mt-8 pt-6 border-t ${dark ? "border-white/15" : "border-[#1d1d1f]/15"}`}>
                                <div>
                                    <div className={`text-[10px] uppercase tracking-[0.3em] ${dark ? "text-white/40" : "text-[#1d1d1f]/40"} font-mono mb-3`}>
                                        Paleta
                                    </div>
                                    <div className="flex gap-2">
                                        {palette.map((c, i) => (
                                            <div
                                                key={c + i}
                                                className={`w-8 h-8 rounded-full ring-1 ${dark ? "ring-white/15" : "ring-[#1d1d1f]/10"}`}
                                                style={{ backgroundColor: c }}
                                                title={c.toUpperCase()}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className={`text-[10px] uppercase tracking-[0.3em] ${dark ? "text-white/40" : "text-[#1d1d1f]/40"} font-mono mb-3`}>
                                        Tipografía
                                    </div>
                                    <div
                                        className={`text-base md:text-lg ${dark ? "text-white" : "text-[#1d1d1f]"} ${fontStyle === "serif" ? "font-[family-name:var(--font-playfair)] italic" : fontStyle === "display" ? "font-heading font-medium" : "font-medium"} leading-none`}
                                    >
                                        {font}
                                    </div>
                                </div>
                            </div>
                        </RiseText>

                        {/* Métrica + CTA */}
                        <RiseText delay={0.35}>
                            <div className={`mt-10 pt-6 border-t ${dark ? "border-white/15" : "border-[#1d1d1f]/15"} flex items-end justify-between gap-6`}>
                                {metric && (
                                    <div>
                                        <div className={`text-3xl md:text-4xl font-light leading-none mb-1 ${accentColor}`}>
                                            {metric.value}
                                        </div>
                                        <div className={`text-[10px] uppercase tracking-[0.25em] ${dark ? "text-white/40" : "text-[#1d1d1f]/40"} font-mono`}>
                                            {metric.label}
                                        </div>
                                    </div>
                                )}
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group inline-flex items-center gap-2 text-sm font-medium ${dark ? "text-white hover:text-white/70" : "text-[#1d1d1f] hover:text-[#1d1d1f]/70"} transition-colors`}
                                >
                                    Ver en vivo
                                    <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </div>
                        </RiseText>
                    </div>

                    {/* Imagen — marco tipo browser + KETING signature debajo */}
                    <div className={`lg:col-span-7 ${effect === "slide" ? "order-2" : ""}`} style={perspective ? { perspective: "1400px" } : {}}>
                        <motion.div
                            style={{ ...imageMotion, transformStyle: perspective ? "preserve-3d" : undefined }}
                            className="relative"
                        >
                            {/* Sombra al piso */}
                            <div className={`absolute -inset-x-8 -bottom-8 h-12 ${dark ? "bg-black/50" : "bg-[#1d1d1f]/20"} blur-3xl rounded-full pointer-events-none`} />

                            {/* Marco tipo monitor / browser */}
                            <div
                                className={`relative rounded-xl md:rounded-2xl overflow-hidden ${dark ? "bg-[#0a0a0a] ring-1 ring-white/10" : "bg-[#1a1a1a] ring-1 ring-black/20"} shadow-2xl`}
                                style={{ padding: "0.4rem" }}
                            >
                                {/* Top bar tipo browser */}
                                <div className={`flex items-center gap-3 px-3 py-2 ${dark ? "bg-[#1a1a1a]" : "bg-[#222]"} rounded-t-lg md:rounded-t-xl`}>
                                    {/* Traffic lights */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="block w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                        <span className="block w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                                        <span className="block w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                    </div>
                                    {/* URL bar */}
                                    <div className="flex-1 mx-2 md:mx-4 h-6 rounded bg-white/5 flex items-center px-3">
                                        <span className="text-[10px] md:text-xs text-white/50 font-mono truncate">
                                            {url.replace(/^https?:\/\//, "")}
                                        </span>
                                    </div>
                                    {/* LIVE indicator */}
                                    <div className="flex items-center gap-1.5">
                                        <motion.span
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="block w-1.5 h-1.5 rounded-full bg-emerald-400"
                                        />
                                        <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-white/50">
                                            Live
                                        </span>
                                    </div>
                                </div>

                                {/* Screen content */}
                                <div className="relative overflow-hidden rounded-b-lg md:rounded-b-xl">
                                    <img
                                        src={image}
                                        alt={imageAlt}
                                        className="block w-full h-auto"
                                        draggable={false}
                                    />
                                </div>
                            </div>

                            {/* Firma KETING debajo del marco */}
                            <div className="mt-5 md:mt-6 flex items-center justify-center gap-3">
                                <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-mono ${dark ? "text-white/40" : "text-[#1d1d1f]/40"}`}>
                                    Designed by
                                </span>
                                <img
                                    src={dark ? "/keting-logo-white.png" : "/keting-logo-black.png"}
                                    alt="Keting Media"
                                    className="h-4 md:h-5 w-auto object-contain opacity-60"
                                    draggable={false}
                                />
                                <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-mono ${dark ? "text-white/40" : "text-[#1d1d1f]/40"}`}>
                                    Media
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ==========================================================================
   Los 6 cases
   ========================================================================== */

export function CaseIvanIvanovich() {
    return (
        <CaseCard
            badge="09"
            eyebrow="Caso · Protección Ejecutiva"
            titleTop="Ivan"
            titleAccent="Ivanovich"
            titleBottom="Academy."
            body={<>Plataforma para la academia de protección ejecutiva más reconocida de México. <span className="font-[family-name:var(--font-playfair)] italic font-normal">Cursos en vivo</span>, eventos, blog y un sistema de afiliados — todo bajo una identidad de autoridad y precisión.</>}
            tags={["WordPress · Custom", "Multi-idioma", "E-Commerce", "Eventos"]}
            palette={["#0A0A0A", "#C8102E", "#C5A572", "#F5F5F0"]}
            font="Montserrat"
            fontStyle="display"
            metric={{ value: "↑ 4x", label: "Tráfico anual" }}
            url="https://ivanivanovich.com/"
            image="/portafolio/screenshots/ivanivanovich.png"
            imageAlt="Ivan Ivanovich · Academia de Protección Ejecutiva"
            effect="tilt"
        />
    );
}

export function CaseIudex() {
    return (
        <CaseCard
            badge="02"
            eyebrow="Caso · Legal AI"
            titleTop="Iudex"
            titleAccent="rest assured."
            body={<>Plataforma para la primera IA jurídica de México con criterio jurídico real. Diseño <span className="font-[family-name:var(--font-playfair)] italic font-normal">brutalista premium</span> en blanco y negro — autoridad legal en cada pixel.</>}
            tags={["Next.js", "IA Integration", "Dark mode", "Editorial"]}
            palette={["#000000", "#FFFFFF", "#1A1A1A", "#9CA3AF"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "100k+", label: "Sesiones mes" }}
            url="https://www.iudex.mx/"
            image="/portafolio/screenshots/iudex.png"
            imageAlt="Iudex · Legal AI"
            dark
            effect="slide"
        />
    );
}

export function CaseGobernia() {
    return (
        <CaseCard
            badge="04"
            eyebrow="Caso · Governance AI"
            titleTop="Gobernia."
            titleAccent="4 agentes."
            titleBottom="1 consejo."
            body={<>Plataforma SaaS de consejeros corporativos potenciados por IA: <span className="font-[family-name:var(--font-playfair)] italic font-normal">CFO, CSO, CRO y Auditor</span> sesionan cada mes y entregan decisiones accionables — sin contratar consultores.</>}
            tags={["Next.js", "IA Agents", "SaaS", "Dashboard"]}
            palette={["#1B2540", "#FFFFFF", "#3B82F6", "#F5F5F7"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "↑ 8x", label: "Conversión" }}
            url="https://gobernia-liard.vercel.app/"
            image="/portafolio/screenshots/gobernia.png"
            imageAlt="Gobernia · 4 agentes IA"
            effect="rise"
        />
    );
}

export function CaseSmileBetter() {
    return (
        <CaseCard
            badge="03"
            eyebrow="Caso · Salud dental"
            titleTop="Smile"
            titleAccent="Better"
            titleBottom="Clinics."
            body={<>Clínica dental holística con enfoque integral. Diseñamos un sitio que comunica <span className="font-[family-name:var(--font-playfair)] italic font-normal">cercanía y tecnología</span> a partes iguales — agendar cita está a un solo tap.</>}
            tags={["Headless CMS", "Booking", "Multi-clinic", "SEO local"]}
            palette={["#0A0A0A", "#FFFFFF", "#22C55E", "#A78BFA"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "↑ 3x", label: "Citas mensuales" }}
            url="https://smilebetterclinics.com/"
            image="/portafolio/screenshots/smilebetter.png"
            imageAlt="Smile Better · Clínica dental"
            dark
            effect="tilt"
        />
    );
}

export function CaseBarmored() {
    return (
        <CaseCard
            badge="06"
            eyebrow="Caso · Blindaje automotriz"
            titleTop="Barmored"
            titleAccent="Security."
            titleBottom="Blindaje perfecto."
            body={<>Sitio para una firma líder en <span className="font-[family-name:var(--font-playfair)] italic font-normal">blindaje automotriz</span> de alto perfil. Estética cinematográfica con video hero, certificaciones internacionales visibles y un flujo de cotización directo — porque cuando se trata de seguridad, no hay tiempo para fricciones.</>}
            tags={["WordPress · Custom", "Video hero", "Cotización", "B2B"]}
            palette={["#0A0A0A", "#C8102E", "#A0A0A0", "#FFFFFF"]}
            font="Montserrat"
            fontStyle="display"
            metric={{ value: "↑ 7x", label: "Cotizaciones" }}
            url="https://www.barmoredsecurity.com/"
            image="/portafolio/screenshots/barmored.png"
            imageAlt="Barmored Security · Blindaje automotriz"
            dark
            effect="tilt"
        />
    );
}

export function CaseToogo() {
    return (
        <CaseCard
            badge="07"
            eyebrow="Caso · SaaS E-commerce"
            titleTop="Toogo."
            titleAccent="Tu tienda,"
            titleBottom="lista en minutos."
            body={<>Plataforma <span className="font-[family-name:var(--font-playfair)] italic font-normal">SaaS multi-tenant</span> para que cualquier vendedor lance su tienda en línea en minutos — sin programador, sin diseñador. Onboarding asistido por IA, dashboard del comerciante, billing por suscripción y arquitectura aislada por inquilino.</>}
            tags={["Next.js · Multi-tenant", "Stripe Billing", "AI Onboarding", "SaaS"]}
            palette={["#8B5CF6", "#FFFFFF", "#1F2937", "#F3F4F6"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "100+", label: "Tiendas activas" }}
            url="https://www.toogo.store/"
            image="/portafolio/screenshots/toogo.png"
            imageAlt="Toogo · SaaS E-commerce multi-tenant"
            effect="rise"
        />
    );
}

export function CaseRosymar() {
    return (
        <CaseCard
            badge="08"
            eyebrow="Caso · Joyería"
            titleTop="Rosymar"
            titleAccent="González."
            body={<>E-commerce de joyería con baño en <span className="font-[family-name:var(--font-playfair)] italic font-normal">oro 18k y 24k</span>. Catálogo curado, manifiesto de marca y experiencia de compra cuidada al detalle — para que cada pieza llegue como debe llegar.</>}
            tags={["WordPress · WooCommerce", "Custom theme", "Manifiesto", "Tienda"]}
            palette={["#1A1A1A", "#D4AF37", "#F5F0E8", "#FFFFFF"]}
            font="Cormorant Garamond"
            fontStyle="serif"
            metric={{ value: "↑ 5x", label: "Ventas online" }}
            url="https://rosymargonzalez.com/"
            image="/portafolio/screenshots/rosymargonzalez.png"
            imageAlt="Rosymar González · Joyería"
            effect="float"
        />
    );
}

export function CaseHapptek() {
    return (
        <CaseCard
            badge="05"
            eyebrow="Caso · Audio premium"
            titleTop="Happtek."
            titleAccent="La voz de la elegancia."
            body={<>Showroom de equipos de audio de gama alta. Tipografía editorial, fotografía cinematográfica y una experiencia que se siente como un <span className="font-[family-name:var(--font-playfair)] italic font-normal">disco de vinilo</span> en silenciador analógico.</>}
            tags={["Next.js", "WebGL", "Hi-end", "Multi-idioma"]}
            palette={["#1A1410", "#CD9851", "#E8D5A8", "#0A0805"]}
            font="Playfair Display"
            fontStyle="serif"
            metric={{ value: "↑ 6x", label: "Tiempo en sitio" }}
            url="https://audio-five-blue.vercel.app/"
            image="/portafolio/screenshots/audiofive.png"
            imageAlt="Happtek · Audio premium"
            dark
            effect="slide"
        />
    );
}

/* ==========================================================================
   CIERRE
   ========================================================================== */

export function PortafolioCierre() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    return (
        <section className="bg-[#F5F5F7] relative py-32 md:py-44 overflow-clip">

            {/* Marquee gigante */}
            <div className="overflow-hidden mb-12 md:mb-16 select-none py-6 md:py-8">
                <motion.div
                    className="flex gap-8 md:gap-12 whitespace-nowrap leading-[1.15] w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                >
                    {Array.from({ length: 14 }).map((_, i) => (
                        <span
                            key={i}
                            className="text-[16vw] md:text-[12vw] font-light uppercase tracking-tighter font-heading text-[#1d1d1f] inline-flex items-center pb-1"
                        >
                            ¿Listo para ser el siguiente?
                            <span className="inline-block ml-3 text-[0.5em] rotate-12 text-[#1d1d1f]/40">*</span>
                        </span>
                    ))}
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                <div className="md:col-span-6">
                    <RiseText delay={0}>
                        <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f] font-light leading-relaxed max-w-xl">
                            <motion.span
                                initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                                whileInView={{ opacity: 1, rotate: 18, scale: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-block mr-2 text-2xl md:text-3xl align-top text-[#1d1d1f]/40 leading-none"
                            >
                                *
                            </motion.span>
                            Si tu marca necesita una web que esté{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">a la altura</span> —{" "}
                            <span className="bg-[#1d1d1f] text-white px-2 py-0.5 font-normal">hablemos</span>.
                            Un café de 30 minutos es suficiente para entender si encajamos. Sin compromiso.
                        </p>
                    </RiseText>
                </div>

                <div className="md:col-span-6 flex flex-col md:items-end gap-6">
                    <motion.button
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => setIsContactOpen(true)}
                        className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-10 py-6 rounded-full text-lg md:text-xl font-medium hover:bg-black transition-colors duration-300"
                    >
                        Hablemos
                        <Plus className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
                    </motion.button>
                    <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
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


/* ==========================================================================
   HERO V2 — Dark, massive type (importado de la versión visual)
   ========================================================================== */

export function PortafolioHeroV2() {
    return (
        <section className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col justify-center pt-32 pb-16 px-6 md:px-12 lg:px-24">

            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Asterisco floating decorativo */}
            <motion.div
                initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 18, scale: 1 }}
                transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-32 right-6 md:right-12 lg:right-24 text-white/15 font-light leading-none"
                style={{ fontSize: "clamp(8rem, 18vw, 22rem)" }}
            >
                *
            </motion.div>

            <div className="max-w-7xl mx-auto w-full relative z-10">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 mb-8 md:mb-12"
                >
                    <span className="block w-12 h-px bg-white/40" />
                    <span className="text-xs uppercase tracking-[0.4em] text-white/60 font-mono">
                        Selected work · 2020 — 2026
                    </span>
                </motion.div>

                {/* Título masivo */}
                <div className="overflow-hidden mb-3 md:mb-4">
                    <motion.h1
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="font-heading font-medium uppercase leading-[0.85] tracking-tighter text-white"
                        style={{ fontSize: "clamp(4rem, 14vw, 14rem)" }}
                    >
                        WORK
                    </motion.h1>
                </div>
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 1.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="leading-[0.85] tracking-tighter text-white/60"
                        style={{ fontSize: "clamp(4rem, 14vw, 14rem)" }}
                    >
                        <span className="font-[family-name:var(--font-playfair)] italic">that</span>{" "}
                        <span className="font-heading font-medium uppercase">scales.</span>
                    </motion.h1>
                </div>

                {/* Bajada */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 md:mt-16"
                >
                    <p className="md:col-span-6 md:col-start-7 text-base md:text-lg text-white/70 font-light leading-relaxed max-w-lg">
                        Marcas premium. Industrias distintas. Una misma firma. Cada proyecto se construyó desde cero — diseño, código y estrategia bajo un mismo techo.
                    </p>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-end justify-between text-white/40 text-[10px] uppercase tracking-[0.3em] font-mono"
                >
                    <span>↓ Scroll</span>
                    <span>Keting Media · Vibe Coders</span>
                </motion.div>
            </div>
        </section>
    );
}
