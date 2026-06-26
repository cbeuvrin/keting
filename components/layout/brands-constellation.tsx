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

// Mezclamos para que cada fila tenga orden distinto
const rowA = [...logos, ...logos];
const rowB = [...logos.slice(3), ...logos.slice(0, 3), ...logos.slice(3), ...logos.slice(0, 3)];
const rowC = [...logos.slice(6), ...logos.slice(0, 6), ...logos.slice(6), ...logos.slice(0, 6)];

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

            {/* Triple marquee — 3 filas, direcciones alternadas, distintas velocidades */}
            <div className="space-y-0 relative -my-2 md:-my-3">
                <MarqueeRow logos={rowA} direction={-1} duration={50} size="md" />
                <MarqueeRow logos={rowB} direction={1} duration={70} size="lg" />
                <MarqueeRow logos={rowC} direction={-1} duration={60} size="sm" />

                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10" />
            </div>

            {/* Footer line + counter */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-16 md:mt-24 relative">
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

function MarqueeRow({
    logos,
    direction,
    duration,
    size,
}: {
    logos: { src: string; alt: string }[];
    direction: 1 | -1;
    duration: number;
    size: "sm" | "md" | "lg";
}) {
    const heights = {
        sm: "h-14 sm:h-20 md:h-28",
        md: "h-16 sm:h-24 md:h-36",
        lg: "h-20 sm:h-28 md:h-44",
    };
    const widths = {
        sm: "w-32 sm:w-44 md:w-64",
        md: "w-36 sm:w-52 md:w-80",
        lg: "w-44 sm:w-64 md:w-96",
    };

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex gap-2 md:gap-4 w-max"
                animate={{ x: direction === -1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {logos.map((logo, i) => (
                    <div
                        key={i}
                        className={`flex items-center justify-center flex-shrink-0 ${heights[size]} ${widths[size]}`}
                    >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            width={300}
                            height={300}
                            className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-500"
                            style={{ filter: "invert(1)" }}
                            draggable={false}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
