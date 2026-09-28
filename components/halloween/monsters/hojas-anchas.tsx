import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Mata de hojas anchas: cinco hojas que salen de un mismo punto, las de atrás
// oscuras y las de enfrente claras para dar profundidad. Relleno: no
// reacciona; cada hoja se mece apenas, desfasada de las demás.

type Pt = [number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;
const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// Curva suave que pasa por los puntos (cuadráticas por los puntos medios).
function smooth(pts: Pt[]) {
    let d = "";
    for (let i = 1; i < pts.length - 1; i++) {
        const end = i === pts.length - 2 ? pts[i + 1] : mid(pts[i], pts[i + 1]);
        d += ` Q${pt(pts[i])} ${pt(end)}`;
    }
    return d;
}

// Un poco arriba del borde: al mecerse, las hojas de enfrente no se salen de la caja.
const BASE: Pt = [108, 146];

// `pow` cambia la silueta: bajo (0.6) = base ancha y redonda; alto (0.95) = lanceolada.
type Leaf = {
    fill: string;
    vein: string;
    deg: number;
    len: number;
    wid: number;
    bend: number;
    pow: number;
    seed: number;
    sd: string;
    bd: string;
};

// Orden de pintado: de atrás hacia adelante. Los pares NO son espejo (ángulo,
// largo, ancho y forma distintos): simétricas se leían como logotipo.
const LEAVES: Leaf[] = [
    { fill: P.tealDeep, vein: P.teal, deg: -138, len: 110, wid: 27, bend: 0.12, pow: 0.8, seed: 1, sd: "5.6s", bd: "-0.4s" },
    { fill: P.tealDeep, vein: P.teal, deg: -54, len: 100, wid: 34, bend: -0.1, pow: 0.6, seed: 2, sd: "6.1s", bd: "-2.1s" },
    { fill: P.moss, vein: P.sage, deg: -104, len: 122, wid: 36, bend: 0.08, pow: 0.75, seed: 3, sd: "5.2s", bd: "-1.2s" },
    { fill: P.sage, vein: P.moss, deg: -158, len: 86, wid: 25, bend: 0.2, pow: 0.95, seed: 4, sd: "5.9s", bd: "-3s" },
    { fill: P.sage, vein: P.moss, deg: -22, len: 92, wid: 27, bend: -0.3, pow: 0.65, seed: 5, sd: "5.4s", bd: "-0.9s" },
];

function build(l: Leaf) {
    const a = (l.deg * Math.PI) / 180;
    const dir: Pt = [Math.cos(a), Math.sin(a)];
    const perp: Pt = [-dir[1], dir[0]];
    // La lámina empieza un poco despegada de la base: ese tramo es el pecíolo.
    const start: Pt = [BASE[0] + dir[0] * 8, BASE[1] + dir[1] * 8];
    const axis = (s: number): Pt => {
        const b = l.bend * s * s * l.len;
        return [start[0] + dir[0] * s * l.len + perp[0] * b, start[1] + dir[1] * s * l.len + perp[1] * b];
    };
    // Ancho máximo según `pow`, punta afilada, borde con leve ondulación.
    const width = (s: number, i: number) =>
        l.wid * Math.pow(Math.sin(Math.PI * Math.pow(s, l.pow)), 0.9) * (1 + 0.08 * Math.sin(i * 2.3 + l.seed));
    const N = 9;
    const side = (sign: number) => {
        const pts: Pt[] = [];
        for (let i = 0; i <= N; i++) {
            const s = i / N;
            const c = axis(s);
            const w = width(s, i + (sign > 0 ? 0 : 5));
            pts.push([c[0] + perp[0] * w * sign, c[1] + perp[1] * w * sign]);
        }
        return pts;
    };
    const right = side(1);
    const left = side(-1);
    const blade = `M${pt(start)}${smooth(right)}${smooth([...left].reverse())} Z`;
    // Media hoja a la sombra: de la base a la punta por el borde y de vuelta por la nervadura.
    const shade = `M${pt(start)}${smooth(right)} Q${pt(axis(0.5))} ${pt(start)} Z`;
    // Nervaduras: central más tres laterales por lado, curvadas hacia la punta.
    // La central arranca ya dentro de la lámina: si empieza en `start` asoma un
    // botón redondo por fuera del contorno.
    let veins = `M${pt(axis(0.06))} Q${pt(axis(0.5))} ${pt(axis(0.94))}`;
    for (const s of [0.22, 0.42, 0.62]) {
        for (const sign of [1, -1]) {
            const c = axis(s);
            const f = axis(s + 0.16);
            const w = width(s + 0.12, 0) * 0.78;
            veins += ` M${pt(c)} Q${pt([f[0] + perp[0] * w * sign * 0.4, f[1] + perp[1] * w * sign * 0.4])} ${pt([f[0] + perp[0] * w * sign, f[1] + perp[1] * w * sign])}`;
        }
    }
    // Pivote del meneo: el arranque de la lámina, en % de su propia caja.
    const all = [...right, ...left];
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const o = `${Math.round(((start[0] - x0) / (x1 - x0)) * 100)}% ${Math.round(((start[1] - y0) / (y1 - y0)) * 100)}%`;
    return { ...l, blade, shade, veins, o, stalk: `M${pt(BASE)} L${pt(start)}` };
}

const BUILT = LEAVES.map(build);
const STALKS = BUILT.map((b) => b.stalk).join(" ");

function Art() {
    return (
        <g>
            {/* Pecíolos juntos, detrás de todo. */}
            <path d={STALKS} fill="none" {...inked} strokeWidth="8" />
            <path d={STALKS} fill="none" stroke={P.moss} strokeWidth="3.5" strokeLinecap="round" />
            {BUILT.map((b, i) => (
                <g key={i} className="hw-sway" style={v({ "--o": b.o, "--sw": "1.6deg", "--sd": b.sd, "--bd": b.bd })}>
                    <path d={b.blade} fill={b.fill} {...inked} />
                    <path d={b.shade} fill={INK} opacity="0.2" />
                    <path d={b.veins} fill="none" stroke={b.vein} strokeWidth="2.2" strokeLinecap="round" />
                </g>
            ))}
            {/* Matita de musgo encima de todo: tapa el nudo de pecíolos y las cuñas de tinta. */}
            <path
                d="M95 148 C95 140 101 135 106 138 C109 133 117 134 118 139 C122 139 124 144 122 148 Z"
                fill={P.moss}
                {...inked}
                strokeWidth="3"
            />
            <path
                d="M103 144 Q106 140 110 141 M112 145 Q115 141 118 143"
                fill="none"
                stroke={P.sage}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </g>
    );
}

const monster: MonsterDef = {
    id: "hojas-anchas",
    name: "Hojas anchas",
    w: 220,
    h: 160,
    interactive: false,
    Art,
};

export default monster;
