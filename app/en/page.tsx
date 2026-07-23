"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/seo/faq-section";
import { ContactModal } from "@/components/pricing/contact-modal";

// English landing (/en) — real, indexable page for the nearshore (US/LATAM)
// market. NOT the ES→EN toggle: this is a dedicated English page with its own
// hreflang. Client component imported normally → all text is server-rendered.

const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
} as const;

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

const SERVICES = [
    { n: "01", t: "Custom software & platforms", d: "SaaS platforms, internal systems and system integrations — built from scratch for how your business actually works." },
    { n: "02", t: "Web & e-commerce", d: "High-performance websites, web apps and online stores with Next.js/React, technical SEO and real speed." },
    { n: "03", t: "Mobile apps", d: "iOS and Android apps, from MVP to production, with the same engineering standard." },
    { n: "04", t: "AI automation", d: "Workflows, AI agents and WhatsApp assistants connected to your systems — so operations run on their own." },
];

const CASES = [
    { name: "Iudex", desc: "Legal AI platform with real juridical criterion", metric: "100k+ sessions/mo" },
    { name: "Gobernia", desc: "Multi-agent AI board for corporate decisions", metric: "AI agents in production" },
    { name: "Toogo", desc: "No-code e-commerce SaaS, WhatsApp-native onboarding", metric: "100+ stores" },
    { name: "Ivan Ivanovich", desc: "Custom LMS, multi-language, live courses", metric: "5,000+ students" },
];

export default function EnglishPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const rotateA = useTransform(smooth, [0, 1], [0, 540]);
    const rotateB = useTransform(smooth, [0, 1], [0, -720]);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header showLogo forcedTheme="light" />

            {/* ── HERO ── */}
            <section ref={heroRef} className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 lg:px-24 overflow-clip">
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />
                <motion.span style={{ rotate: rotateA }} className="absolute top-[12%] left-[4%] text-[10rem] md:text-[18rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none">*</motion.span>
                <motion.span style={{ rotate: rotateB }} className="absolute bottom-[10%] right-[5%] text-[8rem] md:text-[14rem] text-[#1d1d1f]/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none">*</motion.span>

                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center justify-between mb-16 md:mb-24">
                        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3">
                            <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                            <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60 font-sans">Nearshore · Mexico City</span>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                            <span className="font-serif italic text-2xl md:text-3xl text-white">EN</span>
                        </motion.div>
                    </div>

                    <h1 className="uppercase leading-[0.95] tracking-tight text-[#1d1d1f] max-w-6xl">
                        <RiseText delay={0}>
                            <span className="block text-5xl md:text-8xl lg:text-9xl font-light">Custom software,</span>
                        </RiseText>
                        <RiseText delay={0.12}>
                            <span className="block text-5xl md:text-8xl lg:text-9xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 md:mt-3 tracking-tight">web &amp; apps</span>
                        </RiseText>
                        <RiseText delay={0.24}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-light mt-2 md:mt-3">
                                built in{" "}
                                <span className="relative inline-block font-normal">
                                    Mexico
                                    <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }} className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-[#1d1d1f] origin-left" />
                                </span>
                                <span>.</span>
                            </span>
                        </RiseText>
                    </h1>

                    <RiseText delay={0.15}>
                        <p className="text-base md:text-lg lg:text-xl text-[#1d1d1f]/75 font-light leading-relaxed max-w-2xl mt-10 md:mt-12">
                            Keting Media is a{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]">custom software development</span>{" "}
                            studio in Mexico City. We design and build digital products end-to-end —
                            software, web, apps and AI automation — combining engineering, product design
                            and applied AI in one team. <strong className="font-semibold text-[#1d1d1f]">No templates.</strong>
                        </p>
                    </RiseText>

                    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mt-10 md:mt-12 flex flex-wrap items-center gap-4">
                        <button onClick={() => setIsContactOpen(true)} className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors">
                            Start a project
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                        <Link href="/" className="text-sm font-medium text-[#1d1d1f]/50 hover:text-[#1d1d1f] transition-colors">Ver en español →</Link>
                    </motion.div>
                </div>
            </section>

            {/* ── WHY NEARSHORE ── */}
            <section className="relative bg-white py-20 md:py-28 px-6 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">Why nearshore</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-6 text-[#1d1d1f]">
                        US quality, same timezone,{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">without the US price tag</span>
                    </h2>
                    <p className="text-base md:text-lg text-[#1d1d1f]/65 font-light leading-relaxed">
                        We work from Mexico City — overlapping business hours with the entire US, real-time
                        communication in English, and senior engineering at a fraction of the cost of a
                        stateside agency. You get a partner that ships production software, not an offshore
                        team you never talk to. <strong className="font-semibold text-[#1d1d1f]">80%+ of our work comes from referrals.</strong>
                    </p>
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section className="relative bg-white py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
                <span aria-hidden className="pointer-events-none select-none absolute -top-16 right-[2%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.05] font-light leading-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none">*</span>
                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-12 md:mb-16">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">What we build</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
                        {SERVICES.map((s, i) => (
                            <motion.div key={s.n} {...reveal} transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} className="border-t border-[#1d1d1f]/12 pt-6">
                                <div className="flex items-baseline gap-4 mb-3">
                                    <span className="font-serif italic text-2xl md:text-3xl text-[#1d1d1f]/30">{s.n}</span>
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#1d1d1f]">{s.t}</h3>
                                </div>
                                <p className="text-base text-[#1d1d1f]/60 font-light leading-relaxed">{s.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SELECTED WORK ── */}
            <section className="relative bg-[#0A0A0A] text-white py-20 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-12 md:mb-16">
                        <span className="block w-10 h-px bg-white/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/50">Selected work</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
                        {CASES.map((c, i) => (
                            <motion.div key={c.name} {...reveal} transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} className="border-t border-white/15 pt-6 flex items-start justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">{c.name}</h3>
                                    <p className="text-sm md:text-base text-white/55 font-light leading-relaxed max-w-sm">{c.desc}</p>
                                </div>
                                <span className="flex-shrink-0 text-[10px] md:text-xs font-mono uppercase tracking-widest text-white bg-white/10 rounded-full px-3 py-1.5">{c.metric}</span>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-12">
                        <Link href="/portafolio" className="group inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                            See full portfolio
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <FaqSection
                eyebrow="FAQ"
                titleLead="Frequently asked"
                titleAccent="questions"
                items={[
                    { q: "Where is Keting Media based?", a: "In Mexico City. We work nearshore for companies across the US and LATAM, with full business-hours overlap and communication in English." },
                    { q: "What do you build?", a: "Custom software and SaaS platforms, web and e-commerce, mobile apps, internal systems, and AI automation (agents, workflows, WhatsApp assistants). We build end-to-end — no templates." },
                    { q: "How much does a project cost?", a: "It depends on scope. As a reference, a custom web project starts around USD 700–4,000; e-commerce and internal systems are higher; apps and platforms are quoted per scope after a short discovery. You always own the code." },
                    { q: "Do you use AI in your work?", a: "Yes — we integrate AI both into the products we build and into our own process, which lets us ship faster. But engineering leads: architecture, security and code that scales." },
                    { q: "Do we own the source code?", a: "Always. Intellectual property of the code is yours by contract. No lock-in." },
                    { q: "How do we start?", a: "Book a short discovery call. We map your goals, define scope and phases, and give you a fixed proposal — no surprises." },
                ]}
            />

            <Footer />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </main>
    );
}
