"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CornerButton } from "@/components/ui/corner-button";

export function DigitalSolutions() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const width = useTransform(scrollYProgress, [0, 1], ["100%", "80%"]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius }}
            className="relative z-20 mx-auto h-[51vh] bg-[#F5F5F0] text-[#333333] shadow-2xl font-heading flex items-center justify-center mb-40"
        >
            <div className="container mx-auto px-6 md:px-12 h-full flex items-center">
                <div className="grid md:grid-cols-2 gap-12 items-center w-full h-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center"
                    >
                        <motion.h2
                            initial={{ backgroundSize: "0% 100%" }}
                            whileInView={{ backgroundSize: "100% 100%" }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 1.2, ease: [0.1, 0.5, 0.5, 1], delay: 0.3 }}
                            style={{
                                color: "rgba(182, 182, 182, 0.2)",
                                backgroundImage: "linear-gradient(to right, #666666, #666666)",
                                backgroundRepeat: "no-repeat",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                backgroundPosition: "0 0",
                            }}
                            className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
                        >
                            Soluciones digitales
                        </motion.h2>

                        <div className="w-full h-px bg-gray-300 mb-8"></div>

                        <p
                            className="text-gray-600 leading-relaxed font-light"
                            style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                        >
                            Transformamos negocios digitales globales mediante soluciones innovadoras que integran inteligencia artificial, optimizando la experiencia del usuario, automatizando procesos y maximizando resultados con tecnología avanzada.
                        </p>
                    </motion.div>

                    {/* Animated Grid */}
                    <motion.div
                        className="relative flex justify-center items-center h-full"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <motion.div
                            className="grid grid-cols-2 gap-4 w-[200px] md:w-[240px]"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1, // Fast stagger
                                        delayChildren: 0.2
                                    }
                                }
                            }}
                        >
                            {[1, 2, 3, 4].map((item) => (
                                <motion.div
                                    key={item}
                                    variants={{
                                        hidden: { scale: 0, opacity: 0 },
                                        visible: {
                                            scale: 1,
                                            opacity: 1,
                                            transition: { type: "spring", stiffness: 260, damping: 20 }
                                        }
                                    }}
                                    className="aspect-square bg-black rounded-[1.5rem] shadow-lg"
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                </div>
            </div>
            <CornerButton href="/soluciones-digitales" iconColor="border-black text-black" />
        </motion.section>
    );
}
