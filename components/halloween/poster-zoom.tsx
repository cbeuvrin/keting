"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MONSTERS } from "./monsters";
import type { Layout } from "./scene";

/** Los monstruos del póster que se vienen hacia la pantalla. En orden de pintado: el último queda al frente. */
const IDS = ["fantasma-sabana", "calabaza-gigante"];

/*
 * Las copias que crecen son imágenes ya dibujadas (public/halloween/zoom/),
 * no el SVG en vivo: agrandar un SVG obliga a redibujarlo a cada tamaño y en
 * iPhone eso se notaba a saltos. Hay una nítida y otra ya desenfocada que se
 * cruzan con opacidad, así que no se anima ningún filtro. La desenfocada trae
 * un margen de SOFT_PAD (fracción del ancho) por lado para que el difuminado
 * no se corte.
 */
const IMG = (id: string, kind: "sharp" | "soft") => `/halloween/zoom/${id}-${kind}.webp`;
const SOFT_PAD = 0.2;

/** Tramo del scroll del póster en el que se ven las copias; a partir de END ya son invisibles. */
const START = 0.002;
const END = 0.8;

/*
 * Curvas del zoom sobre el progreso del póster (0 = arriba del todo, 1 = el
 * póster ya salió por arriba). Mismos rangos que el título del home: crece de
 * 1× a 5× hasta 0.5 y se apaga hasta 0.8. La nítida se va antes de 0.3 para
 * que a media animación ya se vea borroso.
 */
const P = [0, 0.1, 0.2, 0.3, 0.4, 0.5, END, 1];
const SCALE = [1, 1.8, 2.6, 3.4, 4.2, 5, 5, 5];
const SHARP = [1, 0.5, 0.12, 0, 0, 0, 0, 0];
const SOFT = [0, 0.6, 0.75, 0.625, 0.5, 0.375, 0, 0];

/*
 * Dos maneras de moverlo:
 *
 * - Con mouse (escritorio): sigue al scroll. Donde el navegador tiene
 *   animaciones ligadas al scroll (animation-timeline) va en CSS, en el hilo
 *   del compositor; si no, framer-motion con las mismas curvas.
 *
 * - En pantallas táctiles: el primer scroll DISPARA una animación de TAP_MS
 *   (Web Animations, que el sistema mueve por su cuenta). En iPhone el scroll
 *   corre en otro proceso y a la página le llega tarde y a saltos, así que
 *   cualquier efecto pegado al scroll se veía a tirones, aunque fuera en CSS.
 *   Aquí el original NO se esconde: la copia se lanza hacia la pantalla encima
 *   de él y se desvanece, y el monstruo queda en su sitio. Si se escondiera,
 *   quien baja un poco y se detiene vería dos huecos en el póster. Al volver
 *   arriba del todo queda listo para repetirse.
 */
const TAP_MS = 1000;
const TAP_GO = 0.012;
const TAP_RESET = 0.004;

const pct = (p: number) => `${+(p * 100).toFixed(2)}%`;
const cssKeyframes = (name: string, prop: string, values: number[]) =>
    `@keyframes ${name}{${P.map((p, i) => `${pct(p)}{${prop}:${values[i]}}`).join("")}}`;
const TIMELINE = "animation-timeline:--hw-poster;animation-range:exit-crossing 0% exit-crossing 100%";
const ORIGINALS = IDS.map((id) => `.hw-zoom-css .hw-poster-scene [data-hw-id="${id}"]`).join(",");
const SCROLL_CSS = [
    cssKeyframes("hw-zoom-scale", "scale", SCALE),
    cssKeyframes("hw-zoom-sharp", "opacity", SHARP),
    cssKeyframes("hw-zoom-soft", "opacity", SOFT),
    // Copias visibles solo dentro del tramo; los originales, al revés.
    `@keyframes hw-zoom-show{0%{visibility:hidden}${pct(START)}{visibility:visible}${pct(END)}{visibility:visible}${pct(END + 0.001)},100%{visibility:hidden}}`,
    `@keyframes hw-zoom-hide{0%{visibility:visible}${pct(START)}{visibility:hidden}${pct(END)}{visibility:hidden}${pct(END + 0.001)},100%{visibility:visible}}`,
    `.hw-zoom-css{view-timeline:--hw-poster block}`,
    `.hw-zoom-css .hw-zoom-copy{animation:hw-zoom-scale linear both,hw-zoom-show linear both;${TIMELINE}}`,
    `.hw-zoom-css .hw-zoom-sharp{animation:hw-zoom-sharp linear both;${TIMELINE}}`,
    `.hw-zoom-css .hw-zoom-soft{animation:hw-zoom-soft linear both;${TIMELINE}}`,
    `${ORIGINALS}{animation:hw-zoom-hide linear both;${TIMELINE}}`,
].join("\n");

/** Las mismas curvas como keyframes de tiempo (0–END del scroll = toda la animación táctil). */
const timeFrames = (values: number[], make: (v: number) => Keyframe): Keyframe[] =>
    P.flatMap((p, i) => (p <= END ? [{ ...make(values[i]), offset: p / END }] : []));

type Mode = "scroll-css" | "scroll-js" | "tap";
type Box = { left: number; top: number; width: number; height: number; flip: boolean };

/**
 * Al hacer scroll, el fantasma y la calabaza gigante del póster se vienen
 * hacia la pantalla igual que el título del home: crecen, se desenfocan y se
 * desvanecen.
 *
 * Los que crecen son copias encima de todo y fuera del overflow-hidden del
 * póster: dentro de la escena los taparían los monstruos que van delante y el
 * borde del póster los cortaría en seco. En reposo se ven los del póster, que
 * son los que reaccionan al mouse. En el contenedor, data-zoom marca cuándo se
 * ven las copias EN VEZ de los originales (escritorio) y data-zoom-tap cuándo
 * vuela una copia ENCIMA del original (táctil); ver halloween.css.
 */
export function PosterZoom({ desktop, mobile, children }: { desktop: Layout; mobile: Layout; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

    const scale = useTransform(scrollYProgress, P, SCALE);
    const sharp = useTransform(scrollYProgress, P, SHARP);
    const soft = useTransform(scrollYProgress, P, SOFT);

    const [boxes, setBoxes] = useState<Record<string, Box>>({});
    const [mode, setMode] = useState<Mode | null>(null);
    const tap = useRef<{ anims: Animation[]; played: boolean }>({ anims: [], played: false });

    const setZoom = (on: boolean) => {
        const root = ref.current;
        if (root && root.hasAttribute("data-zoom") !== on) root.toggleAttribute("data-zoom", on);
    };

    const setTapFlying = (on: boolean) => {
        const root = ref.current;
        if (root && root.hasAttribute("data-zoom-tap") !== on) root.toggleAttribute("data-zoom-tap", on);
    };

    // Táctil: una sola pasada por visita al póster.
    const runTap = (go: boolean) => {
        const root = ref.current;
        const t = tap.current;
        if (!root) return;
        if (!go) {
            if (!t.played) return;
            t.played = false;
            for (const a of t.anims) a.cancel();
            t.anims = [];
            setTapFlying(false);
            return;
        }
        if (t.played) return;
        // Sin las imágenes cargadas la copia saldría vacía; el siguiente evento
        // de scroll lo vuelve a intentar.
        const imgs = Array.from(root.querySelectorAll<HTMLImageElement>(".hw-zoom-copy img"));
        if (!imgs.length || imgs.some((img) => !img.complete || !img.naturalWidth)) return;
        t.played = true;
        setTapFlying(true);
        const opts: KeyframeAnimationOptions = { duration: TAP_MS, easing: "linear", fill: "forwards" };
        for (const copy of Array.from(root.querySelectorAll<HTMLElement>(".hw-zoom-copy"))) {
            const sharpEl = copy.querySelector<HTMLElement>(".hw-zoom-sharp");
            const softEl = copy.querySelector<HTMLElement>(".hw-zoom-soft");
            if (!sharpEl || !softEl) continue;
            t.anims.push(
                copy.animate(
                    timeFrames(SCALE, (v) => ({ transform: `scale(${v})` })),
                    opts,
                ),
                sharpEl.animate(
                    timeFrames(SHARP, (v) => ({ opacity: v })),
                    opts,
                ),
                softEl.animate(
                    timeFrames(SOFT, (v) => ({ opacity: v })),
                    opts,
                ),
            );
        }
        const last = t.anims[t.anims.length - 1];
        if (last) last.onfinish = () => setTapFlying(false);
    };

    const sync = (p: number) => {
        if (reduced || !mode) return;
        if (mode === "tap") {
            if (p > TAP_GO) runTap(true);
            else if (p < TAP_RESET) runTap(false);
            return;
        }
        setZoom(p > START && p < END);
    };
    useMotionValueEvent(scrollYProgress, "change", sync);

    // Dónde queda cada monstruo en pantalla: la escena es un SVG recortado con
    // "slice", así que se calcula con la misma cuenta que hace el navegador.
    // Cambia con la forma de la pantalla (escena apaisada o vertical).
    useEffect(() => {
        const root = ref.current;
        if (!root || reduced) return;
        const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const scrollCss =
            typeof CSS !== "undefined" &&
            CSS.supports("animation-timeline", "--hw-poster") &&
            CSS.supports("animation-range", "exit-crossing 0% exit-crossing 100%");
        setMode(touch ? "tap" : scrollCss ? "scroll-css" : "scroll-js");
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
                    next[id] = { left: ox + p.x * k, top: oy + p.y * k, width: def.w * p.s * k, height: def.h * p.s * k, flip: !!p.flip };
                }
            }
            setBoxes(next);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(root);
        return () => ro.disconnect();
    }, [desktop, mobile, reduced]);

    // Si la página se abre ya bajada, que arranque en el estado que le toca.
    useEffect(() => {
        if (mode) sync(scrollYProgress.get());
        // sync solo depende de `mode` y `reduced`.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const js = mode === "scroll-js";
    return (
        <div ref={ref} className={mode === "scroll-css" ? "hw-zoom-css relative" : "relative"}>
            {mode === "scroll-css" && <style>{SCROLL_CSS}</style>}
            {children}
            {!reduced &&
                mode &&
                IDS.map((id) => {
                    const b = boxes[id];
                    if (!b) return null;
                    const pad = b.width * SOFT_PAD;
                    const flip = b.flip ? "-scale-x-100" : "";
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
                                ...(js ? { scale } : {}),
                            }}
                        >
                            <motion.img
                                src={IMG(id, "soft")}
                                alt=""
                                draggable={false}
                                className={`hw-zoom-soft absolute max-w-none ${flip}`}
                                style={{
                                    left: -pad,
                                    top: -pad,
                                    width: b.width + pad * 2,
                                    height: b.height + pad * 2,
                                    willChange: "opacity",
                                    ...(js ? { opacity: soft } : { opacity: 0 }),
                                }}
                            />
                            <motion.img
                                src={IMG(id, "sharp")}
                                alt=""
                                draggable={false}
                                className={`hw-zoom-sharp absolute inset-0 h-full w-full max-w-none ${flip}`}
                                style={{ willChange: "opacity", ...(js ? { opacity: sharp } : {}) }}
                            />
                        </motion.div>
                    );
                })}
        </div>
    );
}
