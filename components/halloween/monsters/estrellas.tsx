import { P, v } from "../palette";
import type { MonsterDef } from "../types";

// Campo de destellos para tapar huecos del fondo entre monstruos. Van sobre
// el negro, así que NADA de tinta: solo crema y mostaza. Cada destello titila
// por su cuenta (duración y retraso propios) para que el campo no "respire"
// todo junto. Relleno: no reacciona.

type Kind = "star" | "plus" | "x" | "dot";
type Spark = { k: Kind; x: number; y: number; s: number; c: string; td: string; bd: string };

// Repartidos a mano, sin cuadrícula: dos estrellas grandes que anclan, el
// resto chico. El orden no importa (ninguno se encima).
const SPARKS: Spark[] = [
    { k: "star", x: 64, y: 58, s: 16, c: P.cream, td: "3.1s", bd: "-0.4s" },
    { k: "star", x: 278, y: 164, s: 18, c: P.mustard, td: "3.6s", bd: "-2.2s" },
    { k: "star", x: 196, y: 38, s: 10, c: P.mustard, td: "2.6s", bd: "-1.3s" },
    { k: "star", x: 118, y: 190, s: 11, c: P.cream, td: "2.9s", bd: "-0.9s" },
    { k: "star", x: 330, y: 64, s: 9, c: P.cream, td: "3.3s", bd: "-2.7s" },
    { k: "plus", x: 142, y: 96, s: 7, c: P.cream, td: "2.4s", bd: "-1.8s" },
    { k: "plus", x: 26, y: 150, s: 6, c: P.mustard, td: "2.8s", bd: "-0.2s" },
    { k: "plus", x: 250, y: 90, s: 6, c: P.cream, td: "3.4s", bd: "-2.9s" },
    { k: "plus", x: 196, y: 214, s: 6, c: P.mustard, td: "2.2s", bd: "-1.1s" },
    { k: "x", x: 96, y: 124, s: 5, c: P.mustard, td: "2.5s", bd: "-1.6s" },
    { k: "x", x: 318, y: 214, s: 5, c: P.cream, td: "3s", bd: "-0.7s" },
    { k: "x", x: 222, y: 128, s: 4.5, c: P.cream, td: "2.7s", bd: "-2.4s" },
    { k: "dot", x: 170, y: 150, s: 3, c: P.cream, td: "2.1s", bd: "-0.5s" },
    { k: "dot", x: 44, y: 212, s: 3.2, c: P.mustard, td: "2.9s", bd: "-1.9s" },
    { k: "dot", x: 124, y: 26, s: 2.6, c: P.cream, td: "2.3s", bd: "-2.6s" },
    { k: "dot", x: 292, y: 118, s: 2.4, c: P.mustard, td: "3.2s", bd: "-0.1s" },
    { k: "dot", x: 344, y: 150, s: 2.8, c: P.cream, td: "2.6s", bd: "-1.4s" },
    { k: "plus", x: 70, y: 170, s: 5, c: P.cream, td: "3.5s", bd: "-3.1s" },
];

const r1 = (n: number) => Math.round(n * 10) / 10;

// Estrella de cuatro puntas con lados cóncavos, más alta que ancha y
// ladeada según su posición: así no salen todas iguales, como de sello.
const starPath = (x: number, y: number, s: number) => {
    const tilt = (((x * 7 + y * 3) % 23) - 11) * (Math.PI / 180);
    const at = (dx: number, dy: number) =>
        `${r1(x + dx * Math.cos(tilt) - dy * Math.sin(tilt))} ${r1(y + dx * Math.sin(tilt) + dy * Math.cos(tilt))}`;
    const w = s * 0.74;
    const k = s * 0.15;
    return `M${at(0, -s)} Q${at(k, -k * 1.2)} ${at(w, 0)} Q${at(k * 0.9, k)} ${at(0, s * 0.92)} Q${at(-k, k * 1.1)} ${at(-w * 0.94, 0)} Q${at(-k * 1.1, -k)} ${at(0, -s)} Z`;
};

// Cruces con un brazo un poco más corto: trazo de pluma, no de regla.
function Spark({ k, x, y, s, c }: Spark) {
    if (k === "star") return <path d={starPath(x, y, s)} fill={c} />;
    if (k === "dot") return <circle cx={x} cy={y} r={s} fill={c} />;
    const t = s * 0.8;
    const d =
        k === "plus"
            ? `M${x - s} ${y + 0.5} L${x + s} ${y - 0.5} M${x} ${y - s} L${x + 0.5} ${y + t}`
            : `M${x - s} ${y - s} L${x + t} ${y + t} M${x + s} ${y - t} L${x - t} ${y + s}`;
    return <path d={d} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />;
}

function Art() {
    return (
        <g>
            {SPARKS.map((sp, i) => (
                <g key={i} className="hw-twinkle" style={v({ "--td": sp.td, "--bd": sp.bd })}>
                    <Spark {...sp} />
                </g>
            ))}
        </g>
    );
}

const monster: MonsterDef = {
    id: "estrellas",
    name: "Estrellas",
    w: 360,
    h: 240,
    interactive: false,
    Art,
};

export default monster;
