"use client";

import { motion } from "framer-motion";

const logos = [
    { src: "/logos-clientes/2.png", alt: "Nike Strength" },
    { src: "/logos-clientes/3.png", alt: "DiDi" },
    { src: "/logos-clientes/1.png", alt: "Suzuki" },
    { src: "/logos-clientes/6.png", alt: "WSO" },
    { src: "/logos-clientes/4.png", alt: "Iudex" },
    { src: "/logos-clientes/7.png", alt: "Toogo" },
    { src: "/logos-clientes/9.png", alt: "Ivan Ivanovich" },
    { src: "/logos-clientes/10.png", alt: "Uhthoff" },
    { src: "/logos-clientes/11.png", alt: "360 Protective" },
    { src: "/logos-clientes/12.png", alt: "Blindajes" },
];

// Duplicamos para loop infinito sin cortes
const strip = [...logos, ...logos];

export function ClientsStrip() {
    return (
        <section className="relative py-16 md:py-20 overflow-hidden snap-start">
            {/* Eyebrow editorial */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-8 md:mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3"
                >
                    <span className="block w-12 h-px bg-black/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                        Marcas que confían en nosotros
                    </span>
                </motion.div>
            </div>

            {/* Marquee infinito */}
            <div className="relative">
                <motion.div
                    className="flex gap-1 md:gap-2 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 45,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {strip.map((logo, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center flex-shrink-0 h-16 md:h-24 w-40 md:w-56"
                        >
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-500"
                                draggable={false}
                            />
                        </div>
                    ))}
                </motion.div>

                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
