"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

// PNG = silueta negra (default), JPG = color original (hover, con mix-blend multiply para ocultar el fondo blanco)
const clients = [
    { png: "/logos-clientes/1.png", jpg: "/logos-clientes/1.jpg", name: "Suzuki" },
    { png: "/logos-clientes/2.png", jpg: "/logos-clientes/2.jpg", name: "Nike Strength" },
    { png: "/logos-clientes/3.png", jpg: "/logos-clientes/3.jpg", name: "DiDi" },
    { png: "/logos-clientes/6.png", jpg: "/logos-clientes/6.jpg", name: "WSO" },
    { png: "/logos-clientes/4.png", jpg: "/logos-clientes/4.jpg", name: "Iudex" },
    { png: "/logos-clientes/7.png", jpg: "/logos-clientes/7.jpg", name: "Toogo" },
    { png: "/logos-clientes/5.png", jpg: "/logos-clientes/5.jpg", name: "Happtek" },
    { png: "/logos-clientes/9.png", jpg: "/logos-clientes/9.jpg", name: "Ivan Ivanovich" },
    { png: "/logos-clientes/10.png", jpg: "/logos-clientes/10.jpg", name: "Uhthoff 1905" },
    { png: "/logos-clientes/11.png", jpg: "/logos-clientes/11.jpg", name: "360 Protective Solutions" },
    { png: "/logos-clientes/12.png", jpg: "/logos-clientes/12.jpg", name: "Blindajes Armored" },
];

function ClientCard({ png, jpg, name, index }: { png: string; jpg: string; name: string; index: number }) {
    // Texto repetido alrededor del círculo
    const label = `${String(index + 1).padStart(2, "0")} / ${name.toUpperCase()}`;
    const circularText = `${label}  •  ${label}  •  ${label}  •  `;

    return (
        <div className="relative flex-shrink-0 w-40 h-40 md:w-56 md:h-56 snap-start flex items-center justify-center group">
            {/* Texto circular alrededor — desaparece en hover */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_30s_linear_infinite] transition-opacity duration-500 group-hover:opacity-0"
                viewBox="0 0 100 100"
            >
                <defs>
                    <path
                        id={`circle-path-${index}`}
                        d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                        fill="none"
                    />
                </defs>
                <text
                    className="fill-[#1d1d1f]/60 font-medium uppercase"
                    style={{ fontSize: "3px", letterSpacing: "1px" }}
                >
                    <textPath href={`#circle-path-${index}`} startOffset="0">
                        {circularText}
                    </textPath>
                </text>
            </svg>

            {/* Fondo blanco circular — desaparece en hover */}
            <div className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-white transition-opacity duration-500 ease-out group-hover:opacity-0" />

            {/* PNG silueta negra (default) — sale del círculo en hover */}
            <img
                src={png}
                alt={name}
                className="absolute max-w-[55%] max-h-[55%] object-contain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0 group-hover:scale-[2.4]"
                draggable={false}
            />

            {/* JPG color (hover) — crece fuera del círculo */}
            <img
                src={jpg}
                alt=""
                aria-hidden
                className="absolute max-w-[55%] max-h-[55%] object-contain opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-[2.4]"
                style={{ mixBlendMode: "multiply" }}
                draggable={false}
            />
        </div>
    );
}

export default function ClientsShowcase() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollBy = (direction: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        // Avanza ~una card a la vez
        const isMobile = window.innerWidth < 768;
        const cardWidth = isMobile ? 288 : 384; // w-72 / w-96
        const gap = isMobile ? 20 : 24; // gap-5 / gap-6
        el.scrollBy({ left: (cardWidth + gap) * direction, behavior: "smooth" });
    };

    return (
        <section className="bg-[#F5F5F7] text-[#111] pt-16 md:pt-20 pb-16 md:pb-20 overflow-hidden">
            {/* Línea divisoria superior */}
            <div className="container mx-auto px-6 md:px-12 mb-8 md:mb-10">
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-black/10 w-full origin-left"
                />
            </div>

            {/* Header alineado a la derecha */}
            <div className="container mx-auto px-6 md:px-12 mb-8 md:mb-10 flex justify-end">
                <div className="text-right">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-5xl font-normal tracking-tight mb-4 font-heading text-[#111]"
                    >
                        Marcas que confían en nosotros
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="text-gray-500 text-lg md:text-xl font-light mb-6"
                    >
                        Cada colaboración, una historia que escala.
                    </motion.p>

                    {/* Flechas navegación */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => scrollBy(-1)}
                            aria-label="Anterior"
                            className="w-12 h-12 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollBy(1)}
                            aria-label="Siguiente"
                            className="w-12 h-12 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Cards horizontal scroll — empiezan más a la derecha */}
            <div
                ref={scrollRef}
                className="overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <div className="flex gap-5 md:gap-6 pl-[35vw] md:pl-[30vw] pr-6 md:pr-12 snap-x snap-mandatory w-max">
                    {clients.map((c, i) => (
                        <ClientCard key={c.name} {...c} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
