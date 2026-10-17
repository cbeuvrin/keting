"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useLang } from "@/lib/i18n/lang-context";

export default function TextSection() {
    const { t } = useLang();
    const s = t.webPage.textSection;
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
        <section ref={sectionRef} className="relative bg-[#FAFAFA] py-32 md:py-48 px-6 md:px-12 overflow-hidden">
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            {/* Asterisco decorativo */}
            <span className="absolute top-[10%] right-[5%] text-[5rem] sm:text-[8rem] md:text-[14rem] text-black/[0.04] select-none font-light leading-none rotate-12 pointer-events-none">*</span>

            <div className="max-w-7xl mx-auto relative">
                {/* Eyebrow editorial */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 mb-10 md:mb-14"
                >
                    <span className="block w-12 h-px bg-black/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                        {s.eyebrow}
                    </span>
                </motion.div>
                <motion.h2
                    style={{ y, opacity }}
                    className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] tracking-tight text-[#1d1d1f] font-heading text-justify md:text-left"
                >
                    <motion.span style={{ color: sideColor }}>
                        {s.part1Pre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.expertsWord}</span>{s.part1Mid}
                    </motion.span>{" "}
                    <span className="font-normal">{s.part2}</span>{" "}
                    <motion.span style={{ color: sideColor }}>
                        {s.part3Pre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.creativityWord}</span>{s.part3Mid}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{s.technologyWord}</span>{s.part3End}
                    </motion.span>
                </motion.h2>
            </div>
        </section>
    );
}
