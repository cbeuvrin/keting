"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/seo/faq-section";
import { ContactModal } from "@/components/pricing/contact-modal";

// Página de servicio: Automatización de procesos con IA.
// Client component importado normal (NO ssr:false) → todo el texto va en el
// HTML del servidor (crawlable); las animaciones solo se activan al entrar.

const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
} as const;

const PASOS = [
    {
        n: "01",
        t: "Diagnóstico de procesos",
        d: "Mapeamos tu operación y encontramos dónde se va el tiempo: capturas dobles, copiar-pegar entre sistemas, reportes a mano, seguimientos que se olvidan.",
    },
    {
        n: "02",
        t: "Automatización de flujos",
        d: "Conectamos tus herramientas para que la información fluya sola: lo que hoy hace una persona en horas, pasa a ejecutarse en segundos y sin errores.",
    },
    {
        n: "03",
        t: "Agentes de IA",
        d: "Donde el proceso requiere criterio —entender un mensaje, clasificar, redactar, decidir— entra la IA: agentes y chatbots que trabajan 24/7 con supervisión humana.",
    },
    {
        n: "04",
        t: "Integración y medición",
        d: "Todo conectado a tus sistemas reales (ERP, CRM, WhatsApp, hojas de cálculo) y con resultados medibles: horas recuperadas, errores eliminados, respuesta más rápida.",
    },
];

const PROCESOS = [
    "Ventas y cotizaciones",
    "Atención a clientes",
    "Facturación y administración",
    "Reportes y tableros",
    "Inventarios y pedidos",
    "Onboarding y RH",
];

export default function AutomatizacionPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header showLogo forcedTheme="light" />

            {/* ── HERO ── */}
            <section className="relative pt-36 md:pt-44 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />
                <span
                    aria-hidden
                    className="pointer-events-none select-none absolute -top-20 right-[3%] text-[12rem] md:text-[22rem] text-[#1d1d1f]/[0.05] font-light leading-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
                >
                    *
                </span>

                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                            Servicio · Automatización
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] mb-7 text-[#1d1d1f] max-w-5xl">
                        Automatización de procesos{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">con IA</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#1d1d1f]/65 font-light leading-relaxed max-w-2xl mb-9">
                        Tu equipo pierde horas cada semana en tareas repetitivas: capturar datos,
                        responder lo mismo, mover información entre sistemas. Nosotros{" "}
                        <strong className="font-semibold text-[#1d1d1f]">automatizamos esos procesos</strong>{" "}
                        —con flujos, agentes de IA y chatbots conectados a tus herramientas— para que
                        tu gente se dedique a lo que sí necesita criterio humano.
                    </p>

                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors"
                    >
                        Cotiza tu automatización
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                </div>
            </section>

            {/* ── CÓMO TRABAJAMOS (4 pasos) ── */}
            <section className="relative bg-white py-20 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...reveal} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-12 md:mb-16">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                            Qué incluye
                        </span>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
                        {PASOS.map((p, i) => (
                            <motion.div
                                key={p.n}
                                {...reveal}
                                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className="border-t border-[#1d1d1f]/12 pt-6"
                            >
                                <div className="flex items-baseline gap-4 mb-3">
                                    <span className="font-serif italic text-2xl md:text-3xl text-[#1d1d1f]/30">{p.n}</span>
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
                                Dónde aplica
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5 text-white">
                            Procesos que ya{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal">automatizamos</span>
                        </h2>
                        <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md mb-7">
                            Para{" "}
                            <strong className="font-semibold text-white">Gobernia</strong> construimos agentes de IA
                            que analizan un negocio y entregan decisiones accionables cada mes; en{" "}
                            <strong className="font-semibold text-white">Toogo</strong>, un onboarding asistido por IA
                            da de alta tiendas completas sin intervención humana. La misma ingeniería, aplicada a tu operación.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {PROCESOS.map((t) => (
                                <span
                                    key={t}
                                    className="text-[11px] md:text-xs font-medium tracking-wide text-white/70 border border-white/15 rounded-full px-3 py-1.5"
                                >
                                    {t}
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
                        <img
                            src="/soluciones/gobernia-imac.png"
                            alt="Gobernia · Agentes de IA automatizando el análisis de negocio"
                            className="relative w-full h-auto drop-shadow-2xl"
                            draggable={false}
                        />
                        <div className="absolute top-4 right-4 bg-white text-black text-[10px] md:text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                            Agentes IA en producción
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── IMPLEMENTACIÓN DE IA (captura la keyword hermana) ── */}
            <section className="relative py-20 md:py-28 px-6 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[#1d1d1f]/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-[#1d1d1f]/50">
                            Implementación de IA
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-6 text-[#1d1d1f]">
                        Implementación de IA en tu empresa:{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">por dónde empezar</span>
                    </h2>
                    <p className="text-base md:text-lg text-[#1d1d1f]/65 font-light leading-relaxed mb-5">
                        La implementación de inteligencia artificial no empieza comprando herramientas:
                        empieza identificando <strong className="font-semibold text-[#1d1d1f]">un proceso concreto</strong> donde
                        la IA genere un resultado medible — responder clientes más rápido, clasificar y dar
                        seguimiento a pedidos, generar reportes que hoy toman días. Nuestro enfoque es empezar
                        por <strong className="font-semibold text-[#1d1d1f]">el proceso que más duele</strong>, automatizarlo de
                        punta a punta, medir el resultado, y de ahí escalar al siguiente.
                    </p>
                    <p className="text-base md:text-lg text-[#1d1d1f]/65 font-light leading-relaxed">
                        Como estudio que integra IA en el núcleo de sus productos —no como complemento—,
                        cuidamos lo que la mayoría descuida: que el agente tenga acceso <em>solo</em> a lo
                        que debe, que haya supervisión humana donde importa, y que todo quede conectado a
                        tus sistemas reales. Si tu proyecto necesita ir más allá —una plataforma o un
                        sistema completo— eso vive en{" "}
                        <a href="/desarrollo-de-software" className="font-semibold text-[#1d1d1f] underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity">
                            desarrollo de software a medida
                        </a>.
                    </p>
                </div>
            </section>

            {/* ── FAQ (con schema FAQPage) ── */}
            <FaqSection
                items={[
                    { q: "¿Qué procesos de mi empresa se pueden automatizar?", a: "Los más comunes: ventas y cotizaciones, atención a clientes (WhatsApp/correo), facturación y tareas administrativas, generación de reportes, inventarios y pedidos, y onboarding de clientes o personal. La regla práctica: si es repetitivo y sigue pasos definidos, casi seguro se puede automatizar." },
                    { q: "¿Automatización con IA o sin IA? ¿Cuál necesito?", a: "Si el proceso sigue reglas fijas (cuando pasa A, haz B), basta un flujo automatizado tradicional. Si requiere criterio —entender un mensaje, clasificar, redactar una respuesta, decidir— entra la IA con agentes. En la práctica, la mayoría de los proyectos combinan ambos, y en el diagnóstico te decimos honestamente qué necesita cada proceso." },
                    { q: "¿Qué es la implementación de IA en una empresa?", a: "Es integrar inteligencia artificial a la operación real del negocio: agentes que atienden y clasifican, análisis automático de información y generación de documentos o reportes — conectados a tus sistemas y con supervisión humana. No es comprar una herramienta: es rediseñar un proceso para que la IA trabaje dentro de él." },
                    { q: "¿Cuánto cuesta automatizar un proceso?", a: "Depende del proceso y las integraciones. Como referencia, automatizar un proceso concreto es una inversión considerablemente menor que un desarrollo completo (un sistema interno a medida arranca desde $100,000 MXN). Tras un diagnóstico corto te damos alcance y precio fijo, sin sorpresas." },
                    { q: "¿Se integra con los sistemas que ya uso?", a: "Sí — ese es el punto. Conectamos con tu ERP, CRM, WhatsApp Business, correo, hojas de cálculo y sistemas internos vía APIs. La automatización trabaja sobre tus herramientas actuales, no te obliga a cambiarlas." },
                    { q: "¿Cuánto tarda en estar funcionando?", a: "Un proceso acotado suele automatizarse en semanas, no meses. Trabajamos por fases: primero el proceso de mayor impacto, medimos el resultado, y de ahí escalamos al siguiente." },
                ]}
            />

            <Footer />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </main>
    );
}
