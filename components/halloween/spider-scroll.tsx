"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useEffect, useState } from "react";
import { INK, P, v } from "./palette";

// La araña que baja por su hilo conforme se hace scroll en la versión
// Halloween del home. Arranca escondida arriba (en el póster ya cuelgan otras
// arañas) y llega casi al fondo de la pantalla al final de la página.
//
// - Posición: ligada al progreso del scroll, con resorte para que rebote como
//   algo que cuelga de verdad.
// - Balanceo: sale de la VELOCIDAD del scroll; al frenar vuelve al centro.
// - Es un .hw-monster: al pasarle el mouse (o tocarla) mueve las patas y
//   sonríe, y sus ojos siguen al cursor como los del póster.
// - Con movimiento reducido: sin resorte ni balanceo, solo sigue al scroll.

const TOP = -70; // escondida arriba, solo se ve el hilo
const BOTTOM_GAP = 170; // se detiene antes de la burbuja de WhatsApp

export function SpiderScroll() {
    const reduced = useReducedMotion();
    const { scrollYProgress, scrollY } = useScroll();
    const [maxY, setMaxY] = useState(600);

    useEffect(() => {
        const update = () => setMaxY(Math.max(200, window.innerHeight - BOTTOM_GAP));
        update();
        window.addEventListener("resize", update, { passive: true });
        return () => window.removeEventListener("resize", update);
    }, []);

    const target = useTransform(scrollYProgress, [0, 0.04, 1], [TOP, 60, maxY]);
    const sprung = useSpring(target, { stiffness: 90, damping: 11, mass: 0.8 });
    const y = reduced ? target : sprung;

    const velocity = useVelocity(scrollY);
    const swingRaw = useTransform(velocity, [-2500, 0, 2500], [14, 0, -14], { clamp: true });
    const swing = useSpring(swingRaw, { stiffness: 60, damping: 6 });

    // La araña se mueve con `y` (puede ser negativo: escondida arriba) y el hilo
    // llega hasta su lomo, que queda a ~30% de la altura del dibujo.
    const thread = useTransform(y, (val) => Math.max(0, val + 14));

    return (
        <div aria-hidden="true" className="pointer-events-none fixed right-4 top-0 z-40 w-12 md:right-[3.5vw] md:w-14">
            <motion.div style={{ rotate: reduced ? 0 : swing, originX: 0.5, originY: 0 }} className="relative">
                <motion.div style={{ height: thread }} className="mx-auto w-px bg-[#f3ecd9]/70" />
                <motion.div style={{ y }} className="pointer-events-auto absolute inset-x-0 top-0">
                    <Spider />
                </motion.div>
            </motion.div>
        </div>
    );
}

function Spider() {
    return (
        <svg viewBox="0 0 64 60" className="hw-scene h-auto w-full overflow-visible">
            <g className="hw-monster">
                {/* Patas: cuatro por lado, cada lado en su grupo para que se agiten con desfase. */}
                <g className="hw-wave" style={v({ "--o": "100% 30%", "--wave": "14deg" })}>
                    <path
                        d="M24 26 Q14 18 6 22 M23 30 Q12 28 4 34 M24 34 Q14 38 8 46 M26 37 Q20 44 16 52"
                        fill="none"
                        stroke={P.lilac}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                    />
                </g>
                <g className="hw-wave" style={v({ "--o": "0% 30%", "--wave": "-14deg" })}>
                    <path
                        d="M40 26 Q50 18 58 22 M41 30 Q52 28 60 34 M40 34 Q50 38 56 46 M38 37 Q44 44 48 52"
                        fill="none"
                        stroke={P.lilac}
                        strokeWidth="2.6"
                        strokeLinecap="round"
                    />
                </g>
                {/* Cuerpo: carbón con orilla lila para que se lea sobre el negro. */}
                <ellipse cx="32" cy="32" rx="12" ry="13" fill={P.charcoal} stroke={P.lilacDeep} strokeWidth="2.4" />
                <path d="M26 24 Q32 20 38 24" fill="none" stroke={P.lilac} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                {/* Ojos */}
                <g className="hw-off hw-eye">
                    <ellipse cx="27.5" cy="32" rx="4" ry="4.6" fill={P.cream} />
                    <ellipse cx="36.5" cy="32" rx="4" ry="4.6" fill={P.cream} />
                    <g className="hw-pupil" style={v({ "--pr": "1.6px" })}>
                        <circle cx="28" cy="32.6" r="2" fill={INK} />
                        <circle cx="37" cy="32.6" r="2" fill={INK} />
                    </g>
                </g>
                <g className="hw-blink" fill="none" stroke={P.cream} strokeWidth="1.6" strokeLinecap="round">
                    <path d="M24 33 Q27.5 35 31 33" />
                    <path d="M33 33 Q36.5 35 40 33" />
                </g>
                <g className="hw-on" fill="none" stroke={P.cream} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M24 34 Q27.5 30 31 34" />
                    <path d="M33 34 Q36.5 30 40 34" />
                    <path d="M28.5 39 Q32 42.5 35.5 39" />
                </g>
                <path
                    className="hw-off"
                    d="M29 39.5 L30.5 42 L32 39.5 L33.5 42 L35 39.5"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
}
