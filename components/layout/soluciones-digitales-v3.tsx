"use client";

import { motion } from "framer-motion";

export function SolucionesDigitalesV3() {
    return (
        <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
            <Typography3D />
        </section>
    );
}

function Typography3D() {
    // Estructura EXACTA como la referencia
    const words = [
        "NOW IT'S",    // Horizontal (piso)
        "TIME",        // VERTICAL (pared)  
        "TO USE",      // Horizontal
        "A VIBE",      // Horizontal
        "CODER"        // Horizontal
    ];

    return (
        <div
            className="relative font-black"
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d"
            }}
        >
            {words.map((word, i) => {
                // TIME es vertical (índice 1), el resto horizontal
                const isVertical = i === 1;

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        style={{
                            position: "relative",
                            fontSize: "clamp(4rem, 12vw, 10rem)",
                            letterSpacing: "-0.03em",
                            lineHeight: "0.85",

                            // Solapamiento vertical EXTREMO (apilado)
                            marginTop: i === 0 ? "0" : "-0.5em",

                            // Minimal desplazamiento diagonal
                            marginLeft: `${i * 0.2}em`,

                            // CLAVE: Rotación diferente por tipo
                            transform: isVertical
                                ? "rotateX(0deg) rotateZ(35deg)"    // VERTICAL - mira a la cámara
                                : "rotateX(60deg) rotateZ(35deg)", // HORIZONTAL - acostado

                            transformStyle: "preserve-3d",
                            zIndex: 10 - i
                        }}
                    >
                        <Text3D text={word} />
                    </motion.div>
                );
            })}
        </div>
    );
}

function Text3D({ text }: { text: string }) {
    const depth = 20; // Capas de extrusión

    return (
        <div className="relative">
            {/* Extrusión (lados del bloque 3D) */}
            {Array.from({ length: depth }, (_, i) => {
                // Gradiente plata → gris oscuro
                const lightness = 70 - (i * 2.5);

                return (
                    <span
                        key={i}
                        className="absolute inset-0 select-none"
                        style={{
                            color: `hsl(0, 0%, ${lightness}%)`,
                            transform: `translate(${-i}px, ${i}px)`,
                            zIndex: -i,
                            textShadow: "1px 1px 0 rgba(0,0,0,0.5)"
                        }}
                    >
                        {text}
                    </span>
                );
            })}

            {/* Sombra proyectada */}
            <span
                className="absolute inset-0 blur-lg opacity-80"
                style={{
                    color: "transparent",
                    transform: `translate(-${depth + 5}px, ${depth + 10}px)`,
                    textShadow: "0 0 30px rgba(0,0,0,0.9)",
                    zIndex: -(depth + 1)
                }}
            >
                {text}
            </span>

            {/* Cara frontal (blanca) */}
            <span className="relative text-white z-10">
                {text}
            </span>
        </div>
    );
}
