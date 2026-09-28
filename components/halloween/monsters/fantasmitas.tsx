import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Tres fantasmitas en fila, de tamaños distintos. A diferencia del fantasma de
// referencia son gotitas con la punta enroscada y el dobladillo en picos, y
// cada uno tiene su cara: el chico saca la lengua, el grande tiene ojos de
// botón cosidos y el mediano ojos de canica.
// Reacción: brincan a alturas distintas, cierran los ojos (cada uno a su
// manera) y abren la boca.

function Art() {
    return (
        // Bajados 8 unidades para que el brinco más alto no se salga de la caja.
        <g transform="translate(0 8)">
            {/* ── Chico, a la izquierda: saca la lengua. ── */}
            <g className="hw-float" style={v({ "--fd": "3.1s", "--fa": "-4px", "--bd": "0.4s" })}>
                <g className="hw-hop" style={v({ "--hop": "-22px" })}>
                    <path
                        d="M8 104 C10 92 10 82 12 72 C14 58 22 48 30 45 C29 38 34 33 41 34 C37 38 37 42 39 46 C49 50 55 62 56 76 C57 86 58 96 60 104 L50 98 L42 106 L34 98 L24 106 L17 98 Z"
                        fill={P.bone}
                        {...inked}
                    />
                    <path
                        d="M16 78 C16 88 16 95 17 100 L22 96 C20 88 20 80 22 70 C24 62 27 57 31 52 C23 58 18 67 16 78 Z"
                        fill={P.boneShade}
                    />
                    <path d="M48 88 L52 95" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
                    <g className="hw-off hw-eye">
                        <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                            <ellipse cx="27" cy="66" rx="3.6" ry="4.8" fill={INK} />
                            <ellipse cx="43" cy="66" rx="3.6" ry="4.8" fill={INK} />
                        </g>
                    </g>
                    <path
                        className="hw-blink"
                        d="M22 67 Q27 71 32 67 M38 67 Q43 71 48 67"
                        fill="none"
                        stroke={INK}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Lengüita de fuera en reposo. */}
                    <g className="hw-off">
                        <path d="M33 80 Q34 88 37 88 Q40 88 40 80 Z" fill={P.tongue} {...inked} strokeWidth="2.5" />
                        <path d="M28 79 Q35 83 42 78" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
                    </g>
                    <g className="hw-on">
                        <path d="M21 62 L28 66 L21 70 M49 62 L42 66 L49 70" fill="none" {...inked} strokeWidth="3.5" />
                        <ellipse cx="35" cy="80" rx="7" ry="6" fill={P.mouth} {...inked} strokeWidth="2.5" />
                    </g>
                    <path
                        className="hw-tongue"
                        d="M31 81 Q35 79 39 81 Q39 93 35 93 Q31 93 31 81 Z"
                        fill={P.tongue}
                        {...inked}
                        strokeWidth="2.5"
                    />
                </g>
            </g>

            {/* ── Grande, al centro: ojos de botón cosidos. ── */}
            <g className="hw-float" style={v({ "--fd": "3.7s", "--fa": "-5px", "--bd": "1.3s" })}>
                <g className="hw-hop" style={v({ "--hop": "-10px" })}>
                    <path
                        d="M66 106 C68 90 66 72 70 56 C74 38 88 26 98 22 C96 14 102 8 110 10 C105 14 105 18 108 22 C124 28 134 44 134 62 C134 78 132 92 136 106 L125 99 L115 107 L104 99 L94 107 L84 99 L74 107 Z"
                        fill={P.bone}
                        {...inked}
                    />
                    <path
                        d="M74 60 C70 76 72 92 74 102 L80 100 C78 88 78 72 82 58 C86 44 92 36 98 30 C86 36 78 46 74 60 Z"
                        fill={P.boneShade}
                    />
                    <path d="M124 84 L128 92 M117 88 L120 95" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
                    <g className="hw-off hw-eye">
                        <circle cx="90" cy="58" r="8" fill={P.lilac} {...inked} strokeWidth="2.5" />
                        <circle cx="116" cy="58" r="8" fill={P.lilac} {...inked} strokeWidth="2.5" />
                        {/* Cuatro agujeritos de botón. */}
                        <path
                            d="M87.5 55.5 h0.01 M92.5 55.5 h0.01 M87.5 60.5 h0.01 M92.5 60.5 h0.01 M113.5 55.5 h0.01 M118.5 55.5 h0.01 M113.5 60.5 h0.01 M118.5 60.5 h0.01"
                            stroke={P.bone}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </g>
                    <path
                        className="hw-blink"
                        d="M82 59 Q90 65 98 59 M108 59 Q116 65 124 59"
                        fill="none"
                        stroke={INK}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Sonrisa cosida con puntadas. */}
                    <path
                        className="hw-off"
                        d="M90 78 Q103 88 116 78 M94 79 L93 85 M103 82 L103 88 M112 79 L113 85"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <g className="hw-on">
                        <path d="M82 61 Q90 52 98 61 M108 61 Q116 52 124 61" fill="none" {...inked} strokeWidth="4" />
                        <path d="M92 75 Q103 73 114 75 Q112 94 103 94 Q94 94 92 75 Z" fill={P.mouth} {...inked} strokeWidth="3" />
                        <path d="M96 88 Q103 82 110 88 Q107 93 103 93 Q99 93 96 88 Z" fill={P.tongue} />
                        <path
                            d="M76 72 a6 3.5 0 1 0 12 0 a6 3.5 0 1 0 -12 0 M118 72 a6 3.5 0 1 0 12 0 a6 3.5 0 1 0 -12 0"
                            fill={P.roseLight}
                            opacity="0.85"
                        />
                    </g>
                </g>
            </g>

            {/* ── Mediano, a la derecha: ojos de canica, uno más grande. ── */}
            <g className="hw-float" style={v({ "--fd": "3.4s", "--fa": "-4px", "--bd": "2.6s" })}>
                <g className="hw-hop" style={v({ "--hop": "-17px" })}>
                    <path
                        d="M144 106 C146 94 144 80 148 68 C152 52 162 44 170 42 C170 36 164 32 158 34 C162 28 174 28 178 38 C188 46 192 60 192 74 C192 86 190 96 194 106 L184 99 L176 106 L168 99 L160 106 L152 99 Z"
                        fill={P.bone}
                        {...inked}
                    />
                    <path
                        d="M152 72 C150 84 150 94 152 101 L157 99 C155 90 155 80 158 70 C160 60 164 54 168 48 C160 52 154 62 152 72 Z"
                        fill={P.boneShade}
                    />
                    <path d="M182 86 L186 93" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
                    <g className="hw-off hw-eye">
                        <ellipse cx="162" cy="68" rx="6" ry="7.5" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                        <ellipse cx="179" cy="67" rx="7.5" ry="9" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                        <g className="hw-pupil" style={v({ "--pr": "2.5px" })}>
                            <circle cx="163" cy="69" r="3" fill={INK} />
                            <circle cx="180" cy="68" r="3.6" fill={INK} />
                        </g>
                    </g>
                    <path
                        className="hw-blink"
                        d="M156 69 Q162 73 168 69 M172 68 Q179 73 186 68"
                        fill="none"
                        stroke={INK}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <path
                        className="hw-off"
                        d="M164 83 Q168 87 171 83 Q174 87 178 83"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <g className="hw-on">
                        <path
                            d="M156 66 Q162 72 168 66 M172 65 Q179 72 186 65 M155 62 L153 59 M187 61 L189 58"
                            fill="none"
                            stroke={INK}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path d="M163 80 Q171 77 179 80 Q179 93 171 93 Q163 93 163 80 Z" fill={P.mouth} {...inked} strokeWidth="2.5" />
                    </g>
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "fantasmitas",
    name: "Fantasmitas",
    w: 200,
    h: 120,
    interactive: true,
    Art,
};

export default monster;
