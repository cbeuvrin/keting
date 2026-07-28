"use client";

// Índice de los 9 casos de éxito — componente único para /casos y
// /en/case-studies (patrón "un componente, dos rutas finas").

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CASE_STUDIES } from "@/lib/case-studies";
import { caseStudyHref } from "@/lib/i18n/routes";

type Lang = "es" | "en";

const LABELS: Record<Lang, { eyebrow: string; title: string; titleAccent: string; subhead: string }> = {
    es: {
        eyebrow: "Casos de éxito",
        title: "Resultados",
        titleAccent: "reales.",
        subhead:
            "Nueve marcas, nueve retos distintos. Cada caso documenta el problema, lo que construimos y el resultado — sin relleno.",
    },
    en: {
        eyebrow: "Case studies",
        title: "Real",
        titleAccent: "results.",
        subhead:
            "Nine brands, nine different challenges. Every case documents the problem, what we built, and the result — no filler.",
    },
};

export function CaseStudiesIndex({ lang }: { lang: Lang }) {
    const l = LABELS[lang];
    const isEn = lang === "en";

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header />

            <section className="relative pt-40 md:pt-48 pb-16 md:pb-24 px-6 md:px-12 lg:px-24 overflow-clip">
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">
                            {l.eyebrow}
                        </span>
                    </div>
                    <h1 className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] max-w-4xl text-5xl md:text-7xl lg:text-8xl font-light">
                        {l.title}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case">
                            {l.titleAccent}
                        </span>
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed max-w-2xl mt-8 md:mt-10">
                        {l.subhead}
                    </p>
                </div>
            </section>

            <section className="relative px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
                <div className="max-w-7xl mx-auto border-t border-[#1d1d1f]/10">
                    {CASE_STUDIES.map((study, i) => {
                        const c = study[lang];
                        return (
                            <motion.div
                                key={study.slug}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link
                                    href={caseStudyHref(study.slug, isEn)}
                                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 items-center py-10 md:py-12 border-b border-[#1d1d1f]/10"
                                >
                                    <div className="md:col-span-1 text-xs font-mono uppercase tracking-[0.25em] text-[#1d1d1f]/40">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <div className="md:col-span-6">
                                        <div className="text-[10px] uppercase tracking-[0.25em] text-[#1d1d1f]/40 font-mono mb-2">
                                            {c.industry}
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-normal tracking-tight text-[#111] leading-none group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                            {c.title}
                                        </h2>
                                    </div>
                                    <div className="md:col-span-3">
                                        <div className="text-2xl md:text-3xl font-light leading-none mb-1">
                                            {study.metricValue}
                                        </div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#1d1d1f]/40 font-mono">
                                            {c.metricLabel}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 flex md:justify-end">
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1d1f]/70 group-hover:text-[#1d1d1f] transition-colors">
                                            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </main>
    );
}
