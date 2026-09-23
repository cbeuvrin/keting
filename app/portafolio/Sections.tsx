"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { ContactModal } from "@/components/pricing/contact-modal";
import { useLang } from "@/lib/i18n/lang-context";
import { PortfolioProject as CaseCard } from "./ProjectAccordion";
import { getCaseStudy } from "@/lib/case-studies";

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

/* Proyectos — contenido compartido por las filas del portafolio. */

export function CaseIvanIvanovich() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.ivan;
    return (
        <CaseCard
            projectName="Ivan Ivanovich Academy"
            caseSlug="ivan-ivanovich-academy"
            eyebrow={c.eyebrow}
            titleTop="Ivan"
            titleAccent="Ivanovich"
            titleBottom="Academy."
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#0A0A0A", "#C8102E", "#C5A572", "#F5F5F0"]}
            font="Montserrat"
            fontStyle="display"
            metric={{ value: "↑ 4x", label: c.metricLabel }}
            url="https://ivanivanovich.com/"
            image="/portafolio/screenshots/ivanivanovich-lms.webp"
            imageSize={{ width: 1920, height: 984 }}
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseIudex() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.iudex;
    return (
        <CaseCard
            projectName="Iudex"
            caseSlug="iudex"
            eyebrow={c.eyebrow}
            titleTop="Iudex"
            titleAccent="rest assured."
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#000000", "#FFFFFF", "#1A1A1A", "#9CA3AF"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "100k+", label: c.metricLabel }}
            url="https://www.iudex.mx/"
            image="/portafolio/screenshots/iudex.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseGobernia() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.gobernia;
    return (
        <CaseCard
            projectName="Gobernia"
            caseSlug="gobernia"
            eyebrow={c.eyebrow}
            titleTop="Gobernia."
            titleAccent={c.titleAccent}
            titleBottom={c.titleBottom}
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#1B2540", "#FFFFFF", "#3B82F6", "#F5F5F7"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "↑ 8x", label: c.metricLabel }}
            url="https://www.gobernia.ai/"
            image="/portafolio/screenshots/gobernia.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseSmileBetter() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.smileBetter;
    return (
        <CaseCard
            projectName="Smile Better Clinics"
            caseSlug="smile-better-clinics"
            eyebrow={c.eyebrow}
            titleTop="Smile"
            titleAccent="Better"
            titleBottom="Clinics."
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#0A0A0A", "#FFFFFF", "#22C55E", "#A78BFA"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "↑ 3x", label: c.metricLabel }}
            url="https://smilebetterclinics.com/"
            image="/portafolio/screenshots/smilebetter.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseBarmored() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.barmored;
    return (
        <CaseCard
            projectName="Barmored Security"
            caseSlug="barmored"
            eyebrow={c.eyebrow}
            titleTop="Barmored"
            titleAccent="Security."
            titleBottom={c.titleBottom}
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#0A0A0A", "#C8102E", "#A0A0A0", "#FFFFFF"]}
            font="Montserrat"
            fontStyle="display"
            metric={{ value: "↑ 7x", label: c.metricLabel }}
            url="https://www.barmoredsecurity.com/"
            image="/portafolio/screenshots/barmored.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseReDress() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.reDress;
    return (
        <CaseCard
            projectName="Re Dress"
            caseSlug="re-dress"
            eyebrow={c.eyebrow}
            titleTop="Re Dress."
            titleAccent={c.titleAccent}
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#F4F0EA", "#3D3D29", "#FFFFFF", "#1A1A1A"]}
            font="Poppins"
            fontStyle="sans"
            url="https://www.redressmx.com/"
            image="/portafolio/screenshots/redress.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseToogo() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.toogo;
    return (
        <CaseCard
            projectName="Toogo"
            caseSlug="toogo"
            eyebrow={c.eyebrow}
            titleTop="Toogo."
            titleAccent={c.titleAccent}
            titleBottom={c.titleBottom}
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#8B5CF6", "#FFFFFF", "#1F2937", "#F3F4F6"]}
            font="Inter"
            fontStyle="sans"
            metric={{ value: "100+", label: c.metricLabel }}
            url="https://www.toogo.store/"
            image="/portafolio/screenshots/toogo.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseRosymar() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.rosymar;
    return (
        <CaseCard
            projectName="Rosymar González"
            caseSlug="rosymar-gonzalez"
            eyebrow={c.eyebrow}
            titleTop="Rosymar"
            titleAccent="González."
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#1A1A1A", "#D4AF37", "#F5F0E8", "#FFFFFF"]}
            font="Cormorant Garamond"
            fontStyle="serif"
            metric={{ value: "↑ 5x", label: c.metricLabel }}
            url="https://rosymargonzalez.com/"
            image="/portafolio/screenshots/rosymargonzalez.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseHapptek() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.happtek;
    return (
        <CaseCard
            projectName="Happtek"
            caseSlug="happtek"
            eyebrow={c.eyebrow}
            titleTop="Happtek."
            titleAccent={c.titleAccent}
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#1A1410", "#CD9851", "#E8D5A8", "#0A0805"]}
            font="Playfair Display"
            fontStyle="serif"
            metric={{ value: "↑ 6x", label: c.metricLabel }}
            url="https://www.happtek.com.mx/"
            image="/portafolio/screenshots/audiofive.jpg"
            imageAlt={c.imageAlt}
        />
    );
}

export function CaseLosDidis() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.losDidis;
    return (
        <CaseCard
            projectName="Los DiDis 2026"
            caseSlug="los-didis-2026"
            url="https://losdidis2026.com/"
            eyebrow={c.eyebrow}
            titleTop="Los DiDis."
            titleAccent={c.titleAccent}
            body={c.body}
            tags={c.tags}
            image="/portafolio/screenshots/los-didis-registro.webp"
            imageSize={{ width: 1920, height: 970 }}
            imageAlt={c.imageAlt}
            imageCaption={c.imageCaption}
        />
    );
}

export function CaseLosDidisAcceso() {
    const { lang } = useLang();
    const study = getCaseStudy("los-didis");
    if (!study) return null;
    const c = study[lang];
    return (
        <CaseCard
            projectName={lang === "en" ? "Los DiDis 2024 · Access control" : "Los DiDis 2024 · Control de acceso"}
            caseSlug={study.slug}
            eyebrow={lang === "en" ? "Case · Event software" : "Caso · Software para eventos"}
            titleTop="Los DiDis 2024."
            titleAccent={lang === "en" ? "QR check-in." : "Acceso con QR."}
            body={c.summary}
            tags={c.stack}
            metric={{ value: study.metricValue, label: c.metricLabel }}
            image={study.image}
            imageAlt={c.imageAlt}
            bareImage
        />
    );
}

export function CaseSuzuki() {
    const { t } = useLang();
    const c = t.portfolioPage.cases.suzuki;
    return (
        <CaseCard
            projectName="Suzuki"
            caseSlug="suzuki"
            eyebrow={c.eyebrow}
            titleTop="Suzuki."
            titleAccent={c.titleAccent}
            titleBottom={c.titleBottom}
            body={<>{c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic1}</span>{c.bodyMid}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic2}</span>{c.bodyPost}</>}
            tags={c.tags}
            palette={["#0A0A0A", "#E30613", "#003DA5", "#F5F5F0"]}
            font="Montserrat"
            fontStyle="display"
            metric={{ value: "500+", label: c.metricLabel }}
            image="/soluciones/suzuki-ipad.png"
            imageAlt={c.imageAlt}
            bareImage
        />
    );
}

/* ==========================================================================
   CIERRE
   ========================================================================== */

export function PortafolioCierre() {
    const { t } = useLang();
    const c = t.portfolioPage.cierre;
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
                            {c.marquee}
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
                            {c.bodyPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.bodyItalic}</span>{c.bodyMid}<span className="bg-[#1d1d1f] text-white px-2 py-0.5 font-normal">{c.ctaPill}</span>{c.bodyPost}
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
                        {c.cta}
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
    const { t } = useLang();
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
                        {t.portfolioPage.heroSubhead}
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
                    <span>Keting Media · AI Engineers</span>
                </motion.div>
            </div>
        </section>
    );
}
