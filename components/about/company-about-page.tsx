"use client";

// Componente de presentación único para /nosotros y /en/about (mismo patrón
// que /casos y /en/case-studies: "un componente, dos rutas finas"). Recibe
// SOLO el contenido del idioma que se renderiza — ver lib/about-content.ts —
// para que Next no serialice ambos idiomas en el payload RSC del HTML.

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactModal } from "@/components/pricing/contact-modal";
import { caseStudyHref, authorHref } from "@/lib/i18n/routes";
import type { AboutLangContent } from "@/lib/about-content";

type Lang = "es" | "en";

// Tarjeta de caso YA resuelta al idioma que se renderiza (ver splitCaseStudy
// en lib/case-studies.ts para el mismo criterio): pasar CASE_STUDIES completo
// (con es+en) a este componente "use client" metería el otro idioma en el
// payload RSC del HTML. El page.tsx de servidor arma este arreglo.
export type WorkCard = {
    slug: string;
    industry: string;
    title: string;
    metricValue: string;
    metricLabel: string;
};

function GridBg() {
    return (
        <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
            }}
        />
    );
}

function RiseText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <div className="overflow-hidden">
            <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
}

export function CompanyAboutPage({
    copy,
    lang,
    workCards,
}: {
    copy: AboutLangContent;
    lang: Lang;
    workCards: WorkCard[];
}) {
    const c = copy;
    const isEn = lang === "en";
    const [isContactOpen, setIsContactOpen] = useState(false);

    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateAst = useTransform(smooth, [0, 1], [0, 540]);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header />

            {/* ============ HERO ============ */}
            <section ref={ref} className="relative pt-40 md:pt-48 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 overflow-clip">
                <GridBg />
                <motion.span
                    style={{ rotate: rotateAst }}
                    className="absolute top-[10%] right-[5%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
                >
                    *
                </motion.span>

                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                            {c.heroEyebrow}
                        </span>
                    </div>

                    <RiseText>
                        <h1 className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] max-w-5xl text-4xl md:text-6xl lg:text-7xl font-light">
                            {c.heroTitleLead}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">
                                {c.heroTitleAccent}
                            </span>
                        </h1>
                    </RiseText>

                    <RiseText delay={0.1}>
                        <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed max-w-2xl mt-8 md:mt-10">
                            {c.heroSubtitle}
                        </p>
                    </RiseText>
                </div>
            </section>

            {/* ============ HISTORIA ============ */}
            <section className="relative bg-[#F5F5F7] py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 font-sans">
                            {c.storyEyebrow}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-10 md:mb-12">
                        {c.storyTitle}
                    </h2>
                    <div className="space-y-6">
                        {c.storyParagraphs.map((p, i) => (
                            <p
                                key={i}
                                className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/85"
                            >
                                {p}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CÓMO TRABAJAMOS ============ */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 font-sans">
                            {c.pillarsEyebrow}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-14 md:mb-16 max-w-3xl">
                        {c.pillarsTitle}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 border-t border-[#1d1d1f]/10 pt-12">
                        {c.pillars.map((pillar, i) => (
                            <div key={pillar.title}>
                                <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-4">
                                    0{i + 1}
                                </div>
                                <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-3">{pillar.title}</h3>
                                <p className="text-base font-light leading-relaxed text-[#1d1d1f]/75">{pillar.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ FUNDADOR ============ */}
            <section className="relative bg-[#F5F5F7] py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                    <div className="md:col-span-7 order-2 md:order-1">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 font-sans">
                                {c.founderEyebrow}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-8">{c.founderTitle}</h2>
                        <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/85 mb-10 max-w-xl">
                            {c.founderBody}
                        </p>
                        <Link
                            href={authorHref(isEn)}
                            className="group inline-flex items-center gap-2 text-sm font-medium text-[#1d1d1f] hover:text-[#1d1d1f]/70 transition-colors"
                        >
                            {c.founderCta}
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                    </div>
                    <div className="md:col-span-5 order-1 md:order-2 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full aspect-[3/4] max-w-[320px] bg-black rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/carlos-beuvrin.png"
                                alt={c.founderImageAlt}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: "center 5%" }}
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ TRABAJO REAL ============ */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 font-sans">
                            {c.workEyebrow}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 max-w-3xl">{c.workTitle}</h2>
                    <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/75 max-w-2xl mb-12 md:mb-14">
                        {c.workBody}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {workCards.map((card) => (
                            <Link
                                key={card.slug}
                                href={caseStudyHref(card.slug, isEn)}
                                className="group border border-[#1d1d1f]/10 rounded-2xl p-6 hover:border-[#1d1d1f]/30 hover:bg-white transition-all"
                            >
                                <div className="text-[10px] uppercase tracking-[0.25em] text-[#1d1d1f]/40 font-mono mb-3">
                                    {card.industry}
                                </div>
                                <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:opacity-70 transition-opacity">
                                    {card.title}
                                </h3>
                                <div className="text-2xl font-light">{card.metricValue}</div>
                                <div className="text-[10px] uppercase tracking-[0.2em] text-[#1d1d1f]/40 font-mono">
                                    {card.metricLabel}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link
                        href={isEn ? "/en/case-studies" : "/casos"}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-[#1d1d1f] hover:text-[#1d1d1f]/70 transition-colors"
                    >
                        {c.workCta}
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="relative bg-[#1a1a1a] text-white py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-clip">
                <GridBg />
                <div className="max-w-4xl mx-auto relative text-center">
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">{c.ctaHeading}</h2>
                    <p className="text-white/70 font-light text-base md:text-lg max-w-xl mx-auto mb-10">{c.ctaBody}</p>
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="group inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full text-base md:text-lg font-medium hover:bg-white/90 transition-colors duration-300"
                    >
                        {c.ctaButton}
                        <Plus className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
                    </button>
                    <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
