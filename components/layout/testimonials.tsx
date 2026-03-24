"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { useRef } from "react";

const testimonials = [
    {
        stat: "4x",
        subtitle: "CRECIMIENTO INTERANUAL",
        quote: "\"El salto de calidad con la web 3D fue el catalizador que necesitábamos. El reconocimiento de la marca se ha disparado; no solo vimos un aumento del 600% en el engagement de redes sociales, sino que logramos entrar en los estantes de los principales distribuidores nacionales en tiempo récord. La web se ve increíble y proyecta una solidez tal que, en las reuniones de ventas, los compradores ya vienen convencidos. No podríamos estar más emocionados con el resultado\"",
        name: "CARLOS R.",
        role: "Co-Fundador & Presidente, NuRange Coffee",
        tags: ["Diseño Web"]
    },
    {
        stat: "7x",
        subtitle: "EXPANSIÓN DE PRODUCTO",
        quote: "\"Nuestro concepto ha tenido una adopción masiva, impulsada en gran medida por una experiencia web inmersiva, audaz y llamativa que nos hizo reconocibles al instante en un mercado saturado. Más allá de lo visual, el sistema de marca integrado nos ha permitido escalar con una agilidad increíble hacia nuevas audiencias. La navegación es tan fluida que el usuario se sumerge en nuestra propuesta de valor sin fricciones. Estamos extremadamente contentos con el resultado\"",
        name: "RAQUEL S.",
        role: "Fundadora & Propietaria, Escapely",
        tags: ["UX/UI", "Diseño Web"]
    },
    {
        stat: "10x",
        subtitle: "LEADS CUALIFICADOS",
        quote: "\"El lanzamiento de nuestra nueva landing page marcó un antes y un después en nuestra estrategia comercial. Pasamos de tener visitas pasivas a generar leads de alta calidad de forma constante. No se trata solo de que el diseño sea impactante y moderno, es que la estructura está tan bien optimizada que la conversión de nuevos clientes se duplicó en el primer mes. Ha sido la herramienta clave para que el mercado entienda nuestro valor real y el crecimiento ha sido inmediato\"",
        name: "ESTEBAN C.",
        role: "Socio & Director, Butcher Bird",
        tags: ["Landing", "Web e Interactivo", "Estrategia"]
    }
];

export function Testimonials() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="relative z-20 py-32 bg-[#FAFAFA] text-[#111111] overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-heading text-[#111]">
                        ¿Y qué dicen nuestros clientes?
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl font-light">
                        Resultados reales para marcas reales.
                    </p>
                </motion.div>

                <div className="flex flex-col">
                    {testimonials.map((item, index) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const yStat = useTransform(scrollYProgress, [0, 1], [40 + index * 20, -40 - index * 20], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const yQuote = useTransform(scrollYProgress, [0, 1], [20 + index * 10, -20 - index * 10], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                                className={`py-12 flex flex-col md:flex-row gap-8 md:gap-16 border-t border-dashed border-[#d5d5d5] ${index === testimonials.length - 1 ? 'border-b' : ''}`}
                            >
                                {/* Stat Column */}
                                <motion.div
                                    style={{ y: yStat }}
                                    className="md:w-1/4 flex flex-col md:items-start items-center text-center md:text-left pt-2"
                                >
                                    <span className="text-[5rem] md:text-[6.5rem] font-bold tracking-tighter leading-[0.8] mb-4 text-[#111]">
                                        {item.stat}
                                    </span>
                                    <span className="text-[10px] md:text-[11px] text-[#666] uppercase tracking-[0.2em] font-mono font-medium">
                                        {item.subtitle}
                                    </span>
                                </motion.div>

                                {/* Quote Column */}
                                <motion.div
                                    style={{ y: yQuote }}
                                    className="md:w-1/2 flex items-start pt-4"
                                >
                                    <p className="text-lg md:text-[1.125rem] leading-[1.8] text-[#333] font-medium tracking-tight italic">
                                        {item.quote}
                                    </p>
                                </motion.div>

                                {/* Client Info Column */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.3 }}
                                    className="md:w-1/4 flex flex-col md:items-start justify-start pt-4"
                                >
                                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1 text-[#111]">{item.name}</h4>
                                    <p className="text-[13px] text-[#888] mb-6 font-light">{item.role}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="text-[10px] md:text-[11px] px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.15)] text-[#555] uppercase font-mono tracking-wider bg-white/50"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

