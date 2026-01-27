"use client";

import { useEffect, useRef } from "react";

interface WavyBackgroundProps {
    className?: string;
    lineColor?: string;
    waveWidth?: number;
    blur?: number;
    speed?: number;
    waveOpacity?: number;
}

export const WavyBackground = ({
    className,
    lineColor = "rgba(255, 255, 255, 0.5)",
    waveWidth = 50,
    blur = 10,
    speed = 0.002, // Slow peaceful movement
    waveOpacity = 0.5,
}: WavyBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generates a random noise/wobble
    const noise = (x: number) => {
        return Math.sin(x) * Math.cos(x * 0.5);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        let time = 0;

        // Resize
        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            ctx.filter = `blur(${blur}px)`;
        };
        window.addEventListener("resize", handleResize);

        // Initial setup
        ctx.filter = `blur(${blur}px)`;

        // Configuration for the waves
        // We want them to look like the reference: parallel-ish curves filling the screen
        const waveCount = 5;
        const waves = Array.from({ length: waveCount }).map((_, i) => ({
            y: (h / waveCount) * i + (h / waveCount) / 2, // Distributed vertically
            amplitude: 50 + Math.random() * 100,
            frequency: 0.002 + Math.random() * 0.003,
            phase: Math.random() * Math.PI * 2,
            speed: (Math.random() * 0.002) + speed
        }));

        let animationFrameId: number;
        const draw = () => {
            time += 1;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "rgba(0,0,0,0)"; // Transparent clear
            // But we actually need to clear properly

            // Loop through waves
            waves.forEach((wave, i) => {
                ctx.beginPath();
                ctx.lineWidth = waveWidth;

                // Create gradient for "light movement"
                // The gradient moves with time
                const gradient = ctx.createLinearGradient(0, 0, w, 0);
                const offset = (time * 0.01) % 1;

                // Light pulse effect
                gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
                gradient.addColorStop(Math.abs(Math.sin(time * 0.005)), `rgba(255, 255, 255, ${waveOpacity})`);
                gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");

                ctx.strokeStyle = gradient;

                for (let x = 0; x < w; x += 5) {
                    // Sine wave formula: y = A * sin(B * x + C) + D
                    // Plus some noise for "organic" feel
                    const y = wave.y +
                        Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
                        noise(x * 0.01 + time * 0.01) * 20;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [lineColor, waveWidth, blur, speed, waveOpacity]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: "block" }}
        />
    );
};
