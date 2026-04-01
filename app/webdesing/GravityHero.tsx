"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { cn } from "@/lib/utils";
import ScrambleText from "./ScrambleText";

export default function GravityHero() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);

    // Refs for the DOM elements corresponding to the bodies
    const lettersRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            World = Matter.World,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        // Create engine
        const engine = Engine.create();
        engineRef.current = engine;

        // Create runner
        const runner = Runner.create();
        runnerRef.current = runner;

        // Screen dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;

        // --- Create Bodies ---
        const isMobile = width < 768;
        const letterSize = Math.min(width * (isMobile ? 0.25 : 0.15), 200);
        const labels = ["W", "W", "W", "."];
        const bodies: Matter.Body[] = [];

        const totalWidth = labels.length * letterSize;
        const startX = (width - totalWidth) / 2 + letterSize / 2;

        labels.forEach((label, index) => {
            const x = startX + index * letterSize * 1.05;
            const y = -200 - Math.random() * 100;

            const body = Bodies.rectangle(x, y, letterSize, letterSize, {
                restitution: 0.4,
                friction: 0.5,
                label: label,
                angle: (Math.random() - 0.5) * 0.1,
            });
            bodies.push(body);
        });

        // Boundaries
        const ground = Bodies.rectangle(width / 2, height + 10, width, 100, {
            isStatic: true,
            render: { visible: false }
        });

        const wallThickness = 100;
        const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 5, { isStatic: true });
        const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 5, { isStatic: true });

        Composite.add(engine.world, [...bodies, ground, leftWall, rightWall]);

        // Add mouse control
        const mouse = Mouse.create(sceneRef.current);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false },
            },
        });

        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

        Composite.add(engine.world, mouseConstraint);
        Runner.run(runner, engine);

        const updateLoop = () => {
            if (!engineRef.current) return;
            bodies.forEach((body, index) => {
                const domEl = lettersRef.current[index];
                if (domEl) {
                    const { x, y } = body.position;
                    const rotation = body.angle;
                    domEl.style.transform = `translate(${x - letterSize / 2}px, ${y - letterSize / 2}px) rotate(${rotation}rad)`;
                    domEl.style.width = `${letterSize}px`;
                    domEl.style.height = `${letterSize}px`;
                    domEl.style.opacity = "1";
                }
            });
            requestAnimationFrame(updateLoop);
        };
        updateLoop();

        const handleResize = () => {};
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            Runner.stop(runner);
            Engine.clear(engine);
            if (runnerRef.current) runnerRef.current = null;
            if (engineRef.current) engineRef.current = null;
        };
    }, []);

    return (
        <div
            ref={sceneRef}
            className="relative w-full h-screen overflow-hidden text-white pointer-events-none"
        >
            {["W", "W", "W", "."].map((char, i) => (
                <div
                    key={i}
                    ref={(el) => { lettersRef.current[i] = el; }}
                    className={cn(
                        "absolute top-0 left-0 flex items-center justify-center font-bold select-none cursor-grab active:cursor-grabbing",
                        "text-white border-none pointer-events-auto"
                    )}
                    style={{
                        touchAction: 'none',
                        opacity: 0,
                        willChange: "transform",
                        fontSize: "clamp(4rem, 15vw, 12rem)",
                        lineHeight: 1
                    }}
                >
                    {char}
                </div>
            ))}

            <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
                <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-start">
                    <div className="flex justify-end mt-20 md:mt-32 pointer-events-auto">
                        <p className="text-sm md:text-base text-white/80 max-w-md text-right leading-relaxed font-light">
                            Como <ScrambleText text="Vibe Coder" className="font-bold text-white" />, diseñamos y estructuramos soluciones digitales precisas, desde tiendas en línea hasta plataformas de cursos. Nos especializamos en desarrollo web, SEO y optimización de velocidad, construyendo sitios sólidos y eficientes que impulsan el crecimiento real de tu negocio.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-4 mt-8 pointer-events-auto">
                        <div className="text-right">
                            <p className="text-sm md:text-base text-white font-medium tracking-tight">
                                Carlos Beuvrin
                            </p>
                            <p className="text-xs md:text-sm text-white/50 font-light italic">
                                Programador
                            </p>
                        </div>
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-[#1a1a1a] border border-white/10 flex-shrink-0 shadow-xl flex items-center justify-center">
                            <img
                                src="/carlos-beuvrin.png"
                                alt="Carlos Beuvrin"
                                className="w-full h-full object-cover grayscale brightness-110 scale-125"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
