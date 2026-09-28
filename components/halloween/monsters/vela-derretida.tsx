import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Vela derretida con cara. La cera chorrea sobre la cara y forma un charco
// en la base; la flama titila siempre.
// Reacción: la flama se vuelve enorme, la vela abre los ojos como platos,
// hace una boquita en "o" y le saltan gotitas de cera.

// Gota de cera centrada en el origen: bola arriba y colita corta hacia abajo.
const DROP = "M0 -9 C8 -9 10 -1 8 4 C5 9 1 11 0 15 C-1 11 -5 9 -8 4 C-10 -1 -8 -9 0 -9 Z";

function Art() {
    return (
        <g>
            {/* Flama chica de reposo. Titila siempre. */}
            <g className="hw-off">
                <g className="hw-flicker">
                    <path d="M66 56 C76 70 82 84 78 94 C75 102 57 102 54 94 C50 84 57 70 66 56 Z" fill={P.pumpkin} {...inked} />
                    <path d="M66 72 C72 80 74 88 71 94 C69 98 63 98 61 94 C58 88 61 80 66 72 Z" fill={P.mustard} />
                    <ellipse cx="66" cy="91" rx="3" ry="4.5" fill={P.cream} />
                </g>
            </g>

            {/* Flamota de susto: crece desde la mecha. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                {/* Rayos de luz en mostaza: la tinta no se vería sobre el fondo. */}
                <path
                    d="M30 34 L20 26 M102 30 L112 22 M24 62 L12 62 M110 60 L122 58 M40 14 L34 6"
                    stroke={P.mustard}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
                <g className="hw-flicker">
                    <path
                        d="M68 8 C62 26 86 32 92 54 C98 76 96 92 84 100 C74 106 58 106 48 100 C34 92 34 70 44 50 C48 62 54 66 57 60 C58 42 52 26 68 8 Z"
                        fill={P.pumpkin}
                        {...inked}
                    />
                    <path d="M66 36 C76 50 84 68 80 84 C78 96 54 96 51 84 C49 72 56 66 60 56 C62 50 62 44 66 36 Z" fill={P.mustard} />
                    <path d="M66 62 C71 70 73 80 70 88 C68 92 63 92 61 88 C59 80 62 72 66 62 Z" fill={P.cream} />
                </g>
            </g>

            {/* Charco de cera en la base. */}
            <path
                d="M8 226 C10 216 24 214 32 219 Q66 227 100 219 C110 213 124 218 122 228 C118 236 96 236 66 236 C34 236 10 236 8 226 Z"
                fill={P.bone}
                {...inked}
            />
            <path d="M82 232 Q104 232 116 226 C118 230 112 233 100 234 Z" fill={P.boneShade} />

            {/* Cuerpo de la vela, con sombra a la derecha y un brillo a la izquierda. */}
            <path
                d="M28 222 C26 190 28 150 30 118 Q46 108 66 110 Q88 108 102 116 C104 150 104 190 104 222 Q66 230 28 222 Z"
                fill={P.bone}
                {...inked}
            />
            <path d="M92 150 C96 176 96 204 93 224 Q99 224 102 222 C103 196 103 170 101 146 Z" fill={P.boneShade} />
            {/* Chorreado largo por el lado izquierdo: sigue del cuello hasta el charco y rompe el bloque liso. */}
            <path
                d="M30 150 C35 150 36 172 35 196 C34 212 37 220 33 223 C27 224 25 204 26 176 C26 164 27 154 30 150 Z"
                fill={P.bone}
                {...inked}
                strokeWidth="3"
            />

            {/* Chorreados: un cuello de cera que cuelga sobre la cara. */}
            <path
                d="M24 124 Q40 104 66 106 Q92 104 108 122 C110 136 106 146 104 156 Q100 166 95 156 C95 144 92 138 86 140 C84 152 84 160 79 164 Q73 167 72 158 C72 152 70 146 64 144 C58 146 56 152 54 156 Q50 162 46 156 C44 146 42 140 36 140 C34 152 34 164 29 166 Q23 166 24 154 Z"
                fill={P.bone}
                {...inked}
            />
            <path
                d="M98 128 C102 138 100 148 99 154 M80 146 C80 152 80 156 78 160"
                fill="none"
                stroke={P.boneShade}
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path d="M34 120 Q66 110 100 120 Q66 128 34 120 Z" fill={P.boneShade} />
            <path d="M66 121 Q63 110 67 99" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />

            {/* Cara en reposo: ojitos con iris rosa y sonrisita; cachetes siempre. */}
            <ellipse cx="40" cy="202" rx="7" ry="4" fill={P.roseLight} opacity="0.8" />
            <ellipse cx="92" cy="202" rx="7" ry="4" fill={P.roseLight} opacity="0.8" />
            <g className="hw-off hw-eye">
                <ellipse cx="51" cy="186" rx="9" ry="11" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                <ellipse cx="81" cy="186" rx="9" ry="11" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                    <circle cx="52" cy="188" r="5.5" fill={P.irisPink} />
                    <circle cx="52.5" cy="188.5" r="2.8" fill={INK} />
                    <circle cx="50" cy="185" r="1.6" fill={P.cream} />
                    <circle cx="82" cy="188" r="5.5" fill={P.irisPink} />
                    <circle cx="82.5" cy="188.5" r="2.8" fill={INK} />
                    <circle cx="80" cy="185" r="1.6" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked} strokeWidth="3">
                <path d="M42 188 Q51 195 60 188" />
                <path d="M72 188 Q81 195 90 188" />
            </g>
            <path className="hw-off" d="M60 206 Q66 211 72 206" fill="none" {...inked} strokeWidth="3" />

            {/* Asombro: ojos como platos con pupila chiquita, y boca en "o". */}
            <g className="hw-on">
                <ellipse cx="50" cy="184" rx="12" ry="14" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                <ellipse cx="82" cy="184" rx="12" ry="14" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                <circle cx="50" cy="185" r="3.2" fill={INK} />
                <circle cx="82" cy="185" r="3.2" fill={INK} />
                <ellipse cx="66" cy="210" rx="5" ry="7" fill={P.mouth} {...inked} strokeWidth="3" />
            </g>

            {/* Gotitas de cera que saltan del borde: bolitas con colita hacia la vela,
            inclinadas hacia afuera, y un arquito crema que marca el salto. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                <path
                    d="M34 116 Q24 110 19 102 M98 116 Q108 110 113 102 M31 120 Q18 120 12 116 M101 120 Q114 120 120 116"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.8"
                />
                <g fill={P.bone} {...inked} strokeWidth="2.5">
                    <g transform="translate(17 84) rotate(-25)">
                        <path d={DROP} />
                    </g>
                    <g transform="translate(115 84) rotate(25)">
                        <path d={DROP} />
                    </g>
                    <g transform="translate(9 106) rotate(-40) scale(0.6)">
                        <path d={DROP} />
                    </g>
                    <g transform="translate(122 106) rotate(40) scale(0.6)">
                        <path d={DROP} />
                    </g>
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "vela-derretida",
    name: "Vela derretida",
    w: 130,
    h: 240,
    interactive: true,
    Art,
};

export default monster;
