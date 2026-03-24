"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { articles } from "@/lib/blog-data";

// Deterministic tilt per card index
const TILTS = articles.map((_, i) => ((i * 137 + 31) % 29) - 14);

// ─── Card ─────────────────────────────────────────────────────────────────────
function BlogCard({
    article,
    tilt,
    velocity,
}: {
    article: (typeof articles)[0];
    tilt: number;
    velocity: number;
}) {
    // Extra tilt based on movement velocity
    const liveRotation = tilt + velocity * 0.08;

    return (
        <Link href={`/blog/${article.slug}`} className="block relative z-30">
            <motion.article
                whileTap={{ scale: 0.98 }}
                style={{
                    rotate: liveRotation,
                    backgroundColor: article.color,
                    color: article.accent,
                }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative flex-shrink-0 w-[280px] md:w-[320px] h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl select-none cursor-pointer"
            >
                {/* Category tag */}
                <div
                    className="absolute top-6 left-6 text-[10px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full"
                    style={{ backgroundColor: article.accent, color: article.color }}
                >
                    {article.category}
                </div>

                {/* Big decorative number */}
                <div
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[120px] font-black leading-none opacity-[0.05] pointer-events-none select-none"
                    style={{ color: article.accent }}
                >
                    {String(article.id).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col gap-3">
                    <h3
                        className="text-xl font-bold leading-tight tracking-tight"
                        style={{ color: article.accent }}
                    >
                        {article.title}
                    </h3>
                    <p
                        className="text-sm leading-relaxed line-clamp-3 opacity-70"
                        style={{ color: article.accent }}
                    >
                        {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-4" style={{ borderTop: `1px solid ${article.accent}22` }}>
                        <span className="text-xs opacity-60 font-medium">
                            {article.author} · {article.date}
                        </span>
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: article.accent, color: article.color }}
                        >
                            <ExternalLink size={14} />
                        </div>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function BlogCarousel() {
    const CARD_WIDTH = 340; // card width + gap
    const TOTAL_WIDTH = CARD_WIDTH * articles.length;

    // --- State ---
    const [direction, setDirection] = useState<1 | -1>(1);
    const [velocity, setVelocity] = useState(0); // pixels/frame, drives tilt
    const [isDragging, setIsDragging] = useState(false);
    const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

    // --- Refs (avoid stale closures in rAF) ---
    const offsetRef = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const directionRef = useRef<1 | -1>(1);
    const dragStartXRef = useRef(0);
    const dragLastXRef = useRef(0);
    const dragVelocityRef = useRef(0); // live drag velocity
    const momentumRef = useRef(0);     // after release momentum

    // Keep directionRef in sync
    useEffect(() => { directionRef.current = direction; }, [direction]);

    // ── Animation loop ────────────────────────────────────────────────────────
    useAnimationFrame((_, delta) => {
        const dt = delta / 1000; // seconds

        let step = 0;

        if (draggingRef.current) {
            // While dragging: step is driven by pointer movement (already applied in onMouseMove)
            step = dragVelocityRef.current;
        } else {
            // Blend momentum → auto-scroll
            if (Math.abs(momentumRef.current) > 0.5) {
                // Decay momentum
                momentumRef.current *= 0.92;
                step = momentumRef.current;
            } else {
                momentumRef.current = 0;
                // Normal auto-scroll at 80 px/s
                step = directionRef.current * dt * 80;
            }
        }

        offsetRef.current = ((offsetRef.current + step) % TOTAL_WIDTH + TOTAL_WIDTH) % TOTAL_WIDTH;

        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
        }

        setVelocity(step);
    });

    // ── Pointer handlers ──────────────────────────────────────────────────────
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        // We don't use setPointerCapture to allow Link clicks to trigger
        draggingRef.current = true;
        dragStartXRef.current = e.clientX;
        dragLastXRef.current = e.clientX;
        dragVelocityRef.current = 0;
        momentumRef.current = 0;
        setIsDragging(true);
        setCursor("grabbing");
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        const dx = dragLastXRef.current - e.clientX;
        dragVelocityRef.current = dx;
        dragLastXRef.current = e.clientX;
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        
        const totalDrag = Math.abs(dragStartXRef.current - e.clientX);
        
        draggingRef.current = false;
        setIsDragging(false);
        setCursor("grab");

        // Hand off velocity to momentum
        momentumRef.current = dragVelocityRef.current;

        // If dragged more than 5px, we consider it a drag, not a click
        if (totalDrag > 5) {
            const dragDirection = dragStartXRef.current - e.clientX > 0 ? 1 : -1;
            directionRef.current = dragDirection;
            setDirection(dragDirection);
        }

        dragVelocityRef.current = 0;
    }, []);

    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        // If movement was significant, prevent click from triggering link
        const dx = Math.abs(dragStartXRef.current - e.clientX);
        if (dx > 5) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    // ── Keyboard a11y ─────────────────────────────────────────────────────────
    const handleLeft = useCallback(() => {
        setDirection(-1);
        directionRef.current = -1;
    }, []);

    const handleRight = useCallback(() => {
        setDirection(1);
        directionRef.current = 1;
    }, []);

    return (
        <section id="blog" className="relative w-full py-24 md:py-32 bg-white overflow-hidden">
            {/* Smooth background blend */}
            <div className="absolute inset-0 bg-[#FAFAFA] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />

            {/* ── Header ── */}
            <div className="container mx-auto px-6 md:px-12 mb-16 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                    <div>
                        <p className="text-xs font-bold tracking-[3px] uppercase text-gray-400 mb-3">
                            Blog &amp; Recursos
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] leading-none">
                            Ideas que<br />
                            <span className="italic font-light">inspiran</span>
                        </h2>
                    </div>

                    {/* Arrow buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLeft}
                            aria-label="Mover hacia la izquierda"
                            className={`group w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                direction === -1
                                    ? "bg-black border-black text-white"
                                    : "border-gray-200 text-gray-400 hover:border-black hover:text-black"
                            }`}
                        >
                            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button
                            onClick={handleRight}
                            aria-label="Mover hacia la derecha"
                            className={`group w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                direction === 1
                                    ? "bg-black border-black text-white"
                                    : "border-gray-200 text-gray-400 hover:border-black hover:text-black"
                            }`}
                        >
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>

                {/* Hint text */}
                <p className="mt-4 text-xs text-gray-400 flex items-center gap-1.5">
                    <span>← Arrastra el carrusel con el cursor →</span>
                </p>
            </div>

            {/* ── Track container ── */}
            <div
                className="relative w-full overflow-hidden z-10"
                style={{ cursor }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={handleContainerClick}
            >
                {/* Edge fades removed */}
                
                {/* Bottom fade - to fix the sharp cutting line */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent z-20 pointer-events-none" />

                {/* 3× duplicated cards for seamless loop */}
                <div
                    ref={trackRef}
                    className="flex gap-6 will-change-transform py-16 px-6" // Increased padding-y
                    style={{ width: `${TOTAL_WIDTH * 3}px` }}
                >
                    {[...articles, ...articles, ...articles].map((article, i) => (
                        <BlogCard
                            key={`${article.id}-${i}`}
                            article={article}
                            tilt={TILTS[article.id - 1]}
                            velocity={velocity}
                        />
                    ))}
                </div>
            </div>

            {/* ── Footer link ── */}
            <div className="container mx-auto px-6 md:px-12 mt-12 flex justify-center lg:justify-end relative z-10">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors group"
                >
                    Ver todos los artículos
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    );
}
