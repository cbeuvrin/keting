"use client";

// Componente de presentación único para /nosotros/carlos-beuvrin y
// /en/about/carlos-beuvrin (mismo patrón que /casos y /en/case-studies).
// Recibe SOLO el contenido del idioma que se renderiza — ver
// lib/about-content.ts — para que Next no serialice ambos idiomas en el
// payload RSC del HTML. Lo mismo aplica a `caseStudies` y `articles`: los
// arma el page.tsx (servidor) ya resueltos al idioma que toca, en vez de que
// este componente importe lib/case-studies.ts / Supabase / lib/blog-en
// directamente (eso metería ambos idiomas en el bundle del cliente).

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Linkedin, Github, Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactModal } from "@/components/pricing/contact-modal";
import { AUTHOR } from "@/lib/author";
import { aboutHref } from "@/lib/i18n/routes";
import type { AuthorAboutLangContent } from "@/lib/about-content";

type Lang = "es" | "en";

const COMPANY_GITHUB = "https://github.com/KetingMedia";

// Nombres cortos de marca para la franja de métricas — son nombres propios ya
// usados en todo el sitio (Iudex, Gobernia, Toogo, Ivan Ivanovich Academy),
// no un dato biográfico nuevo.
const CASE_SHORT_NAME: Record<string, string> = {
    iudex: "Iudex",
    gobernia: "Gobernia",
    toogo: "Toogo",
    "ivan-ivanovich-academy": "Ivan Ivanovich",
};

// Los 4 casos que se destacan en la franja de métricas, en este orden.
const METRIC_SLUGS = ["iudex", "gobernia", "toogo", "ivan-ivanovich-academy"];

export type AuthorCaseStudyItem = {
    slug: string;
    title: string;
    industry: string;
    metricValue: string;
    metricLabel: string;
    href: string;
};

export type AuthorArticleItem = {
    slug: string;
    title: string;
    href: string;
    category?: string;
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

function EyebrowLine({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <span className="block w-10 h-px bg-[#1d1d1f]/40" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">{label}</span>
        </div>
    );
}

export function AuthorAboutPage({
    copy,
    lang,
    caseStudies,
    articles,
}: {
    copy: AuthorAboutLangContent;
    lang: Lang;
    caseStudies: AuthorCaseStudyItem[];
    articles: AuthorArticleItem[];
}) {
    const c = copy;
    const isEn = lang === "en";
    const [isContactOpen, setIsContactOpen] = useState(false);

    const featuredMetrics = METRIC_SLUGS.map((slug) => caseStudies.find((cs) => cs.slug === slug)).filter(
        (cs): cs is AuthorCaseStudyItem => Boolean(cs)
    );

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header />

            {/* ============ HERO ============ */}
            <section className="relative pt-40 md:pt-48 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 overflow-clip">
                <GridBg />
                <span className="absolute top-[6%] right-[2%] text-[10rem] md:text-[18rem] text-[#1d1d1f]/[0.06] select-none font-light leading-none inline-block rotate-12 pointer-events-none">
                    *
                </span>

                <div className="max-w-6xl mx-auto relative grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
                    <div className="md:col-span-6 order-2 md:order-1">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                            <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                                {c.eyebrow}
                            </span>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] text-5xl md:text-6xl lg:text-7xl font-light"
                        >
                            Carlos{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case block md:inline">
                                Beuvrin
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed mt-6"
                        >
                            {c.roleLabel} · {c.companyLabel}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-4 mt-10"
                        >
                            <a
                                href={AUTHOR.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 border border-[#1d1d1f]/20 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-all"
                            >
                                <Linkedin className="w-4 h-4" />
                                {c.linkedinLabel}
                            </a>
                            <a
                                href={COMPANY_GITHUB}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 border border-[#1d1d1f]/20 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-all"
                            >
                                <Github className="w-4 h-4" />
                                {c.githubLabel}
                            </a>
                        </motion.div>
                    </div>

                    <div className="md:col-span-6 order-1 md:order-2 flex justify-center md:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="relative w-full aspect-[4/5] max-w-[460px] bg-black rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/carlos-beuvrin.png"
                                alt={`${AUTHOR.name} — ${c.roleLabel}`}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: "center 5%" }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ POSICIONAMIENTO ============ */}
            <section className="relative bg-[#1a1a1a] text-white py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-clip">
                <GridBg />
                <div className="max-w-5xl mx-auto relative">
                    <div className="overflow-hidden">
                        <motion.p
                            initial={{ y: "100%" }}
                            whileInView={{ y: "0%" }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight"
                        >
                            {c.positioning}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* ============ BIO ============ */}
            <section className="relative bg-[#F5F5F7] py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 border-t border-[#1d1d1f]/10 pt-14">
                    {c.bioSections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.7, delay: i * 0.08 }}
                        >
                            <div className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-4">
                                {section.title}
                            </div>
                            <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/85">
                                {section.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ============ MÉTRICAS ============ */}
            {featuredMetrics.length > 0 && (
                <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24">
                    <div className="max-w-6xl mx-auto">
                        <EyebrowLine label={c.metricsEyebrow} />
                        <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-14 md:mb-16 max-w-2xl">
                            {c.metricsTitle}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-[#1d1d1f]/10">
                            {featuredMetrics.map((m, i) => (
                                <Link
                                    key={m.slug}
                                    href={m.href}
                                    className="group relative border-b border-r border-[#1d1d1f]/10 p-6 md:p-8 flex flex-col justify-between min-h-[180px] md:min-h-[220px] hover:bg-black/[0.02] transition-colors"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 0.6, delay: i * 0.08 }}
                                    >
                                        <div className="text-3xl md:text-5xl font-light leading-none mb-3 tracking-tight">
                                            {m.metricValue}
                                        </div>
                                        <div className="text-[10px] uppercase tracking-[0.25em] text-[#1d1d1f]/40 font-mono">
                                            {m.metricLabel}
                                        </div>
                                    </motion.div>
                                    <div className="flex items-center justify-between mt-6">
                                        <span className="text-sm font-medium text-[#1d1d1f]/70 group-hover:text-[#1d1d1f] transition-colors">
                                            {CASE_SHORT_NAME[m.slug] ?? m.title}
                                        </span>
                                        <ArrowUpRight className="w-4 h-4 text-[#1d1d1f]/30 group-hover:text-[#1d1d1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============ PROYECTOS ============ */}
            {caseStudies.length > 0 && (
                <section className="relative bg-[#F5F5F7] py-24 md:py-32 px-6 md:px-12 lg:px-24">
                    <div className="max-w-5xl mx-auto">
                        <EyebrowLine label={c.projectsEyebrow} />
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-light tracking-tight max-w-xl">
                                {c.projectsTitle}
                            </h2>
                            <p className="text-base text-[#1d1d1f]/60 font-light max-w-sm">{c.projectsBody}</p>
                        </div>

                        <div className="border-t border-b border-[#1d1d1f]/10 divide-y divide-[#1d1d1f]/10">
                            {caseStudies.map((cs, i) => (
                                <Link
                                    key={cs.slug}
                                    href={cs.href}
                                    className="group flex items-center justify-between gap-4 md:gap-8 py-6 md:py-7 px-1 md:px-2 hover:bg-black/[0.02] transition-colors"
                                >
                                    <div className="flex items-center gap-4 md:gap-8 min-w-0">
                                        <span className="font-mono text-xs text-[#1d1d1f]/30 shrink-0 hidden sm:block">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-base md:text-xl lg:text-2xl font-normal tracking-tight truncate group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                                {cs.title}
                                            </h3>
                                            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#1d1d1f]/40 font-mono mt-1.5 truncate">
                                                {cs.industry}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#1d1d1f]/30 group-hover:text-[#1d1d1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============ ARTÍCULOS ============ */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <EyebrowLine label={c.blogEyebrow} />
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-5">{c.blogHeading}</h2>
                    <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/75 mb-10 max-w-xl">
                        {c.blogBody}
                    </p>

                    {articles.length > 0 && (
                        <div className="border-t border-b border-[#1d1d1f]/10 divide-y divide-[#1d1d1f]/10 mb-10">
                            {articles.map((a) => (
                                <Link
                                    key={a.slug}
                                    href={a.href}
                                    className="group flex items-center justify-between gap-6 py-5 md:py-6 px-1 md:px-2 hover:bg-black/[0.02] transition-colors"
                                >
                                    <div className="min-w-0">
                                        {a.category && (
                                            <p className="text-[10px] uppercase tracking-[0.25em] text-[#1d1d1f]/40 font-mono mb-1.5">
                                                {a.category}
                                            </p>
                                        )}
                                        <h3 className="text-base md:text-lg font-normal tracking-tight leading-snug group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                            {a.title}
                                        </h3>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 shrink-0 text-[#1d1d1f]/30 group-hover:text-[#1d1d1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                        <Link
                            href={isEn ? "/en/blog" : "/blog"}
                            className="group inline-flex items-center gap-2 text-sm font-medium text-[#1d1d1f] hover:text-[#1d1d1f]/70 transition-colors"
                        >
                            {c.blogCta}
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                        <Link
                            href={aboutHref(isEn)}
                            className="group inline-flex items-center gap-2 text-sm text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors"
                        >
                            <ArrowUpRight className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                            {c.companyLabel}
                        </Link>
                    </div>
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
