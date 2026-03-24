"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

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
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden z-[60] pointer-events-none">
                {/* Video Background Removed */}

                {/* Main Title - Z-index 10 to stay behind phone */}
                <motion.h1
                    className="text-[clamp(3rem,8vw,7rem)] font-heading font-medium leading-none tracking-tighter text-black text-center z-10 relative"
                >
                    Soluciones Digitales
                </motion.h1>

                {/* Phone Image Container */}
                <motion.div
                    style={{ y, scale, transformOrigin: "50% 49.2%" }}
                    className="absolute w-[300px] md:w-[400px] lg:w-[500px] aspect-square z-[60] flex items-center justify-center pointer-events-auto"
                >
                    {/* FEATURE OVERLAY - Moved OUTSIDE the clipped screen div 
                        Positioned relative to the Phone Container (500px wide).
                        Inverse scaled to maintain readable size.
                     */}


                    {/* Screen Background - Drastically reduced to ensure no bleeding */}
                    <div className="absolute left-[50%] top-[49.2%] -translate-x-1/2 -translate-y-1/2 w-[36.5%] h-[78%] bg-black rounded-[2rem] overflow-hidden">

                        {/* Static Grid Squares Container with Counter-Scaling */}
                        <motion.div
                            style={{ scale: inverseScale }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            {/* V4 Content Wrapper - Sized to Viewport to act as "World" behind the "Window" */}
                            <div className="relative w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 pt-20 bg-black text-white">



                                {/* Grid Background Effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 z-10" />

                                {/* Floating Number 01 */}
                                <div className="absolute top-[25%] left-6 md:left-[5%] font-serif italic text-4xl md:text-5xl text-white/90">
                                    01
                                </div>

                                {/* Main Title Group */}
                                <div className="flex flex-col justify-center h-full mt-20 md:mt-0 md:ml-[15%] w-fit relative z-10">
                                    <h1 className="flex flex-col text-6xl md:text-[8vw] leading-none tracking-tight font-light !text-white text-left max-w-4xl gap-1 uppercase relative">
                                        <span className="block whitespace-nowrap">Experiencias</span>
                                        <span className="block whitespace-nowrap"><span className="font-bold italic">digitales</span></span>
                                        <span className="block whitespace-nowrap">únicas</span>
                                        <span className="block whitespace-nowrap">e innovadoras</span>

                                        {/* Circular Video next to text */}
                                        <motion.div
                                            className="absolute -left-64 top-96 w-24 h-24 rounded-full shadow-xl z-10 flex items-center justify-center bg-white"
                                            animate={{ y: ["-20%", "0%", "-20%"] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            {/* Black Arrow */}
                                            <ArrowDown className="relative w-12 h-12 text-black" />
                                        </motion.div>
                                    </h1>
                                </div>



                                {/* Scroll Indicator */}
                                <div className="absolute bottom-2 right-2 flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                                    <span>Scroll</span>
                                </div>
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
        </section >
    );
}
