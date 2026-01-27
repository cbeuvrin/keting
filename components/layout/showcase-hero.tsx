"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function ShowcaseHero() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    // Strategy:
    // Define the FINAL layout using standard CSS Grid (Two Columns).
    // Animate FROM a centered position TO this final layout.

    // Animation phases
    // 0.0 -> 0.2: Hold Center
    // 0.2 -> 0.8: Split to Columns

    // Left Column (Title + Text)
    // Starts shifted RIGHT (to center screen)
    // Ends at 0 (natural grid position)
    const leftColX = useTransform(scrollYProgress, [0.2, 0.8], ["50%", "0%"]);
    // We might need pixel values for perfect centering, but % works for responsive "unmerging" feel.
    // If Left Col is 50% width, shifting it 50% right puts its left edge at center. 
    // We want its CENTER to be at screen center. 
    // Simplified: Translate X.

    // Right Column (Phone)
    // Starts shifted LEFT.
    const rightColX = useTransform(scrollYProgress, [0.2, 0.8], ["-50%", "0%"]);

    // Title Scale
    // Starts slightly larger if we want, or same size.
    // Let's keep it simple.

    // Opacity of Text List
    // Fades in as they separate
    const textOpacity = useTransform(scrollYProgress, [0.4, 0.9], [0, 1]);

    return (
        <section
            ref={targetRef}
            className="relative h-[300vh] bg-white"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center p-6 md:p-12 lg:p-24">

                {/* Final Grid Layout Container */}
                <div className="relative w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Left Column: Title & Content */}
                    <motion.div
                        style={{ x: leftColX }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left z-20"
                    >
                        {/* Title Wrapper */}
                        <div className="mb-12 lg:mb-16">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter text-black leading-[0.9]">
                                Soluciones<br />Digitales
                            </h1>
                        </div>

                        {/* Services List */}
                        <motion.div
                            style={{ opacity: textOpacity }}
                            className="space-y-8 max-w-md"
                        >
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-black">Desarrollo de APP</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Apps nativas e híbridas que transforman la experiencia de usuario y optimizan procesos.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-black">Soluciones para eventos</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Registro digital, apps interactivas y experiencias en tiempo real para eventos inolvidables.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-black">Desarrollo de ecosistemas digital</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Integración de web, app y redes en un entorno cohesivo que potencia tu marca.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-black">Plataformas digitales</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Sistemas robustos y escalables a medida, desde e-commerce hasta portales corporativos.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>


                    {/* Right Column: Phone */}
                    <motion.div
                        style={{ x: rightColX }}
                        className="flex items-center justify-center lg:justify-end z-30"
                    >
                        <div className="relative w-[300px] md:w-[350px] lg:w-[400px] aspect-square">
                            {/* Phone Screen Content */}
                            <div className="absolute left-[50%] top-[49.2%] -translate-x-1/2 -translate-y-1/2 w-[36.5%] h-[78%] bg-black rounded-[2rem] overflow-hidden">
                                {/* Simple White Squares */}
                                <div className="absolute left-[34%] top-[43%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute left-[66%] top-[43%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute left-[34%] top-[57%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute left-[66%] top-[57%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                            </div>

                            {/* Phone Frame */}
                            <Image
                                src="/phone-frame.png"
                                alt="Mobile App"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
