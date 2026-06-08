"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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

            {/* Logos formados por partículas — morph en loop */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
                <LogoParticles />
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
 * LogoParticles — miles de partículas se reúnen para formar cada logo en secuencia,
 * se dispersan y vuelven a formar el siguiente. Implementado con Canvas 2D puro.
 */
function LogoParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId = 0;
        let running = true;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Dimensiones
        const setup = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        setup();

        let W = canvas.clientWidth;
        let H = canvas.clientHeight;

        // Pool de partículas
        const COUNT = 3500;
        const particles = Array.from({ length: COUNT }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            tx: Math.random() * W,
            ty: Math.random() * H,
            vx: 0,
            vy: 0,
        }));

        // Extrae puntos donde el logo tiene contenido (alfa > umbral y no es blanco)
        const extractPoints = (src: string): Promise<Array<[number, number]>> =>
            new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    // Escala el logo para que ocupe ~55% del menor lado del canvas
                    const targetSize = Math.min(W, H) * 0.55;
                    const scale = targetSize / Math.max(img.width, img.height);
                    const w = Math.round(img.width * scale);
                    const h = Math.round(img.height * scale);
                    const off = document.createElement("canvas");
                    off.width = w;
                    off.height = h;
                    const octx = off.getContext("2d");
                    if (!octx) return resolve([]);
                    octx.drawImage(img, 0, 0, w, h);
                    const data = octx.getImageData(0, 0, w, h).data;
                    const points: Array<[number, number]> = [];
                    const step = 3; // densidad de muestreo
                    const offsetX = (W - w) / 2;
                    const offsetY = (H - h) / 2;
                    for (let y = 0; y < h; y += step) {
                        for (let x = 0; x < w; x += step) {
                            const idx = (y * w + x) * 4;
                            const r = data[idx];
                            const g = data[idx + 1];
                            const b = data[idx + 2];
                            const a = data[idx + 3];
                            // Es parte del logo: alpha alto Y no es blanco/casi blanco
                            const avg = (r + g + b) / 3;
                            if (a > 150 && avg < 220) {
                                points.push([x + offsetX, y + offsetY]);
                            }
                        }
                    }
                    resolve(points);
                };
                img.onerror = () => resolve([]);
                img.src = src;
            });

        // Asigna targets a partir de los puntos extraídos
        const assignTargets = (points: Array<[number, number]>) => {
            if (!points.length) return;
            // Shuffle
            for (let i = points.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [points[i], points[j]] = [points[j], points[i]];
            }
            particles.forEach((p, i) => {
                const point = points[i % points.length];
                if (point) {
                    // Pequeño jitter orgánico
                    p.tx = point[0] + (Math.random() - 0.5) * 2;
                    p.ty = point[1] + (Math.random() - 0.5) * 2;
                }
            });
        };

        // Targets dispersos (estado entre logos)
        const dispersedTargets = () => {
            particles.forEach((p) => {
                p.tx = Math.random() * W;
                p.ty = Math.random() * H;
            });
        };

        // Secuencia de logos
        const sources = LOGO_SRCS;
        let logoIndex = 0;
        let phase: "forming" | "holding" | "dispersing" = "dispersing";
        let phaseStart = performance.now();
        const DURATIONS = { forming: 1800, holding: 1600, dispersing: 1200 };

        dispersedTargets();

        const advance = async () => {
            if (!running) return;
            if (phase === "dispersing") {
                phase = "forming";
                const pts = await extractPoints(sources[logoIndex]);
                assignTargets(pts);
                phaseStart = performance.now();
            } else if (phase === "forming") {
                phase = "holding";
                phaseStart = performance.now();
            } else if (phase === "holding") {
                phase = "dispersing";
                dispersedTargets();
                phaseStart = performance.now();
                logoIndex = (logoIndex + 1) % sources.length;
            }
        };

        // Inicial: extrae el primer logo y empieza
        (async () => {
            const pts = await extractPoints(sources[0]);
            assignTargets(pts);
            phase = "forming";
            phaseStart = performance.now();
        })();

        const draw = (now: number) => {
            if (!running) return;

            const elapsed = now - phaseStart;
            const duration = DURATIONS[phase];

            if (elapsed >= duration) advance();

            // Lerp factor según fase (más suave al formar, más rápido al dispersar)
            const lerp = phase === "forming" ? 0.045 : phase === "holding" ? 0.08 : 0.025;

            // Limpiar canvas con un negro semi-transparente para trail orgánico
            ctx.fillStyle = "rgba(10, 10, 10, 0.30)";
            ctx.fillRect(0, 0, W, H);

            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += (p.tx - p.x) * lerp;
                p.y += (p.ty - p.y) * lerp;
                ctx.fillRect(p.x, p.y, 1.4, 1.4);
            }

            rafId = requestAnimationFrame(draw);
        };
        rafId = requestAnimationFrame(draw);

        const handleResize = () => {
            setup();
            W = canvas.clientWidth;
            H = canvas.clientHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            running = false;
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="relative w-full h-[420px] md:h-[560px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* Label esquina */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
                <span className="block w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/40 font-mono">
                    Marcas · loop
                </span>
            </div>
        </div>
    );
}

const LOGO_SRCS = [
    "/logos-clientes/2.png",
    "/logos-clientes/3.png",
    "/logos-clientes/1.png",
    "/logos-clientes/6.png",
    "/logos-clientes/4.png",
    "/logos-clientes/7.png",
    "/logos-clientes/9.png",
    "/logos-clientes/10.png",
    "/logos-clientes/11.png",
    "/logos-clientes/12.png",
];
