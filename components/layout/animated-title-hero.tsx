"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export function AnimatedTitleHero() {
    const [animationStep, setAnimationStep] = useState<"initial" | "rotating" | "final">("initial");

    // Scramble State
    const [displayText, setDisplayText] = useState("Soluciones");
    const [targetWord, setTargetWord] = useState("Soluciones");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Looping Logo State
    const [logoIndex, setLogoIndex] = useState(0);
    const logos = [
        "/antigravity-logo.png", // Start with original
        "/icon-triangle.png",
        "/icon-flash.png",
        "/icon-cat.png"
    ];

    useEffect(() => {
        const logoInterval = setInterval(() => {
            setLogoIndex((prev) => (prev + 1) % logos.length);
        }, 500); // 500ms intervals
        return () => clearInterval(logoInterval);
    }, [logos.length]);

    // Services Data
    const SERVICE_ITEMS = [
        {
            title: <>Sistemas & Software <br />para Empresas</>,
            desc1: 'Creamos la "columna vertebral" de tu negocio para que todo funcione sin errores humanos.',
            desc2: 'Dashboards de control, CRMs personalizados, automatización de procesos internos y herramientas administrativas.',
            image: '/soluciones-digitales/software.png'
        },
        {
            title: <>Apps Móviles &<br />Web Apps</>,
            desc1: 'Aplicaciones interactivas para iOS y Android, y plataformas web dinámicas que tus clientes pueden usar desde cualquier lugar.',
            desc2: 'Interfaces modernas y fluidas diseñadas para una experiencia de usuario impecable.',
            image: '/soluciones-digitales/celualrapp.png'
        }
    ];

    // Scroll Control - Increased height
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // --- ANIMATION SEQUENCE DEFINITION ---
    // 0.0 - 0.2: Background Rises
    // 0.2 - 0.4: Title Scrambles (Soluciones -> Servicios)
    // 0.25 - 0.6: Content Scrolls (Title UP, Services UP) - SYNCED EARLIER

    const bgY = useTransform(scrollYProgress, [0.05, 0.25], ["100%", "0%"]);
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0.05, 0.15], [1, 0]);

    // Header moves UP naturally to make room for services
    // Starts moving earlier to match user request "cuando servicio empieza aparecer... empieza a aparecer el texto abajo"
    // MOVES FURTHER UP (-100%) and over a longer range so it doesn't stop ("no se debe detener")
    const headerY = useTransform(scrollYProgress, [0.25, 0.85], ["0%", "-120%"]);
    const headerOpacity = useTransform(scrollYProgress, [0.8, 0.95], [1, 0]); // Fade out much later if needed, or keep

    // Services move UP from bottom
    // Sync start with header movement (0.25)
    // Starts closer (20%) so it is visible immediately ("ya debe empezar a verse") and closer to title
    const servicesY = useTransform(scrollYProgress, [0.25, 0.85], ["20%", "-50%"]);
    const servicesOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]); // Fade in VERY quickly


    // Trigger Scramble on Scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Trigger as background finishes rising
        if (latest > 0.15 && targetWord !== "Servicios") {
            setTargetWord("Servicios");
            scramble("Servicios");
        } else if (latest <= 0.15 && targetWord !== "Soluciones") {
            setTargetWord("Soluciones");
            scramble("Soluciones");
        }
    });

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

                {/* RISING BACKGROUND */}
                <motion.div
                    style={{ y: bgY }}
                    className="absolute inset-0 bg-[#F1F1F1] z-0"
                />

                <div className="relative w-full h-full max-w-[90%] mx-auto flex flex-col items-center justify-center z-10">

                    {/* --- HEADER SECTION (MOVES UP) --- */}
                    {/* Centered initially, then moves up */}
                    <motion.div
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="absolute top-0 w-full h-screen flex items-center justify-center z-20 origin-top"
                    >
                        <div className="relative flex items-center justify-center">

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
                                    {/* SCRAMBLE WORD PHANTOM CONTAINER */}
                                    <span className="relative block text-left">
                                        <span className="invisible opacity-0 select-none">{targetWord}</span>
                                        <span className="absolute left-0 top-0 whitespace-nowrap">{displayText}</span>
                                        {/* UNDERLINE ANIMATION */}
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: displayText === "Servicios" ? "100%" : "0%" }}
                                            transition={{ delay: 0.5, duration: 0.8 }}
                                            className="absolute left-0 -bottom-1 md:-bottom-2 h-[2px] md:h-[4px] bg-black transition-all duration-1000 ease-out"
                                        />
                                    </span>

                                    {/* DIGITALES (Fades out, keeps space) */}
                                    <motion.span
                                        animate={{ opacity: targetWord === "Servicios" ? 0 : 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="ml-[0.25em] block"
                                    >
                                        Digitales
                                    </motion.span>
                                </h1>
                            </motion.div>

                        </div>
                    </motion.div>


                    {/* --- SERVICES LIST SECTION (MOVES UP FROM BOTTOM) --- */}
                    <motion.div
                        style={{ y: servicesY, opacity: servicesOpacity }}
                        className="absolute top-[40vh] w-full max-w-4xl flex flex-col gap-32 pb-32"
                    >
                        {SERVICE_ITEMS.map((item, index) => (
                            <ServiceItem key={index} item={item} />
                        ))}
                    </motion.div>
                </div>

                {/* SCROLL INDICATOR */}
                <motion.div
                    style={{ opacity: scrollIndicatorOpacity }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
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
            </div>
        </section >
    );
}

function ServiceItem({ item }: { item: any }) {
    const imageRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: imageRef,
        offset: ["start end", "center center"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
    const borderRadius = useTransform(scrollYProgress, [0, 0.8], ["4rem", "0rem"]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-16 items-start w-full">
                {/* LEFT: TITLE & ICON */}
                <div className="flex flex-col gap-6 sticky top-32">
                    <div className="flex items-center gap-6">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white shrink-0 flex items-center justify-center shadow-sm border border-gray-100">
                            <img
                                src="/antigravity-logo.png"
                                alt="Antigravity Logo"
                                className="w-10 h-10 object-contain opacity-80"
                            />
                        </div>
                        <h3 className="text-xl md:text-3xl font-medium leading-tight tracking-tight">
                            {item.title}
                        </h3>
                    </div>
                </div>

                {/* RIGHT: CONTENT (Text Only) */}
                <div className="flex flex-col gap-6">
                    <div className="prose prose-lg">
                        <p className="text-base md:text-lg font-normal leading-relaxed text-gray-800">
                            {item.desc1}
                        </p>
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                            {item.desc2}
                        </p>
                    </div>

                    {/* EXPAND BUTTON / ACTION */}
                    <div className="pt-4">
                        <button className="px-6 py-3 rounded-full border border-black text-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>

            {/* SERVICE IMAGE - Animate Scale on Scroll */}
            {item.image && (
                <motion.div
                    ref={imageRef}
                    style={{ scale, borderRadius }}
                    className="mt-12 overflow-hidden shadow-2xl border border-gray-100 w-full origin-center"
                >
                    <img
                        src={item.image}
                        alt="Service Preview"
                        className="w-full h-auto object-cover"
                    />
                </motion.div>
            )}
        </div>
    );
}
