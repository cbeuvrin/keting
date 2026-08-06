"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";
import { caseStudyHref } from "@/lib/i18n/routes";
import { TESTIMONIALS } from "@/lib/testimonials";

// Sección de testimonios. Se usa en el home y en /desarrollo-web.
//
// Sustituye a la versión anterior, que traía tres testimonios inventados
// atribuidos a empresas reales (NuRange Coffee, Escapely, Butcher Bird) con
// métricas de resultado que nadie dijo. Venían de una plantilla y se retiraron
// el 2026-08-03, confirmado por Carlos: no eran clientes. Lee de lib/testimonials.ts, que incluye
// también los de proyectos sin página de caso — por eso existe esta sección y no
// basta con los que salen dentro de cada caso.
//
// Los testimonios van SIN TRADUCIR en la versión inglesa, a propósito: son las
// palabras de una persona real, no copy nuestro. Traducirlas sería ponerle en la
// boca algo que no dijo, y un lector inglés entiende perfectamente que un cliente
// mexicano o argentino hable en español — de hecho refuerza que es auténtico.
// Lo que sí se traduce es el marco: eyebrow, titular y el enlace al caso.
export function Testimonials() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const c = t.testimonials;

    if (TESTIMONIALS.length === 0) return null;

    return (
        <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-[#FAFAFA] overflow-hidden">
            {/* Cuadrícula tenue, como el resto del sitio */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <span className="absolute top-[6%] right-[4%] text-[7rem] md:text-[13rem] text-black/[0.04] select-none font-light leading-none rotate-12 pointer-events-none">
                *
            </span>

            <div className="max-w-6xl mx-auto relative">
                <div className="flex items-center gap-3 mb-6">
                    <span className="block w-10 h-px bg-black/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                        {c.eyebrow}
                    </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-14 md:mb-20 text-black max-w-3xl">
                    {c.title}{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                        {c.titleItalic}
                    </span>
                </h2>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
                    {TESTIMONIALS.map((item, i) => (
                        <motion.figure
                            key={item.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="border-l-2 border-black/15 pl-6 md:pl-8"
                        >
                            <blockquote className="text-lg md:text-xl font-[family-name:var(--font-playfair)] italic font-normal leading-snug text-black">
                                &ldquo;{item.text}&rdquo;
                            </blockquote>

                            <figcaption className="mt-6">
                                <span className="block text-sm font-semibold text-black">
                                    {item.name}
                                </span>
                                <span className="block text-sm text-black/55">
                                    {item.role}, {item.company}
                                </span>
                                <span className="block mt-2 text-[10px] uppercase tracking-[0.2em] text-black/35 font-mono">
                                    {item.project}
                                </span>

                                {/* Solo los proyectos con página de caso llevan enlace. El
                                    resto no lo lleva — antes que un destino inventado,
                                    ninguno. */}
                                {item.caseSlug && (
                                    <Link
                                        href={caseStudyHref(item.caseSlug, isEn)}
                                        className="inline-flex items-center gap-2 mt-3 text-[10px] uppercase tracking-[0.2em] text-black/45 hover:text-black transition-colors"
                                    >
                                        <span className="block w-5 h-px bg-black/25" />
                                        {c.readCase}
                                    </Link>
                                )}
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>

                <p className="mt-16 text-sm text-black/45 font-light max-w-2xl">
                    {c.note}
                </p>
            </div>
        </section>
    );
}
