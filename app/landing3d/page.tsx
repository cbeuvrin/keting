"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { ContactModal } from "@/components/pricing/contact-modal";

export default function ScrollyTellingLanding() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    // 1. SCROLL SETUP
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth Scroll Physics — tuned para fluidez sin rebote
    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.4,
        stiffness: 120,
        damping: 30,
        restDelta: 0.0005
    });

    // 2. SCROLLYTELLING — CSS 3D laptop, scroll abre la tapa
    // Tapa: rotateX 0deg (cerrada, plana sobre base) → -105deg (abierta hacia atrás)
    const lidRotation = useTransform(smoothProgress, [0, 0.55], [0, -105]);
    // Tilt de cámara: arranca picado desde arriba, baja a 3/4 cuando abre
    const cameraTilt = useTransform(smoothProgress, [0, 0.55], [65, 20]);
    // Zoom final una vez abierta
    const stageScale = useTransform(smoothProgress, [0.55, 0.85, 1], [1, 1.15, 1.25]);
    const stageY = useTransform(smoothProgress, [0.55, 1], ["0vh", "-8vh"]);

    // Marquee continuous movement - scroll changes direction only
    const marqueeX = useMotionValue(0);
    useEffect(() => {
        let direction = -1; // -1 = left, 1 = right
        let lastScroll = window.scrollY;
        const speed = 1.5; // px per frame

        const handleScroll = () => {
            const delta = window.scrollY - lastScroll;
            if (delta > 0) direction = -1; // scrolling down → move left
            if (delta < 0) direction = 1;  // scrolling up → move right
            lastScroll = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        let raf: number;
        const animate = () => {
            marqueeX.set(marqueeX.get() + direction * speed);
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(raf);
        };
    }, [marqueeX]);


    return (
        <div ref={containerRef} className="bg-black min-h-[500vh] relative">

            {/* Mobile Header - Top */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center items-center pointer-events-none px-4 md:hidden"
            >
                <div className="w-full max-w-sm bg-[#111111] text-white rounded-xl p-3 flex items-center justify-between shadow-2xl pointer-events-auto border border-white/10">
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/" className="flex items-center">
                        <span className="font-heading font-black text-lg tracking-wider uppercase">KETING</span>
                    </Link>
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors relative">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </motion.header>

            {/* Desktop Header - Top Left */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-6 z-50 items-center pointer-events-none hidden md:flex"
            >
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div className="bg-[#111111] border border-white/10 p-1.5 pl-6 pr-2 rounded-2xl flex items-center gap-1 shadow-2xl">
                        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center mr-4">
                            <img src="/keting-logo-white.png" alt="Keting" className="h-7 w-auto object-contain" />
                        </Link>
                        <nav className="flex items-center gap-6 px-2">
                            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Inicio</Link>
                            <Link href="/portafolio" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Portafolio</Link>
                            <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">App</Link>
                        </nav>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="bg-[#222222] text-white px-6 h-10 rounded-xl text-sm font-medium hover:bg-[#333333] transition-colors ml-4 border border-white/5"
                        >
                            Let&apos;s Talk
                        </button>
                    </div>
                    <button className="w-14 h-14 bg-[#111111] rounded-2xl flex items-center justify-center border border-white/10 hover:bg-[#222222] transition-colors group shadow-2xl">
                        <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </motion.header>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            {/* Scrollytelling Container - canvas is sticky only within this */}
            <div className="relative min-h-[500vh]">
                {/* Sticky Canvas - unsticks when this container ends */}
                <div className="sticky top-0 z-0 h-screen w-full bg-black flex items-center justify-center overflow-hidden">
                    {/* Escenario 3D CSS — laptop minimal */}
                    <motion.div
                        style={{
                            scale: stageScale,
                            y: stageY,
                            perspective: "2200px",
                            perspectiveOrigin: "50% 55%",
                        }}
                        className="relative"
                    >
                        <motion.div
                            style={{
                                rotateX: cameraTilt,
                                transformStyle: "preserve-3d",
                            }}
                            className="relative"
                        >
                            {/* BASE — keyboard surface (horizontal slab) */}
                            <div
                                style={{
                                    width: "640px",
                                    height: "440px",
                                    borderRadius: "16px",
                                    background: "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
                                    boxShadow: "0 80px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
                                    transformStyle: "preserve-3d",
                                }}
                                className="relative"
                            >
                                {/* Reflejo sutil en el borde frontal */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-2 rounded-b-2xl"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                                    }}
                                />

                                {/* Trackpad */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 bottom-12 rounded-lg"
                                    style={{
                                        width: "200px",
                                        height: "120px",
                                        background: "linear-gradient(180deg, #232323, #1a1a1a)",
                                        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.04), inset 0 -1px 2px rgba(0,0,0,0.5)",
                                    }}
                                />

                                {/* Teclado — grid de teclas */}
                                <div
                                    className="absolute top-8 left-8 right-8 grid gap-1.5"
                                    style={{
                                        height: "180px",
                                        gridTemplateColumns: "repeat(14, 1fr)",
                                        gridTemplateRows: "repeat(5, 1fr)",
                                    }}
                                >
                                    {Array.from({ length: 70 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="rounded-[3px]"
                                            style={{
                                                background: "linear-gradient(180deg, #1a1a1a, #0d0d0d)",
                                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 1px rgba(0,0,0,0.4)",
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Hinge visible — banda fina en el back edge */}
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                                    style={{
                                        width: "180px",
                                        height: "3px",
                                        background: "linear-gradient(90deg, #0a0a0a, #2a2a2a, #0a0a0a)",
                                    }}
                                />
                            </div>

                            {/* TAPA / LID — pivota en el borde trasero del base */}
                            <motion.div
                                style={{
                                    rotateX: lidRotation,
                                    transformOrigin: "50% 100%",
                                    transformStyle: "preserve-3d",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "640px",
                                    height: "440px",
                                }}
                            >
                                {/* Cara EXTERIOR (visible cuando cerrada — el logo aparece desde arriba) */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center rounded-2xl"
                                    style={{
                                        background: "linear-gradient(135deg, #2c2c2c 0%, #161616 100%)",
                                        backfaceVisibility: "hidden",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                                    }}
                                >
                                    <span
                                        className="font-heading font-black text-white/30 tracking-tighter"
                                        style={{ fontSize: "8rem", lineHeight: 1 }}
                                    >
                                        K
                                    </span>
                                </div>

                                {/* Cara INTERIOR (la pantalla — visible cuando se abre) */}
                                <div
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background: "#0a0a0a",
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                                    }}
                                >
                                    {/* Bezel + display */}
                                    <div
                                        className="absolute inset-3 rounded-lg overflow-hidden"
                                        style={{
                                            background: "linear-gradient(180deg, #0f0f0f 0%, #050505 100%)",
                                        }}
                                    >
                                        {/* Contenido de la pantalla */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                                            {/* Top bar simulada */}
                                            <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-white/15" />
                                                <div className="w-2 h-2 rounded-full bg-white/15" />
                                                <div className="w-2 h-2 rounded-full bg-white/15" />
                                                <div className="flex-1 mx-3 h-5 bg-white/[0.03] rounded" />
                                            </div>

                                            <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3 font-mono">
                                                Studio · AI Engineer
                                            </span>
                                            <h2 className="font-[family-name:var(--font-playfair)] italic text-white text-7xl leading-none">
                                                KETING
                                            </h2>
                                            <div className="mt-6 w-16 h-px bg-white/20" />
                                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3 font-mono">
                                                Energy · Immersive
                                            </span>

                                            {/* Cámara */}
                                            <div
                                                className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-black"
                                                style={{ boxShadow: "0 0 4px rgba(0,0,0,0.6)" }}
                                            >
                                                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-zinc-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Hero Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            y: useTransform(scrollYProgress, [0, 0.25], [0, -250]),
                            opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0])
                        }}
                        className="absolute inset-0 flex items-center justify-center text-white text-6xl md:text-9xl font-black uppercase mix-blend-overlay text-center pointer-events-none"
                    >
                        ENERGY<br />IMMERSIVE
                    </motion.h1>

                    {/* Scroll instruction overlay */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm uppercase tracking-widest animate-pulse pointer-events-none"
                    >
                        Scroll
                    </motion.div>
                </div>
            </div>

            {/* Marquee Ribbon */}
            <div className="relative z-30 bg-[#DFDEE7] overflow-visible">
                <div className="bg-[#B8E3E9] border-y border-black/10 h-6 flex items-center overflow-visible -rotate-2 scale-[1.2]">
                    <motion.div className="flex whitespace-nowrap" style={{ x: marqueeX }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <span key={i} className="text-black text-5xl md:text-7xl font-heading font-black uppercase tracking-wider mx-8">
                                AI Engineer <span className="text-black/30 mx-4">✦</span>
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* About / Manifesto Section */}
            <div className="relative z-20 bg-[#DFDEE7] text-black min-h-screen flex items-center overflow-hidden">
                <div className="container mx-auto px-6 md:px-16 py-24 max-w-5xl">
                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-4xl lg:text-5xl font-medium leading-snug md:leading-tight tracking-tight"
                    >
                        <span className="text-zinc-900">Soy un </span>
                        <span className="italic text-zinc-600">AI Engineer</span>
                        <span className="text-zinc-900">, diseñador & desarrollador web </span>
                        <span className="text-zinc-500">que trabaja en la intersección del diseño visual, la experiencia de usuario y el movimiento. </span>
                        <span className="text-zinc-400">Ayudo a marcas y equipos creativos a construir sitios web expresivos que se sienten audaces, intuitivos y diseñados para destacar.</span>
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
