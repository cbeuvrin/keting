"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLang } from "@/lib/i18n/lang-context";

export default function ZoomSection() {
    const { t } = useLang();
    const z = t.webPage.zoom;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.6 });

    // Imagen entra desde la derecha, ligeramente rotada, y se asienta al centro
    const x = useTransform(smooth, [0, 0.55], ["28%", "0%"]);
    const rotate = useTransform(smooth, [0, 0.55], [6, 0]);
    const scale = useTransform(smooth, [0, 0.55, 1], [0.9, 1, 1.05]);
    const opacity = useTransform(smooth, [0, 0.2, 0.9, 1], [0, 1, 1, 0.95]);

    // Asterisco giratorio en armonía con soluciones-digitales
    const rotateAst = useTransform(smooth, [0, 1], [0, 540]);

    return (
        <section
            ref={ref}
            className="relative bg-[#FAFAFA] overflow-clip py-24 md:py-44"
        >
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Asterisco gigante girando */}
            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[10%] left-[3%] text-[6rem] sm:text-[10rem] md:text-[18rem] text-black/[0.05] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="container mx-auto px-6 md:px-12 relative">

                {/* Eyebrow editorial */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 mb-10 md:mb-16"
                >
                    <span className="block w-12 h-px bg-black/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                        {z.eyebrow}
                    </span>
                </motion.div>

                {/* Imagen responsive con entrada scroll-driven */}
                <motion.div
                    style={{ x, rotate, scale, opacity }}
                    className="relative w-full flex items-center justify-center"
                >
                    {/* Glow / sombra de apoyo */}
                    <div className="absolute inset-x-0 -bottom-8 h-12 bg-black/10 blur-3xl rounded-full pointer-events-none" />

                    {/* Mobile: iPhone */}
                    <img
                        src="/iphone-web.png"
                        alt={z.altMobile}
                        className="md:hidden relative w-auto max-w-[70%] h-auto drop-shadow-2xl"
                        draggable={false}
                    />

                    {/* Desktop: Pantalla */}
                    <a href="https://www.toogo.store" target="_blank" rel="noopener noreferrer" className="block transition-transform duration-500 hover:-translate-y-2 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                        <img
                        src="/pantalla-web.png"
                        alt={z.altDesktop}
                        className="hidden md:block relative w-full max-w-5xl h-auto drop-shadow-2xl"
                        draggable={false}
                    />
                    </a>

                    {/* Etiqueta LIVE flotante */}
                    <div className="absolute top-2 right-2 md:top-6 md:right-6 bg-black text-white text-[9px] md:text-xs font-mono uppercase tracking-widest px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                        {z.badge}
                    </div>
                </motion.div>

                {/* Caption inferior — etiqueta editorial */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-10 md:mt-16 flex items-center justify-center gap-3 text-[10px] md:text-xs uppercase tracking-[0.3em] text-black/50 font-mono"
                >
                    <span className="block w-8 h-px bg-black/30" />
                    {z.caption}
                    <span className="block w-8 h-px bg-black/30" />
                </motion.div>
            </div>
        </section>
    );
}
