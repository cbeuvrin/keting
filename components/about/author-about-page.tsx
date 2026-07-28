"use client";

// Componente de presentación único para /nosotros/carlos-beuvrin y
// /en/about/carlos-beuvrin (mismo patrón que /casos y /en/case-studies).
// Recibe SOLO el contenido del idioma que se renderiza — ver
// lib/about-content.ts — para que Next no serialice ambos idiomas en el
// payload RSC del HTML.

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

export function AuthorAboutPage({ copy, lang }: { copy: AuthorAboutLangContent; lang: Lang }) {
    const c = copy;
    const isEn = lang === "en";
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header />

            {/* ============ HERO ============ */}
            <section className="relative pt-40 md:pt-48 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 overflow-clip">
                <GridBg />
                <span className="absolute top-[8%] right-[5%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block rotate-12 pointer-events-none">
                    *
                </span>

                <div className="max-w-6xl mx-auto relative grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                    <div className="md:col-span-7 order-2 md:order-1">
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
                            className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] text-4xl md:text-6xl lg:text-7xl font-light"
                        >
                            Carlos{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">
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

                    <div className="md:col-span-5 order-1 md:order-2 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="relative w-full aspect-[3/4] max-w-[320px] bg-black rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/carlos-beuvrin.png"
                                alt={`${AUTHOR.name} — ${c.roleLabel}`}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: "center 5%" }}
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ BIO ============ */}
            <section className="relative bg-[#F5F5F7] py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto space-y-6">
                    {c.bioParagraphs.map((p, i) => (
                        <p key={i} className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/85">
                            {p}
                        </p>
                    ))}
                </div>
            </section>

            {/* ============ BLOG ============ */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-light tracking-tight mb-5">{c.blogHeading}</h2>
                    <p className="text-base md:text-lg font-light leading-relaxed text-[#1d1d1f]/75 mb-8">
                        {c.blogBody}
                    </p>
                    <Link
                        href="/blog"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-[#1d1d1f] hover:text-[#1d1d1f]/70 transition-colors"
                    >
                        {c.blogCta}
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                    <div className="mt-4">
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
