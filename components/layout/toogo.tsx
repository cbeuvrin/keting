"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CornerButton } from "@/components/ui/corner-button";

export function Toogo() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "90%"]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "2rem"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius }}
            className="relative z-20 mx-auto min-h-[60vh] md:h-[51vh] py-16 md:py-0 bg-[#E8E8E0] text-[#1a2332] shadow-2xl font-heading flex items-center justify-center mb-40"
        >
            <div className="container mx-auto px-6 md:px-12 h-full flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center text-center md:text-left items-center md:items-start"
                    >
                        <motion.h2
                            initial={{ backgroundSize: "0% 100%" }}
                            whileInView={{ backgroundSize: "100% 100%" }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 1.2, ease: [0.1, 0.5, 0.5, 1], delay: 0.3 }}
                            style={{
                                color: "rgba(26, 35, 50, 0.2)",
                                backgroundImage: "linear-gradient(to right, #1a2332, #1a2332)",
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                backgroundPosition: "0 0",
                            }}
                            className="text-4xl md:text-7xl font-bold mb-8 tracking-tight"
                        >
                            toogo.store
                        </motion.h2>

                        <div className="w-full h-px bg-gray-400 mb-8 max-w-[100px] md:max-w-none"></div>

                        <p
                            className="text-gray-700 leading-relaxed font-light"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            Olvídate de depender de programadores o de luchar con códigos complejos. <span className="font-bold">Toogo</span> es la plataforma todo en uno que democratiza el comercio electrónico. Diseña tu marca, gestiona tu inventario y cobra de forma segura en un solo lugar
                        </p>
                    </motion.div>

                    {/* Toogo Character Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center h-full"
                    >
                        <div className="relative w-[250px] h-[250px] flex items-center justify-center">
                            <img
                                src="/toogo-character.png"
                                alt="Toogo Character"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
            <CornerButton href="https://www.toogo.store" iconColor="border-black text-black" />
        </motion.section>
    );
}
