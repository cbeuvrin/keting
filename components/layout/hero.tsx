import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, Variants, useMotionValue, useMotionValueEvent, useSpring, animate, cubicBezier } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ScrollArrow } from "@/components/ui/scroll-arrow";

export function Hero() {
    const targetRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 5]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]); // Fades out much later
    const blur = useTransform(scrollYProgress, [0, 0.4], [0, 10]);
    const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);

    // "Smooth start" / "Soft Takeoff" parallax
    // We use a cubic bezier that starts very flat (slow) and accelerates.
    // [0.8, 0, 1, 1] is a customized ease-in curve. Focuses heavily on the start delay.
    const easeInCurve = cubicBezier(0.8, 0, 1, 1);
    const subtextY = useTransform(scrollYProgress, [0, 1], [0, -800], { ease: easeInCurve });

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
    };

    const wordVariants: Variants = {
        hidden: {
            opacity: 1, // Changed from 0 to 1 - text appears immediately
        },
        show: {
            opacity: 1,
            transition: {
                duration: 0,
            },
        },
    };

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Automatic sweep animation on load
    useEffect(() => {
        if (!targetRef.current || hasAnimated) return;

        const section = targetRef.current;
        const sectionWidth = section.offsetWidth;

        // Wait a bit for the page to load, then animate
        const timer = setTimeout(() => {
            // Animate mouseX from left to right to create the sweep effect
            animate(mouseX, sectionWidth, {
                duration: 2.5,
                ease: "easeInOut",
                onComplete: () => {
                    setHasAnimated(true);
                    mouseX.set(0); // Reset after animation
                }
            });
        }, 2500); // Delayed to start AFTER preloader disappears (~2s)

        return () => clearTimeout(timer);
    }, [hasAnimated, mouseX]); // Added mouseX to dependencies

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // Individual character component that reacts to mouse with Magnifying Glass effect
    const MagnifyingChar = ({ char, index, baseDelay }: { char: string, index: number, baseDelay: number }) => {
        const ref = useRef<HTMLSpanElement>(null);

        // Map mouse distance to Scale
        const scale = useTransform(mouseX, (val: number) => {
            if (!ref.current) return 1;
            const rect = ref.current.getBoundingClientRect();
            // Get center relative to parent
            const parentRect = ref.current.closest('section')?.getBoundingClientRect();
            if (!parentRect) return 1;

            const centerX = (rect.left + rect.width / 2) - parentRect.left;
            const diffX = val - centerX;

            // We also need Y distance for a true circular "glass" effect
            // But useTransform only accepts one value. We can combine or just use X for horizontal ripple.
            // User asked for "lupa" which implies circular.
            // However, useTransform(mouseX) only updates on X change. logic needs to be inside.
            // We can just use the X distance for the "wave" effect which is very common with text.
            // If we want true circular, we need a shared MotionValue or use a Raf.
            // Let's rely on X first as it's cleaner to hook into mouseX.
            // If we want both, we can try to assume Y is close or use the Y motion value too?
            // simpler: Let's use distance on X axis primarily for the line, as lines are horizontal.

            const dist = Math.abs(diffX);

            // Interaction radius
            if (dist < 150) {
                // Gaussian-ish curve for smooth bubble
                const strength = 1 - (dist / 150);
                // Scale up to 1.5x
                return 1 + (strength * 1.5);
            }
            return 1;
        });

        // Optional: Y shift to center the magnification or "bulge" up
        const yShift = useTransform(mouseX, (val: number) => {
            if (!ref.current) return 0;
            const rect = ref.current.getBoundingClientRect();
            const parentRect = ref.current.closest('section')?.getBoundingClientRect();
            if (!parentRect) return 0;
            const centerX = (rect.left + rect.width / 2) - parentRect.left;
            const dist = Math.abs(val - centerX);
            if (dist < 150) {
                const strength = 1 - (dist / 150);
                return -strength * 10; // Lift up slightly
            }
            return 0;
        });


        // Smooth physics
        const smoothScale = useSpring(scale, { damping: 15, stiffness: 200, mass: 0.5 });
        const smoothY = useSpring(yShift, { damping: 15, stiffness: 200, mass: 0.5 });

        return (
            <motion.span
                ref={ref}
                custom={baseDelay + index}
                variants={wordVariants}
                initial="hidden"
                animate="show"
                style={{ scale: smoothScale, y: smoothY, zIndex: smoothScale }} // zIndex to pop over neighbours
                className="inline-block origin-bottom relative px-[0.02em]" // origin-bottom so it grows up
            >
                {char}
            </motion.span>
        );
    }

    const AnimatedWord = ({ word, className }: { word: string, className?: string }) => {
        const chars = word.split("");

        return (
            <span className={cn("inline-block mr-[0.25em] whitespace-nowrap", className)}>
                {chars.map((char, i) => (
                    <MagnifyingChar key={i} char={char} index={i} baseDelay={0} />
                ))}
            </span>
        )
    }

    // Helper to split text into words and animate them
    const AnimatedLine = ({ text }: { text: string }) => {
        const words = text.split(" ");

        return (
            <span className="block">
                {words.map((word, i) => {
                    const cleanWord = word.replace(/[.,]/g, "");
                    const isStyled = cleanWord === "escalan" || cleanWord === "negocios";
                    return (
                        <AnimatedWord 
                            key={i} 
                            word={word} 
                            className={isStyled ? "italic font-light" : ""} 
                        />
                    );
                })}
            </span>
        );
    };

    const rotateK = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <section
            ref={targetRef}
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => {
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(touch.clientX - rect.left);
                mouseY.set(touch.clientY - rect.top);
            }}
            className="relative h-screen snap-start"
        >
            <div className="sticky top-0 h-screen flex flex-col justify-center relative">

                <div className="w-full px-6 md:px-12 lg:px-20 relative z-10 flex flex-col justify-end h-full pb-32 md:pb-24 lg:pb-14">

                    {/* Desktop Subtext (Hidden on mobile/tablet, visible on large screens) */}
                    <motion.div
                        style={{ opacity, y: subtextY }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="hidden lg:flex justify-end absolute top-32 right-20 z-20"
                    >
                        <div className="text-base text-gray-500 max-w-lg text-right leading-relaxed">
                            Más del <span className="font-bold text-black">80%</span> de nuestros <span className="font-bold text-black">proyectos</span> son <span className="font-bold text-black">referidos</span><br />
                            por clientes anteriores que conocen<br />
                            nuestro trabajo y compromiso
                        </div>
                    </motion.div>



                    <motion.div
                        style={{
                            scale,
                            opacity,
                            filter: blurFilter
                        }}
                        suppressHydrationWarning
                        className="w-full origin-center z-10 pb-4 lg:pb-2 mt-32"
                    >
                        <motion.h1
                            className="text-[clamp(2rem,8vw,7.5rem)] font-heading font-medium leading-[0.85] tracking-tighter text-black"
                        >
                            <AnimatedLine text="Soluciones digitales que escalan negocios ambiciosos." />
                        </motion.h1>
                    </motion.div>

                    {/* Mobile/Tablet Subtext (Below title) */}
                    <motion.div
                        style={{ opacity, y: subtextY }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="lg:hidden mt-8 md:mt-12 max-w-sm md:max-w-lg mb-8"
                    >
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed text-left">
                            Más del <span className="font-bold text-black">80%</span> de nuestros <span className="font-bold text-black">proyectos</span> son <span className="font-bold text-black">referidos</span><br />
                            por clientes anteriores que conocen<br />
                            nuestro trabajo y compromiso
                        </p>
                    </motion.div>

                    {/* Mobile/Tablet Monitor Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:hidden relative self-center w-full max-w-[340px] group flex flex-col items-center pb-10"
                    >
                        {/* Monitor Frame */}
                        <div className="relative w-full aspect-video bg-black rounded-xl p-1 shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden">
                            {/* Screen */}
                            <div className="relative w-full h-full bg-zinc-900 rounded-lg overflow-hidden">
                                <video
                                    src="/videos-raros/bideo3.mov"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                {/* Surface Gloss */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />
                            </div>
                        </div>
                        {/* Monitor Stand/Base */}
                        <div className="relative flex flex-col items-center -mt-[1px]">
                            {/* Neck */}
                            <div className="w-10 h-3 bg-neutral-900" />
                            {/* Base */}
                            <div className="w-20 h-1.5 bg-neutral-950 rounded-full shadow-sm" />
                        </div>
                    </motion.div>

                </div>
                <ScrollArrow className="text-black/80 hover:text-black" />
            </div>
        </section>
    );
}
