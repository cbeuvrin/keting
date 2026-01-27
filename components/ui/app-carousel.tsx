"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const APPS = [
    { id: 1, color: "#FF3B30", label: "Music" },
    { id: 2, color: "#007AFF", label: "Mail" },
    { id: 3, color: "#34C759", label: "Phone" },
    { id: 4, color: "#5856D6", label: "Podcasts" },
    { id: 5, color: "#FF9500", label: "Home" },
    { id: 6, color: "#AF52DE", label: "Maps" },
    { id: 7, color: "#FF2D55", label: "Health" },
    { id: 8, color: "#5AC8FA", label: "Weather" },
];

// Duplicate for infinite scroll feel
const ITEMS = [...APPS, ...APPS, ...APPS];

export function AppCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [centerOffset, setCenterOffset] = useState(0);

    // Auto-scroll logic
    const x = useMotionValue(0);
    const speed = -1; // Pixels per frame

    useAnimationFrame(() => {
        const current = x.get();
        // Reset when we've scrolled past the first set width (approx)
        // Adjust reset point based on item width * count
        const resetPoint = -(APPS.length * 100);
        if (current <= resetPoint) {
            x.set(0);
        } else {
            x.set(current + speed);
        }
    });

    useEffect(() => {
        if (containerRef.current) {
            setCenterOffset(containerRef.current.offsetWidth / 2);
        }

        const handleResize = () => {
            if (containerRef.current) {
                setCenterOffset(containerRef.current.offsetWidth / 2);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <div ref={containerRef} className="relative w-full h-24 md:h-32 flex items-center justify-center overflow-hidden">

            {/* CAROUSEL TRACK */}
            <motion.div
                className="flex items-center gap-6 absolute left-1/2"
                style={{ x }}
            >
                {ITEMS.map((app, i) => (
                    <AppItem key={i} app={app} containerX={x} index={i} centerOffset={centerOffset} />
                ))}
            </motion.div>

            {/* PHONE OVERLAY (Static Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-32 md:w-20 md:h-40 border-[4px] border-black rounded-[1.5rem] bg-transparent pointer-events-none z-20 shadow-xl overflow-hidden backdrop-blur-[1px]">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-3 bg-black rounded-b-lg z-30"></div>
            </div>

            {/* FADE GRADIENTS ON EDGES */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        </div>
    );
}

function AppItem({ app, containerX, index, centerOffset }: { app: any, containerX: any, index: number, centerOffset: number }) {
    const itemRef = useRef<HTMLDivElement>(null);
    const width = 64; // Estimated item width (16) + gap
    const gap = 24;
    const totalWidth = width + gap;
    const initialOffset = index * totalWidth;

    // We can't easily transform generic motion values in a child independent of the parent render cycle 
    // without some raw value calculation.
    // Instead, let's just use CSS scale based on simple distance check in a useAnimationFrame or useTransform if we bind correctly.
    // Since 'containerX' changes every frame, we can derive scale from it.

    // Position of this item relative to the container's center 
    // Item world X = (Left 1/2) + containerX + initialOffset
    // dist = Item World X - Center X

    const scale = useTransform(containerX, (xVal: number) => {
        // centerOffset is usually half screen width.
        // We centered the track at left-1/2, so the track origin is at the screen center.
        // So Item World X relative to screen center is simply: xVal + initialOffset - (half item width to center it)
        const itemCenter = xVal + initialOffset;
        const dist = Math.abs(itemCenter);

        // Range for scaling: within +/- 150px of center
        if (dist < 100) {
            // Map 0 -> 1.5, 150 -> 1
            return 1 + (1 - dist / 100) * 0.6; // Slightly more mag
        }
        return 0.9;
    });

    const opacity = useTransform(containerX, (xVal: number) => {
        const itemCenter = xVal + initialOffset;
        const dist = Math.abs(itemCenter);
        // Fade out slightly when far
        if (dist > 200) return 0.5;
        return 1;
    });

    return (
        <motion.div
            ref={itemRef}
            style={{ scale, opacity }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md bg-white border border-gray-100"
        >
            <div
                className="w-full h-full rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: app.color }}
            >
                {app.label[0]}
            </div>
        </motion.div>
    );
}
