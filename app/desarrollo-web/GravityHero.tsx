"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import ScrambleText from "./ScrambleText";

export default function GravityHero() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const [avatarHover, setAvatarHover] = useState(false);

    // Refs for the DOM elements corresponding to the bodies
    const lettersRef = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll-driven rotation para el asterisco gigante mobile (estilo soluciones-digitales)
    const { scrollYProgress: heroScroll } = useScroll({
        target: sceneRef,
        offset: ["start end", "end start"],
    });
    const smoothHero = useSpring(heroScroll, { stiffness: 50, damping: 22, mass: 0.6 });
    const asteriskRotate = useTransform(smoothHero, [0, 1], [0, 540]);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            World = Matter.World,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        // Create engine
        const engine = Engine.create();
        engineRef.current = engine;

        // Create runner
        const runner = Runner.create();
        runnerRef.current = runner;

        // Screen dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;

        // --- Create Bodies ---
        const isMobile = width < 768;
        const letterSize = Math.min(width * (isMobile ? 0.38 : 0.15), 220);
        const labels = ["W", "W", "W", "."];
        const bodies: Matter.Body[] = [];

        const totalWidth = labels.length * letterSize;
        // Desplazado a la izquierda — leftmost edge ~10% del viewport
        const startX = width * 0.1 + letterSize / 2;

        labels.forEach((label, index) => {
            const x = startX + index * letterSize * 1.05;
            const y = -200 - Math.random() * 100;

            const body = Bodies.rectangle(x, y, letterSize, letterSize, {
                restitution: 0.4,
                friction: 0.5,
                label: label,
                angle: (Math.random() - 0.5) * 0.1,
            });
            bodies.push(body);
        });

        // Boundaries
        const ground = Bodies.rectangle(width / 2, height + 10, width, 100, {
            isStatic: true,
            render: { visible: false }
        });

        const wallThickness = 100;
        const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 5, { isStatic: true });
        const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 5, { isStatic: true });

        Composite.add(engine.world, [...bodies, ground, leftWall, rightWall]);

        // Add mouse control
        const mouse = Mouse.create(sceneRef.current);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false },
            },
        });

        // Quitar listeners de wheel que Matter adjunta — bloquean el scroll de página
        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
        if ((mouse as any).wheel) {
            mouse.element.removeEventListener("wheel", (mouse as any).wheel);
        }
        // Permitir explícitamente que el scroll de página funcione sobre el hero
        const allowScroll = (e: Event) => { e.stopPropagation(); };
        mouse.element.addEventListener("wheel", allowScroll, { passive: true });

        Composite.add(engine.world, mouseConstraint);
        Runner.run(runner, engine);

        const updateLoop = () => {
            if (!engineRef.current) return;
            bodies.forEach((body, index) => {
                const domEl = lettersRef.current[index];
                if (domEl) {
                    const { x, y } = body.position;
                    const rotation = body.angle;
                    domEl.style.transform = `translate(${x - letterSize / 2}px, ${y - letterSize / 2}px) rotate(${rotation}rad)`;
                    domEl.style.width = `${letterSize}px`;
                    domEl.style.height = `${letterSize}px`;
                    domEl.style.opacity = "1";
                }
            });
            requestAnimationFrame(updateLoop);
        };
        updateLoop();

        const handleResize = () => {};
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            Runner.stop(runner);
            Engine.clear(engine);
            if (runnerRef.current) runnerRef.current = null;
            if (engineRef.current) engineRef.current = null;
        };
    }, []);

    return (
        <div
            ref={sceneRef}
            className="relative w-full h-screen overflow-hidden text-white pointer-events-none"
        >
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* H1 semántico para SEO — el hero es visual (letras de física), así que
                el encabezado va accesible (sr-only) con la keyword ancla de la página. */}
            <h1 className="sr-only">Diseño y desarrollo web a medida en México</h1>

            {/* Asteriscos decorativos gigantes (detrás de las letras) */}
            <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-[8%] left-[2%] text-[7rem] sm:text-[12rem] md:text-[22rem] text-white/[0.04] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>
            <motion.span
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[12%] right-[3%] text-[5rem] sm:text-[8rem] md:text-[16rem] text-white/[0.04] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            {/* Asterisco gigante centrado solo en mobile — gira con el scroll, estilo soluciones-digitales */}
            <motion.span
                style={{ rotate: asteriskRotate, x: "-50%", y: "-50%" }}
                className="md:hidden absolute top-1/2 left-1/2 text-[20rem] text-white/[0.07] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            {/* Esquina superior izquierda — badge numero + label (oculto en mobile para no chocar con el menú) */}
            <div className="absolute top-24 md:top-32 left-6 md:left-12 pointer-events-none hidden sm:flex items-start gap-3 md:gap-4 z-10">
                <span className="text-white/30 font-mono text-xs md:text-sm tracking-wider mt-1 md:mt-2">
                    01 / 05
                </span>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="block w-8 h-px bg-white/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/60 font-sans">
                            World Wide Web
                        </span>
                    </div>
                    <span className="text-white/40 text-[10px] md:text-xs font-[family-name:var(--font-playfair)] italic ml-10">
                        arrástralas
                    </span>
                </div>
            </div>

            {/* Bottom — label editorial alineado con el manifiesto (oculto en mobile para evitar saturación) */}
            <div className="absolute bottom-12 md:bottom-16 left-0 right-0 pointer-events-none z-10 hidden sm:block">
              <div className="container mx-auto px-6 md:px-12 flex justify-end">
                <div className="flex flex-col items-end gap-3 max-w-md">
                <div className="flex items-center gap-3">
                    <span className="block w-12 md:w-16 h-px bg-white/30" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.4em] uppercase text-white/50 font-sans">
                        Diseño <span className="font-[family-name:var(--font-playfair)] italic font-normal normal-case tracking-normal text-white/70">web</span> · 2026
                    </span>
                    <span className="block w-12 md:w-16 h-px bg-white/30" />
                </div>
                <span className="text-white/30 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    Scroll
                </span>
                </div>
              </div>
            </div>

            {["W", "W", "W", "."].map((char, i) => (
                <div
                    key={i}
                    ref={(el) => { lettersRef.current[i] = el; }}
                    className={cn(
                        "absolute top-0 left-0 hidden md:flex items-center justify-center font-bold select-none cursor-grab active:cursor-grabbing",
                        "text-white border-none pointer-events-auto"
                    )}
                    style={{
                        touchAction: 'pan-y',
                        opacity: 0,
                        willChange: "transform",
                        fontSize: "clamp(4rem, 15vw, 12rem)",
                        lineHeight: 1
                    }}
                >
                    {char}
                </div>
            ))}

            <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
                <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-start">
                    <div className="flex justify-end mt-[40vh] md:mt-32 pointer-events-auto">
                      <div className="flex flex-col items-end max-w-md">
                        {/* Eyebrow editorial */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/60 font-sans">
                                Manifiesto
                            </span>
                            <span className="block w-10 h-px bg-white/40" />
                        </div>
                        <p className="text-sm md:text-base text-white/80 text-justify md:text-right leading-relaxed font-light">
                            Como <ScrambleText text="AI Engineer" className="font-bold text-white" />, diseñamos y estructuramos{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal text-white">soluciones digitales</span>{" "}
                            precisas, desde tiendas en línea hasta plataformas de cursos. Nos especializamos en{" "}
                            <span className="relative inline-block text-white font-medium">
                                desarrollo web
                                <span className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-white/70" />
                            </span>
                            , SEO y optimización de velocidad, construyendo sitios sólidos y eficientes que impulsan el{" "}
                            <span className="font-[family-name:var(--font-playfair)] italic font-normal text-white">crecimiento real</span>{" "}
                            de tu negocio.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-8 pointer-events-auto">
                        <div className="text-right">
                            <p className="text-sm md:text-base text-white font-medium tracking-tight">
                                Carlos Beuvrin
                            </p>
                            <p className="text-xs md:text-sm text-white/50 font-light italic">
                                Programador
                            </p>
                        </div>
                        <div
                            className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0"
                            onMouseEnter={() => setAvatarHover(true)}
                            onMouseLeave={() => setAvatarHover(false)}
                        >
                            <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a] border border-white/10 shadow-xl flex items-center justify-center cursor-pointer">
                                <img
                                    src="/carlos-beuvrin.png"
                                    alt="Carlos Beuvrin - Director de Keting Media · Diseño y desarrollo de software, web y apps a medida en México"
                                    className="w-full h-full object-cover grayscale brightness-110 scale-125"
                                />
                            </div>

                            <AnimatePresence>
                                {avatarHover && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.85, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.92, y: -8 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute top-full right-0 mt-4 w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden bg-[#1a1a1a] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-50 pointer-events-none"
                                    >
                                        <img
                                            src="/carlos-beuvrin.png"
                                            alt="Carlos Beuvrin - Director de Keting Media · Diseño y desarrollo de software, web y apps a medida en México"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
