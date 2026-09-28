import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Criatura tipo Frankenstein: cabezota alta casi cuadrada, flequillo recto,
// tornillos en el cuello y cara de sueño eterno.
// Reacción: le da un toque — los tornillos echan chispas, los ojos se abren
// de golpe enormes, boca en "O" y todo el cuerpo tirita.

function Art() {
    return (
        <g className="hw-shake">
            {/* Hombros de saco oscuro; la banda lilacDeep arriba separa la silueta del fondo. */}
            <path d="M18 296 C20 272 44 256 82 252 L178 252 C216 256 240 272 242 296 Z" fill={P.charcoal} {...inked} />
            <path d="M30 284 C40 268 58 261 82 258" fill="none" stroke={P.lilacDeep} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M230 284 C220 268 202 261 178 258" fill="none" stroke={P.lilacDeep} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M102 252 L130 292 L158 252 Z" fill={P.boneShade} {...inked} strokeWidth="3" />
            <path d="M86 256 L112 290 M174 256 L148 290" fill="none" stroke={P.lilacDeep} strokeWidth="3" strokeLinecap="round" />
            {/* Parche remendado en el hombro. */}
            <path d="M194 272 L216 268 L220 290 L198 293 Z" fill={P.plum} stroke={P.lilacDeep} strokeWidth="2.5" strokeLinejoin="round" />
            <path
                d="M200 276 L204 280 M208 274 L212 278 M202 286 L206 290 M211 284 L215 288"
                stroke={P.lilac}
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Tornillos: varilla delgada y cabeza hexagonal con ranura, para que se
            lean como tornillos y no como collarín. Van antes que el cuello para que
            éste tape la unión de la varilla. */}
            <path d="M70 233 L100 233 L100 243 L70 243 Z M160 233 L190 233 L190 243 L160 243 Z" fill={P.boneShade} {...inked} />
            <path d="M51 238 L56 228 L68 228 L73 238 L68 248 L56 248 Z" fill={P.bone} {...inked} />
            <path d="M187 238 L192 228 L204 228 L209 238 L204 248 L192 248 Z" fill={P.bone} {...inked} />
            <path d="M54 239 L70 239 L66.5 246 L57.5 246 Z M190 239 L206 239 L202.5 246 L193.5 246 Z" fill={P.boneShade} />
            <path d="M57 238 L67 238 M193 238 L203 238" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

            {/* Cuello. */}
            <path d="M98 212 L162 212 L164 258 C142 264 118 264 96 258 Z" fill={P.sage} {...inked} />
            <path d="M146 214 L160 214 L161 256 C156 258 150 259 146 259 Z" fill={P.moss} />

            {/* Cabeza: bloque alto con los lados un poco chuecos. */}
            <path
                d="M60 64 C58 48 70 40 86 40 C120 36 150 38 180 36 C198 36 208 46 208 62 C210 110 212 170 206 212 C204 224 194 228 180 228 C146 230 112 231 80 228 C64 227 56 218 56 204 C54 160 58 110 60 64 Z"
                fill={P.sage}
                {...inked}
            />
            <path d="M186 80 C194 124 196 170 190 214 C188 220 184 222 178 223 C186 180 186 124 180 84 Z" fill={P.moss} />
            <path d="M190 150 L198 158 M190 166 L198 174 M190 182 L197 190" stroke={P.moss} strokeWidth="2.5" strokeLinecap="round" />

            {/* Mechones parados: antes que el pelo, que tapa su raíz. */}
            <path d="M112 24 Q118 8 130 16 Q124 20 122 26 Z M164 25 Q171 13 180 18 Q175 21 174 26 Z" fill={P.charcoal} {...inked} />
            {/* Filo lila: sin él, el mechón oscuro se pierde contra el fondo. */}
            <path d="M117 21 Q120 13 127 15 M168 22 Q172 16 177 18" fill="none" stroke={P.lilac} strokeWidth="2.5" strokeLinecap="round" />

            {/* Flequillo de tinta con picos desiguales; el rayado lila hace que se lea como pelo y no como mancha. */}
            <path
                d="M52 92 C48 60 54 32 84 26 C120 20 160 20 186 26 C212 32 216 60 212 92 L202 88 L193 100 L182 92 L172 98 L160 88 L150 101 L139 92 L127 99 L115 89 L103 101 L91 93 L80 100 L68 88 Z"
                fill={P.charcoal}
                {...inked}
            />
            <path
                d="M62 60 C66 42 82 34 104 31 M160 30 C182 32 198 40 204 58"
                fill="none"
                stroke={P.lilac}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M92 36 Q80 50 76 72 M100 46 Q92 60 90 80 M126 30 Q131 46 127 62 M137 38 Q141 48 139 56 M168 36 Q182 50 184 74 M158 48 Q168 60 170 82 M192 58 Q197 66 197 76"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Costura en la frente y cicatriz en la mejilla. */}
            <path d="M120 114 L186 106" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path
                d="M128 106 L130 120 M142 104 L144 118 M156 103 L158 116 M170 101 L172 114"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path d="M66 172 L80 196 M64 184 L74 178 M70 192 L80 186" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

            {/* Ojos de sueño: pupila abajo y párpado pesado a media asta. */}
            <g className="hw-off hw-eye">
                <ellipse cx="98" cy="144" rx="21" ry="17" fill={P.eyeWhite} {...inked} />
                <ellipse cx="160" cy="142" rx="21" ry="17" fill={P.eyeWhite} {...inked} />
                <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                    <circle cx="99" cy="149" r="8" fill={P.irisGold} />
                    <circle cx="99" cy="150" r="4" fill={INK} />
                    <circle cx="96" cy="149" r="2.2" fill={P.cream} />
                    <circle cx="161" cy="147" r="8" fill={P.irisGold} />
                    <circle cx="161" cy="148" r="4" fill={INK} />
                    <circle cx="158" cy="147" r="2.2" fill={P.cream} />
                </g>
                <path d="M75 145 C76 124 120 124 121 145 Z" fill={P.sage} {...inked} />
                <path d="M137 143 C138 122 182 122 183 143 Z" fill={P.sage} {...inked} />
            </g>
            <g className="hw-blink" fill="none" {...inked}>
                <path d="M77 146 Q98 156 119 146" />
                <path d="M139 144 Q160 154 181 144" />
            </g>
            {/* Ojeras: van siempre, también despierto del susto. */}
            <path d="M82 168 Q98 174 114 167 M144 166 Q160 172 176 165" fill="none" stroke={P.moss} strokeWidth="3" strokeLinecap="round" />

            <path d="M132 150 L124 178 L140 179" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Boca en reposo: raya plana con puntadas. */}
            <g className="hw-off">
                <path d="M104 202 Q130 198 158 204" fill="none" {...inked} />
                <path d="M114 195 L114 208 M130 194 L130 207 M146 196 L146 209" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Susto: ojos enormes con pupila de alfiler, cejas arriba y boca en O. */}
            <g className="hw-on">
                <ellipse cx="96" cy="147" rx="26" ry="24" fill={P.eyeWhite} {...inked} />
                <ellipse cx="162" cy="145" rx="27" ry="24" fill={P.eyeWhite} {...inked} />
                <circle cx="97" cy="148" r="5" fill={INK} />
                <circle cx="161" cy="146" r="5" fill={INK} />
                <path
                    d="M130 188 C139 188 143 196 143 204 C143 213 138 218 130 218 C122 218 117 213 117 204 C117 196 121 188 130 188 Z"
                    fill={P.mouth}
                    {...inked}
                />
                <path d="M121 210 Q130 203 139 210 Q136 216 130 216 Q124 216 121 210 Z" fill={P.tongue} />
            </g>

            {/* Chispas de los tornillos: crema y mostaza, que la tinta no se ve sobre el fondo. */}
            <g
                className="hw-on hw-pop"
                style={v({ "--o": "100% 50%" })}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M50 230 L38 222 L44 216 L28 208" stroke={P.cream} />
                <path d="M50 246 L36 250 L42 258 L26 262" stroke={P.mustard} />
                <path d="M45 238 L20 238" stroke={P.cream} />
            </g>
            <g
                className="hw-on hw-pop"
                style={v({ "--o": "0% 50%" })}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M210 230 L222 222 L216 216 L232 208" stroke={P.cream} />
                <path d="M210 246 L224 250 L218 258 L234 262" stroke={P.mustard} />
                <path d="M215 238 L240 238" stroke={P.cream} />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "frankenstein",
    name: "Criatura de Frankenstein",
    w: 260,
    h: 300,
    interactive: true,
    Art,
};

export default monster;
