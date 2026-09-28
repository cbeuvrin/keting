import { P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Ramita delgada con hojitas alternas. Es la pieza más fina del relleno: trazo
// de tinta delgado para que, escalada chiquita, no se vuelva un manchón.
// Relleno: no reacciona, se mece desde la base.

type Pt = [number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;

// Tallo principal (cúbica) y un brote lateral (cuadrática).
const cubic =
    (a: Pt, b: Pt, c: Pt, d: Pt) =>
    (t: number): Pt => {
        const u = 1 - t;
        return [
            u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
            u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
        ];
    };
const MAIN: [Pt, Pt, Pt, Pt] = [
    [40, 176],
    [30, 130],
    [58, 80],
    [46, 26],
];
const main = cubic(...MAIN);
const BRANCH_FROM = main(0.42);
const BRANCH: [Pt, Pt, Pt, Pt] = [BRANCH_FROM, [58, 100], [70, 92], [78, 70]];
const branch = cubic(...BRANCH);

const dirAt = (f: (t: number) => Pt, t: number): Pt => {
    const a = f(Math.max(0, t - 0.01));
    const b = f(Math.min(1, t + 0.01));
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
};
const rotate = (d: Pt, deg: number): Pt => {
    const a = (deg * Math.PI) / 180;
    return [d[0] * Math.cos(a) - d[1] * Math.sin(a), d[0] * Math.sin(a) + d[1] * Math.cos(a)];
};

// Hojita lanceolada: dos cuadráticas de la base a la punta. `wf` = ancho
// relativo (0.36 angosta … 0.52 ancha); `ribF` = hasta dónde llega la
// nervadura, que arranca en 0.12 para no atravesar el tallo. `bite` abre una
// mordida (arco cóncavo) en la orilla de la cuadrática c1.
function leaf(base: Pt, dir: Pt, len: number, wf: number, ribF = 0.7, bite = false) {
    const perp: Pt = [-dir[1], dir[0]];
    const w = len * wf;
    const at = (s: number, o = 0): Pt => [base[0] + dir[0] * len * s + perp[0] * o, base[1] + dir[1] * len * s + perp[1] * o];
    const tip = at(1);
    const c1 = at(0.45, w);
    const c2 = at(0.45, -w);
    const rib = `M${pt(at(0.12))} L${pt(at(ribF))}`;
    if (!bite) return { d: `M${pt(base)} Q${pt(c1)} ${pt(tip)} Q${pt(c2)} ${pt(base)} Z`, rib };
    // Parte la cuadrática en u0–u1 (de Casteljau) y mete un arco hacia adentro.
    const lerp = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    const q = (u: number) => lerp(lerp(base, c1, u), lerp(c1, tip, u), u);
    const u0 = 0.42;
    const u1 = 0.66;
    const a = q(u0);
    const b = q(u1);
    const r = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.6;
    return {
        d: `M${pt(base)} Q${pt(lerp(base, c1, u0))} ${pt(a)} A${r1(r)} ${r1(r)} 0 0 1 ${pt(b)} Q${pt(lerp(c1, tip, u1))} ${pt(tip)} Q${pt(c2)} ${pt(base)} Z`,
        rib,
    };
}

// Hojita con la punta enrollada: la nervadura se dobla en el último tramo
// (hacia `curl` = ±1) y el contorno se arma con muestras suavizadas.
function curledLeaf(base: Pt, dir: Pt, len: number, wf: number, curl: number, ribF = 0.62) {
    const N = 18;
    const step = len / N;
    let ang = Math.atan2(dir[1], dir[0]);
    let p: Pt = base;
    const L: Pt[] = [];
    const R: Pt[] = [];
    const mid: Pt[] = [];
    for (let i = 0; i <= N; i++) {
        const s = i / N;
        const hw = 0.5 * len * wf * Math.sin(Math.PI * Math.pow(s, 0.72));
        const n: Pt = [-Math.sin(ang), Math.cos(ang)];
        L.push([p[0] + n[0] * hw, p[1] + n[1] * hw]);
        R.push([p[0] - n[0] * hw, p[1] - n[1] * hw]);
        mid.push(p);
        if (s >= 0.66) ang += (curl * (170 * Math.PI)) / 180 / (N * 0.34);
        p = [p[0] + Math.cos(ang) * step, p[1] + Math.sin(ang) * step];
    }
    const smooth = (pts: Pt[]) => {
        let d = "";
        for (let i = 1; i < pts.length - 1; i++) {
            const m: Pt = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
            d += ` Q${pt(pts[i])} ${pt(m)}`;
        }
        return `${d} L${pt(pts[pts.length - 1])}`;
    };
    const back = [...R].reverse();
    return {
        d: `M${pt(base)}${smooth(L)}${smooth(back)} Z`,
        rib: `M${pt(mid[Math.round(N * 0.12)])} L${pt(mid[Math.round(N * ribF)])}`,
    };
}
// Ancho por índice: sin esto las 12 hojas salen del mismo sello.
const wf = (i: number) => 0.36 + ((i * 0.618) % 1) * 0.16;

// Cada hoja nace 2 u hacia su lado del eje del tallo: así su tinta no corta
// la franja salvia (que además se pinta encima de las bases).
const baseAt = (f: (t: number) => Pt, t: number, side: number): Pt => {
    const d = dirAt(f, t);
    const o = f(t);
    return [o[0] - d[1] * side * 2, o[1] + d[0] * side * 2];
};

type L = { d: string; rib: string; fill: string };
const LEAVES: L[] = [];
// Hojas del tallo principal, de más grandes abajo a chicas arriba. Alternas,
// salvo que ninguna sale a la derecha junto al brote (t 0.3–0.62): ahí se
// encimaban hoja, tallo y brote en un nudo oscuro. Dos llevan la punta
// enrollada y la grande de abajo una mordida: el toque otoñal, raro.
const MAIN_LEAVES: { t: number; side: number; curl?: boolean; bite?: boolean }[] = [
    { t: 0.12, side: -1, curl: true },
    { t: 0.24, side: 1, bite: true },
    { t: 0.36, side: -1 },
    { t: 0.55, side: -1 },
    { t: 0.66, side: 1 },
    { t: 0.81, side: -1 },
    { t: 0.91, side: 1, curl: true },
];
MAIN_LEAVES.forEach(({ t, side, curl, bite }, i) => {
    const len = 32 - t * 14;
    const b = baseAt(main, t, side);
    const d = rotate(dirAt(main, t), side * 52);
    LEAVES.push({
        ...(curl ? curledLeaf(b, d, len, wf(i), side) : leaf(b, d, len, wf(i), 0.7, bite)),
        fill: i % 2 === 0 ? P.sage : P.teal,
    });
});
// Brote lateral con dos hojitas, las dos hacia su lado de afuera (abajo a la
// derecha, que estaba vacío): hacia el tallo se juntaban tres hojas en un nudo.
// La primera, angosta y con nervadura corta: cruzada por la raya se leía como ojo.
[0.45, 0.78].forEach((t, i) => {
    const deg = i === 0 ? 62 : 50;
    LEAVES.push({
        ...leaf(baseAt(branch, t, 1), rotate(dirAt(branch, t), deg), 21, i === 0 ? 0.36 : wf(i + 8), i === 0 ? 0.5 : 0.7),
        fill: i % 2 === 0 ? P.teal : P.sage,
    });
});
// Yema de la punta del tallo principal.
LEAVES.push({ ...leaf(main(1), dirAt(main, 0.99), 17, wf(11)), fill: P.teal });

// Racimo de bayitas en la punta del brote, en vez de otra hoja.
const BERRIES: Pt[] = [
    [75, 66],
    [83, 68],
    [79, 75],
];

const cpath = (c: [Pt, Pt, Pt, Pt]) => `M${pt(c[0])} C${pt(c[1])} ${pt(c[2])} ${pt(c[3])}`;
const TWIG = `${cpath(MAIN)} ${cpath(BRANCH)}`;
// Nervaduras en el tono oscuro de cada hoja (la tinta con opacidad no se veía).
const ribsOf = (fill: string) =>
    LEAVES.filter((l) => l.fill === fill)
        .map((l) => l.rib)
        .join(" ");
const RIBS_SAGE = ribsOf(P.sage);
const RIBS_TEAL = ribsOf(P.teal);

function Art() {
    return (
        <g className="hw-sway" style={v({ "--o": "40% 100%", "--sw": "4deg", "--sd": "4.3s" })}>
            {/* Tallo en tinta + salvia: la tinta sola (o el musgo) se pierde en el
            fondo. La salvia va después de las hojas y tapa sus bases: sin muescas
            negras en cada nudo. */}
            <path d={TWIG} fill="none" {...inked} strokeWidth="6.5" />
            {LEAVES.map((l, i) => (
                <path key={i} d={l.d} fill={l.fill} {...inked} strokeWidth="2.5" />
            ))}
            <path d={TWIG} fill="none" stroke={P.sage} strokeWidth="3.5" strokeLinecap="round" />
            <path d={RIBS_SAGE} fill="none" stroke={P.moss} strokeWidth="1.6" strokeLinecap="round" />
            <path d={RIBS_TEAL} fill="none" stroke={P.tealDeep} strokeWidth="1.6" strokeLinecap="round" />
            {BERRIES.map((b, i) => (
                <circle key={i} cx={b[0]} cy={b[1]} r="4.5" fill={P.roseDeep} {...inked} strokeWidth="2.5" />
            ))}
            <circle cx={BERRIES[0][0] - 1.4} cy={BERRIES[0][1] - 1.4} r="1.2" fill={P.cream} />
        </g>
    );
}

const monster: MonsterDef = {
    id: "ramita",
    name: "Ramita",
    w: 90,
    h: 180,
    interactive: false,
    Art,
};

export default monster;
