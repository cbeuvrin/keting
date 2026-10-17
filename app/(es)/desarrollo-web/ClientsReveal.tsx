"use client";

import { motion } from "framer-motion";

// 6 logos seleccionados: Nike, DiDi, Suzuki, WSO, Iudex, Toogo
const selected = [
    { src: "/logos-clientes/2.png", alt: "Nike" },
    { src: "/logos-clientes/3.png", alt: "DiDi" },
    { src: "/logos-clientes/1.png", alt: "Suzuki" },
    { src: "/logos-clientes/6.png", alt: "WSO" },
    { src: "/logos-clientes/4.png", alt: "Iudex" },
    { src: "/logos-clientes/7.png", alt: "Toogo" },
];

export default function ClientsReveal() {
    return (
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3">
            {selected.map((logo, i) => (
                <motion.div
                    key={logo.alt}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{
                        duration: 0.7,
                        delay: i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center justify-center h-24 md:h-32"
                >
                    <img
                        src={logo.src}
                        alt={logo.alt}
                        className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-500"
                        draggable={false}
                    />
                </motion.div>
            ))}
        </div>
    );
}
