"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const logos = [
    { src: "/logos-clientes/2.png", alt: "Nike Strength" },
    { src: "/logos-clientes/3.png", alt: "DiDi" },
    { src: "/logos-clientes/1.png", alt: "Suzuki" },
    { src: "/logos-clientes/6.png", alt: "WSO" },
    { src: "/logos-clientes/4.png", alt: "Iudex" },
    { src: "/logos-clientes/7.png", alt: "Toogo" },
    { src: "/logos-clientes/9.png", alt: "Ivan Ivanovich" },
    { src: "/logos-clientes/10.png", alt: "Uhthoff 1905" },
    { src: "/logos-clientes/11.png", alt: "360 Protective" },
    { src: "/logos-clientes/12.png", alt: "Blindajes" },
];

export function BrandsConstellation() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    // Asteriscos giratorios
    const rotateA = useTransform(smooth, [0, 1], [0, 540]);
    const rotateB = useTransform(smooth, [0, 1], [0, -720]);

    return (
        <section
            ref={ref}
            className="relative bg-[#0a0a0a] text-white pt-20 md:pt-24 pb-20 md:pb-24 overflow-clip snap-start"
        >
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Asteriscos */}
            <motion.span
                style={{ rotate: rotateA }}
                className="absolute top-[8%] left-[3%] text-[6rem] sm:text-[10rem] md:text-[18rem] text-white/[0.05] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>
            <motion.span
                style={{ rotate: rotateB }}
                className="absolute bottom-[10%] right-[5%] text-[5rem] sm:text-[8rem] md:text-[14rem] text-white/[0.05] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-10 md:mb-14 relative">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 mb-6 md:mb-8"
                >
                    <span className="block w-12 h-px bg-white/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/60 font-sans">
                        Algunos de los nuestros
                    </span>
                </motion.div>

                {/* Título — mismo tamaño que las otras secciones del home */}
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white font-heading">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                    >
                        Construido para{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">marcas</span>
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                    >
                        que cambian su{" "}
                        <span className="relative inline-block">
                            industria
                            <motion.span
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute -bottom-1 left-0 right-0 h-[2px] md:h-[3px] bg-white origin-left"
                            />
                        </span>
                        <span className="inline-block ml-2 md:ml-3 text-2xl md:text-4xl align-top rotate-12 text-white/30">*</span>
                    </motion.span>
                </h2>
            </div>

            {/* Mundo 3D con marcas orbitando */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
                <Globe3D />
            </div>

            {/* Footer line + counter */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-12 md:mt-16 relative">
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-white/20 w-full origin-left mb-6"
                />
                <div className="flex items-center justify-between text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 font-mono">
                    <span>10+ marcas</span>
                    <span>8 industrias</span>
                    <span>2020 — 2026</span>
                </div>
            </div>
        </section>
    );
}

/**
 * Mundo 3D estilizado con los logos orbitando uniformemente en su ecuador.
 * Implementado con CSS 3D transforms — performante y sin librerías externas.
 */
function Globe3D() {
    return (
        <div className="globe-scene relative w-full flex items-center justify-center py-8 md:py-12">
            {/* Estrellas de fondo decorativas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => {
                    const top = (i * 53) % 100;
                    const left = (i * 67) % 100;
                    const size = (i % 3) + 1;
                    const opacity = ((i % 5) + 2) * 0.05;
                    return (
                        <span
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                top: `${top}%`,
                                left: `${left}%`,
                                width: `${size}px`,
                                height: `${size}px`,
                                opacity,
                            }}
                        />
                    );
                })}
            </div>

            {/* Escena 3D */}
            <div
                className="relative w-full h-[420px] md:h-[560px] flex items-center justify-center"
                style={{ perspective: "1400px" }}
            >
                {/* Eje rotador (preserve-3d) */}
                <div
                    className="relative"
                    style={{
                        transformStyle: "preserve-3d",
                        animation: "globe-spin 28s linear infinite",
                        transform: "rotateX(-12deg)",
                    }}
                >
                    {/* Globo central */}
                    <div className="globe-sphere" />

                    {/* Anillo ecuatorial sutil */}
                    <div className="globe-ring" />

                    {/* Logos orbitando uniformemente */}
                    {logos.map((logo, i) => {
                        const angle = (360 / logos.length) * i;
                        return (
                            <div
                                key={i}
                                className="globe-logo"
                                style={{
                                    transform: `rotateY(${angle}deg) translateZ(var(--orbit-radius))`,
                                }}
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="max-w-[80%] max-h-[80%] object-contain"
                                    style={{ filter: "invert(1)" }}
                                    draggable={false}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Halo radial bajo el globo */}
                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[60%] h-12 bg-white/10 blur-3xl rounded-full pointer-events-none" />
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes globe-spin {
                    from { transform: rotateX(-12deg) rotateY(0deg); }
                    to { transform: rotateX(-12deg) rotateY(360deg); }
                }
                .globe-sphere {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: var(--globe-size);
                    height: var(--globe-size);
                    margin-top: calc(var(--globe-size) / -2);
                    margin-left: calc(var(--globe-size) / -2);
                    border-radius: 50%;
                    background:
                        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 70%, rgba(255,255,255,0.04) 0%, transparent 60%),
                        linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #050505 100%);
                    box-shadow:
                        inset -20px -20px 60px rgba(0,0,0,0.6),
                        inset 20px 20px 40px rgba(255,255,255,0.05),
                        0 0 80px rgba(255,255,255,0.08);
                    transform: translateZ(0);
                }
                .globe-sphere::before,
                .globe-sphere::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.06);
                }
                .globe-sphere::after {
                    inset: 12%;
                    border: 1px solid rgba(255,255,255,0.04);
                }
                .globe-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: calc(var(--orbit-radius) * 2 + 24px);
                    height: calc(var(--orbit-radius) * 2 + 24px);
                    margin-top: calc((var(--orbit-radius) * 2 + 24px) / -2);
                    margin-left: calc((var(--orbit-radius) * 2 + 24px) / -2);
                    border-radius: 50%;
                    border: 1px dashed rgba(255,255,255,0.08);
                    transform: rotateX(90deg);
                    pointer-events: none;
                }
                .globe-logo {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: var(--logo-size);
                    height: var(--logo-size);
                    margin-top: calc(var(--logo-size) / -2);
                    margin-left: calc(var(--logo-size) / -2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform-style: preserve-3d;
                    backface-visibility: hidden;
                }
                /* Variables scopeadas al componente */
                .globe-scene {
                    --globe-size: 140px;
                    --orbit-radius: 130px;
                    --logo-size: 96px;
                }
                @media (min-width: 768px) {
                    .globe-scene {
                        --globe-size: 220px;
                        --orbit-radius: 220px;
                        --logo-size: 140px;
                    }
                }
            `,
                }}
            />
        </div>
    );
}
