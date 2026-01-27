"use client";

import { useEffect, useRef } from "react";

interface BinaryBackgroundProps {
    className?: string;
    speed?: number; // Speed of the fall
    density?: number; // Drop probability (lower is more dense)
    color?: string; // Text color
}

export const BinaryBackground = ({
    className,
    speed = 30,
    density = 0.975,
    color = "#0F0"
}: BinaryBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        // Resize handler
        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            // Re-calc columns is handled in draw loop automatically if we check width
            cols = Math.floor(w / 20) + 1;
            ypos = Array(cols).fill(0);
        };
        window.addEventListener("resize", handleResize);

        // Setup columns
        let cols = Math.floor(w / 20) + 1;
        let ypos = Array(cols).fill(0);

        // Draw Function
        const draw = () => {
            // Semi-transparent black fill for trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = color;
            ctx.font = "15pt monospace";

            ypos.forEach((y, ind) => {
                const text = Math.random() > 0.5 ? "1" : "0";
                const x = ind * 20;

                ctx.fillText(text, x, y);

                // Random reset to top
                if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + speed; // Use speed prop
            });

            // Loop
            // animationFrameId = requestAnimationFrame(draw);
        };

        // For better control of speed, we can use setInterval instead of requestAnimationFrame loop directly 
        // OR slow down the loop.
        // User asked for "rapido" (fast). 
        // The simplistic implementation usually runs at 60fps which is fast.
        // Let's us setInterval for frame control.
        const intervalId = setInterval(draw, 50); // 50ms = 20fps for classic matrix feel, or lower for faster.

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("resize", handleResize);
        };
    }, [speed, density, color]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: "block" }} // Avoid inline-block whitespace
        />
    );
};
