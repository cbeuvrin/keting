import { P, v } from "./palette";

// El logotipo KETING redibujado en trazo fino (mismas mayúsculas geométricas
// del header, para que se siga reconociendo la marca) con su disfraz de
// Halloween: sombrero de bruja en la K, la T derritiéndose, la I hecha vela,
// un murciélago, ojitos que viven dentro de la G y una araña colgando de ella.
// Es un .hw-monster más: al pasarle el mouse el sombrero brinca, la vela se
// aviva, el murciélago aletea, la araña baja y los ojitos sonríen.
//
// Todo lo que va sobre el fondo es claro (cream / mustard / lilac): la tinta
// del resto del póster aquí no se vería.

const LETTER = { fill: "none", stroke: P.cream, strokeWidth: 3.6, strokeLinecap: "butt", strokeLinejoin: "miter" } as const;

/**
 * `compact` recorta la caja a la palabra con el sombrero (sin la araña que
 * cuelga debajo), para que quepa en la barra del header.
 */
export function HalloweenLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
    const box = compact ? { y: -36, h: 106 } : { y: -40, h: 168 };
    return (
        <svg viewBox={`-8 ${box.y} 304 ${box.h}`} className={`hw-scene ${className ?? ""}`} role="img" aria-label="Keting Media">
            <g className="hw-monster">
                {/* Área de hover: las letras son trazos finos y costaría atinarles. */}
                <rect x="-8" y={box.y} width="304" height={box.h} fill="transparent" />

                {/* K */}
                <path d="M2 6 V62 M40 6 L3 43 M17 29 L42 62" {...LETTER} />
                {/* E, con una gota colgando de la barra de en medio */}
                <path d="M86 6 H57 V62 H86 M57 34 H82" {...LETTER} />
                <path d="M78 35 V41 Q78 45 80 45 Q82 45 82 41 V35 Z" fill={P.cream} />
                {/* T derritiéndose */}
                <path d="M98 6 H140 M119 6 V62" {...LETTER} />
                <path
                    d="M101 7.5 V13 Q101 17 103.5 17 Q106 17 106 13 V7.5 Z M129 7.5 V18 Q129 23 132 23 Q135 23 135 18 V7.5 Z"
                    fill={P.cream}
                />
                {/* I: vela, con un chorrito de cera */}
                <path d="M156 6 V62" {...LETTER} />
                <path d="M157.6 6 V14 Q157.6 17 159.6 17 Q161.4 17 161.4 14 V9 Q161.4 6.5 158 6 Z" fill={P.cream} />
                <path d="M156 5 V0" stroke={P.mustardDeep} strokeWidth="1.6" strokeLinecap="round" />
                <g className="hw-off">
                    <g className="hw-flicker">
                        <path d="M156 -12 Q162 -4 159.5 0 Q156 3 152.5 0 Q150 -4 156 -12 Z" fill={P.mustard} />
                        <path d="M156 -6 Q158.5 -2.5 157.3 -0.5 Q156 0.8 154.7 -0.5 Q153.5 -2.5 156 -6 Z" fill={P.pumpkin} />
                    </g>
                </g>
                <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                    <g className="hw-flicker">
                        <path d="M156 -26 Q167 -10 162 -1 Q156 4 150 -1 Q145 -10 156 -26 Z" fill={P.mustard} />
                        <path d="M156 -14 Q160.5 -6 158.6 -1.5 Q156 1 153.4 -1.5 Q151.5 -6 156 -14 Z" fill={P.pumpkin} />
                    </g>
                </g>
                {/* N */}
                <path d="M172 62 V6 L214 62 V6" {...LETTER} />
                {/* G */}
                <path d="M279.8 14.2 A28 28 0 1 0 288 34 H263" {...LETTER} />

                {/* Ojitos que viven dentro de la G */}
                <g className="hw-off hw-eye">
                    <ellipse cx="251" cy="40" rx="4.2" ry="5" fill={P.cream} />
                    <ellipse cx="263" cy="42" rx="4.2" ry="5" fill={P.cream} />
                    <g className="hw-pupil" style={v({ "--pr": "1.6px" })}>
                        <circle cx="251.5" cy="41" r="2" fill={P.mouth} />
                        <circle cx="263.5" cy="43" r="2" fill={P.mouth} />
                    </g>
                </g>
                <g className="hw-blink" fill="none" stroke={P.cream} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M247 41 Q251 43.5 255 41" />
                    <path d="M259 43 Q263 45.5 267 43" />
                </g>
                <g className="hw-on" fill="none" stroke={P.cream} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M247 42 Q251 38 255 42" />
                    <path d="M259 44 Q263 40 267 44" />
                </g>

                {/* Araña colgando de la G. El tramo fijo del hilo se solapa con el
                    que baja con la araña, para que no se abra un hueco al caer. */}
                <path d="M260 62 V92" stroke={P.cream} strokeWidth="1.2" />
                <g className="hw-hop" style={v({ "--hop": "12px" })}>
                    <path d="M260 80 V96" stroke={P.cream} strokeWidth="1.2" />
                    <g className="hw-wave" style={v({ "--o": "50% 0%", "--wave": "10deg" })}>
                        <path
                            d="M254 99 L247 94 M254 102 L246 102 M254 105 L247 110 M255 107 L251 113 M266 99 L273 94 M266 102 L274 102 M266 105 L273 110 M265 107 L269 113"
                            stroke={P.lilac}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <ellipse cx="260" cy="103" rx="7" ry="8" fill={P.charcoal} stroke={P.lilacDeep} strokeWidth="1.6" />
                        <circle cx="257.5" cy="101" r="1.5" fill={P.cream} />
                        <circle cx="262.5" cy="101" r="1.5" fill={P.cream} />
                    </g>
                </g>

                {/* Murciélago revoloteando entre la N y la G */}
                <g className="hw-float" style={v({ "--fd": "2.4s", "--fa": "-4px" })}>
                    <g className="hw-flap" style={v({ "--o": "100% 50%" })}>
                        <path
                            d="M224 -16 Q216 -26 206 -22 Q211 -18 208 -13 Q214 -15 216 -10 Q219 -15 224 -12 Z"
                            fill={P.plum}
                            stroke={P.lilacDeep}
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                        />
                    </g>
                    <g className="hw-flap" style={v({ "--o": "0% 50%" })}>
                        <path
                            d="M232 -16 Q240 -26 250 -22 Q245 -18 248 -13 Q242 -15 240 -10 Q237 -15 232 -12 Z"
                            fill={P.plum}
                            stroke={P.lilacDeep}
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                        />
                    </g>
                    <path
                        d="M224 -20 L225 -25 L227 -21 Q228 -21.6 229 -21 L231 -25 L232 -20 Q233 -12 228 -9 Q223 -12 224 -20 Z"
                        fill={P.plum}
                        stroke={P.lilacDeep}
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                    />
                    <circle cx="226.4" cy="-17" r="1.1" fill={P.mustard} />
                    <circle cx="229.6" cy="-17" r="1.1" fill={P.mustard} />
                </g>

                {/* Sombrero de bruja en la K: brinca al pasar el mouse. */}
                <g className="hw-hop" style={v({ "--hop": "-9px" })}>
                    <g transform="rotate(-14 20 2)">
                        <path
                            d="M9 1 Q14 -12 18 -22 Q21 -30 29 -33 Q25 -27 25 -20 Q26 -10 31 1 Z"
                            fill={P.lilacDeep}
                            stroke={P.lilac}
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                        />
                        <path d="M11.5 -4 Q20 -6.5 29 -4 L30.2 -0.8 Q20 -3.4 10.2 -0.8 Z" fill={P.mustard} />
                        <ellipse cx="20" cy="1.5" rx="23" ry="4.2" fill={P.lilacDeep} stroke={P.lilac} strokeWidth="1.4" />
                    </g>
                </g>
            </g>
        </svg>
    );
}
