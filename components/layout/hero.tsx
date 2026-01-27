import { motion, useScroll, useTransform, Variants, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import { useRef } from "react";

export function Hero() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 5]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]); // Fades out much later
    const blur = useTransform(scrollYProgress, [0, 0.4], [0, 10]);
    const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);

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
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            scale: 0.9,
        },
        show: (custom) => ({
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
                delay: 0.02 * custom,
            },
        }),
    };

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

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

    const AnimatedWord = ({ word, wordIndex, lineBaseDelay }: { word: string, wordIndex: number, lineBaseDelay: number }) => {
        const chars = word.split("");
        const wordBaseDelay = lineBaseDelay + (wordIndex * 6);

        return (
            <span className="inline-block mr-[0.25em] whitespace-nowrap">
                {chars.map((char, i) => (
                    <MagnifyingChar key={i} char={char} index={i} baseDelay={wordBaseDelay} />
                ))}
            </span>
        )
    }

    // Helper to split text into words and animate them
    const AnimatedLine = ({ text, index }: { text: string; index: number }) => {
        const words = text.split(" ");
        const lineBaseDelay = index * 20;

        return (
            <span className="block"> {/* Removed perspective */}
                {words.map((word, i) => (
                    <AnimatedWord key={i} word={word} wordIndex={i} lineBaseDelay={lineBaseDelay} />
                ))}
            </span>
        );
    };

    const rotateK = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <section
            ref={targetRef}
            onMouseMove={handleMouseMove}
            className="relative h-[200vh]"
        >
            <div className="sticky top-0 h-screen flex flex-col justify-center relative">

                <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col justify-center h-full pb-32 md:pb-0">

                    {/* Desktop Subtext (Hidden on mobile/tablet, visible on large screens) */}
                    <motion.div
                        style={{ opacity }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="hidden lg:flex justify-end absolute top-32 right-12 z-20"
                    >
                        <p className="text-base text-gray-500 max-w-md text-right leading-relaxed">
                            Más del <span className="font-bold text-black">80%</span> de nuestros <span className="font-bold text-black">proyectos</span> son <span className="font-bold text-black">referidos<br />por clientes anteriores</span> que conocen nuestro trabajo y compromiso
                        </p>
                    </motion.div>

                    {/* Main Typography */}
                    <motion.div
                        style={{
                            scale,
                            opacity,
                            filter: blurFilter
                        }}
                        suppressHydrationWarning
                        className="max-w-6xl origin-center z-10 mt-48"
                    >
                        <motion.h1
                            className="text-[clamp(2rem,7vw,6.5rem)] font-heading font-medium leading-[0.9] tracking-tighter text-black"
                        >
                            <AnimatedLine text="Soluciones digitales que" index={0} />
                            <AnimatedLine text="escalan los negocios" index={1} />
                            <AnimatedLine text="de clientes ambiciosos." index={2} />
                        </motion.h1>
                    </motion.div>

                    {/* Mobile/Tablet Subtext (Below title) */}
                    <motion.div
                        style={{ opacity }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="lg:hidden mt-8 md:mt-12 max-w-sm md:max-w-lg"
                    >
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed text-left">
                            Más del <span className="font-bold text-black">80%</span> de nuestros <span className="font-bold text-black">proyectos</span> son <span className="font-bold text-black">referidos<br />por clientes anteriores</span> que conocen nuestro trabajo y compromiso
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
