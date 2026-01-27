"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

export function SolucionesHero({ onThemeChange }: { onThemeChange?: (theme: "light" | "dark") => void }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    // Animation phases
    // 0 -> 0.4: Phone rises from bottom to center
    // 0.4 -> 0.8: Phone zooms in (scale up)
    // 0.8 -> 1.0: Hold / Fade out text?

    const y = useTransform(scrollYProgress, [0, 0.4], ["100%", "0%"]);
    const scale = useTransform(scrollYProgress, [0.4, 0.9], [1, 25]); // Huge scale to fill screen
    const inverseScale = useTransform(scale, (s) => 1 / s); // Perfectly counteract the scale at every frame
    // Opacity for features: Appear as screen gets dark (0.5 -> 0.8)
    const featureOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

    // Detect when screen is "dark" (phone fills most of screen)
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (onThemeChange) {
            // Adjust threshold as needed. 0.6 is halfway through zoom (0.4 to 0.9)
            if (latest > 0.6) {
                onThemeChange("dark");
            } else {
                onThemeChange("light");
            }
        }
    });

    return (
        <section
            ref={targetRef}
            className="relative h-[400vh] bg-white" // Very tall for scroll length
        >
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

                {/* Main Title - Z-index 10 to stay behind phone */}
                <motion.h1
                    className="text-[clamp(3rem,8vw,7rem)] font-heading font-medium leading-none tracking-tighter text-black text-center z-10 relative"
                >
                    Soluciones Digitales
                </motion.h1>

                {/* Phone Image Container */}
                <motion.div
                    style={{ y, scale, transformOrigin: "50% 49.2%" }}
                    className="absolute w-[300px] md:w-[400px] lg:w-[500px] aspect-square z-20 flex items-center justify-center"
                >
                    {/* FEATURE OVERLAY - Moved OUTSIDE the clipped screen div 
                        Positioned relative to the Phone Container (500px wide).
                        Inverse scaled to maintain readable size.
                     */}
                    <motion.div
                        style={{ scale: inverseScale, opacity: featureOpacity }}
                        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        {/* Container for absolute positioning relative to center */}
                        <div className="relative w-full h-full max-w-[500px]">

                            {/* 
                                Coordinates Logic:
                                The container is effectively ~500px wide (visually).
                                We want text pushed out to left and right.
                                Let's use standard absolute positioning from center.
                            */}

                            {/* TOP LEFT: Desarrollo de APP */}
                            <div className="absolute right-[110%] bottom-[55%] w-[250px] text-right">
                                <h3 className="text-white font-bold text-xl mb-2">Desarrollo de APP</h3>
                                <p className="text-gray-300 text-sm">Apps nativas e híbridas que transforman la experiencia de usuario y optimizan procesos.</p>
                            </div>
                            {/* Line TL */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible">
                                {/* From: Text Right Edge (Left side of phone) -> To: Square Center */}
                                {/* Text is at -10% of width. Phone is 0 to 100%. Square is at ~44%. */}
                                <line x1="-10%" y1="45%" x2="44.2%" y2="48%" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                                <circle cx="44.2%" cy="48%" r="3" fill="white" />
                            </svg>


                            {/* TOP RIGHT: Soluciones para eventos */}
                            <div className="absolute left-[110%] bottom-[55%] w-[250px] text-left">
                                <h3 className="text-white font-bold text-xl mb-2">Soluciones para eventos</h3>
                                <p className="text-gray-300 text-sm">Registro digital, apps interactivas y experiencias en tiempo real para eventos inolvidables.</p>
                            </div>
                            <svg className="absolute inset-0 w-full h-full overflow-visible">
                                <line x1="110%" y1="45%" x2="55.8%" y2="48%" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                                <circle cx="55.8%" cy="48%" r="3" fill="white" />
                            </svg>


                            {/* BOTTOM LEFT: Desarrollo de ecosistemas digital */}
                            <div className="absolute right-[110%] top-[55%] w-[250px] text-right">
                                <h3 className="text-white font-bold text-xl mb-2">Desarrollo de ecosistemas digital</h3>
                                <p className="text-gray-300 text-sm">Integración de web, app y redes en un entorno cohesivo que potencia tu marca.</p>
                            </div>
                            <svg className="absolute inset-0 w-full h-full overflow-visible">
                                <line x1="-10%" y1="55%" x2="44.2%" y2="52%" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                                <circle cx="44.2%" cy="52%" r="3" fill="white" />
                            </svg>


                            {/* BOTTOM RIGHT: Plataformas digitales */}
                            <div className="absolute left-[110%] top-[55%] w-[250px] text-left">
                                <h3 className="text-white font-bold text-xl mb-2">Plataformas digitales</h3>
                                <p className="text-gray-300 text-sm">Sistemas robustos y escalables a medida, desde e-commerce hasta portales corporativos.</p>
                            </div>
                            <svg className="absolute inset-0 w-full h-full overflow-visible">
                                <line x1="110%" y1="55%" x2="55.8%" y2="52%" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                                <circle cx="55.8%" cy="52%" r="3" fill="white" />
                            </svg>

                        </div>
                    </motion.div>

                    {/* Screen Background - Drastically reduced to ensure no bleeding */}
                    <div className="absolute left-[50%] top-[49.2%] -translate-x-1/2 -translate-y-1/2 w-[36.5%] h-[78%] bg-black rounded-[2rem] overflow-hidden">

                        {/* Static Grid Squares Container with Counter-Scaling */}
                        <motion.div
                            style={{ scale: inverseScale }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="relative w-full h-full">
                                {/* FEATURE OVERLAY REMOVED FROM HERE */}

                                {/* Squares - Static Position (Relative to container) */}
                                <div className="absolute left-[34%] top-[43%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute left-[66%] top-[43%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute left-[34%] top-[57%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute left-[66%] top-[57%] w-[28%] aspect-square bg-white rounded-[20%] -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        </motion.div>
                    </div>
                    <Image
                        src="/phone-frame.png"
                        alt="Mobile App"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>

            </div>
        </section>
    );
}
