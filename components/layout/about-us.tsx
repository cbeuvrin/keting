"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function AboutUs() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to horizontal movement
    // Moves from -20% to 20% of its width
    const x = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section
            ref={sectionRef}
            className="relative z-20 w-full pt-32 pb-12 md:pt-48 md:pb-20 bg-white text-black font-heading overflow-hidden"
        >
            {/* Background Text - Subtle background "About" with parallax */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
                <motion.h2
                    style={{ x }}
                    className="text-[20rem] md:text-[40rem] font-bold text-black leading-none whitespace-nowrap"
                >
                    About
                </motion.h2>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Content section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">

                    {/* Left Column: Greeting + Bio */}
                    <div className="md:col-span-12 lg:col-span-7 space-y-8">
                        <div className="space-y-6">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl md:text-7xl font-bold mb-2 tracking-tight text-[#1a1a1a]"
                            >
                                Creando el futuro <span className="italic font-light">digital</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-xl md:text-2xl text-gray-600 font-normal leading-snug max-w-3xl"
                            >
                                en México desde 2019. Diseño e innovación impulsada por IA para proyectos que rompen el molde.
                            </motion.p>
                        </div>

                        <div className="space-y-4">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed font-light max-w-2xl italic"
                            >
                                "Me enfoco en trabajar con marcas que buscan escalar su presencia digital mediante soluciones innovadoras y un diseño que realmente conecta con sus clientes."
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex justify-end pr-4 md:pr-12"
                            >
                                <span className="text-lg md:text-xl font-medium text-[#1a1a1a] tracking-tight italic">
                                    — Carlos Beuvrin
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Profile Image */}
                    <div className="md:col-span-12 lg:col-span-5 flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="relative w-full aspect-[3/4] max-w-[320px] bg-black rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
                        >
                            <img
                                src="/carlos-beuvrin.png"
                                alt="Carlos Beuvrin - Director de Keting Media, especializado en Marketing Digital y Diseño Web en México"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: "center 5%" }}
                                loading="lazy"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
