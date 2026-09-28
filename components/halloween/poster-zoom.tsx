"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MONSTERS } from "./monsters";
import type { Layout } from "./scene";

/** Los monstruos del póster que se vienen hacia la pantalla. En orden de pintado: el último queda al frente. */
const IDS = ["fantasma-sabana", "calabaza-gigante"];

/** Tramo del scroll del póster en el que se ven las copias; a partir de END ya son invisibles. */
const START = 0.002;
const END = 0.8;

/*
 * Curvas del zoom sobre el progreso del póster (0 = arriba del todo, 1 = el
 * póster ya salió por arriba). Mismos rangos que el título del home: crece de
 * 1× a 5× hasta 0.5, se apaga hasta 0.8 y el desenfoque llega al máximo en 0.4.
 *
 * El desenfoque no se anima: animar `filter: blur()` obliga a repintar en cada
 * cuadro. Hay una copia desenfocada fija debajo de una nítida y se cruzan con
 * opacidad (SHARP baja, SOFT sube), así que solo cambian escala y opacidad,
 * que el navegador mueve sin repintar.
 */
const P = [0, 0.1, 0.2, 0.3, 0.4, 0.5, END, 1];
const SCALE = [1, 1.8, 2.6, 3.4, 4.2, 5, 5, 5];
// La nítida se va antes de 0.3 para que a media animación ya se vea borroso,
// como con el desenfoque animado; juntas suman más o menos la opacidad total.
const SHARP = [1, 0.5, 0.12, 0, 0, 0, 0, 0];
const SOFT = [0, 0.6, 0.75, 0.625, 0.5, 0.375, 0, 0];
const BLUR = "blur(10px)";

/*
 * Donde el navegador tiene animaciones ligadas al scroll (animation-timeline),
 * el zoom corre en CSS: va pegado al scroll en el hilo del compositor. Con
 * JavaScript, en celular el scroll corre por su lado y los cambios llegan
 * tarde o se saltan cuadros, y el zoom se veía a tirones. Donde no las hay,
 * framer-motion hace lo mismo con las mismas curvas.
 */
const pct = (p: number) => `${+(p * 100).toFixed(2)}%`;
const keyframes = (name: string, prop: string, values: number[]) =>
    `@keyframes ${name}{${P.map((p, i) => `${pct(p)}{${prop}:${values[i]}}`).join("")}}`;
const TIMELINE = "animation-timeline:--hw-poster;animation-range:exit-crossing 0% exit-crossing 100%";
const ORIGINALS = IDS.map((id) => `.hw-zoom-css .hw-poster-scene [data-hw-id="${id}"]`).join(",");
const SCROLL_CSS = [
    keyframes("hw-zoom-scale", "scale", SCALE),
    keyframes("hw-zoom-sharp", "opacity", SHARP),
    keyframes("hw-zoom-soft", "opacity", SOFT),
    // Copias visibles solo dentro del tramo; los originales, al revés.
    `@keyframes hw-zoom-show{0%{visibility:hidden}${pct(START)}{visibility:visible}${pct(END)}{visibility:visible}${pct(END + 0.001)},100%{visibility:hidden}}`,
    `@keyframes hw-zoom-hide{0%{visibility:visible}${pct(START)}{visibility:hidden}${pct(END)}{visibility:hidden}${pct(END + 0.001)},100%{visibility:visible}}`,
    `.hw-zoom-css{view-timeline:--hw-poster block}`,
    `.hw-zoom-css .hw-zoom-copy{animation:hw-zoom-scale linear both,hw-zoom-show linear both;${TIMELINE}}`,
    `.hw-zoom-css .hw-zoom-sharp{animation:hw-zoom-sharp linear both;${TIMELINE}}`,
    `.hw-zoom-css .hw-zoom-soft{animation:hw-zoom-soft linear both;${TIMELINE}}`,
    `${ORIGINALS}{animation:hw-zoom-hide linear both;${TIMELINE}}`,
].join("\n");

type Box = { left: number; top: number; width: number; height: number; flip: boolean; bd?: string };

/**
 * Al hacer scroll, el fantasma y la calabaza gigante del póster se vienen
 * hacia la pantalla igual que el título del home: crecen, se desenfocan y se
 * desvanecen.
 *
 * Los que crecen son copias encima de todo y fuera del overflow-hidden del
 * póster: dentro de la escena los taparían los monstruos que van delante y el
 * borde del póster los cortaría en seco. En reposo se ven los del póster, que
 * son los que reaccionan al mouse. Cada copia es una capa del tamaño justo de
 * su monstruo, no del póster entero.
 *
 * data-zoom (que se toca solo al cruzar START o END) marca el tramo en que se
 * ven las copias: con él halloween.css detiene las animaciones de lo que no se
 * ve y, sin animaciones de scroll, cambia originales por copias.
 */
export function PosterZoom({ desktop, mobile, children }: { desktop: Layout; mobile: Layout; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

    const scale = useTransform(scrollYProgress, P, SCALE);
    const sharp = useTransform(scrollYProgress, P, SHARP);
    const soft = useTransform(scrollYProgress, P, SOFT);

    const [boxes, setBoxes] = useState<Record<string, Box>>({});
    const [cssScroll, setCssScroll] = useState(false);

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
        setCssScroll(
            typeof CSS !== "undefined" &&
                CSS.supports("animation-timeline", "--hw-poster") &&
                CSS.supports("animation-range", "exit-crossing 0% exit-crossing 100%"),
        );
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
        <div ref={ref} className={cssScroll ? "hw-zoom-css relative" : "relative"}>
            {cssScroll && <style>{SCROLL_CSS}</style>}
            {children}
            {!reduced &&
                IDS.map((id) => {
                    const b = boxes[id];
                    const def = MONSTERS[id];
                    if (!b || !def) return null;
                    const art = (
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
                    );
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
                                willChange: "transform, scale",
                                ...(cssScroll ? {} : { scale }),
                            }}
                        >
                            <motion.div
                                className="hw-zoom-soft absolute inset-0"
                                style={{ filter: BLUR, willChange: "opacity", ...(cssScroll ? {} : { opacity: soft }) }}
                            >
                                {art}
                            </motion.div>
                            <motion.div
                                className="hw-zoom-sharp absolute inset-0"
                                style={{ willChange: "opacity", ...(cssScroll ? {} : { opacity: sharp }) }}
                            >
                                {art}
                            </motion.div>
                        </motion.div>
                    );
                })}
        </div>
    );
}
