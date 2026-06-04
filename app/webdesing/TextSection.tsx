"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function TextSection() {
    const sectionRef = useRef<HTMLElement>(null);

    // Scroll-linked parallax: la sección reacciona durante TODO su paso por el viewport.
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    // Parallax sutil: la frase sube continuamente conforme avanza el scroll
    const y = useTransform(smooth, [0, 1], [80, -80]);
    // Fade-in al entrar y fade-out al salir
    const opacity = useTransform(smooth, [0, 0.25, 0.75, 1], [0, 1, 1, 0.4]);

    // Color: arranca negro al entrar y llega a gris justo cuando la frase queda centrada para leer
    const sideColor = useTransform(
        smooth,
        [0.15, 0.45],
        ["rgba(29, 29, 31, 1)", "rgba(29, 29, 31, 0.22)"]
    );

    return (
        <section ref={sectionRef} className="bg-[#FAFAFA] py-32 md:py-48 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    style={{ y, opacity }}
                    className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] tracking-tight text-[#1d1d1f] font-heading"
                >
                    <motion.span style={{ color: sideColor }}>
                        Como agencia digital experta en creación de sitios web,
                    </motion.span>{" "}
                    <span className="font-normal">Keting le ofrece servicios a medida para potenciar su presencia online.</span>{" "}
                    <motion.span style={{ color: sideColor }}>
                        Combinamos creatividad, pensamiento estratégico y tecnología para crear soluciones personalizadas que contribuirán a su éxito.
                    </motion.span>
                </motion.h2>
            </div>
        </section>
    );
}
