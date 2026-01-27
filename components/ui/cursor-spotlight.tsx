"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CursorSpotlight() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const windowWidth = window.innerWidth;

            // Update position
            mouseX.set(clientX - 200); // Center the 400px div
            mouseY.set(clientY - 200);

            // Visibility Logic:
            // Assuming the "side of the effect" is the right half (approx > 40% width)
            // Or maybe > 50%
            if (clientX > windowWidth * 0.4) {
                setOpacity(1);
            } else {
                setOpacity(0);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
                opacity: opacity,
            }}
            className="fixed top-0 left-0 w-[400px] h-[400px] bg-radial-white-to-transparent rounded-full pointer-events-none z-0 blur-3xl"
        >
            {/* Gradient Definition via CSS or just simpler background */}
            <div className="w-full h-full bg-[radial-gradient(circle,rgba(255,220,140,0.6)_0%,rgba(255,220,140,0)_70%)]" />
        </motion.div>
    );
}
