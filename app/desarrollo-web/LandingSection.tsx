"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/lang-context";

// Sección de Landing pages para /desarrollo-web (versión oscura, hace juego con
// Iudex). Importada normalmente (NO ssr:false) → texto en el HTML; solo anima al entrar.

const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15%" },
} as const;

export function LandingSection() {
    const { t } = useLang();
    const c = t.webPage.landing;
    const tags = c.tags;

    return (
        <section className="relative bg-[#0A0A0A] text-white py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
            {/* Cuadrícula sutil */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />
            {/* Asterisco girando (CSS puro) */}
            <span
                aria-hidden
                className="pointer-events-none select-none absolute -top-16 right-[2%] text-[12rem] md:text-[20rem] text-white/[0.05] font-light leading-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
            >
                *
            </span>

            <div className="max-w-7xl mx-auto relative grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                {/* Imagen del caso Iudex en marco de navegador (izquierda) */}
                <motion.div
                    {...reveal}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-7 relative order-2 md:order-1"
                >
                    <div className="absolute -inset-x-8 -bottom-8 h-12 bg-black/50 blur-3xl rounded-full pointer-events-none" />
                    <div
                        className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#0a0a0a] ring-1 ring-white/10 shadow-2xl"
                        style={{ padding: "0.4rem" }}
                    >
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-t-lg md:rounded-t-xl">
                            <span className="block w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <span className="block w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                            <span className="block w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                            <div className="flex-1 mx-2 md:mx-4 h-5 rounded bg-white/5 flex items-center px-3">
                                <span className="text-[10px] md:text-xs text-white/50 font-mono truncate">iudex.mx</span>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-b-lg md:rounded-b-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <a href="https://www.iudex.mx/" target="_blank" rel="noopener noreferrer" className="block transition-transform duration-500 hover:-translate-y-2 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                                <img
                                src="/portafolio/screenshots/iudex.jpg"
                                alt={c.imageAlt}
                                className="block w-full h-auto"
                                draggable={false}
                            />
                            </a>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-black text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {c.badge}
                    </div>
                </motion.div>

                {/* Texto (derecha) */}
                <motion.div
                    {...reveal}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-5 order-1 md:order-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-white/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/50">
                            {c.eyebrow}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5 text-white">
                        {c.h2Pre}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.h2Accent}</span>
                    </h2>
                    <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md mb-7">
                        {c.paragraphPre}<strong className="font-semibold text-white">{c.paragraphStrong}</strong>{c.paragraphEnd}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t}
                                className="text-[11px] md:text-xs font-medium tracking-wide text-white/70 border border-white/15 rounded-full px-3 py-1.5"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
