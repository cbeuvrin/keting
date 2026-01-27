"use client";

import { useEffect, useRef } from "react";

interface LightTubesProps {
    className?: string;
    speed?: number;
    color?: string;
    tubeCount?: number;
}

export const LightTubesBackground = ({
    className,
    speed = 15,
    tubeCount = 50,
    color = "#FFFFFF"
}: LightTubesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        // Resize handler
        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            initTubes();
        };
        window.addEventListener("resize", handleResize);

        // Tube Class
        class Tube {
            x: number;
            y: number;
            z: number; // Depth to simulate 3D or speed variation
            length: number;
            width: number;
            speed: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.z = Math.random() * 2 + 0.5; // Depth multiplier
                this.length = Math.random() * 100 + 50;
                this.width = Math.random() * 2 + 1; // Thickness to look like "tubes"
                this.speed = (Math.random() * 10 + 5) * speed * 0.1;
                this.opacity = Math.random() * 0.5 + 0.1;

                // Start visually randomly placed top/bottom or just anywhere?
                // Let's make them flow top to bottom or angled?
                // "Tubos de luces que se mueven" -> often implies a warp tunnel or vertical rain.
                // Let's do a vertical downward flow for "digital rain" feel but with lines, or angled.
                // Let's do angled (45 deg) for dynamic feel? Or straight down?
                // Straight down is cleaner for backgrounds.
                this.reset();
                this.y = Math.random() * h; // Initial random placement
            }

            reset() {
                this.x = Math.random() * w;
                this.y = -this.length - Math.random() * 100;
                this.z = Math.random() * 1.5 + 0.5;
                this.speed = (Math.random() * 10 + 5) * (speed / 10) * this.z;
                this.length = Math.random() * 200 + 100; // Longer beams
                this.width = Math.random() * 3 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.y += this.speed;
                if (this.y > h + this.length) {
                    this.reset();
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                // Gradient trail for "tube" look
                const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.length);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.width;
                ctx.lineCap = "round";
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y - this.length);
                ctx.stroke();

                // Add a "head" glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = color; // Glow color
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.2})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            }
        }

        let tubes: Tube[] = [];
        const initTubes = () => {
            tubes = [];
            for (let i = 0; i < tubeCount; i++) {
                tubes.push(new Tube());
            }
        };

        initTubes();

        // Animation Loop
        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            // Draw
            tubes.forEach(tube => {
                tube.update();
                tube.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [speed, tubeCount, color]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ display: "block" }}
        />
    );
};
