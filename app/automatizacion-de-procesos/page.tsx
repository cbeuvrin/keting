"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/seo/faq-section";
import { ContactModal } from "@/components/pricing/contact-modal";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";

// Página de servicio: Automatización de procesos con IA.
// Client component importado normal (NO ssr:false) → todo el texto va en el
// HTML del servidor (crawlable); las animaciones solo se activan al entrar.

const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
} as const;

// Statement gigante con scrub de scroll: las palabras clave se quedan oscuras
// SIEMPRE; el resto del texto se aclara conforme bajas y vuelve a oscurecerse
// al subir (ligado a scrollYProgress → totalmente reversible).
function FraseImpactoIA() {
    const { t } = useLang();
    const f = t.automationPage.fraseImpacto;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    // De oscuro → claro conforme avanza el scroll dentro de la sección.
    const fadeColor = useTransform(smooth, [0.1, 0.9], ["#1d1d1f", "#d8d8d4"]);
    const rotateAst = useTransform(smooth, [0, 1], [0, 420]);
    const rotateAstInv = useTransform(rotateAst, (v) => -v);

    // Palabras "de relleno": comparten el color animado.
    const Dim = ({ children }: { children: React.ReactNode }) => (
        <motion.span style={{ color: fadeColor }}>{children}</motion.span>
    );

    return (
        <section ref={ref} className="relative bg-white py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />
            {/* Doble asterisco girando en direcciones opuestas */}
            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute -top-10 right-[3%] text-[10rem] md:text-[18rem] text-[#1d1d1f]/[0.06] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >
                *
            </motion.span>
            <motion.span
                style={{ rotate: rotateAstInv }}
                className="absolute -bottom-14 left-[2%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.05] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >
                *
            </motion.span>

            <div className="max-w-6xl mx-auto relative">
                {/* Eyebrow editorial */}
                <div className="flex items-center gap-3 mb-12 md:mb-16">
                    <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                        {f.eyebrow}
                    </span>
                </div>

                <p className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.15] text-[#1d1d1f]">
                    <Dim>{f.d1}</Dim>
                    {/* dinero — resaltado tipo marcador */}
                    <span className="relative inline-block font-medium text-[#1d1d1f] whitespace-nowrap">
                        {f.k1}
                        <span className="absolute inset-x-0 bottom-1 md:bottom-2 h-2.5 md:h-4 bg-[#1d1d1f]/10" aria-hidden />
                    </span>
                    <Dim>{f.d2}</Dim>
                    {/* IA — acento Playfair */}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{f.k2}</span>
                    <Dim>{f.d3}</Dim>
                    {/* tiempo — Playfair */}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{f.k3}</span>
                    <Dim>{f.d4}</Dim>
                    {/* errores — tachado con intención */}
                    <span className="font-medium text-[#1d1d1f] line-through decoration-2 md:decoration-[3px] decoration-[#1d1d1f]/60">{f.k4}</span>
                    <Dim>{f.d5}</Dim>
                    {/* ventaja — subrayado animado + asterisco */}
                    <span className="relative inline-block font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f] whitespace-nowrap">
                        {f.k5}
                        <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, margin: "-20%" }}
                            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left"
                            aria-hidden
                        />
                    </span>
                    <motion.span
                        initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, rotate: 18, scale: 1 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block ml-2 md:ml-3 text-2xl md:text-4xl align-top text-[#1d1d1f]/40"
                        aria-hidden
                    >*</motion.span>
                    <Dim>{f.d6}</Dim>
                </p>

                {/* Remate editorial */}
                <div className="mt-12 md:mt-16 flex items-center gap-3">
                    <span className="block w-8 h-px bg-[#1d1d1f]/30" />
                    <span className="text-sm md:text-base text-[#1d1d1f]/50 font-[family-name:var(--font-playfair)] italic">
                        {f.remate}
                    </span>
                    <span className="block flex-1 h-px bg-[#1d1d1f]/10" />
                </div>
            </div>
        </section>
    );
}

// Reveal editorial por línea (mask desde abajo), igual que el hero de /portafolio.
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

// Los números de paso (01, 02...) son fijos independientemente del idioma.
const PASOS_N = ["01", "02", "03", "04"];

export default function AutomatizacionPage() {
    const { t } = useLang();
    const a = t.automationPage;
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const softwareHref = enHref("/desarrollo-de-software", isEn);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateA = useTransform(smooth, [0, 1], [0, 540]);
    const rotateB = useTransform(smooth, [0, 1], [0, -720]);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header showLogo forcedTheme="light" />

            {/* ── HERO editorial gigante (mismo ADN que /portafolio) ── */}
            <section ref={heroRef} className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 lg:px-24 overflow-clip">
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />
                {/* Asteriscos girando con el scroll */}
                <motion.span style={{ rotate: rotateA }} className="absolute top-[12%] left-[4%] text-[10rem] md:text-[18rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none">*</motion.span>
                <motion.span style={{ rotate: rotateB }} className="absolute bottom-[10%] right-[5%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none">*</motion.span>

                <div className="max-w-7xl mx-auto relative">
                    {/* Eyebrow + badge */}
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
                                {a.hero.eyebrow}
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                        >
                            <span className="font-serif italic text-2xl md:text-3xl text-white">{a.hero.badge}</span>
                        </motion.div>
                    </div>

                    {/* Título editorial gigante */}
                    <h1 className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] max-w-6xl">
                        <RiseText delay={0}>
                            <span className="block text-5xl md:text-8xl lg:text-9xl font-light">
                                {a.hero.h1a}
                            </span>
                        </RiseText>
                        <RiseText delay={0.12}>
                            <span className="block text-5xl md:text-8xl lg:text-9xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 md:mt-3 tracking-tight">
                                {a.hero.h1b}
                            </span>
                        </RiseText>
                        <RiseText delay={0.24}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-light mt-2 md:mt-3">
                                {a.hero.h1c}
                                <span className="relative inline-block font-normal">
                                    {a.hero.h1accent}
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
                                <span>{a.hero.h1dot}</span>
                            </span>
                        </RiseText>
                    </h1>

                    <RiseText delay={0.15}>
                        <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed max-w-2xl mt-10 md:mt-12">
                            <span className="font-medium text-[#1d1d1f]">{a.hero.subBold}</span>
                            {a.hero.subMid1}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{a.hero.subItalic}</span>
                            {a.hero.subMid2}
                        </p>
                    </RiseText>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-10 md:mt-12"
                    >
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors"
                        >
                            {a.hero.ctaLabel}
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── CÓMO TRABAJAMOS (4 pasos) ── */}
            <section className="relative bg-white py-20 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...reveal} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-12 md:mb-16">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                            {a.pasos.eyebrow}
                        </span>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
                        {a.pasos.items.map((p, i) => (
                            <motion.div
                                key={p.t}
                                {...reveal}
                                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="border-t border-[#1d1d1f]/12 pt-6"
                            >
                                <div className="flex items-baseline gap-4 mb-3">
                                    <span className="font-serif italic text-2xl md:text-3xl text-[#1d1d1f]/30">{PASOS_N[i]}</span>
                                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1d1d1f]">{p.t}</h2>
                                </div>
                                <p className="text-base text-[#1d1d1f]/60 font-light leading-relaxed">{p.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── QUÉ PROCESOS + CASO ── */}
            <section className="relative bg-[#0A0A0A] text-white py-20 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />
                <span
                    aria-hidden
                    className="pointer-events-none select-none absolute -bottom-24 left-[2%] text-[12rem] md:text-[20rem] text-white/[0.05] font-light leading-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
                >
                    *
                </span>

                <div className="max-w-7xl mx-auto relative grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                    <motion.div {...reveal} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="md:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-white/40" />
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/50">
                                {a.darkSection.eyebrow}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5 text-white">
                            {a.darkSection.h2pre}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">{a.darkSection.h2accent}</span>
                        </h2>
                        <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md mb-7">
                            {a.darkSection.paraPre}
                            <strong className="font-semibold text-white">{a.darkSection.paraBold1}</strong>
                            {a.darkSection.paraMid}
                            <strong className="font-semibold text-white">{a.darkSection.paraBold2}</strong>
                            {a.darkSection.paraEnd}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {a.darkSection.procesos.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[11px] md:text-xs font-medium tracking-wide text-white/70 border border-white/15 rounded-full px-3 py-1.5"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        {...reveal}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-7 relative"
                    >
                        <div className="absolute -inset-x-8 -bottom-8 h-12 bg-black/50 blur-3xl rounded-full pointer-events-none" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <a href="https://gobernia-liard.vercel.app/" target="_blank" rel="noopener noreferrer" className="block transition-transform duration-500 hover:-translate-y-2 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                            <img
                            src="/soluciones/gobernia-imac.png"
                            alt={a.darkSection.imgAlt}
                            className="relative w-full h-auto drop-shadow-2xl"
                            draggable={false}
                        />
                        </a>
                        <div className="absolute top-4 right-4 bg-white text-black text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                            {a.darkSection.badge}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── IMPLEMENTACIÓN DE IA (captura la keyword hermana) + caso Toogo/WhatsApp ── */}
            <section className="relative py-20 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden">
                <span
                    aria-hidden
                    className="pointer-events-none select-none absolute -top-16 right-[2%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.05] font-light leading-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
                >
                    *
                </span>
                <div className="max-w-7xl mx-auto relative grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                    {/* Texto */}
                    <div className="md:col-span-7">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                                {a.implementacion.eyebrow}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-6 text-[#1d1d1f]">
                            {a.implementacion.h2pre}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">{a.implementacion.h2accent}</span>
                        </h2>
                        <p className="text-base md:text-lg text-[#1d1d1f]/65 font-light leading-relaxed mb-5">
                            {a.implementacion.p1Pre}
                            <strong className="font-semibold text-[#1d1d1f]">{a.implementacion.p1Bold}</strong>
                            {a.implementacion.p1Mid}
                            <strong className="font-semibold text-[#1d1d1f]">{a.implementacion.p1Bold2}</strong>
                            {a.implementacion.p1End}
                        </p>
                        <p className="text-base md:text-lg text-[#1d1d1f]/65 font-light leading-relaxed mb-5">
                            {a.implementacion.p2Pre}
                            <strong className="font-semibold text-[#1d1d1f]">{a.implementacion.p2Bold1}</strong>
                            {a.implementacion.p2Mid1}
                            <strong className="font-semibold text-[#1d1d1f]">{a.implementacion.p2Bold2}</strong>
                            {a.implementacion.p2Mid2}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">{a.implementacion.p2Italic}</span>
                            {a.implementacion.p2End}
                        </p>
                        <p className="text-base md:text-lg text-[#1d1d1f]/65 font-light leading-relaxed">
                            {a.implementacion.p3Pre}
                            <em>{a.implementacion.p3Italic}</em>
                            {a.implementacion.p3Mid}
                            <a href={softwareHref} className="font-semibold text-[#1d1d1f] underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity">
                                {a.implementacion.p3LinkText}
                            </a>
                            {a.implementacion.p3End}
                        </p>
                    </div>

                    {/* iPhone Toogo — WhatsApp como asistente */}
                    <motion.div
                        {...reveal}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-5 relative flex justify-center"
                    >
                        <div className="relative w-[240px] md:w-[300px]">
                            <div className="absolute -inset-x-6 -bottom-6 h-10 bg-[#1d1d1f]/15 blur-3xl rounded-full pointer-events-none" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <a href="https://www.toogo.store" target="_blank" rel="noopener noreferrer" className="block transition-transform duration-500 hover:-translate-y-2 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                                <img
                                src="/soluciones/iphone-toogo.png"
                                alt={a.implementacion.imgAlt}
                                width={850}
                                height={1750}
                                className="relative w-full h-auto drop-shadow-2xl"
                                draggable={false}
                            />
                            </a>
                            <div className="absolute top-6 -right-3 md:-right-6 bg-[#25D366] text-white text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                {a.implementacion.badge}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── STATEMENT gigante con scrub de scroll ── */}
            <FraseImpactoIA />

            {/* ── FAQ (con schema FAQPage) ── */}
            <FaqSection
                items={a.faq}
                eyebrow={a.faqEyebrow}
                titleLead={a.faqTitleLead}
                titleAccent={a.faqTitleAccent}
            />

            <Footer />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </main>
    );
}
