"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useSpring, MotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export function SolucionesDigitalesV2() {
    const [animationStep, setAnimationStep] = useState<"initial" | "rotating" | "final">("initial");

    // Scramble State
    const [displayText, setDisplayText] = useState("SOLUCIONES");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll Control - Reduced height since no services
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const bgY = useTransform(scrollYProgress, [0.05, 0.25], ["100%", "0%"]);

    // Scramble Logic
    const scramble = (newText: string) => {
        let iteration = 0;
        const speed = 12;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText((prev) =>
                newText
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return newText[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= newText.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 2;
        }, speed);
    };

    useEffect(() => {
        // Initial Entrance Logic
        const rotateTimer = setTimeout(() => {
            setAnimationStep("rotating");
        }, 500);

        const finalTimer = setTimeout(() => {
            setAnimationStep("final");
            scramble("SOLUCIONES");
        }, 2000);

        return () => {
            clearTimeout(rotateTimer);
            clearTimeout(finalTimer);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);


    return (
        <section ref={containerRef} className="relative h-[300vh] bg-white">

            <div className="sticky top-0 h-screen overflow-hidden">

                {/* RISING BACKGROUND - Removed per user request */}
                {/* <motion.div
                    style={{ y: bgY }}
                    className="absolute inset-0 bg-[#F1F1F1] z-0"
                /> */}

                <div className="relative w-full h-full max-w-[90%] mx-auto flex flex-col items-center justify-center z-10">

                    {/* --- HEADER SECTION --- */}
                    <div className="absolute top-0 w-full h-screen flex items-center justify-center z-20 origin-top">
                        <div className="relative flex flex-col items-center justify-center">

                            <div className="flex items-center justify-center">
                                {/* SQUARES GRID */}
                                <motion.div
                                    layout
                                    animate={{
                                        marginRight: animationStep === "final" ? 32 : 0,
                                        scale: animationStep === "final" ? 1 : 1.5
                                    }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="grid grid-cols-2 gap-2 md:gap-3 z-50 flex-shrink-0"
                                >
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0, rotate: 45 }}
                                            animate={
                                                animationStep === "initial" ? { opacity: 1, scale: 1, rotate: 0 } :
                                                    animationStep === "rotating" ? { opacity: 1, scale: 1, rotate: 90 } :
                                                        { opacity: 1, scale: 1, rotate: 0 }
                                            }
                                            transition={
                                                animationStep === "rotating"
                                                    ? { duration: 0.8, ease: "easeInOut", repeat: 1, repeatType: "loop" }
                                                    : { duration: 0.5, delay: i * 0.1 }
                                            }
                                            className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-lg md:rounded-xl"
                                        />
                                    ))}
                                </motion.div>


                                {/* TITLE CONTAINER */}
                                <motion.div
                                    className="relative z-10 overflow-hidden py-4"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={
                                        animationStep === "final"
                                            ? { opacity: 1, width: "auto" }
                                            : { opacity: 0, width: 0 }
                                    }
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <h1 className="text-[clamp(3rem,8vw,7rem)] font-heading font-medium leading-none tracking-tighter text-black whitespace-nowrap px-1 flex">
                                        <span className="relative block text-left">
                                            <span className="invisible opacity-0 select-none">SOLUCIONES</span>
                                            <span className="absolute left-0 top-0 whitespace-nowrap">{displayText}</span>
                                        </span>

                                        <motion.span
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="ml-[0.25em] block"
                                        >
                                            DIGITALES
                                        </motion.span>
                                    </h1>
                                </motion.div>
                            </div>

                            {/* SECOND LINE: CREATIVIDAD DIGITAL */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    animationStep === "final"
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="mt-4 md:mt-6"
                            >
                                <p className="text-xl md:text-3xl font-light tracking-[0.2em] text-gray-800 uppercase">
                                    Creatividad Digital
                                </p>
                            </motion.div>

                        </div>
                    </div>

                </div>

                {/* SCROLL INDICATOR (Optional, can remove if not needed) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                >
                    <span className="text-[10px] uppercase tracking-widest text-black/40">Scroll</span>
                    <motion.div
                        className="w-[1px] h-12 bg-gray-200 overflow-hidden relative"
                    >
                        <motion.div
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-full h-1/2 bg-black"
                        />
                    </motion.div>
                </motion.div>

                {/* --- PARALLAX SOFTWARE SECTION (Starts at bottom, moves up) --- */}
                <SoftwareParallaxSection scrollYProgress={scrollYProgress} />

            </div>
        </section >
    );
}

function SoftwareParallaxSection({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {

    // SMOOTH SCROLL: Spring physics for "liquid" feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Main Container Motion (Slides up from bottom)
    const containerY = useTransform(smoothProgress, [0, 1], ["100%", "0%"]);

    // Background: "Fixed" feel. 
    // Moving from -90% to 0% as container moves 100% to 0% creates a net movement of ~10% (Very slow/Fixed).
    const yBg = useTransform(smoothProgress, [0, 1], ["-90%", "0%"]);

    // Phone: Moves WITH the background (Fixed feel).
    const yCel1 = useTransform(smoothProgress, [0, 1], ["-90%", "0%"]);

    // Text Sync - Title moves FASTER (Natural scroll).
    // No counter-movement (or very slight) allows it to scroll up with the container.
    // We'll keep a tiny bit of parallax just for smoothness, but mostly it flies by.
    const textY = useTransform(smoothProgress, [0.4, 0.8], ["0vh", "0vh"]);
    const textOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);

    return (
        <motion.div
            style={{ y: containerY }}
            className="absolute inset-x-0 bottom-0 z-40 w-full h-screen pointer-events-none flex items-center justify-center overflow-hidden"
        >
            {/* Background Image Layer */}
            <motion.div style={{ y: yBg }} className="absolute inset-x-0 top-0 w-full h-[140%] z-0">
                <img
                    src="/soluciones-digitales/software.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-100" // Increased opacity if needed, checking previous value
                />
            </motion.div>

            <div className="relative z-10 w-full h-full max-w-[90%] mx-auto flex items-center justify-between">

                {/* LEFT SIDE: TEXT */}
                <div className="w-1/2 flex flex-col justify-center items-start text-left pl-8">
                    <motion.h2
                        style={{ y: textY, opacity: textOpacity }}
                        className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-[0.9] text-black"
                    >
                        SISTEMAS <br /> & SOFTWARE
                    </motion.h2>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm font-light text-gray-600 leading-relaxed">
                        <p className="text-justify max-w-[280px]">
                            Dashboards de control, CRMs personalizados y automatización de procesos para tu negocio.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: PHONE (Single) */}
                <div className="w-1/2 h-full flex items-center justify-center relative">
                    <motion.div style={{ y: yCel1 }} className="flex-1 max-w-[42%] -rotate-12">
                        <img src="/soluciones-digitales/cel1.png" alt="Phone 1" className="w-full h-auto object-contain drop-shadow-2xl" />
                    </motion.div>
                </div>

            </div>
        </motion.div>
    )
}

