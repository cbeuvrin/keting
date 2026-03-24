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

    // Smooth Scroll Physics
    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.1,
        stiffness: 80,
        damping: 10,
        restDelta: 0.001
    });

    // 2. SCROLLYTELLING LOGIC
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const totalFrames = 240; // Updated frame count for smoother animation

    // Load images on mount
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            // Format: 00001.png, 00002.png ... 00240.png
            const paddedIndex = i.toString().padStart(5, '0');
            img.src = `/images/landing3d/frames4/${paddedIndex}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    setImages(loadedImages); // Trigger re-render to start drawing
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    // Draw frame based on smooth scroll
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Optimized Resize Handler for High DPI
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = true;
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial setup

        // Subscribe to SMOOTH scroll changes
        const unsubscribe = smoothProgress.on("change", (latest) => {
            const frameIndex = Math.min(
                totalFrames - 1,
                Math.floor(latest * (totalFrames - 1))
            );

            requestAnimationFrame(() => renderFrame(frameIndex));
        });

        function renderFrame(index = 0) {
            if (!images[index] || !images[index].complete) return;

            const img = images[index];
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            const ratio = Math.max(canvasWidth / img.width, canvasHeight / img.height);
            const centerShift_x = (canvasWidth - img.width * ratio) / 2;
            const centerShift_y = (canvasHeight - img.height * ratio) / 2;

            ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx!.drawImage(
                img,
                0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
            );
        }

        const checkLoad = setInterval(() => {
            if (images[0] && images[0].complete) {
                renderFrame(0);
                clearInterval(checkLoad);
            }
        }, 100);

        return () => {
            window.removeEventListener("resize", handleResize);
            unsubscribe();
            clearInterval(checkLoad);
        };
    }, [images, smoothProgress]);

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
                            <Link href="/#portafolio" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Portafolio</Link>
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
                <div className="sticky top-0 z-0 h-screen w-full bg-black">
                    <canvas ref={canvasRef} className="block w-full h-full object-cover" />

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
                                vibe coder <span className="text-black/30 mx-4">✦</span>
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
                        <span className="italic text-zinc-600">vibe coder</span>
                        <span className="text-zinc-900">, diseñador & desarrollador web </span>
                        <span className="text-zinc-500">que trabaja en la intersección del diseño visual, la experiencia de usuario y el movimiento. </span>
                        <span className="text-zinc-400">Ayudo a marcas y equipos creativos a construir sitios web expresivos que se sienten audaces, intuitivos y diseñados para destacar.</span>
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
