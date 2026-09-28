import { P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Mata de pasto para tapar las bases de los monstruos de primer plano. Tres
// capas (oscura atrás, clara adelante), cada una un solo path de puntas.
// Relleno: no reacciona; cada capa se mece un poquito, a destiempo.

const r1 = (n: number) => Math.round(n * 10) / 10;
// Ruido determinista: el mismo dibujo en servidor y cliente.
const rnd = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const W = 200;
const H = 80;

// Una capa: puntas curvas que arrancan en `base` y se inclinan al azar. El
// path NO se cierra: la tinta no dibuja la orilla de abajo, así al tapar el
// pie de un monstruo no queda una raya horizontal encima de él.
// Hojas angostas y muchas: pocas y anchas se leían como agave o como flamas.
// `slim`: controles pegados al eje, costados rectos o un poco cóncavos. Sin
// esto la capa de enfrente (la más clara, la que manda) se leía como una fila
// de arcos góticos.
function layer(x0: number, x1: number, base: number, count: number, tall: number, seed: number, slim = false) {
    const bw = (x1 - x0) / count;
    let d = `M${r1(x0)} ${H}`;
    let blades = "";
    for (let i = 0; i < count; i++) {
        const vx = x0 + i * bw;
        const nx = vx + bw;
        // Más altas en medio de la mata, más bajas en las orillas.
        const hump = Math.pow(Math.sin((Math.PI * (i + 0.5)) / count), 0.6);
        const h = tall * hump * (0.55 + rnd(seed + i) * 0.45);
        // Las de las orillas se abren hacia afuera: así la orilla de la capa es
        // la hoja misma y no una pared de tinta que remata en gancho.
        // Las de en medio, acotadas: si la punta se pasa de media hoja, los
        // costados se cruzan y quedan nudos de tinta.
        const lean = i === 0 ? -bw * 0.6 : i === count - 1 ? bw * 0.6 : clamp((rnd(seed + i * 7) - 0.5) * bw * 1.2, -bw * 0.4, bw * 0.4);
        const tx = vx + bw * 0.5 + lean * 1.4;
        const ty = base - h;
        const vy = i === count - 1 ? H : base + rnd(seed + i * 3) * 6;
        // Los controles siguen la inclinación: la hoja se dobla sin que sus
        // dos orillas se crucen (si se cruzan, el relleno se vuelve astillas).
        const c1: [number, number] = slim
            ? [vx + bw * 0.3 + lean * 0.35, base - h * 0.55]
            : [vx + bw * 0.08 + lean * 0.35, base - h * 0.35];
        const c2: [number, number] = slim ? [nx - bw * 0.3 + lean * 0.35, base - h * 0.6] : [nx - bw * 0.08 + lean * 0.35, base - h * 0.5];
        d += ` Q${r1(c1[0])} ${r1(c1[1])} ${r1(tx)} ${r1(ty)}`;
        d += ` Q${r1(c2[0])} ${r1(c2[1])} ${r1(nx)} ${r1(vy)}`;
        // Una hebra interior en algunas hojas: textura sin formas extra.
        if (rnd(seed + i * 11) > 0.45) {
            blades += ` M${r1(vx + bw * 0.55)} ${r1(base + 2)} Q${r1(vx + bw * 0.5 + lean * 0.5)} ${r1(base - h * 0.4)} ${r1(tx - lean * 0.25)} ${r1(ty + h * 0.3)}`;
        }
    }
    return { d, blades: blades.trim() };
}

// La capa de enfrente se mece menos: es la que tapa pies y, al girar, una
// esquina de abajo se levantaba y dejaba ver una rendija. Las de atrás llevan
// tinta más delgada (`ink`): con 3 las puntas angostas eran pura tinta.
const LAYERS = [
    { ...layer(10, 190, 60, 11, 52, 3), fill: P.tealDeep, line: P.teal, ink: "2.5", sd: "5.8s", bd: "-1.1s", sw: "1.2deg" },
    { ...layer(8, 192, 68, 10, 44, 17), fill: P.moss, line: P.sage, ink: "2.5", sd: "5s", bd: "-2.7s", sw: "1deg" },
    { ...layer(10, 190, 76, 14, 34, 29, true), fill: P.sage, line: P.moss, ink: "3", sd: "4.4s", bd: "-0.5s", sw: "0.6deg" },
];

function Art() {
    return (
        <g>
            {LAYERS.map((l, i) => (
                <g key={i} className="hw-sway" style={v({ "--o": "50% 100%", "--sw": l.sw, "--sd": l.sd, "--bd": l.bd })}>
                    <path d={l.d} fill={l.fill} {...inked} strokeWidth={l.ink} />
                    <path d={l.blades} fill="none" stroke={l.line} strokeWidth="2" strokeLinecap="round" />
                </g>
            ))}
        </g>
    );
}

const monster: MonsterDef = {
    id: "pasto",
    name: "Pasto",
    w: W,
    h: H,
    interactive: false,
    Art,
};

export default monster;
