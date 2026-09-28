import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Bruja en escoba: vuela en diagonal hacia arriba a la derecha, con el pelo y
// la punta del sombrero barridos hacia atrás por el viento. Piel verde, nariz
// larga con verruguita, vestido ciruela parchado y medias a rayas.
// Reacción: se carcajea — ojos ^^, bocota con un diente chueco, el sombrero
// se agita, la paja tiembla y la escoba suelta chispitas.

/** Destello de cuatro picos (lados cóncavos) centrado en (cx, cy). */
function sparkle(cx: number, cy: number, r: number) {
    return `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`;
}

function Art() {
    return (
        // Bajada 6 para que el vaivén de vuelo no saque la punta del sombrero.
        <g transform="translate(0 6)">
            <g className="hw-float" style={v({ "--fd": "3s", "--fa": "-6px" })}>
                {/* Estela de vuelo, en crema porque va sobre el fondo. */}
                <path
                    d="M40 140 L70 128 M26 160 L48 152"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.7"
                />

                {/* Pierna de atrás, detrás de la escoba. */}
                <path d="M154 184 L168 186 L161 236 L149 234 Z" fill={P.bone} {...inked} />
                <path
                    d="M155 196 L167 198 L166 204 L154 202 Z M153 210 L165 212 L164 218 L152 216 Z M151 222 L163 224 L162 230 L150 228 Z"
                    fill={P.roseDeep}
                />
                {/* Zapatos ciruela con suela lila: en charcoal se perdían en el fondo. */}
                <path
                    d="M149 232 L165 234 C171 234 181 232 187 226 C188 238 177 246 159 246 C149 246 145 240 149 232 Z"
                    fill={P.plum}
                    {...inked}
                />
                <path d="M153 240 C163 242 175 238 183 232" fill="none" stroke={P.lilac} strokeWidth="3.5" strokeLinecap="round" />

                {/* Paja: tiembla sola; rayado de popotes y sombra abajo. */}
                <g className="hw-shake">
                    <path
                        d="M88 190 C66 182 36 170 10 164 L20 178 L6 186 L18 196 L4 206 L18 214 L8 226 L24 228 L20 240 C46 232 72 222 94 214 Z"
                        fill={P.burlap}
                        {...inked}
                    />
                    <path d="M92 206 C72 214 48 224 24 230 L22 236 C46 230 70 222 93 212 Z" fill={P.burlapShade} />
                    <path
                        d="M86 196 L26 178 M86 202 L18 200 M88 206 L20 216"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M84 192 L40 176 M88 199 L40 190 M88 203 L34 208 M90 208 L40 222"
                        fill="none"
                        stroke={P.burlapShade}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>

                {/* Palo de la escoba con veta clara y amarre rosa. */}
                <path d="M62 203 L310 103 C316 101 319 111 314 113 L66 213 Z" fill={P.mustardDeep} {...inked} />
                <path
                    d="M120 190 L160 174 M200 158 L228 147 M262 134 L288 124"
                    fill="none"
                    stroke={P.mustard}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <path d="M83 185 L98 180 L104 208 L90 215 Z" fill={P.roseDeep} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
                <path d="M87 192 L100 187 M89 200 L102 195 M91 208 L103 203" stroke={INK} strokeWidth="2" strokeLinecap="round" />

                {/* Brazo de atrás: nace del hombro, detrás del vestido, y agarra el palo más adelante. */}
                <path d="M200 128 C220 124 238 122 252 120 L254 132 C238 134 220 138 202 142 Z" fill={P.plum} {...inked} />
                <path d="M250 116 C259 110 271 114 269 124 C268 132 257 134 251 130 Z" fill={P.sage} {...inked} />

                {/* Torso inclinado con la escoba: va montada, no parada. Los brazos quedan
                fuera del giro para que las manos sigan sobre el palo. */}
                <g transform="rotate(-8 186 160)">
                    {/* Vestido: dobladillo en picos, filo lila para despegarlo del fondo, parches. */}
                    <path
                        d="M164 124 C150 134 144 152 140 168 L128 190 L140 186 L146 196 L156 188 L166 198 L176 188 L186 198 L196 188 L206 196 L214 186 L224 190 C218 170 212 148 202 128 C192 120 174 118 164 124 Z"
                        fill={P.plum}
                        {...inked}
                    />
                    <path d="M160 132 C151 146 147 162 141 180" fill="none" stroke={P.lilac} strokeWidth="3" strokeLinecap="round" />
                    <path
                        d="M152 160 L166 158 L168 172 L154 174 Z"
                        fill={P.mustard}
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <path d="M190 164 L204 166 L202 180 L188 178 Z" fill={P.teal} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
                    <path
                        d="M155 163 L158 166 M158 163 L155 166 M162 168 L165 171 M165 168 L162 171 M192 169 L195 172 M195 169 L192 172 M197 174 L200 177 M200 174 L197 177"
                        stroke={INK}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>

                {/* Pierna de enfrente, pateando hacia adelante. */}
                <path d="M190 186 L204 186 L228 228 L216 234 Z" fill={P.bone} {...inked} />
                <path
                    d="M194 194 L206 192 L210 199 L198 202 Z M202 207 L214 204 L218 211 L206 214 Z M209 220 L222 216 L226 223 L213 227 Z"
                    fill={P.roseDeep}
                />
                <path
                    d="M215 230 L231 224 C243 226 255 222 261 214 C262 226 251 238 229 240 C219 240 213 236 215 230 Z"
                    fill={P.plum}
                    {...inked}
                />
                <path d="M223 234 C237 234 249 228 257 220" fill="none" stroke={P.lilac} strokeWidth="3.5" strokeLinecap="round" />

                {/* Brazo de enfrente, con el codo doblado y la mano en el palo. */}
                <path
                    d="M184 132 C196 138 206 146 214 150 C222 146 228 140 232 134 L236 146 C228 154 218 160 208 160 C198 158 190 154 186 150 Z"
                    fill={P.plum}
                    {...inked}
                />
                <path
                    d="M190 138 C200 144 207 150 214 154 C220 151 225 146 229 141"
                    fill="none"
                    stroke={P.lilac}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <path d="M230 130 C239 124 251 128 249 138 C248 146 237 148 231 144 Z" fill={P.sage} {...inked} />
                <path d="M238 133 L241 141" stroke={INK} strokeWidth="2" strokeLinecap="round" />

                <g transform="rotate(-8 186 160)">
                    {/* Pelo barrido por el viento, detrás de la cabeza; oreja puntiaguda. */}
                    <path
                        d="M168 52 C150 50 128 58 112 68 L126 72 L106 82 L124 86 L104 98 L126 98 L112 112 L136 108 L128 122 L150 112 C146 92 150 66 168 52 Z"
                        fill={P.pumpkinDeep}
                        {...inked}
                    />
                    <path
                        d="M146 64 L120 74 M144 80 L116 90 M146 96 L122 104"
                        fill="none"
                        stroke={P.pumpkin}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path d="M150 88 C138 84 130 80 126 74 C130 92 140 102 152 104 Z" fill={P.sage} {...inked} />

                    {/* Cabeza con sombra musgo a la izquierda. */}
                    <path
                        d="M146 88 C144 64 162 48 184 48 C208 48 226 64 226 88 C226 112 208 128 186 128 C162 128 146 112 146 88 Z"
                        fill={P.sage}
                        {...inked}
                    />
                    <path d="M153 74 C147 90 151 108 165 120 C157 107 155 92 159 78 Z" fill={P.moss} opacity="0.55" />

                    {/* Fleco: mechones sueltos de distinto largo que el viento barre hacia atrás.
                Nada de hilera pareja de picos: eso se leía como el corte de Frankenstein. */}
                    <path
                        d="M158 62 C154 72 154 80 160 88 C162 78 168 72 178 66 Z M170 62 C166 70 164 76 168 83 C172 75 180 70 190 66 Z M184 62 C180 68 178 74 180 79 C186 73 194 69 204 66 Z M200 62 C198 66 197 70 199 73 C204 69 210 67 216 66 Z"
                        fill={P.pumpkinDeep}
                        {...inked}
                        strokeWidth="3"
                    />

                    {/* Ojos en reposo, mirando hacia donde vuela. */}
                    <g className="hw-off hw-eye">
                        <ellipse cx="174" cy="92" rx="8" ry="10" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                        <ellipse cx="200" cy="90" rx="9" ry="11" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                        <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                            <circle cx="176" cy="93" r="4.5" fill={P.irisPink} />
                            <circle cx="176.5" cy="93.5" r="2.4" fill={INK} />
                            <circle cx="174.5" cy="91" r="1.3" fill={P.cream} />
                            <circle cx="202" cy="91" r="5" fill={P.irisPink} />
                            <circle cx="202.5" cy="91.5" r="2.6" fill={INK} />
                            <circle cx="200.5" cy="89" r="1.4" fill={P.cream} />
                        </g>
                    </g>
                    <g className="hw-blink" fill="none" {...inked} strokeWidth="3.5">
                        <path d="M165 93 Q174 99 183 93" />
                        <path d="M190 91 Q200 98 210 91" />
                    </g>

                    {/* Sonrisa pícara en reposo. */}
                    <path className="hw-off" d="M178 116 Q192 124 208 116 L211 112" fill="none" {...inked} strokeWidth="3.5" />

                    {/* Carcajada: ojos ^^, bocota con diente chueco, cachetes. */}
                    <g className="hw-on">
                        <path d="M165 95 Q174 82 183 95 M190 93 Q200 80 210 93" fill="none" {...inked} strokeWidth="5" />
                        <path d="M177 107 Q194 113 211 107 C211 118 203 124 194 124 C185 124 177 118 177 107 Z" fill={P.mouth} {...inked} />
                        <path d="M184 120 Q194 114 204 120 Q200 124 194 124 Q188 124 184 120 Z" fill={P.tongue} />
                        <path d="M188 109 L191 117 L197 110 Z" fill={P.bone} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
                        <ellipse cx="160" cy="110" rx="8" ry="5" fill={P.roseLight} opacity="0.85" />
                        <ellipse cx="216" cy="118" rx="6" ry="4" fill={P.roseLight} opacity="0.85" />
                    </g>

                    {/* Nariz larga con verruguita (encima de la boca, como gancho). */}
                    <path
                        d="M210 100 C220 98 234 101 243 108 C248 112 245 116 239 115 C229 114 219 112 211 112 Z"
                        fill={P.sage}
                        {...inked}
                    />
                    <circle cx="231" cy="104" r="3.2" fill={P.moss} stroke={INK} strokeWidth="2" />

                    {/* Sombrero: la punta se dobla hacia atrás por el viento; se agita al reír. */}
                    <g className="hw-wave" style={v({ "--o": "55% 95%", "--wave": "-10deg" })}>
                        <path
                            d="M140 58 C142 44 138 34 128 28 C120 24 112 20 104 16 C116 4 146 2 166 14 C184 26 198 40 214 52 Z"
                            fill={P.plum}
                            {...inked}
                        />
                        <path
                            d="M204 45 C190 34 176 22 160 14 C142 8 124 9 114 14"
                            fill="none"
                            stroke={P.lilac}
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <path
                            d="M141 50 C166 44 194 44 217 50 L216 60 C194 54 168 53 142 58 Z"
                            fill={P.mustard}
                            stroke={INK}
                            strokeWidth="3"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M180 45 L192 45 L192 57 L180 57 Z"
                            fill={P.mustardDeep}
                            stroke={INK}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                        <path d="M184 49 L188 49 L188 53 L184 53 Z" fill={P.charcoal} />
                        <path
                            d="M124 64 C140 52 220 46 248 56 C256 62 240 68 186 68 C150 68 116 72 124 64 Z"
                            fill={P.lilacDeep}
                            {...inked}
                        />
                        <path d="M134 63 C160 56 214 52 240 58" fill="none" stroke={P.lilac} strokeWidth="4" strokeLinecap="round" />
                    </g>
                </g>

                {/* Risa: rayitas crema junto a la cabeza. */}
                <g
                    className="hw-on hw-pop"
                    style={v({ "--o": "0% 100%" })}
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                >
                    <path d="M256 70 L268 60" />
                    <path d="M262 86 L276 84" />
                    <path d="M246 48 L252 36" />
                </g>

                {/* Chispitas que suelta la escoba. */}
                <g className="hw-on hw-pop" style={v({ "--o": "100% 50%" })} fill={P.cream}>
                    <path d={sparkle(22, 146, 9)} />
                    <path d={sparkle(48, 158, 5)} />
                    <path d={sparkle(10, 236, 6)} />
                    <circle cx="36" cy="244" r="2.5" />
                    <circle cx="6" cy="170" r="2.5" />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "bruja-escoba",
    name: "Bruja en escoba",
    w: 322,
    h: 256,
    interactive: true,
    Art,
};

export default monster;
