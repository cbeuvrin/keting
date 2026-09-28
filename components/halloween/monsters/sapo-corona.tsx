import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Sapo con coronita chueca: verrugas musgo, panza hueso, ojos saltones
// arriba de la cabeza y una sonrisa de oreja a oreja.
// Reacción: cierra los párpados y dispara una lengua larguísima que se
// enrosca en un lazo a un lado; la corona pega un brinco.

function Art() {
    return (
        // Corrido a la derecha: el lazo de la lengua queda dentro de la caja y
        // el sapo no deja un hueco vacío a su lado en reposo.
        <g transform="translate(10 0)">
            {/* Cuerpo y ojos saltones en una sola silueta. La muesca entre los
            ojos es poco honda para que la corona asiente encima sin dejar hueco. */}
            <path
                d="M24 136 C12 126 10 104 18 86 C20 76 24 68 28 62 C22 44 32 22 50 20 C64 18 72 28 73 34 C78 31 82 31 86 33 C86 26 98 16 110 18 C128 20 136 40 128 58 C136 70 142 90 140 108 C140 124 132 134 124 138 C100 145 48 145 24 136 Z"
                fill={P.sage}
                {...inked}
            />
            <path d="M128 60 C138 74 142 92 139 110 C138 124 132 132 124 136 C130 118 132 88 122 66 Z" fill={P.moss} opacity="0.55" />
            {/* Verrugas: una forma con varias manchas de musgo, grandes para que
            se lean chiquitas en el póster; las tres mayores llevan brillito. */}
            <path
                d="M24.2 92 a6.3 4.9 0 1 0 12.6 0 a6.3 4.9 0 1 0 -12.6 0 M16.8 110 a4.2 4.2 0 1 0 8.4 0 a4.2 4.2 0 1 0 -8.4 0 M35 78 a3.5 2.8 0 1 0 7 0 a3.5 2.8 0 1 0 -7 0 M122.4 92 a5.6 4.9 0 1 0 11.2 0 a5.6 4.9 0 1 0 -11.2 0 M128.8 112 a4.2 4.2 0 1 0 8.4 0 a4.2 4.2 0 1 0 -8.4 0 M115 80 a3.5 2.8 0 1 0 7 0 a3.5 2.8 0 1 0 -7 0 M30.8 28 a4.2 3.5 0 1 0 8.4 0 a4.2 3.5 0 1 0 -8.4 0 M116.8 24 a4.2 3.5 0 1 0 8.4 0 a4.2 3.5 0 1 0 -8.4 0"
                fill={P.moss}
            />
            <path
                d="M26.8 90 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 M124.3 90 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 M129.8 110 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0"
                fill={P.cream}
                opacity="0.5"
            />
            {/* Punteado alrededor de las verrugas: piel rugosa. */}
            <path
                d="M43 84 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 M29 101 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 M27 123 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 M121 104 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 M134 82 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 M127 126 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 M19 96 a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0 M93 25 a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0 M62 25 a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0 M41 71 a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0"
                fill={P.moss}
            />
            {/* Contorno de los muslos: da la pose de sapo sentado. */}
            <path
                d="M18 102 C32 102 42 118 36 136 M138 98 C124 100 114 116 120 136"
                fill="none"
                stroke={INK}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Panza con pliegues. */}
            <path
                d="M40 134 C34 112 46 92 78 90 C110 90 122 112 116 134 C98 142 58 142 40 134 Z"
                fill={P.bone}
                {...inked}
                strokeWidth="3.5"
            />
            <path
                d="M54 106 Q78 100 102 106 M48 119 Q78 113 108 119"
                fill="none"
                stroke={P.boneShade}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Patitas delanteras con dedos redondos. */}
            <path d="M34 144 Q31 136 39 135 Q41 129 48 132 Q55 129 57 135 Q64 135 62 144 Z" fill={P.sage} {...inked} strokeWidth="3" />
            <path
                d="M96 144 Q93 136 101 135 Q103 129 110 132 Q117 129 119 135 Q126 135 124 144 Z"
                fill={P.sage}
                {...inked}
                strokeWidth="3"
            />

            {/* Cara en reposo: ojos dorados de pupila horizontal, sonrisota. */}
            <g className="hw-off hw-eye">
                <ellipse cx="50" cy="41" rx="14" ry="15" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                <ellipse cx="110" cy="39" rx="15" ry="16" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                <g className="hw-pupil" style={v({ "--pr": "3.5px" })}>
                    <circle cx="51" cy="43" r="8.5" fill={P.irisGold} />
                    <ellipse cx="51" cy="43" rx="5" ry="3" fill={INK} />
                    <circle cx="48" cy="39.5" r="1.8" fill={P.cream} />
                    <circle cx="111" cy="41" r="9" fill={P.irisGold} />
                    <ellipse cx="111" cy="41" rx="5.3" ry="3.2" fill={INK} />
                    <circle cx="108" cy="37.5" r="1.9" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked} strokeWidth="3.5">
                <path d="M37 42 Q50 50 63 42" />
                <path d="M96 40 Q110 48 124 40" />
            </g>
            <path d="M74 60 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0 M84 60 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0" fill={INK} />
            <path className="hw-off" d="M32 68 Q80 90 128 66" fill="none" {...inked} strokeWidth="3.5" />

            {/* Lengüetazo: párpados de sapo cerrados y boca abierta de lado. */}
            <g className="hw-on">
                <g fill={P.sage} {...inked} strokeWidth="3.5">
                    <ellipse cx="50" cy="41" rx="14" ry="15" />
                    <ellipse cx="110" cy="39" rx="15" ry="16" />
                </g>
                <path d="M38 44 Q50 52 62 44 M97 42 Q110 50 123 42" fill="none" {...inked} strokeWidth="3.5" />
                {/* Sonrisa y boca separadas: la boca es una forma cerrada, así el
                relleno no se cuela bajo la mitad izquierda de la sonrisa. */}
                <path d="M32 68 Q60 82 86 80" fill="none" {...inked} strokeWidth="3.5" />
                <path d="M84 80 Q108 78 128 66 Q124 90 104 92 Q88 92 84 80 Z" fill={P.mouth} {...inked} strokeWidth="3.5" />
                <ellipse cx="34" cy="80" rx="8" ry="5" fill={P.roseLight} opacity="0.85" />
            </g>
            {/* La lengua gira sobre la comisura de la boca y se enrosca en un
            lazo apretado, para no salirse de la caja. */}
            <g className="hw-tongue" style={v({ "--o": "4% 73%" })}>
                <path
                    d="M105.5 90.9 C108.8 92.5 118 99.5 125.1 100.4 C132.2 101.4 141.6 99.7 148.1 96.8 C154.6 93.8 160.8 88.3 164.2 82.7 C167.6 77.1 170 69.2 168.7 63.2 C167.5 57.2 161.8 48.9 156.9 46.9 C151.9 44.9 142.2 47.7 138.9 51.1 C135.7 54.6 136 63.7 137.3 67.5 C138.6 71.4 145.4 73.1 147 74.2 A3.8 3.8 0 0 0 151 67.8 C150 67.2 145.7 66.3 144.7 64.5 C143.7 62.7 143.7 58.4 145.1 56.9 C146.5 55.3 150.8 53.8 153.1 55.1 C155.5 56.4 158.8 61.1 159.3 64.8 C159.7 68.5 158.4 73.6 155.8 77.3 C153.2 81 148.7 85.2 143.9 87.2 C139.1 89.3 132.4 90.6 126.9 89.6 C121.3 88.5 113.2 82.5 110.5 81.1 Z"
                    fill={P.tongue}
                    {...inked}
                    strokeWidth="3.5"
                />
                <path
                    d="M126 95 C132.3 96 140.3 94.5 146 92 C151.7 89.5 157 84.7 160 80 C163 75.3 164.8 68.8 164 64 C163.2 59.2 158.7 52.7 155 51"
                    fill="none"
                    stroke={P.roseDeep}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </g>

            {/* Corona chueca, asentada en la cabeza (su base tapa la muesca entre
            los ojos): el giro va en un <g> adentro del que brinca. */}
            <g className="hw-hop" style={v({ "--hop": "-9px" })}>
                <g transform="translate(80 31) rotate(-12) scale(1.12)">
                    <path d="M-13 8 L-15 -8 L-7 -1 L0 -13 L7 -1 L15 -8 L13 8 Z" fill={P.mustard} {...inked} strokeWidth="3" />
                    <path d="M4 1 L7 -1 L15 -8 L13 8 L5 8 Z" fill={P.mustardDeep} />
                    <circle cx="0" cy="3" r="2.8" fill={P.rose} stroke={INK} strokeWidth="1.8" />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "sapo-corona",
    name: "Sapo con corona",
    w: 190,
    h: 150,
    interactive: true,
    Art,
};

export default monster;
