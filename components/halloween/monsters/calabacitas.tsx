import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Dos calabacitas chicas, sin cara (las calabazas con cara son personajes).
// Cada una: relleno, sombra plana a la derecha con rayado, costillas y AL FINAL el
// contorno, para que la sombra no se coma media línea de tinta.
// Relleno: no reacciona; solo el zarcillo se mece.

type Pumpkin = { body: string; shade: string; ribs: string; shine: string; stem: string; fill: string; dark: string };

const PUMPKINS: Pumpkin[] = [
    // Grande, naranja, a la izquierda y un poco atrás.
    {
        body: "M56 34 C46 28 32 30 24 38 C12 42 8 58 12 70 C16 82 30 88 44 85 C50 88 62 88 68 85 C82 88 96 82 99 70 C102 58 98 42 88 38 C80 30 66 28 56 34 Z",
        shade: "M62 35 C74 44 76 72 68 85 C82 88 96 82 99 70 C102 58 98 42 88 38 C80 30 66 28 62 35 Z",
        ribs: "M50 35 C38 44 36 72 44 85 M62 35 C74 44 76 72 68 85 M56 36 C55 52 55 70 56 87 M82 41 L86 47 M78 55 L81 61 M78 67 L81 73",
        shine: "M21 50 C18 57 19 64 23 69",
        stem: "M49 38 C47 29 48 21 53 13 L64 16 C59 23 59 30 62 38 Z",
        fill: P.pumpkin,
        dark: P.pumpkinDeep,
    },
    // Chica, mostaza, enfrente a la derecha.
    {
        body: "M114 50 C107 45 97 46 92 52 C84 55 82 68 86 76 C90 84 100 87 108 85 C112 87 118 87 122 85 C130 87 140 84 143 76 C146 66 142 55 136 52 C131 46 121 45 114 50 Z",
        shade: "M118 51 C126 58 127 76 122 85 C130 87 140 84 143 76 C146 66 142 55 136 52 C131 46 121 45 118 51 Z",
        ribs: "M110 51 C102 58 101 76 106 85 M118 51 C126 58 127 76 122 85 M133 58 L136 63 M134 69 L137 74",
        shine: "M90 60 C88 66 89 71 92 75",
        stem: "M109 53 C108 45 112 38 119 34 L125 40 C119 43 117 47 119 53 Z",
        fill: P.mustard,
        dark: P.mustardDeep,
    },
];

const TENDRIL = "M60 20 C70 11 83 14 85 23 C87 30 80 34 77 29 C75 25 79 22 82 25";

function Art() {
    return (
        <g>
            {/* Hojita del tallo grande, detrás de todo. */}
            <path d="M53 23 C43 12 28 13 22 22 C31 30 45 30 53 23 Z" fill={P.moss} {...inked} strokeWidth="3" />
            <path d="M50 23 C42 20 33 20 27 22" fill="none" stroke={P.sage} strokeWidth="2" strokeLinecap="round" />

            {/* Zarcillo: sobre el fondo, así que salvia con tinta debajo. */}
            <g className="hw-sway" style={v({ "--o": "0% 40%", "--sw": "6deg", "--sd": "3.8s" })}>
                <path d={TENDRIL} fill="none" {...inked} strokeWidth="5.5" />
                <path d={TENDRIL} fill="none" stroke={P.sage} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {PUMPKINS.map((p, i) => (
                <g key={i}>
                    <path d={p.stem} fill={P.moss} {...inked} strokeWidth="3" />
                    <path d={p.body} fill={p.fill} />
                    <path d={p.shade} fill={p.dark} />
                    <path d={p.ribs} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
                    <path d={p.shine} fill="none" stroke={P.cream} strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
                    <path d={p.body} fill="none" {...inked} />
                </g>
            ))}
        </g>
    );
}

const monster: MonsterDef = {
    id: "calabacitas",
    name: "Calabacitas",
    w: 150,
    h: 90,
    interactive: false,
    Art,
};

export default monster;
