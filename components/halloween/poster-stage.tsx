"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Lo único que corre en el cliente del póster. Las reacciones al hover son
// CSS puro (halloween.css); aquí solo se hace lo que el CSS no puede:
//
//  1. Que cada monstruo mire AL CURSOR desde donde está él. Con una sola
//     variable global todos mirarían hacia el mismo lado aunque el mouse
//     estuviera a su izquierda. Se escribe --mx/--my en cada monstruo, una vez
//     por frame, con los centros cacheados (medirlos en cada movimiento
//     fuerza layout de ~30 SVG).
//  2. En pantallas táctiles no hay hover: un toque enciende .is-active un
//     momento, y mientras tanto los demás miran hacia donde se tocó.

const ACTIVE_MS = 1400;

type Target = { el: SVGGElement; cx: number; cy: number; flip: number };

export function PosterStage({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let targets: Target[] = [];
        let dirty = true;
        let frame = 0;
        let pointer: { x: number; y: number } | null = null;

        const measure = () => {
            targets = Array.from(root.querySelectorAll<SVGGElement>(".hw-monster:not(.hw-deco)"))
                .map((el) => {
                    const r = el.getBoundingClientRect();
                    return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2, flip: el.dataset.flip ? -1 : 1 };
                })
                // Los del otro póster (móvil/escritorio) están ocultos y miden 0.
                .filter((t) => t.cx !== 0 || t.cy !== 0);
            dirty = false;
        };

        const paint = () => {
            frame = 0;
            if (!pointer) return;
            if (dirty) measure();
            for (const t of targets) {
                const dx = pointer.x - t.cx;
                const dy = pointer.y - t.cy;
                const dist = Math.hypot(dx, dy) || 1;
                // Dirección unitaria; de cerca la mirada se relaja hacia el centro
                // para que no bizqueen cuando el cursor está encima de ellos.
                const k = Math.min(1, dist / 120);
                t.el.style.setProperty("--mx", ((dx / dist) * k * t.flip).toFixed(3));
                t.el.style.setProperty("--my", ((dy / dist) * k).toFixed(3));
            }
        };

        const lookAt = (x: number, y: number) => {
            if (reduced) return;
            pointer = { x, y };
            if (!frame) frame = requestAnimationFrame(paint);
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "mouse") lookAt(e.clientX, e.clientY);
        };

        const timers = new Map<Element, number>();
        const onDown = (e: PointerEvent) => {
            if (e.pointerType === "mouse") return;
            lookAt(e.clientX, e.clientY);
            const hit = (e.target as Element | null)?.closest?.(".hw-monster:not(.hw-deco)");
            if (!hit) return;
            hit.classList.add("is-active");
            window.clearTimeout(timers.get(hit));
            timers.set(
                hit,
                window.setTimeout(() => {
                    hit.classList.remove("is-active");
                    timers.delete(hit);
                }, ACTIVE_MS),
            );
        };

        const invalidate = () => {
            dirty = true;
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        root.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("resize", invalidate, { passive: true });
        window.addEventListener("scroll", invalidate, { passive: true });
        // Para lo que aparece o se mueve sin scroll (el menú de la barra de Halloween).
        window.addEventListener("hw:layout", invalidate);

        return () => {
            window.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerdown", onDown);
            window.removeEventListener("resize", invalidate);
            window.removeEventListener("scroll", invalidate);
            window.removeEventListener("hw:layout", invalidate);
            if (frame) cancelAnimationFrame(frame);
            for (const id of timers.values()) window.clearTimeout(id);
        };
    }, []);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
