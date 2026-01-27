"use client";

import { Header } from "@/components/layout/header";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function DigitalProductsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Animate scale/width logic. 
    // STAGE 1: EXPANSION
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.7, 1]);
    const borderRadius = useTransform(scrollYProgress, [0, 0.2], ["2rem", "0rem"]);

    // STAGE 2: TITLE SHIFT & REFLOW
    // Trigger earlier to ensure users see it happening.
    // 1. Width constricts (100% -> 45%) to force wrap.
    // 2. Highlight activates.

    // Position: We rely on flex-start + width constriction.
    // We can add a slight negative margin-left if needed, but width usually suffices.
    const titleWidth = useTransform(scrollYProgress, [0.15, 0.35], ["100%", "45%"]);

    const titleScale = useTransform(scrollYProgress, [0, 0.2], [1.4, 1]);

    // Highlight Animation for "Digitales"
    // Starts when width constriction ends.
    const highlightBg = useTransform(scrollYProgress, [0.3, 0.4], ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]);
    const highlightText = useTransform(scrollYProgress, [0.3, 0.4], ["rgba(0,0,0,1)", "rgba(255,255,255,1)"]);
    const highlightPadding = useTransform(scrollYProgress, [0.3, 0.4], ["0px", "0.5rem"]);

    // STAGE 3: CONTENT SCROLL
    // Make it appear SOONER so user doesn't scroll into void.
    // Overlap slightly with title shift.
    const contentY = useTransform(scrollYProgress, [0.3, 1], ["20vh", "-40vh"]);
    const contentOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]); // Fade in quickly

    // Image Reveal
    const imageWidth = useTransform(scrollYProgress, [0, 0.15], ["0px", "140px"]);
    const imageOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div ref={containerRef} className="h-[400vh] bg-black relative">
            {/* Header - Fixed */}
            <Header initialColor="white" />

            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ scale, borderRadius }}
                    className="w-full h-full bg-[#F5F5F0] shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Left Column Area */}
                    {/* z-index 20 to stay above entering content if needed, though they shouldn't overlap visually */}
                    <div className="w-full h-full p-8 md:p-24 flex flex-col justify-center relative z-20 pointer-events-none">
                        <motion.h1
                            style={{
                                scale: titleScale,
                                width: titleWidth
                            }}
                            className="text-3xl md:text-5xl lg:text-7xl font-heading font-black tracking-tighter leading-[0.9] text-black uppercase origin-left flex flex-col items-start text-left pointer-events-auto"
                        >
                            <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 mb-2">
                                <span>¿Sabes qué son</span>
                                <motion.span
                                    style={{ width: imageWidth, opacity: imageOpacity }}
                                    className="h-[0.8em] md:h-[0.85em] relative overflow-hidden rounded-lg inline-block align-middle bg-black"
                                >
                                    <img
                                        src="/reveal-image.png"
                                        alt="Reveal"
                                        className="absolute top-0 left-0 w-[140px] h-full object-cover"
                                    />
                                </motion.span>
                                <span>los</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4">
                                <span>Productos</span>
                                <motion.span
                                    style={{
                                        backgroundColor: highlightBg,
                                        color: highlightText,
                                        paddingLeft: highlightPadding,
                                        paddingRight: highlightPadding
                                    }}
                                    className="rounded-lg transition-colors inline-block"
                                >
                                    Digitales?
                                </motion.span>
                            </div>
                        </motion.h1>
                    </div>

                    {/* Right Column / Scrollable Content */}
                    {/* z-index 10. */}
                    <motion.div
                        style={{ y: contentY, opacity: contentOpacity }}
                        className="absolute right-0 top-0 w-full md:w-1/2 h-full p-12 md:p-24 flex flex-col justify-center gap-12 text-black z-10"
                    >
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold uppercase tracking-tight">Definición</h3>
                            <p className="text-xl leading-relaxed text-gray-700">
                                Los productos digitales son herramientas intangibles basadas en software que resuelven problemas, entretienen o aportan valor a través de dispositivos electrónicos.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold uppercase tracking-tight">Características</h3>
                            <ul className="text-xl leading-relaxed text-gray-700 space-y-2">
                                <li>• Escalabilidad global inmediata.</li>
                                <li>• Interacción en tiempo real.</li>
                                <li>• Actualización continua y ágil.</li>
                                <li>• Basados en datos y métricas.</li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold uppercase tracking-tight">Nuestra Solución</h3>
                            <p className="text-xl leading-relaxed text-gray-700">
                                Creamos ecosistemas digitales completos, desde apps nativas hasta plataformas web complejas, diseñados para crecer con tu negocio.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
