"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Monitor, ShoppingBag, BarChart3 } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { CornerButton } from "@/components/ui/corner-button";

export function Services() {
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
            className="relative z-20 -mt-[100vh] mb-40 mx-auto h-[51vh] bg-[#222222] text-white shadow-2xl font-heading flex items-center justify-center"
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
                        <Link href="/gravity" className="block group cursor-pointer">
                            <motion.h2
                                initial={{ backgroundSize: "0% 100%" }}
                                whileInView={{ backgroundSize: "100% 100%" }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 1.2, ease: [0.1, 0.5, 0.5, 1], delay: 0.3 }}
                                style={{
                                    color: "rgba(182, 182, 182, 0.2)",
                                    backgroundImage: "linear-gradient(to right, #b6b6b6, #b6b6b6)",
                                    backgroundRepeat: "no-repeat",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    backgroundPosition: "0 0",
                                }}
                                className="text-6xl md:text-8xl font-bold mb-8 tracking-tight group-hover:scale-105 transition-transform origin-left"
                            >
                                Diseño web
                            </motion.h2>

                            <div className="w-full h-px bg-gray-700 mb-8"></div>

                            <p
                                className="text-gray-300 leading-relaxed font-light"
                                style={{ fontSize: "clamp(0.875rem, 0.8092rem + 0.2105vw, 1.125rem)" }}
                            >
                                Creamos <strong className="text-white font-bold">e-commerce</strong>, <strong className="text-white font-bold">plataformas de cursos</strong>, <strong className="text-white font-bold">landing pages</strong> y <strong className="text-white font-bold">páginas informativas</strong>, combinando diseño web de alta calidad y estrategias SEO efectivas. Nos enfocamos en funcionalidad, estética y optimización para motores de búsqueda, garantizando una experiencia de usuario excepcional y aumentando la visibilidad en línea para impulsar el crecimiento de tu negocio.
                            </p>
                        </Link>
                    </motion.div>

                    {/* Image/Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center h-full"
                    >
                        <div className="relative w-[220px] h-[460px] -my-[50px] bg-[#F0F0E0] rounded-[2rem] overflow-hidden shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500">
                            {/* Placeholder for Phone Mockup */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <span className="text-gray-400 text-xs">Phone Mockup</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
            <CornerButton href="/gravity" iconColor="border-white text-white" />
        </motion.section>
    );
}
