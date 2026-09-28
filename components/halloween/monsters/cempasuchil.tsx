import { P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Racimo de tres cempasúchiles (el guiño de Día de Muertos del póster). Cada
// flor es un pompón de tres capas festoneadas, la de arriba corrida hacia
// arriba para que se vea la "copa", más rizos de pétalo dibujados.
// Relleno: no reacciona; cada flor se mece desde su tallo, desfasada.

type Pt = [number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;
// Ruido determinista: el mismo dibujo en servidor y cliente.
const rnd = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};

// Disco festoneado: n pétalos redondeados alrededor de una elipse.
function ruffle(cx: number, cy: number, rx: number, ry: number, n: number, depth: number, seed: number) {
    const at = (a: number, k: number): Pt => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
    const rot = rnd(seed) * 6;
    let d = "";
    for (let i = 0; i < n; i++) {
        const a0 = rot + (i / n) * Math.PI * 2;
        const a1 = rot + ((i + 1) / n) * Math.PI * 2;
        const bump = 1 + depth * (0.7 + rnd(seed + i) * 0.6);
        if (i === 0) d += `M${pt(at(a0, 1 - depth))}`;
        d += ` Q${pt(at((a0 + a1) / 2, bump))} ${pt(at(a1, 1 - depth))}`;
    }
    return `${d} Z`;
}

// Rizos de pétalo: arquitos "⌒" dentro de una banda (anillo de elipse entre
// k0 y k1, ángulos a0–a1) que no toca ningún contorno. Sueltos al azar
// cruzaban la tinta de las capas y se veían como garabato.
function curls(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    k0: number,
    k1: number,
    a0: number,
    a1: number,
    n: number,
    seed: number,
    size = 1,
) {
    let d = "";
    for (let i = 0; i < n; i++) {
        const a = ((a0 + ((i + 0.3 + rnd(seed + i * 3) * 0.4) / n) * (a1 - a0)) * Math.PI) / 180;
        const k = k0 + rnd(seed + i * 5) * (k1 - k0);
        const x = cx + Math.cos(a) * rx * k;
        const y = cy + Math.sin(a) * ry * k;
        const s = (2.2 + rnd(seed + i * 7) * 1.4) * size;
        d += ` M${r1(x - s)} ${r1(y)} Q${r1(x)} ${r1(y - s * 0.9)} ${r1(x + s)} ${r1(y)}`;
    }
    return d.trim();
}

type Flower = {
    cx: number;
    cy: number;
    r: number;
    base: string;
    top: string;
    heart: string;
    line: string;
    stem: string;
    sd: string;
    bd: string;
    seed: number;
};

const STEM_BASE: Pt = [86, 134];

// Orden de pintado: la flor central va al final, encima de las otras.
const FLOWERS: Flower[] = [
    {
        cx: 38,
        cy: 66,
        r: 27,
        base: P.mustardDeep,
        top: P.mustard,
        heart: P.mustardDeep,
        line: P.pumpkinDeep,
        stem: "",
        sd: "5.4s",
        bd: "-1.6s",
        seed: 11,
    },
    {
        cx: 132,
        cy: 62,
        r: 28,
        base: P.pumpkinDeep,
        top: P.pumpkin,
        // Borde en rosa oscuro: en pumpkinDeep sobre pumpkinDeep la copa se
        // perdía y la flor se veía plana y café.
        heart: P.mustardDeep,
        line: P.roseDeep,
        stem: "",
        sd: "6s",
        bd: "-0.3s",
        seed: 23,
    },
    {
        cx: 86,
        cy: 42,
        r: 33,
        base: P.pumpkin,
        top: P.mustard,
        heart: P.pumpkin,
        line: P.pumpkinDeep,
        stem: "",
        sd: "4.9s",
        bd: "-2.6s",
        seed: 37,
    },
].map((f) => ({
    ...f,
    stem: `M${pt(STEM_BASE)} Q${r1((STEM_BASE[0] + f.cx) / 2 + (f.cx < 86 ? 18 : f.cx > 86 ? -18 : 10))} ${r1(f.cy + 40)} ${f.cx} ${f.cy + f.r * 0.6}`,
}));

// Pivote del meneo: la base del tallo en % de la caja de flor + tallo.
const pivot = (f: Flower) => {
    const x0 = Math.min(f.cx - f.r * 1.2, STEM_BASE[0]);
    const x1 = Math.max(f.cx + f.r * 1.2, STEM_BASE[0]);
    return `${Math.round(((STEM_BASE[0] - x0) / (x1 - x0)) * 100)}% 100%`;
};

// Hojas de cempasúchil: alargadas con borde finamente aserrado, como folíolo
// de tagetes. Con pocos dientes grandes se leían como acebo navideño.
function sawLeaf(base: Pt, deg: number, len: number, wid: number) {
    const a = (deg * Math.PI) / 180;
    const dir: Pt = [Math.cos(a), Math.sin(a)];
    const perp: Pt = [-dir[1], dir[0]];
    const p = (s: number, w: number): Pt => [base[0] + dir[0] * s * len + perp[0] * w, base[1] + dir[1] * s * len + perp[1] * w];
    const width = (s: number) => wid * Math.sin(Math.PI * Math.pow(s, 0.8));
    const teeth = 9;
    let d = `M${pt(base)}`;
    for (let i = 1; i <= teeth; i++) {
        const s = i / teeth;
        d += ` L${pt(p(s - 0.5 / teeth, width(s - 0.5 / teeth) * 1.05))} L${pt(p(s, width(s) * 0.9))}`;
    }
    for (let i = teeth; i >= 1; i--) {
        const s = i / teeth;
        d += ` L${pt(p(s - 0.5 / teeth, -width(s - 0.5 / teeth) * 1.05))} L${pt(p(s - 1 / teeth, -width(s - 1 / teeth) * 0.9))}`;
    }
    return { d: `${d} Z`, rib: `M${pt(base)} L${pt(p(0.8, 0))}` };
}

const LEAVES = [
    // Las dos de afuera, levantadas: acostadas formaban una estrella plana.
    sawLeaf([84, 130], -155, 50, 8),
    sawLeaf([88, 130], -25, 48, 8),
    sawLeaf([82, 126], -128, 36, 7),
    sawLeaf([90, 126], -56, 34, 7),
];
const RIBS = LEAVES.map((l) => l.rib).join(" ");

function Art() {
    return (
        <g>
            {FLOWERS.map((f, i) => (
                <g key={i} className="hw-sway" style={v({ "--o": pivot(f), "--sw": "2.5deg", "--sd": f.sd, "--bd": f.bd })}>
                    <path d={f.stem} fill="none" {...inked} strokeWidth="8" />
                    <path d={f.stem} fill="none" stroke={P.moss} strokeWidth="3.5" strokeLinecap="round" />
                    {/* Pompón: capa de afuera muy festoneada, un segundo borde de
                    pétalos sin relleno, la copa corrida hacia arriba y el corazón de pétalos
                    apretados (con rizos adentro, para que no parezca un botón). Solo
                    la capa de afuera lleva tinta: con tres anillos negros parecía diana. */}
                    <path d={ruffle(f.cx, f.cy, f.r, f.r * 0.86, 20, 0.09, f.seed)} fill={f.base} {...inked} />
                    <path
                        d={ruffle(f.cx, f.cy - f.r * 0.04, f.r * 0.8, f.r * 0.66, 15, 0.1, f.seed + 20)}
                        fill="none"
                        stroke={f.line}
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                    <path
                        d={ruffle(f.cx, f.cy - f.r * 0.16, f.r * 0.72, f.r * 0.6, 11, 0.14, f.seed + 40)}
                        fill={f.top}
                        {...inked}
                        stroke={f.line}
                        strokeWidth="2.5"
                    />
                    <path d={ruffle(f.cx, f.cy - f.r * 0.24, f.r * 0.3, f.r * 0.24, 10, 0.1, f.seed + 80)} fill={f.heart} />
                    <path
                        d={`${curls(f.cx, f.cy, f.r, f.r * 0.86, 0.72, 0.82, 25, 155, 5, f.seed)} ${curls(f.cx, f.cy - f.r * 0.16, f.r * 0.72, f.r * 0.6, 0.64, 0.76, 0, 360, 5, f.seed + 9)} ${curls(f.cx, f.cy - f.r * 0.24, f.r * 0.3, f.r * 0.24, 0.2, 0.6, 0, 360, 3, f.seed + 60, 0.6)}`}
                        fill="none"
                        stroke={f.line}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>
            ))}

            {/* Hojas al frente de la base, tapando la unión de los tallos. */}
            {LEAVES.map((l, i) => (
                <path key={i} d={l.d} fill={P.moss} {...inked} strokeWidth="3" />
            ))}
            <path d={RIBS} fill="none" stroke={P.sage} strokeWidth="2" strokeLinecap="round" />
        </g>
    );
}

const monster: MonsterDef = {
    id: "cempasuchil",
    name: "Cempasúchil",
    w: 170,
    h: 140,
    interactive: false,
    Art,
};

export default monster;
