"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const logos = Array.from({ length: 12 }, (_, i) => `/logos-clientes/${i + 1}.jpg`);

export default function TVLogos() {
    const [index, setIndex] = useState(0);
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        let mounted = true;
        const cycle = () => {
            if (!mounted) return;
            setGlitch(true);
            setTimeout(() => {
                if (!mounted) return;
                setIndex((prev) => (prev + 1) % logos.length);
                setTimeout(() => mounted && setGlitch(false), 140);
            }, 110);
        };
        const interval = setInterval(cycle, 1500);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    // Filtros para limpiar el JPG: convertimos a silueta monocroma sin marco blanco.
    // invert(1) → fondo blanco se vuelve oscuro (se mezcla con el hero), logo oscuro se vuelve claro.
    // El logo queda visible sin necesidad de tarjeta blanca.
    const logoFilter = "invert(1) brightness(1.1) contrast(1.2)";

    return (
        <div className="relative w-[min(80vw,640px)] h-[min(60vw,440px)] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.98, filter: "blur(3px)" }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {/* Capa principal */}
                    <img
                        src={logos[index]}
                        alt={`Cliente ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                        style={{
                            filter: logoFilter,
                            mixBlendMode: "screen",
                        }}
                        draggable={false}
                    />

                    {/* Capa RGB split (efecto de aberración cromática constante) */}
                    <img
                        src={logos[index]}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 m-auto max-w-full max-h-full object-contain pointer-events-none"
                        style={{
                            filter: logoFilter,
                            mixBlendMode: "screen",
                            transform: "translateX(-2px)",
                            opacity: 0.5,
                            // tint rojo via CSS si fuese SVG; usamos opacity para no recortar
                        }}
                        draggable={false}
                    />
                    <img
                        src={logos[index]}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 m-auto max-w-full max-h-full object-contain pointer-events-none"
                        style={{
                            filter: logoFilter,
                            mixBlendMode: "screen",
                            transform: "translateX(2px)",
                            opacity: 0.5,
                        }}
                        draggable={false}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Capas de distorsión que aparecen en cada cambio */}
            <AnimatePresence>
                {glitch && (
                    <>
                        {/* RGB split fuerte */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.08 }}
                            className="absolute inset-0 pointer-events-none mix-blend-screen"
                            style={{
                                background: "linear-gradient(90deg, rgba(255,30,80,0.5), transparent 45%, transparent 55%, rgba(0,200,255,0.5))",
                            }}
                        />

                        {/* Slices horizontales (clip-path) */}
                        <motion.img
                            src={logos[index]}
                            alt=""
                            aria-hidden
                            initial={{ x: -12, opacity: 0.9 }}
                            animate={{ x: [-12, 8, -4, 6, 0], opacity: [0.9, 0.7, 0.9, 0.6, 0] }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 m-auto max-w-full max-h-full object-contain pointer-events-none"
                            style={{
                                filter: logoFilter,
                                mixBlendMode: "screen",
                                clipPath: "polygon(0 22%, 100% 22%, 100% 38%, 0 38%)",
                            }}
                            draggable={false}
                        />
                        <motion.img
                            src={logos[index]}
                            alt=""
                            aria-hidden
                            initial={{ x: 14, opacity: 0.9 }}
                            animate={{ x: [14, -10, 4, -6, 0], opacity: [0.9, 0.7, 0.9, 0.6, 0] }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 m-auto max-w-full max-h-full object-contain pointer-events-none"
                            style={{
                                filter: logoFilter,
                                mixBlendMode: "screen",
                                clipPath: "polygon(0 56%, 100% 56%, 100% 74%, 0 74%)",
                            }}
                            draggable={false}
                        />

                        {/* Flash de estática */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.06 }}
                            className="absolute inset-0 pointer-events-none mix-blend-overlay"
                            style={{
                                backgroundImage:
                                    "repeating-conic-gradient(#fff 0% 0.0002%, #000 0% 0.0004%)",
                                backgroundSize: "3px 3px",
                            }}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* Scanlines sutiles encima de todo */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                style={{
                    background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 3px)",
                }}
            />

            {/* Parpadeo CRT */}
            <motion.div
                animate={{ opacity: [0, 0.03, 0, 0.06, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay"
            />
        </div>
    );
}
