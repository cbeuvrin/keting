"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

// Balanceo. Se limita por lo que la araña se desplaza de lado, no solo por el
// ángulo: colgada de un hilo largo, pocos grados ya son media pantalla.
const SWAY_PX_MOBILE = 40;
const SWAY_PX_DESKTOP = 110;
const MAX_ANGLE = 12;
const DEG_PER_PX_S = 0.005; // 2500 px/s de scroll ≈ 12°

// Resortes (rigidez K, amortiguamiento C = 2·ζ·√K). La posición rebota un
// poco (ζ 0.7) pero nunca más de MAX_BOUNCE px de donde le toca estar.
const POS_K = 110;
const POS_C = 2 * 0.7 * Math.sqrt(POS_K);
const MAX_BOUNCE = 60;
const SWING_K = 40;
const SWING_C = 2 * 0.6 * Math.sqrt(SWING_K);

export function SpiderScroll() {
    const reduced = useReducedMotion();
    const { scrollYProgress, scrollY } = useScroll();
    const [maxY, setMaxY] = useState(600);
    const swayPx = useRef(SWAY_PX_DESKTOP);

    useEffect(() => {
        const update = () => {
            setMaxY(Math.max(200, window.innerHeight - BOTTOM_GAP));
            swayPx.current = window.innerWidth < 768 ? SWAY_PX_MOBILE : SWAY_PX_DESKTOP;
        };
        update();
        window.addEventListener("resize", update, { passive: true });
        return () => window.removeEventListener("resize", update);
    }, []);

    const target = useTransform(scrollYProgress, [0, 0.04, 1], [TOP, 60, maxY]);

    // Posición y balanceo se integran a mano, cuadro a cuadro. Antes eran dos
    // useSpring: uno persiguiendo la posición y otro la velocidad del scroll.
    // En celular esas entradas saltan mucho de un cuadro a otro, cada objetivo
    // nuevo heredaba la inercia del anterior y los resortes acumulaban energía:
    // la araña brincaba cientos de píxeles y llegaba a dar vueltas completas.
    // Aquí la velocidad se suaviza primero, los dos resortes van casi en
    // amortiguamiento crítico y ninguno puede pasar de su tope.
    const hang = useMotionValue(TOP);
    const swing = useMotionValue(0);
    const sim = useRef({ primed: false, lastY: 0, vel: 0, pos: TOP, posVel: 0, angle: 0, spin: 0 });
    useAnimationFrame((_, delta) => {
        if (reduced) return;
        const s = sim.current;
        const sy = scrollY.get();
        const goalY = target.get();
        if (!s.primed) {
            s.lastY = sy;
            s.pos = goalY;
            hang.set(goalY);
            s.primed = true;
            return;
        }
        const frame = Math.min(delta, 50) / 1000;
        if (frame <= 0) return;
        s.vel += ((sy - s.lastY) / frame - s.vel) * (1 - Math.exp(-frame / 0.15));
        s.lastY = sy;

        const settled =
            Math.abs(s.vel) < 1 &&
            Math.abs(s.angle) < 0.02 &&
            Math.abs(s.spin) < 0.02 &&
            Math.abs(goalY - s.pos) < 0.2 &&
            Math.abs(s.posVel) < 0.5;
        if (settled) {
            if (s.angle !== 0 || s.pos !== goalY) {
                s.angle = s.spin = s.posVel = 0;
                s.pos = goalY;
                swing.set(0);
                hang.set(goalY);
            }
            return;
        }

        const rope = Math.max(80, s.pos + 30);
        const maxAngle = Math.min(MAX_ANGLE, (Math.asin(Math.min(1, swayPx.current / rope)) * 180) / Math.PI);
        const goalAngle = Math.max(-maxAngle, Math.min(maxAngle, -s.vel * DEG_PER_PX_S));

        // Pasos cortos: con cuadros largos (celular ocupado) un solo paso grande
        // se pasaría de largo.
        const steps = Math.ceil(frame / (1 / 120));
        const dt = frame / steps;
        for (let i = 0; i < steps; i++) {
            s.posVel += (POS_K * (goalY - s.pos) - POS_C * s.posVel) * dt;
            s.pos = Math.max(goalY - MAX_BOUNCE, Math.min(goalY + MAX_BOUNCE, s.pos + s.posVel * dt));
            s.spin += (SWING_K * (goalAngle - s.angle) - SWING_C * s.spin) * dt;
            s.angle = Math.max(-maxAngle * 1.15, Math.min(maxAngle * 1.15, s.angle + s.spin * dt));
        }
        hang.set(s.pos);
        swing.set(s.angle);
    });
    const y = reduced ? target : hang;

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
