"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function SnakeLine() {
    const { scrollYProgress } = useScroll();
    
    // Map scroll progress to draw correctly starting from when the line is reached
    // Adjusted range: 0.2 is roughly beginning of the line section, 1 is the end
    const rawLength = useTransform(scrollYProgress, [0.2, 0.95], [0, 1]);
    const pathLength = useSpring(rawLength, { stiffness: 400, damping: 90 });

    return (
        <div className="absolute top-[200vh] left-0 w-full pointer-events-none overflow-visible" style={{ height: '6000px', zIndex: 0 }}>
            <svg 
                className="w-full h-full" 
                viewBox="0 0 1000 6000" 
                preserveAspectRatio="none"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.path
                    d="M 500 0 
                       C 1000 600, 0 1200, 500 1800 
                       C 1000 2400, 0 3000, 500 3600 
                       C 1000 4200, 0 4800, 500 5400
                       L 500 6000"
                    stroke="#242424"
                    strokeWidth="20"
                    strokeLinecap="round"
                    style={{ 
                        pathLength,
                        opacity: 0.15 
                    }}
                    transition={{ duration: 0.5 }}
                />
            </svg>
        </div>
    );
}
