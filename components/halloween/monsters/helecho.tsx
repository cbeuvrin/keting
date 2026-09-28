import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Helecho: fronda alta de relleno. Las pinnas se generan con código para que
// todas tengan el mismo borde lobulado "a mano" sin escribir 20 paths.
// Relleno: no reacciona, solo se mece desde la base.

type Pt = [number, number];
const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;
// Ruido determinista: el mismo dibujo en servidor y cliente.
const rnd = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};

// Tallo: cuadrática de la base a la punta, con una panza hacia la izquierda.
const S0: Pt = [63, 254];
const S1: Pt = [44, 134];
const S2: Pt = [72, 26];
const stemAt = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * S0[0] + 2 * u * t * S1[0] + t * t * S2[0], u * u * S0[1] + 2 * u * t * S1[1] + t * t * S2[1]];
};
const stemDir = (t: number): Pt => {
    const dx = 2 * (1 - t) * (S1[0] - S0[0]) + 2 * t * (S2[0] - S1[0]);
    const dy = 2 * (1 - t) * (S1[1] - S0[1]) + 2 * t * (S2[1] - S1[1]);
    const l = Math.hypot(dx, dy);
    return [dx / l, dy / l];
};
const rotate = (d: Pt, deg: number): Pt => {
    const a = (deg * Math.PI) / 180;
    return [d[0] * Math.cos(a) - d[1] * Math.sin(a), d[0] * Math.sin(a) + d[1] * Math.cos(a)];
};

// Una pinna: eje que se curva hacia la punta de la fronda, bordes con lóbulos.
function pinna(base: Pt, dir: Pt, up: Pt, len: number) {
    const perp: Pt = [-dir[1], dir[0]];
    const wid = Math.max(5, len * 0.22); // piso: las pinnas cortas no se vuelven rayitas
    const axis = (s: number): Pt => [
        base[0] + dir[0] * s * len + up[0] * s * s * len * 0.3,
        base[1] + dir[1] * s * len + up[1] * s * s * len * 0.3,
    ];
    const side = (s: number, k: number, sign: number): Pt => {
        const a = axis(s);
        return [a[0] + perp[0] * k * sign, a[1] + perp[1] * k * sign];
    };
    const wp = (s: number) => wid * Math.pow(Math.sin(Math.PI * s), 0.6);
    const n = Math.max(2, Math.round(len / 9));
    let d = `M${pt(base)}`;
    for (let j = 0; j < n; j++) {
        const m = (j + 0.5) / n;
        const e = (j + 1) / n;
        d += ` Q${pt(side(m, wp(m) * 1.35, 1))} ${pt(side(e, wp(e) * 0.72, 1))}`;
    }
    for (let j = n - 1; j >= 0; j--) {
        const m = (j + 0.5) / n;
        const e = j / n;
        d += ` Q${pt(side(m, wp(m) * 1.35, -1))} ${pt(side(e, wp(e) * 0.72, -1))}`;
    }
    const tipS = 0.82;
    const rib = `M${pt(base)} Q${pt([base[0] + (dir[0] * len * tipS) / 2, base[1] + (dir[1] * len * tipS) / 2])} ${pt(axis(tipS))}`;
    return { d: `${d} Z`, rib };
}

// Pinnas alternas: más largas a media altura, cortas abajo y en la punta. El
// largo lleva ruido y el lado izquierdo es más largo: sin eso el contorno de la
// fronda es una elipse perfecta y se lee como ícono de hoja.
type Pinna = { d: string; rib: string; shaded: boolean };
const PINNAS: Pinna[] = [];
for (let k = 0; k < 8; k++) {
    for (const side of [-1, 1]) {
        const t = 0.08 + k * 0.104 + (side > 0 ? 0.045 : 0);
        const jitter = 0.82 + rnd(k * 2 + (side > 0 ? 1 : 0)) * 0.28;
        const len = Math.max(22, 46 * Math.sin(Math.PI * (0.2 + 0.8 * t)) * jitter * (side < 0 ? 1.1 : 1));
        const up = stemDir(t);
        PINNAS.push({ ...pinna(stemAt(t), rotate(up, side * 64), up, len), shaded: side > 0 });
    }
}
// Folíolo terminal, en la dirección del tallo: cierra la punta.
PINNAS.push({ ...pinna(stemAt(0.87), stemDir(0.87), stemDir(0.87), 30), shaded: false });

// Lado derecho a la sombra, en un solo path para no gastar formas.
const SHADE = PINNAS.filter((p) => p.shaded)
    .map((p) => p.d)
    .join(" ");
// Tallo recortado donde nace el folíolo terminal (de Casteljau: el control se
// acorta en la misma proporción, así el trazo pasa justo por la base de las pinnas).
const STEM_END = 0.88;
const STEM = `M${pt(S0)} Q${pt([S0[0] + (S1[0] - S0[0]) * STEM_END, S0[1] + (S1[1] - S0[1]) * STEM_END])} ${pt(stemAt(STEM_END))}`;
const RIBS = PINNAS.map((p) => p.rib).join(" ");

function Art() {
    return (
        <g className="hw-sway" style={v({ "--o": "50% 100%", "--sw": "2.5deg", "--sd": "5.2s" })}>
            {/* Brote enrollado junto a la base: el detalle que dice "helecho". */}
            <path
                d="M65 252 C78 242 98 238 106 222 C112 208 104 198 96 202 C90 206 94 214 100 211"
                fill="none"
                {...inked}
                strokeWidth="10"
            />
            <path
                d="M65 252 C78 242 98 238 106 222 C112 208 104 198 96 202 C90 206 94 214 100 211"
                fill="none"
                stroke={P.sage}
                strokeWidth="5"
                strokeLinecap="round"
            />
            {/* Cabeza enrollada del brote: sin ella el rizo parece un hilo suelto. */}
            <ellipse cx="100" cy="208" rx="6" ry="5" fill={P.moss} {...inked} strokeWidth="2.5" />

            {/* Pinnas en musgo con nervadura salvia. */}
            {PINNAS.map((p, i) => (
                <path key={i} d={p.d} fill={P.moss} {...inked} strokeWidth="3" />
            ))}
            <path d={SHADE} fill={INK} opacity="0.18" />
            <path d={RIBS} fill="none" stroke={P.sage} strokeWidth="2" strokeLinecap="round" />

            {/* Tallo al final: tapa la unión de las pinnas. */}
            <path d={STEM} fill="none" {...inked} strokeWidth="8.5" />
            <path d={STEM} fill="none" stroke={P.sage} strokeWidth="3.5" strokeLinecap="round" />
        </g>
    );
}

const monster: MonsterDef = {
    id: "helecho",
    name: "Helecho",
    w: 120,
    h: 260,
    interactive: false,
    Art,
};

export default monster;
