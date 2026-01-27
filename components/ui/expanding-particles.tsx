"use client";

import { useEffect, useRef } from "react";

interface Particle {
    angle: number;
    distance: number;
    speed: number;
    radius: number;
    opacity: number;
    lx: number; // Local X offset (interaction)
    ly: number; // Local Y offset (interaction)
    vx: number; // Velocity X
    vy: number; // Velocity Y
}

export function ExpandingParticles({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const mouse = mouseRef.current;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Initialize particles
        // We want concentric rings expanding.
        const spawnRing = (dist: number) => {
            const numParticles = 60; // Particles per ring
            for (let i = 0; i < numParticles; i++) {
                const angle = (i / numParticles) * Math.PI * 2;
                particlesRef.current.push({
                    angle: angle,
                    distance: dist,
                    speed: 0.8, // Constant speed for the ring
                    radius: Math.random() * 1.5 + 0.8,
                    opacity: 0,
                    lx: 0,
                    ly: 0,
                    vx: 0,
                    vy: 0
                });
            }
        };

        // Initial populate
        for (let d = 0; d < Math.max(canvas.width, canvas.height); d += 40) {
            spawnRing(d);
        }

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const maxDist = Math.max(canvas.width, canvas.height) * 0.8;

            // Interaction settings
            const interactionRadius = 250; // Increased radius
            const forceStrength = 2.0;    // Increased strength
            const friction = 0.90;
            const returnStrength = 0.08;

            // Correct Mouse Coordinates
            // Since the canvas is absolutely positioned and transformed (translate-x right),
            // global clientX/Y needs to be mapped to local canvas space properly.
            const rect = canvas.getBoundingClientRect();
            // mx/my are local to canvas 0,0 (top-left)
            const mx = mouse.x - rect.left;
            const my = mouse.y - rect.top;

            // Check if mouse is actually over/near canvas to avoid global repel weirdness
            // if (mouse.x < rect.left - 100 || mouse.x > rect.right + 100) ... optional check

            // Update & Draw
            // We need to manage lifecycle of particles or just loop rings?
            // To keep "rings", let's just loop distance.

            particlesRef.current.forEach(p => {
                // Expansion
                p.distance += p.speed;
                if (p.distance > maxDist) {
                    p.distance = 0; // Loop back to center to maintain ring structure
                }

                // Opacity: Fade in center, Fade out edge
                if (p.distance < 100) {
                    p.opacity = p.distance / 100;
                } else if (p.distance > maxDist - 100) {
                    p.opacity = (maxDist - p.distance) / 100;
                } else {
                    p.opacity = 1;
                }

                // Ideal position (Ring)
                const ix = cx + Math.cos(p.angle) * p.distance;
                const iy = cy + Math.sin(p.angle) * p.distance;

                // Actual position (with physics offset)
                let px = ix + p.lx;
                let py = iy + p.ly;

                // Repel Logic
                const dx = px - mx;
                const dy = py - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < interactionRadius) {
                    const force = (interactionRadius - dist) / interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    // Push away harder
                    p.vx += Math.cos(angle) * force * forceStrength;
                    p.vy += Math.sin(angle) * force * forceStrength;
                }

                p.lx += p.vx;
                p.ly += p.vy;

                p.vx *= friction;
                p.vy *= friction;

                p.lx -= p.lx * returnStrength;
                p.ly -= p.ly * returnStrength;

                ctx.beginPath();
                ctx.arc(ix + p.lx, iy + p.ly, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity * 0.5})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    );
}
