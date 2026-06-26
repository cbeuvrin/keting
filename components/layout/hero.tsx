import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, Variants, useMotionValue, useMotionValueEvent, useSpring, animate, cubicBezier, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ScrollArrow } from "@/components/ui/scroll-arrow";
import { ContactModal } from "@/components/pricing/contact-modal";
import { useLang } from "@/lib/i18n/lang-context";


export function Hero() {
    const { t } = useLang();
    const targetRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

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
    const prefersReduced = useReducedMotion();

    // El efecto lupa crea ~2 springs por letra (~100 en total) → muy costoso en
    // JS y, en móvil/táctil, inútil (no hay mouse que lo active). Solo lo
    // encendemos en escritorio con puntero fino; en móvil el título va plano
    // (carga mucho más rápido + mejora el LCP).
    const [magnify, setMagnify] = useState(false);
    useEffect(() => {
        if (prefersReduced) return;
        const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
        const update = () => setMagnify(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [prefersReduced]);

    // Automatic sweep animation on load
    useEffect(() => {
        if (!targetRef.current || hasAnimated || prefersReduced) return;

        const section = targetRef.current;
        const sectionWidth = section.offsetWidth;

        // Barrido de bienvenida: la "lupa" recorre el título al cargar.
        // Arranca pronto (ya no hay preloader que esperar) y con un ease suave.
        const timer = setTimeout(() => {
            animate(mouseX, sectionWidth, {
                duration: 2.8,
                ease: [0.4, 0, 0.2, 1],
                onComplete: () => {
                    setHasAnimated(true);
                    mouseX.set(0); // Reset after animation
                }
            });
        }, 700);

        return () => clearTimeout(timer);
    }, [hasAnimated, mouseX, prefersReduced]);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // Individual character component that reacts to mouse with Magnifying Glass effect
    const MagnifyingChar = ({ char, index, baseDelay }: { char: string, index: number, baseDelay: number }) => {
        const ref = useRef<HTMLSpanElement>(null);
        // Centro X del carácter (relativo a la sección), medido UNA vez y cacheado.
        // Antes se llamaba getBoundingClientRect en cada frame por cada letra →
        // layout thrash y tirones. Cacheado = movimiento fluido.
        const centerX = useRef(0);

        useEffect(() => {
            const measure = () => {
                const el = ref.current;
                const parent = el?.closest("section");
                if (!el || !parent) return;
                const r = el.getBoundingClientRect();
                const p = parent.getBoundingClientRect();
                centerX.current = r.left + r.width / 2 - p.left;
            };
            measure();
            // Re-mide cuando el layout se asienta tras la entrada y al redimensionar.
            const t = setTimeout(measure, 700);
            window.addEventListener("resize", measure);
            return () => {
                clearTimeout(t);
                window.removeEventListener("resize", measure);
            };
        }, []);

        const RADIUS = 160;
        // Smoothstep: caída suave en los bordes del radio (burbuja natural).
        const falloff = (val: number) => {
            if (prefersReduced) return 0;
            const dist = Math.abs(val - centerX.current);
            if (dist >= RADIUS) return 0;
            const k = 1 - dist / RADIUS;
            return k * k * (3 - 2 * k);
        };

        const scale = useTransform(mouseX, (val: number) => 1 + falloff(val) * 1.4);
        const yShift = useTransform(mouseX, (val: number) => -falloff(val) * 10);

        // Física suave: glide fluido sin jitter.
        const smoothScale = useSpring(scale, { damping: 20, stiffness: 170, mass: 0.55 });
        const smoothY = useSpring(yShift, { damping: 20, stiffness: 170, mass: 0.55 });

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
        // Móvil / táctil / reduced-motion: título plano, sin springs por letra.
        if (!magnify) {
            return (
                <span className={cn("inline-block mr-[0.25em] whitespace-nowrap", className)}>
                    {word}
                </span>
            );
        }

        const chars = word.split("");

        return (
            <span className={cn("inline-block mr-[0.25em] whitespace-nowrap", className)}>
                {chars.map((char, i) => (
                    <MagnifyingChar key={i} char={char} index={i} baseDelay={0} />
                ))}
            </span>
        )
    }

    // Helper to split text into words and animate them con styles desde el dictionary
    const AnimatedLine = ({ text, styles }: { text: string; styles: { playfair?: readonly string[]; italic?: readonly string[]; underlined?: readonly string[] } }) => {
        const words = text.split(" ");
        const playfair = (styles.playfair ?? []).map((w) => w.toLowerCase().replace(/[.,]/g, ""));
        const italic = (styles.italic ?? []).map((w) => w.toLowerCase().replace(/[.,]/g, ""));
        const underlined = (styles.underlined ?? []).map((w) => w.toLowerCase().replace(/[.,]/g, ""));

        return (
            <span className="block">
                {words.map((word, i) => {
                    const cleanWord = word.toLowerCase().replace(/[.,]/g, "");

                    let className = "";
                    if (playfair.includes(cleanWord)) {
                        className = "font-[family-name:var(--font-playfair)] italic font-normal";
                    } else if (italic.includes(cleanWord)) {
                        className = "italic font-light";
                    } else if (underlined.includes(cleanWord)) {
                        className = "relative inline-block underline decoration-2 md:decoration-[3px] underline-offset-[0.12em] decoration-black";
                    }

                    return (
                        <AnimatedWord
                            key={i}
                            word={word}
                            className={className}
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

                {/* Asterisco decorativo gigante girando con el scroll */}
                <motion.span
                    style={{ rotate: rotateK, opacity }}
                    suppressHydrationWarning
                    className="absolute top-[6%] right-[4%] lg:top-[12%] lg:right-[8%] text-[5rem] sm:text-[8rem] md:text-[14rem] lg:text-[18rem] text-black/[0.04] select-none font-light leading-none inline-block origin-center pointer-events-none"
                >
                    *
                </motion.span>

                <div className="w-full px-6 md:px-12 lg:px-20 relative z-10 flex flex-col justify-end h-full pb-44 md:pb-24 lg:pb-14">
                    {/* Desktop Subtext (Hidden on mobile/tablet, visible on large screens) */}
                    {/* Visible desde el primer paint (sin gate de opacidad) — es el elemento LCP.
                        Conserva el parallax/fade al hacer scroll vía `style`. */}
                    <motion.div
                        style={{ opacity, y: subtextY }}
                        suppressHydrationWarning
                        className="hidden lg:flex justify-end absolute top-32 right-20 z-20"
                    >
                        <div className="text-base text-gray-500 max-w-lg text-right leading-relaxed">
                            {t.hero.stats.prefix}{" "}
                            <span className="bg-black text-white px-2 py-0.5 font-medium">{t.hero.stats.stat}</span>{" "}
                            {t.hero.stats.middle}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal text-black">{t.hero.stats.projects}</span>{" "}
                            {t.hero.stats.are}{" "}
                            <span className="relative inline-block font-medium text-black">
                                {t.hero.stats.referred}
                                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-black/80" />
                            </span>
                            <br />
                            {t.hero.stats.line2}<br />
                            {t.hero.stats.line3}
                        </div>
                    </motion.div>

                    <div className="relative w-full flex flex-col pt-4 md:pt-6">
                        <motion.div
                            style={{
                                scale,
                                opacity,
                                filter: blurFilter
                            }}
                            suppressHydrationWarning
                            className="w-full origin-center relative z-10 pb-4 lg:pb-2"
                        >
                            <motion.div
                                style={{ opacity, y: subtextY }}
                                suppressHydrationWarning
                                className="flex items-center gap-3 mb-8 md:mb-12"
                            >
                                <span className="block w-12 h-px bg-gray-400" />
                                <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-gray-500 font-sans">
                                    {t.hero.eyebrow}
                                </span>
                            </motion.div>

                            <motion.h1
                                className="text-[clamp(2.5rem,10vw,7.5rem)] font-heading font-medium leading-[0.85] tracking-tighter text-black"
                            >
                                <AnimatedLine text={t.hero.title} styles={t.hero.titleStyles} />
                            </motion.h1>
                        </motion.div>
                    </div>

                    {/* Mobile/Tablet Subtext (Below title) — elemento LCP en celular.
                        Visible al instante (sin opacity:0 + delay que retrasaban el LCP ~2.7s);
                        el fade/parallax al scroll se mantiene vía `style`. */}
                    <motion.div
                        style={{ opacity, y: subtextY }}
                        suppressHydrationWarning
                        className="lg:hidden mt-8 md:mt-12 max-w-sm md:max-w-lg mb-8"
                    >
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed text-left">
                            {t.hero.stats.prefix}{" "}
                            <span className="bg-black text-white px-2 py-0.5 font-medium">{t.hero.stats.stat}</span>{" "}
                            {t.hero.stats.middle}{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal text-black">{t.hero.stats.projects}</span>{" "}
                            {t.hero.stats.are}{" "}
                            <span className="relative inline-block font-medium text-black">
                                {t.hero.stats.referred}
                                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-black/80" />
                            </span>
                            <br />
                            {t.hero.stats.line2}<br />
                            {t.hero.stats.line3}
                        </p>

                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="mt-8 bg-black text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-lg hover:bg-zinc-800 transition-colors w-fit"
                        >
                            {t.hero.cta}
                        </button>
                    </motion.div>

                    <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />




                </div>
                <ScrollArrow className="text-black/80 hover:text-black" />
            </div>
        </section>
    );
}
