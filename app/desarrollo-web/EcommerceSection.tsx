"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/lang-context";

// Sección de E-commerce para /desarrollo-web.
// Client component pero importado normalmente (NO ssr:false) → el texto sí
// renderiza en el HTML del servidor (crawlable); solo se anima al entrar.

const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15%" },
} as const;

export function EcommerceSection() {
    const { t } = useLang();
    const c = t.webPage.ecommerce;
    const tags = c.tags;

    return (
        <section className="relative bg-white text-[#1d1d1f] py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
            {/* Cuadrícula sutil */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />
            {/* Asterisco girando (CSS puro, respeta reduce-motion) */}
            <span
                aria-hidden
                className="pointer-events-none select-none absolute -top-16 left-[2%] text-[12rem] md:text-[20rem] text-[#1d1d1f]/[0.05] font-light leading-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
            >
                *
            </span>

            <div className="max-w-7xl mx-auto relative grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                {/* Texto */}
                <motion.div
                    {...reveal}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-5"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                            {c.eyebrow}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5 text-[#1d1d1f]">
                        {c.h2Pre}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">{c.h2Accent}</span>
                    </h2>
                    <p className="text-base md:text-lg text-[#1d1d1f]/65 font-light leading-relaxed max-w-md mb-7">
                        {c.paragraphPre}<strong className="font-semibold text-[#1d1d1f]">{c.paragraphStrong}</strong>{c.paragraphEnd}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t}
                                className="text-[11px] md:text-xs font-medium tracking-wide text-[#1d1d1f]/70 border border-[#1d1d1f]/15 rounded-full px-3 py-1.5"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Imagen del caso Rosymar en marco de navegador */}
                <motion.div
                    {...reveal}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-7 relative"
                >
                    <div className="absolute -inset-x-8 -bottom-8 h-12 bg-[#1d1d1f]/10 blur-3xl rounded-full pointer-events-none" />
                    <div
                        className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#1a1a1a] ring-1 ring-black/10 shadow-2xl"
                        style={{ padding: "0.4rem" }}
                    >
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#222] rounded-t-lg md:rounded-t-xl">
                            <span className="block w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <span className="block w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                            <span className="block w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                            <div className="flex-1 mx-2 md:mx-4 h-5 rounded bg-white/5 flex items-center px-3">
                                <span className="text-[10px] md:text-xs text-white/50 font-mono truncate">
                                    rosymargonzalez.com
                                </span>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-b-lg md:rounded-b-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <a href="https://rosymargonzalez.com" target="_blank" rel="noopener noreferrer" className="block transition-transform duration-500 hover:-translate-y-2 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                                <img
                                src="/portafolio/screenshots/rosymargonzalez.jpg"
                                alt={c.imageAlt}
                                className="block w-full h-auto"
                                draggable={false}
                            />
                            </a>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-[#1d1d1f] text-white text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {c.badge}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
