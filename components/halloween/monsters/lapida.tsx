import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Lápida chiquita y tierna: piedra ladeada, musgo que la abraza y una
// florecita de cempasúchil al pie. El "R.I.P." va con trazos (nada de <text>).
// Relleno: no reacciona; solo el mechón de pasto (detrás de la piedra) se mece.

const STONE = "M26 131 C25 104 23 77 24 55 C25 29 42 13 61 12 C82 11 98 27 99 52 C100 78 98 106 97 131 Z";

function Art() {
    return (
        <g>
            {/* Mechón de pasto DETRÁS de la piedra: asoma por su orilla derecha. */}
            <g className="hw-sway" style={v({ "--o": "50% 100%", "--sw": "5deg", "--sd": "3.9s" })}>
                <path
                    d="M86 131 Q84 114 78 100 Q91 108 96 120 Q99 106 109 96 Q107 116 104 131 Z"
                    fill={P.sage}
                    {...inked}
                    strokeWidth="3"
                />
            </g>

            {/* Piedra ladeada. Relleno, detalles y AL FINAL el contorno, para
            que la sombra no se coma media línea de tinta. La sombra lateral es
            ancha a propósito: sin ella la piedra clara le gana al fantasma. */}
            <g transform="rotate(-4 61 131)">
                <path d={STONE} fill={P.boneShade} />
                <path
                    d="M85 19 C95 29 99 41 99 52 C100 78 98 106 97 131 L80 131 C82 104 83 77 83 55 C83 41 85 29 85 19 Z"
                    fill={INK}
                    opacity="0.22"
                />
                <path d="M32 60 C31 40 41 25 56 20" fill="none" stroke={P.bone} strokeWidth="3.5" strokeLinecap="round" />
                {/* Motitas de piedra: segmentos de largo cero con punta redonda. */}
                <path
                    d="M36 86 L36.1 86 M45 100 L45.1 100 M73 92 L73.1 92 M83 108 L83.1 108 M54 114 L54.1 114 M31 106 L31.1 106 M68 38 L68.1 38 M91 86 L91.1 86 M40 120 L40.1 120"
                    stroke={P.burlapShade}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                />
                {/* R.I.P. grabado. */}
                <path
                    d="M37 75 L37 55 C45 54 49 57 48 61 C48 65 44 66 38 66 L47 75 M52 74.5 L52.1 74.5 M58 55 L58 75 M64 74.5 L64.1 74.5 M70 75 L70 55 C78 54 83 57 82 61 C82 66 77 67 71 66 M85 74.5 L85.1 74.5"
                    fill="none"
                    stroke={INK}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Renglones de "fecha" ilegible. Rectos a propósito: una curva aquí
                se lee como sonrisa y la piedra se vuelve personaje. */}
                <path d="M42 88 L80 87 M49 96 L73 95.5" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
                {/* Grieta desde el borde de arriba. */}
                <path
                    d="M83 16 L79 27 L84 34 L79 45 M79 27 L73 31"
                    fill="none"
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d={STONE} fill="none" {...inked} />
                {/* Musgo trepando por la esquina. */}
                <path
                    d="M26 50 C25 38 31 26 40 21 C45 24 41 29 44 33 C39 37 35 35 35 42 C33 47 29 51 26 50 Z"
                    fill={P.sage}
                    {...inked}
                    strokeWidth="2.5"
                />
            </g>

            {/* Montículo de musgo que tapa la base de la piedra. */}
            <path
                d="M8 134 C8 124 16 120 24 123 C28 114 40 114 44 121 C50 115 60 116 63 122 C68 116 80 115 84 121 C90 116 102 118 104 125 C110 124 114 130 112 134 Z"
                fill={P.sage}
                {...inked}
            />
            <path
                d="M20 129 Q24 126 28 129 M48 127 Q52 124 56 127 M74 128 Q78 125 82 128 M96 130 Q99 127 103 130"
                fill="none"
                stroke={P.moss}
                strokeWidth="2.2"
                strokeLinecap="round"
            />

            {/* Florecita de cempasúchil al pie: festoneada y con rizos. Redonda y
            con punto al centro se leía como ojo. */}
            <path d="M19 124 Q17 128 20 132" fill="none" {...inked} strokeWidth="5" />
            <path d="M19 124 Q17 128 20 132" fill="none" stroke={P.moss} strokeWidth="2.2" strokeLinecap="round" />
            <path
                d="M19 112.8 Q22.8 110.1 23.1 114.7 Q27.5 116.1 24.1 119.2 Q25.8 123.5 21.3 122.7 Q19 126.8 16.7 122.7 Q12.2 123.5 13.9 119.2 Q10.5 116.1 14.9 114.7 Q15.2 110.1 19 112.8 Z"
                fill={P.mustard}
                {...inked}
                strokeWidth="2.5"
            />
            <path
                d="M14.8 120 Q16 119 17.2 120.2 M20.8 116 Q22 115 23.2 116.2"
                fill="none"
                stroke={P.pumpkinDeep}
                strokeWidth="1.4"
                strokeLinecap="round"
            />
            <circle cx="19" cy="118" r="2.4" fill={P.pumpkinDeep} />
        </g>
    );
}

const monster: MonsterDef = {
    id: "lapida",
    name: "Lápida",
    w: 120,
    h: 140,
    interactive: false,
    Art,
};

export default monster;
