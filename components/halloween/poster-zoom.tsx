"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MONSTERS } from "./monsters";
import type { Layout } from "./scene";

/** Los monstruos del póster que se vienen hacia la pantalla. En orden de pintado: el último queda al frente. */
const IDS = ["fantasma-sabana", "calabaza-gigante"];

/** Tramo del scroll del póster en el que se ven las copias; fuera de él, a partir de 0.8 ya son invisibles. */
const START = 0.002;
const END = 0.8;

type Box = { left: number; top: number; width: number; height: number; flip: boolean; bd?: string };

/**
 * Al hacer scroll, el fantasma y la calabaza gigante del póster se vienen
 * hacia la pantalla igual que el título del home: crecen hasta 5×, se
 * desenfocan y se desvanecen (mismos rangos que components/layout/hero.tsx).
 *
 * Los que crecen son copias encima de todo y fuera del overflow-hidden del
 * póster: dentro de la escena los taparían los monstruos que van delante y el
 * borde del póster los cortaría en seco. En reposo se ven los del póster, que
 * son los que reaccionan al mouse.
 *
 * Para que cueste poco: cada copia es una capa del tamaño justo de su
 * monstruo (no del póster entero, que a 5× sería enorme de desenfocar), y el
 * cambio entre originales y copias es un atributo, data-zoom, que solo se
 * toca al cruzar START o END; halloween.css hace el resto y detiene las
 * animaciones de lo que no se ve.
 */
export function PosterZoom({ desktop, mobile, children }: { desktop: Layout; mobile: Layout; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 5]);
    const opacity = useTransform(scrollYProgress, [0, END], [1, 0]);
    const blur = useTransform(scrollYProgress, [0, 0.4], [0, 10]);
    const filter = useTransform(blur, (b) => `blur(${b}px)`);

    const [boxes, setBoxes] = useState<Record<string, Box>>({});

    const sync = (p: number) => {
        const root = ref.current;
        if (!root) return;
        const on = !reduced && p > START && p < END;
        if (root.hasAttribute("data-zoom") !== on) root.toggleAttribute("data-zoom", on);
    };
    useMotionValueEvent(scrollYProgress, "change", sync);

    // Dónde queda cada monstruo en pantalla: la escena es un SVG recortado con
    // "slice", así que se calcula con la misma cuenta que hace el navegador.
    // Cambia con la forma de la pantalla (escena apaisada o vertical).
    useEffect(() => {
        const root = ref.current;
        if (!root || reduced) return;
        const measure = () => {
            const rb = root.getBoundingClientRect();
            const next: Record<string, Box> = {};
            for (const svg of Array.from(root.querySelectorAll<SVGSVGElement>("svg.hw-poster-scene"))) {
                const r = svg.getBoundingClientRect();
                if (!r.width) continue; // la otra composición está en display:none
                const vb = svg.viewBox.baseVal;
                const layout = vb.width === desktop.width && vb.height === desktop.height ? desktop : mobile;
                const k = Math.max(r.width / vb.width, r.height / vb.height);
                const ox = r.left - rb.left + (r.width - vb.width * k) / 2;
                const oy = r.top - rb.top + (r.height - vb.height * k) / 2;
                for (const id of IDS) {
                    const p = layout.placements.find((q) => q.id === id);
                    const def = MONSTERS[id];
                    if (!p || !def) continue;
                    next[id] = {
                        left: ox + p.x * k,
                        top: oy + p.y * k,
                        width: def.w * p.s * k,
                        height: def.h * p.s * k,
                        flip: !!p.flip,
                        bd: p.bd,
                    };
                }
            }
            setBoxes(next);
        };
        measure();
        sync(scrollYProgress.get());
        const ro = new ResizeObserver(measure);
        ro.observe(root);
        return () => ro.disconnect();
        // sync solo lee refs y `reduced`, que ya está en las dependencias.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desktop, mobile, reduced, scrollYProgress]);

    return (
        <div ref={ref} className="relative">
            {children}
            {!reduced &&
                IDS.map((id) => {
                    const b = boxes[id];
                    const def = MONSTERS[id];
                    if (!b || !def) return null;
                    return (
                        // z-30: por encima de la primera sección (z-20), debajo de la araña y la barra.
                        <motion.div
                            key={id}
                            aria-hidden="true"
                            className="hw-zoom-copy pointer-events-none absolute z-30"
                            style={{
                                left: b.left,
                                top: b.top,
                                width: b.width,
                                height: b.height,
                                scale,
                                opacity,
                                filter,
                                willChange: "transform, opacity, filter",
                            }}
                        >
                            <svg viewBox={`0 0 ${def.w} ${def.h}`} className="hw-scene block h-full w-full overflow-visible">
                                <g transform={b.flip ? `translate(${def.w} 0) scale(-1 1)` : undefined}>
                                    <g
                                        className="hw-monster hw-deco"
                                        data-flip={b.flip ? "1" : undefined}
                                        style={b.bd ? ({ ["--bd" as string]: b.bd } as CSSProperties) : undefined}
                                    >
                                        <def.Art />
                                    </g>
                                </g>
                            </svg>
                        </motion.div>
                    );
                })}
        </div>
    );
}
