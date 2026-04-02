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

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    const mobileWidth = "100%"; // Fixed at 100% for mobile
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);
    const titleFillProgress = useTransform(scrollYProgress, [0.1, 0.5], ["0% 100%", "100% 100%"]);

    // Dynamic colors for mobile scroll (matching the page background transition)
    const { scrollYProgress: pageScrollY } = useScroll();
    const textColor = useTransform(pageScrollY, [0.3, 0.5], ["#1a2332", "#ffffff"]);
    const descColor = useTransform(pageScrollY, [0.3, 0.5], ["#374151", "#d1d5db"]);
    const separatorColor = useTransform(pageScrollY, [0.3, 0.5], ["#000000", "#ffffff"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ 
                width: typeof window !== 'undefined' && window.innerWidth < 768 ? mobileWidth : width, 
                borderRadius: typeof window !== 'undefined' && window.innerWidth < 768 ? "0rem" : borderRadius 
            }}
            className="relative z-20 mx-auto min-h-0 md:h-[51vh] py-20 md:bg-[#E8E8E0] text-[#1a2332] md:shadow-2xl font-heading flex flex-col md:flex-row items-center justify-center mb-40 w-full overflow-x-hidden"
        >
            <div className="container mx-auto px-0 md:px-12 h-full flex flex-col md:flex-row items-center">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center text-left items-start px-[30px] md:px-0 w-full"
                    >
                        <motion.h2
                            style={{
                                color: "rgba(26, 35, 50, 0.1)",
                                backgroundImage: useTransform(pageScrollY, [0.3, 0.5], [
                                    "linear-gradient(to right, #1a2332, #1a2332)",
                                    "linear-gradient(to right, #ffffff, #ffffff)"
                                ]),
                                backgroundSize: titleFillProgress,
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                backgroundPosition: "0 0",
                            }}
                            className="text-6xl md:text-7xl font-bold mb-8 tracking-tight text-left w-full leading-[0.9]"
                        >
                            toogo.<br className="md:hidden" /><span className="italic font-light">store</span>
                        </motion.h2>

                        <motion.div 
                            style={{ backgroundColor: separatorColor }}
                            className="w-full h-px mb-8"
                        />

                        <motion.p
                            style={{ 
                                color: descColor,
                                fontSize: "clamp(1.1rem, 1rem + 1vw, 1.3rem)" 
                            }}
                            className="leading-relaxed font-light text-left w-full"
                        >
                            Olvídate de depender de programadores o de luchar con códigos complejos. <motion.span style={{ color: textColor }} className="font-bold">Toogo</motion.span> es la plataforma todo en uno que democratiza el comercio electrónico. Diseña tu marca, gestiona tu inventario y cobra de forma segura en un solo lugar
                        </motion.p>
                    </motion.div>

                    {/* Toogo Character Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center h-full w-full mt-8 md:mt-0"
                    >
                        <div className="relative w-[280px] h-[280px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center justify-center p-8">
                            <img
                                src="/toogo-character.png"
                                alt="Toogo Character"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
            <CornerButton 
                href="https://www.toogo.store" 
                iconColor={useTransform(pageScrollY, [0.4, 0.5], ["border-black text-black", "border-white text-white"]).get()} 
            />
        </motion.section>
    );
}
