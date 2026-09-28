import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Fantasma de sábana. Es la pieza de referencia del póster: cómo se nombran
// las capas, dónde va cada clase hw-* y cuánto detalle lleva un personaje.
// Reacción: se asusta — estira el cuerpo, abre ojos y boca en "O", levanta
// los bracitos y se sonroja.

function Art() {
    return (
        // El translate es un <g> aparte y sin clase: una clase hw-* nunca
        // comparte elemento con un atributo transform.
        <g transform="translate(0 -30)">
            <g className="hw-float" style={v({ "--fd": "3.8s", "--fa": "-8px" })}>
                <g className="hw-stretch">
                    {/* Bracitos detrás del cuerpo, para que la sábana tape su unión. */}
                    <g className="hw-wave" style={v({ "--o": "100% 60%", "--wave": "28deg" })}>
                        <path d="M44 150 C24 142 12 156 20 168 C27 178 40 174 46 164 Z" fill={P.bone} {...inked} />
                    </g>
                    <g className="hw-wave" style={v({ "--o": "0% 60%", "--wave": "-28deg" })}>
                        <path d="M204 146 C224 136 238 150 230 164 C223 175 209 171 202 160 Z" fill={P.bone} {...inked} />
                    </g>

                    {/* Sábana: cabeza redonda y dobladillo ondulado desigual. */}
                    <path
                        d="M44 238 C36 180 30 118 58 84 C84 52 150 44 184 74 C214 102 216 170 206 236 Q194 254 180 238 Q166 256 151 240 Q137 258 122 242 Q108 257 94 241 Q80 255 66 240 Q56 251 44 238 Z"
                        fill={P.bone}
                        {...inked}
                    />
                    <path d="M64 98 C46 132 45 190 54 230 Q59 238 66 235 C59 196 59 140 76 106 Z" fill={P.boneShade} />
                    <path d="M170 212 L178 226 M184 206 L192 220 M196 200 L201 212" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

                    {/* Cara en reposo: ojos que siguen al cursor y sonrisita. */}
                    <g className="hw-off hw-eye">
                        <ellipse cx="98" cy="132" rx="19" ry="23" fill={P.eyeWhite} {...inked} />
                        <ellipse cx="154" cy="126" rx="21" ry="25" fill={P.eyeWhite} {...inked} />
                        <g className="hw-pupil" style={v({ "--pr": "5px" })}>
                            <circle cx="103" cy="136" r="11" fill={P.irisTeal} />
                            <circle cx="104" cy="137" r="5.5" fill={INK} />
                            <circle cx="99" cy="131" r="2.4" fill={P.cream} />
                            <circle cx="159" cy="130" r="12" fill={P.irisTeal} />
                            <circle cx="160" cy="131" r="6" fill={INK} />
                            <circle cx="155" cy="125" r="2.6" fill={P.cream} />
                        </g>
                    </g>
                    <g className="hw-blink" fill="none" {...inked}>
                        <path d="M80 134 Q98 146 116 134" />
                        <path d="M134 128 Q154 142 174 128" />
                    </g>
                    <path className="hw-off" d="M117 170 Q126 178 137 169" fill="none" {...inked} strokeWidth="3.5" />

                    {/* Susto: ojos redondos con pupila de alfiler, boca en O y mejillas. */}
                    <g className="hw-on">
                        <ellipse cx="98" cy="130" rx="23" ry="28" fill={P.eyeWhite} {...inked} />
                        <ellipse cx="154" cy="124" rx="25" ry="30" fill={P.eyeWhite} {...inked} />
                        <circle cx="99" cy="131" r="4.5" fill={INK} />
                        <circle cx="155" cy="125" r="4.5" fill={INK} />
                        <ellipse cx="127" cy="184" rx="13" ry="18" fill={P.mouth} {...inked} />
                        <path d="M117 193 Q127 184 137 193 Q134 200 127 200 Q120 200 117 193 Z" fill={P.tongue} />
                        <ellipse cx="72" cy="166" rx="11" ry="6" fill={P.roseLight} opacity="0.85" />
                        <ellipse cx="184" cy="160" rx="11" ry="6" fill={P.roseLight} opacity="0.85" />
                    </g>
                    {/* Líneas de susto: van sobre el fondo, así que en crema (la tinta
                    desaparece contra el negro del póster). */}
                    <g
                        className="hw-on hw-pop"
                        style={v({ "--o": "100% 100%" })}
                        fill="none"
                        stroke={P.cream}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                    >
                        <path d="M46 70 L34 58" />
                        <path d="M40 90 L24 88" />
                        <path d="M62 54 L58 38" />
                    </g>
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "fantasma-sabana",
    name: "Fantasma de sábana",
    w: 240,
    h: 232,
    interactive: true,
    Art,
};

export default monster;
