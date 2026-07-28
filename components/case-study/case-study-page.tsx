"use client";

// Componente de presentación único para /casos/[slug] y /en/case-studies/[slug]
// (patrón "un componente, dos rutas finas" — ver components/layout/home-shell.tsx).
// El idioma se recibe explícito por prop (no por pathname) porque cada ruta
// fina ya sabe en qué idioma vive.

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactModal } from "@/components/pricing/contact-modal";
import type { CaseStudyBase, CaseStudyLangContent } from "@/lib/case-studies";
import { CASE_STUDIES_PUBLISHED_DATE } from "@/lib/case-studies";

type Lang = "es" | "en";

const LABELS: Record<Lang, {
    eyebrow: string;
    back: string;
    viewLive: string;
    challenge: string;
    solution: string;
    result: string;
    stackLabel: string;
    published: string;
    ctaHeading: string;
    ctaBody: string;
    ctaButton: string;
    designedBy: string;
}> = {
    es: {
        eyebrow: "Caso de éxito",
        back: "Ver todos los casos",
        viewLive: "Ver en vivo",
        challenge: "El reto",
        solution: "La solución",
        result: "El resultado",
        stackLabel: "Stack / Servicios",
        published: "Publicado",
        ctaHeading: "¿Tu marca necesita algo así?",
        ctaBody: "Un café de 30 minutos es suficiente para entender si encajamos. Sin compromiso.",
        ctaButton: "Hablemos",
        designedBy: "Designed by",
    },
    en: {
        eyebrow: "Case study",
        back: "See all case studies",
        viewLive: "View live",
        challenge: "The challenge",
        solution: "The solution",
        result: "The result",
        stackLabel: "Stack / Services",
        published: "Published",
        ctaHeading: "Does your brand need something like this?",
        ctaBody: "A 30-minute coffee is enough to see if we're a fit. No commitment.",
        ctaButton: "Let's talk",
        designedBy: "Designed by",
    },
};

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

/** Título con la última palabra en Playfair itálica, al estilo del resto del sitio. */
function EditorialTitle({ title }: { title: string }) {
    const words = title.split(" ");
    const last = words.pop();
    const rest = words.join(" ");
    return (
        <h1 className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] max-w-5xl text-4xl md:text-6xl lg:text-7xl font-light">
            {rest && `${rest} `}
            <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">{last}</span>
        </h1>
    );
}

// Recibe SOLO el contenido del idioma que se renderiza (ver splitCaseStudy):
// pasar el caso completo metería el otro idioma en el payload RSC del HTML.
export function CaseStudyPage({ study, copy, lang }: { study: CaseStudyBase; copy: CaseStudyLangContent; lang: Lang }) {
    const c = copy;
    const l = LABELS[lang];
    const isEn = lang === "en";
    const [isContactOpen, setIsContactOpen] = useState(false);

    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateAst = useTransform(smooth, [0, 1], [0, 540]);

    const publishedDate = new Date(`${CASE_STUDIES_PUBLISHED_DATE}T00:00:00Z`).toLocaleDateString(
        isEn ? "en-US" : "es-MX",
        { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
    );

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
                    <Link
                        href={isEn ? "/en/case-studies" : "/casos"}
                        className="group inline-flex items-center gap-2 text-sm text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors mb-12 md:mb-16"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        {l.back}
                    </Link>

                    <div className="flex items-center gap-3 mb-8">
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                            {l.eyebrow} · {c.industry}
                        </span>
                    </div>

                    <RiseText>
                        <EditorialTitle title={c.title} />
                    </RiseText>

                    <RiseText delay={0.1}>
                        <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed max-w-2xl mt-8 md:mt-10">
                            {c.summary}
                        </p>
                    </RiseText>

                    <RiseText delay={0.18}>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#1d1d1f]/40 font-mono mt-8">
                            {l.published}: <time dateTime={CASE_STUDIES_PUBLISHED_DATE}>{publishedDate}</time>
                        </p>
                    </RiseText>

                    {/* Métrica + stack + CTA */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mt-14 md:mt-20 pt-10 border-t border-[#1d1d1f]/15 max-w-4xl">
                        <div className="md:col-span-4">
                            <div className="text-4xl md:text-5xl font-light leading-none mb-2">{study.metricValue}</div>
                            <div className="text-[10px] uppercase tracking-[0.25em] text-[#1d1d1f]/40 font-mono">
                                {c.metricLabel}
                            </div>
                        </div>
                        <div className="md:col-span-8">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-3">
                                {l.stackLabel}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {c.stack.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-mono uppercase tracking-widest border border-[#1d1d1f]/20 text-[#1d1d1f]/80 px-3 py-1.5 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {study.url && (
                        <a
                            href={study.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-[#1d1d1f] hover:text-[#1d1d1f]/70 transition-colors mt-10"
                        >
                            {l.viewLive}
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                    )}
                </div>
            </section>

            {/* ============ IMAGEN ============ */}
            <section className="relative px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
                <div className="max-w-6xl mx-auto relative">
                    <div className={`relative ${study.bareImage ? "max-w-[70%] mx-auto" : ""}`}>
                        <div className="absolute -inset-x-8 -bottom-8 h-12 bg-[#1d1d1f]/15 blur-3xl rounded-full pointer-events-none" />
                        {study.bareImage ? (
                            <img
                                src={study.image}
                                alt={c.imageAlt}
                                className="relative w-full h-auto drop-shadow-2xl"
                                draggable={false}
                            />
                        ) : (
                            <div
                                className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#1a1a1a] ring-1 ring-black/20 shadow-2xl"
                                style={{ padding: "0.4rem" }}
                            >
                                <div className="flex items-center gap-3 px-3 py-2 bg-[#222] rounded-t-lg md:rounded-t-xl">
                                    <div className="flex items-center gap-1.5">
                                        <span className="block w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                        <span className="block w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                                        <span className="block w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                    </div>
                                    <div className="flex-1 mx-2 md:mx-4 h-6 rounded bg-white/5 flex items-center px-3">
                                        <span className="text-[10px] md:text-xs text-white/50 font-mono truncate">
                                            {study.url ? study.url.replace(/^https?:\/\//, "") : ""}
                                        </span>
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-b-lg md:rounded-b-xl">
                                    <img src={study.image} alt={c.imageAlt} className="block w-full h-auto" draggable={false} />
                                </div>
                            </div>
                        )}
                        <div className="mt-5 md:mt-6 flex items-center justify-center gap-3">
                            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-mono text-[#1d1d1f]/40">
                                {l.designedBy}
                            </span>
                            <img
                                src="/keting-logo-black.png"
                                alt="Keting Media"
                                className="h-4 md:h-5 w-auto object-contain opacity-60"
                                draggable={false}
                            />
                            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-mono text-[#1d1d1f]/40">
                                Media
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ RETO / SOLUCIÓN / RESULTADO ============ */}
            <section className="relative bg-[#F5F5F7] py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 border-t border-[#1d1d1f]/10 pt-14">
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-4">
                            {l.challenge}
                        </div>
                        <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/85">{c.challenge}</p>
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-4">
                            {l.solution}
                        </div>
                        <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/85">{c.solution}</p>
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-4">
                            {l.result}
                        </div>
                        <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/85">{c.result}</p>
                    </div>
                </div>

                {/* Duración / inversión — solo si existen datos reales (opcional, sin relleno). */}
                {(study.duration || study.investment) && (
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 pt-10 border-t border-[#1d1d1f]/10">
                        {study.duration && (
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-2">
                                    {isEn ? "Duration" : "Duración"}
                                </div>
                                <p className="text-base font-light text-[#1d1d1f]/85">{study.duration}</p>
                            </div>
                        )}
                        {study.investment && (
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-2">
                                    {isEn ? "Investment" : "Inversión"}
                                </div>
                                <p className="text-base font-light text-[#1d1d1f]/85">{study.investment}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Testimonio — solo si existe una cita real (opcional, sin relleno). */}
                {study.quote && (
                    <div className="max-w-4xl mx-auto mt-16 pt-14 border-t border-[#1d1d1f]/10">
                        <p className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] italic font-normal leading-snug text-[#1d1d1f]">
                            &ldquo;{study.quote.text}&rdquo;
                        </p>
                        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#1d1d1f]/50 font-mono">
                            {study.quote.name} · {study.quote.role}, {study.quote.company}
                        </p>
                    </div>
                )}
            </section>

            {/* ============ CTA ============ */}
            <section className="relative bg-[#1a1a1a] text-white py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-clip">
                <GridBg />
                <div className="max-w-4xl mx-auto relative text-center">
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
                        {l.ctaHeading}
                    </h2>
                    <p className="text-white/70 font-light text-base md:text-lg max-w-xl mx-auto mb-10">{l.ctaBody}</p>
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="group inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full text-base md:text-lg font-medium hover:bg-white/90 transition-colors duration-300"
                    >
                        {l.ctaButton}
                        <Plus className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
                    </button>
                    <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
