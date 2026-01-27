"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScrambleTextProps {
    text: string;
    className?: string; // Additional classes for styling (e.g., font-bold, colors)
    duration?: number; // Total duration of the scramble effect in seconds
    delay?: number; // Delay before starting
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function ScrambleText({ text, className = "", duration = 1.5, delay = 0 }: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        let iteration = 0;
        const totalIterations = text.length * 3; // Number of scrambles per character approx
        const speed = (duration * 1000) / totalIterations;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText((prev) =>
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 3; // Slower resolve
        }, 50); // Frame rate
    };

    useEffect(() => {
        // Initial scramble on mount
        const timeout = setTimeout(() => {
            scramble();
        }, delay * 1000);

        return () => {
            clearTimeout(timeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text, delay]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        scramble();
    };

    return (
        <span
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
        >
            {displayText}
        </span>
    );
}
