"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";

const logos = [
    { src: "/logos-clientes/2.png", alt: "Nike Strength" },
    { src: "/logos-clientes/3.png", alt: "DiDi" },
    { src: "/logos-clientes/1.png", alt: "Suzuki" },
    { src: "/logos-clientes/6.png", alt: "WSO" },
    { src: "/logos-clientes/4.png", alt: "Iudex" },
    { src: "/logos-clientes/7.png", alt: "Toogo" },
    { src: "/logos-clientes/9.png", alt: "Ivan Ivanovich" },
    { src: "/logos-clientes/10.png", alt: "Uhthoff 1905" },
    { src: "/logos-clientes/11.png", alt: "360 Protective" },
    { src: "/logos-clientes/12.png", alt: "Blindajes" },
];

export function BrandsConstellation() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });

    // Asteriscos giratorios
    const rotateA = useTransform(smooth, [0, 1], [0, 540]);
    const rotateB = useTransform(smooth, [0, 1], [0, -720]);

    return (
        <section
            ref={ref}
            className="relative bg-[#0a0a0a] text-white pt-20 md:pt-24 pb-20 md:pb-24 overflow-clip snap-start"
        >
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Asteriscos */}
            <motion.span
                style={{ rotate: rotateA }}
                className="absolute top-[8%] left-[3%] text-[6rem] sm:text-[10rem] md:text-[18rem] text-white/[0.05] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>
            <motion.span
                style={{ rotate: rotateB }}
                className="absolute bottom-[10%] right-[5%] text-[5rem] sm:text-[8rem] md:text-[14rem] text-white/[0.05] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-10 md:mb-14 relative">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 mb-6 md:mb-8"
                >
                    <span className="block w-12 h-px bg-white/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/60 font-sans">
                        Algunos de los nuestros
                    </span>
                </motion.div>

                {/* Título — mismo tamaño que las otras secciones del home */}
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white font-heading">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                    >
                        Construido para{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">marcas</span>
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                    >
                        que cambian su{" "}
                        <span className="relative inline-block">
                            industria
                            <motion.span
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute -bottom-1 left-0 right-0 h-[2px] md:h-[3px] bg-white origin-left"
                            />
                        </span>
                        <span className="inline-block ml-2 md:ml-3 text-2xl md:text-4xl align-top rotate-12 text-white/30">*</span>
                    </motion.span>
                </h2>
            </div>

            {/* Tanque de física — logos caen y se acumulan */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative">
                <LogoTank />
            </div>

            {/* Footer line + counter */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-12 md:mt-16 relative">
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-white/20 w-full origin-left mb-6"
                />
                <div className="flex items-center justify-between text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 font-mono">
                    <span>10+ marcas</span>
                    <span>8 industrias</span>
                    <span>2020 — 2026</span>
                </div>
            </div>
        </section>
    );
}

/**
 * Tanque con física: los logos caen desde arriba en cascada y se acumulan en el fondo.
 * Arrastrables con el cursor (como las WWW. en /webdesing).
 */
function LogoTank() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const logoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const isInView = useInView(sceneRef, { once: true, margin: "-5%" });
    const [armed, setArmed] = useState(false);

    useEffect(() => {
        if (isInView) setArmed(true);
    }, [isInView]);

    useEffect(() => {
        if (!armed || !sceneRef.current) return;

        const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

        const engine = Engine.create();
        engine.gravity.y = 1;
        engineRef.current = engine;

        const runner = Runner.create();
        runnerRef.current = runner;

        const rect = sceneRef.current.getBoundingClientRect();
        const tankWidth = rect.width;
        const tankHeight = rect.height;
        const isMobile = window.innerWidth < 768;

        // Tamaño de cada caja contenedora del logo (más pequeño en mobile)
        const cellW = isMobile ? 110 : 170;
        const cellH = isMobile ? 60 : 90;

        // Paredes y suelo
        const wallThickness = 60;
        const ground = Bodies.rectangle(
            tankWidth / 2,
            tankHeight + wallThickness / 2 - 1,
            tankWidth * 2,
            wallThickness,
            { isStatic: true, label: "ground" },
        );
        const leftWall = Bodies.rectangle(
            -wallThickness / 2,
            tankHeight / 2,
            wallThickness,
            tankHeight * 2,
            { isStatic: true },
        );
        const rightWall = Bodies.rectangle(
            tankWidth + wallThickness / 2,
            tankHeight / 2,
            wallThickness,
            tankHeight * 2,
            { isStatic: true },
        );
        Composite.add(engine.world, [ground, leftWall, rightWall]);

        // Mouse para arrastrar
        const mouse = Mouse.create(sceneRef.current);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.15, render: { visible: false } },
        });
        // No bloquear scroll de página
        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
        if ((mouse as any).wheel) {
            mouse.element.removeEventListener("wheel", (mouse as any).wheel);
        }
        const allowScroll = (e: Event) => e.stopPropagation();
        mouse.element.addEventListener("wheel", allowScroll, { passive: true });
        Composite.add(engine.world, mouseConstraint);

        Runner.run(runner, engine);

        // Spawning escalonado: un logo cada 250ms
        const bodies: Matter.Body[] = [];
        const spawnTimers: ReturnType<typeof setTimeout>[] = [];

        logos.forEach((_, index) => {
            const timer = setTimeout(() => {
                const x = cellW / 2 + Math.random() * (tankWidth - cellW);
                const y = -cellH - Math.random() * 100;
                const body = Bodies.rectangle(x, y, cellW, cellH, {
                    restitution: 0.35,
                    friction: 0.45,
                    chamfer: { radius: 12 },
                    angle: (Math.random() - 0.5) * 0.3,
                });
                bodies[index] = body;
                Composite.add(engine.world, body);
            }, index * 280);
            spawnTimers.push(timer);
        });

        // Loop de sincronización física → DOM
        let rafId: number;
        const updateLoop = () => {
            bodies.forEach((body, i) => {
                const el = logoRefs.current[i];
                if (body && el) {
                    const { x, y } = body.position;
                    el.style.transform = `translate(${x - cellW / 2}px, ${y - cellH / 2}px) rotate(${body.angle}rad)`;
                    el.style.width = `${cellW}px`;
                    el.style.height = `${cellH}px`;
                    el.style.opacity = "1";
                }
            });
            rafId = requestAnimationFrame(updateLoop);
        };
        updateLoop();

        return () => {
            cancelAnimationFrame(rafId);
            spawnTimers.forEach(clearTimeout);
            Runner.stop(runner);
            Engine.clear(engine);
            engineRef.current = null;
            runnerRef.current = null;
        };
    }, [armed]);

    return (
        <div
            ref={sceneRef}
            className="relative w-full h-[400px] md:h-[520px] overflow-hidden rounded-2xl border border-white/10"
        >
            {/* Marca interior sutil (línea inferior tipo recipiente) */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15 pointer-events-none z-10" />

            {/* Label flotante esquina */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
                <span className="block w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/40 font-mono">
                    Arrástralos
                </span>
            </div>

            {/* Logos como DOM nodes */}
            {logos.map((logo, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        logoRefs.current[i] = el;
                    }}
                    className="absolute top-0 left-0 flex items-center justify-center select-none pointer-events-auto cursor-grab active:cursor-grabbing"
                    style={{
                        touchAction: "pan-y",
                        opacity: 0,
                        willChange: "transform",
                    }}
                >
                    <img
                        src={logo.src}
                        alt={logo.alt}
                        className="max-w-[80%] max-h-[80%] object-contain"
                        style={{ filter: "invert(1)" }}
                        draggable={false}
                    />
                </div>
            ))}
        </div>
    );
}
