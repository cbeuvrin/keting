import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Gato negro de perfil con el lomo arqueado y la cara de frente.
// Es carbón sobre casi-negro: la silueta se sostiene con bordes de luz
// (navyLight / lilacDeep) y mechones en lila, no con la tinta.
// Reacción: se eriza — se estira, le salen pelos de punta en el lomo,
// los ojos se redondean con la pupila dilatada y bufa enseñando colmillos.

// Mechón de pelo: dos trazos curvos juntos. Se usa en lomo, cola y cabeza.
const tufts = (pts: [number, number][]) => pts.map(([x, y]) => `M${x} ${y} q2 -7 8 -9 M${x + 5} ${y + 2} q2 -7 8 -9`).join(" ");

// Las dos patas lejanas en un solo path: se dibuja dos veces (carbón y velo de sombra).
const FAR_LEGS =
    "M104 196 C108 220 110 236 110 248 Q100 250 100 257 Q102 262 116 262 Q130 262 130 256 Q130 250 122 248 C122 232 124 214 126 198 Z " +
    "M158 194 C162 218 164 234 164 248 Q154 250 154 257 Q156 262 170 262 Q184 262 184 256 Q184 250 176 248 C176 232 178 214 180 196 Z";

// Cresta de erizarse: cinco picos triangulares que salen del lomo. Empieza y acaba
// dentro del cuerpo, que tapa su base; ningún tramo queda suelto junto a la cola.
const CREST = "M96 110 L98 76 L110 98 L116 62 L128 90 L140 54 L152 86 L164 58 L172 90 L184 70 L188 104";
// La misma cresta 4 unidades hacia adentro: banda de luz que despega los picos del fondo.
const CREST_INNER = "M100 110 L101 90 L112 110 L118 76 L128 101 L140 66 L152 97 L163 70 L170 100 L181 82 L184 104";

function Art() {
    return (
        <g className="hw-stretch">
            {/* Cola esponjada detrás de todo; se mece siempre desde la base. */}
            <g className="hw-sway" style={v({ "--o": "70% 100%", "--sw": "4deg", "--sd": "3.6s" })}>
                <path
                    d="M72 170 Q58 164 50 162 Q46 152 38 150 Q38 140 28 134 Q32 124 22 114 Q30 106 22 94 Q32 88 26 74 Q38 70 34 56 Q46 54 46 40 Q56 42 62 30 Q70 38 80 36 Q78 48 86 56 Q76 62 80 74 Q70 80 72 92 Q62 98 68 110 Q60 118 66 128 Q60 136 70 144 Q76 150 88 150 Z"
                    fill={P.charcoal}
                    {...inked}
                />
                <path d="M40 142 C28 118 26 88 44 58" fill="none" stroke={P.navyLight} strokeWidth="3.5" strokeLinecap="round" />
                <path
                    d={tufts([
                        [48, 130],
                        [40, 104],
                        [50, 80],
                        [54, 56],
                        [60, 112],
                    ])}
                    fill="none"
                    stroke={P.lilac}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>

            {/* Patas del otro lado: se afinan hacia el pie y un velo navyDeep las manda atrás. */}
            <path d={FAR_LEGS} fill={P.charcoal} {...inked} />
            <path d={FAR_LEGS} fill={P.navyDeep} opacity="0.45" />
            <path
                d="M119 206 L118 242 M177 204 L174 242 M110 261 L110 256 M119 261 L119 256 M164 261 L164 256 M173 261 L173 256"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Pelos de punta del lomo: detrás del cuerpo, que tapa su base. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                <path d={`M92 150 L${CREST.slice(1)} L180 150 Z`} fill={P.charcoal} {...inked} />
                <path
                    d={CREST_INNER}
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="5"
                    opacity="0.6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </g>

            {/* Cuerpo arqueado con las patas cercanas en una sola silueta. */}
            <path
                d="M66 246 C64 222 58 192 66 160 C76 112 110 84 146 84 C182 84 204 112 206 150 C208 190 208 222 206 246 Q216 248 216 256 Q214 262 200 262 Q184 262 182 256 Q182 250 188 246 C188 228 186 212 180 198 Q140 184 102 200 C94 216 90 232 88 246 Q96 250 96 256 Q94 262 78 262 Q62 262 60 256 Q58 250 66 246 Z"
                fill={P.charcoal}
                {...inked}
            />
            {/* Sombra plana: media luna en la cara interna del muslo trasero. */}
            <path
                d="M78 196 C84 214 82 232 80 246 L88 246 C90 230 94 214 102 202 C94 200 86 198 78 196 Z"
                fill={P.navyDeep}
                opacity="0.35"
            />
            {/* Luz en el lomo: banda lila apagada y un filo navy encima. */}
            <path
                d="M72 168 C76 118 108 94 146 93 C176 93 194 114 198 142"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="9"
                opacity="0.55"
            />
            <path
                d="M70 176 C72 122 106 92 146 91 C178 91 196 112 200 138"
                fill="none"
                stroke={P.navyLight}
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            {/* Mechones de pelo en V y deditos. */}
            <path
                d={tufts([
                    [90, 140],
                    [116, 122],
                    [146, 116],
                    [124, 158],
                    [160, 146],
                    [76, 204],
                    [188, 220],
                ])}
                fill="none"
                stroke={P.lilac}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Filo de luz en el frente de la pata delantera y por fuera de la trasera. */}
            <path d="M204 160 C206 196 206 224 203 244" fill="none" stroke={P.lilacDeep} strokeWidth="3" strokeLinecap="round" />
            <path
                d="M68 200 C64 222 66 236 66 244"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                opacity="0.7"
                strokeLinecap="round"
            />
            <path
                d="M72 261 L72 255 M82 261 L82 255 M196 261 L196 255 M206 261 L206 255"
                stroke={P.lilacLight}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Cabeza de frente, con orejas, luz de borde a los dos lados y un mechón en la frente. */}
            <path
                d="M176 150 C170 126 176 106 186 96 L180 50 L214 84 Q228 80 242 84 L276 52 L272 98 C284 114 286 140 278 158 C288 164 286 174 276 174 C266 190 246 198 226 198 C206 198 186 190 178 176 C166 174 166 162 176 156 Z"
                fill={P.charcoal}
                {...inked}
            />
            <path d="M190 92 L186 64 L206 86 Z" fill={P.roseDeep} />
            <path d="M252 84 L270 64 L268 96 Z" fill={P.roseDeep} />
            <path
                d="M183 150 C178 128 182 110 191 100 M183 58 L187 90 M272 58 L268 94 M274 102 C284 118 285 140 278 158"
                fill="none"
                stroke={P.navyLight}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M220 94 q2 -7 8 -9 M228 96 q2 -7 8 -9"
                fill="none"
                stroke={P.lilac}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Cara en reposo: ojos mostaza con pupila rasgada y boquita en w. */}
            <g className="hw-off hw-eye">
                <ellipse cx="205" cy="134" rx="17" ry="19" fill={P.mustard} {...inked} />
                <ellipse cx="250" cy="132" rx="18" ry="20" fill={P.mustard} {...inked} />
                <g className="hw-pupil" style={v({ "--pr": "5px" })}>
                    <ellipse cx="206" cy="135" rx="3.5" ry="13" fill={INK} />
                    <ellipse cx="251" cy="133" rx="3.8" ry="14" fill={INK} />
                    <circle cx="201" cy="128" r="3" fill={P.cream} />
                    <circle cx="246" cy="125" r="3.2" fill={P.cream} />
                </g>
            </g>
            {/* Párpados en lila claro: la tinta no se vería sobre el carbón. */}
            <g className="hw-blink" fill="none" stroke={P.lilacLight} strokeWidth="4" strokeLinecap="round">
                <path d="M189 136 Q205 146 221 136" />
                <path d="M233 134 Q250 144 267 134" />
            </g>
            <path
                className="hw-off"
                d="M214 168 Q221 176 228 167 Q235 176 242 168"
                fill="none"
                stroke={P.lilacLight}
                strokeWidth="3.5"
                strokeLinecap="round"
            />

            {/* Bufido: ojos redondos con pupila dilatada, cejas fruncidas y boca abierta con colmillos. */}
            <g className="hw-on">
                <ellipse cx="205" cy="132" rx="20" ry="21" fill={P.mustard} {...inked} />
                <ellipse cx="250" cy="130" rx="21" ry="22" fill={P.mustard} {...inked} />
                <circle cx="206" cy="133" r="13" fill={INK} />
                <circle cx="251" cy="131" r="14" fill={INK} />
                <circle cx="201" cy="127" r="4" fill={P.cream} />
                <circle cx="246" cy="125" r="4.2" fill={P.cream} />
                <path d="M188 106 L214 114 M266 104 L240 112" fill="none" stroke={P.lilacLight} strokeWidth="4" strokeLinecap="round" />
                <path d="M208 165 Q228 158 248 165 Q246 188 228 191 Q210 188 208 165 Z" fill={P.mouth} {...inked} />
                <path
                    d="M214 165 L218 178 L222 163 Z M234 163 L238 178 L242 165 Z"
                    fill={P.bone}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path d="M217 186 Q228 177 239 186 Q234 191 228 191 Q222 191 217 186 Z" fill={P.tongue} />
            </g>

            {/* Nariz y bigotes (crema: van sobre el fondo). */}
            <path d="M222 154 L234 154 L228 161 Z" fill={P.rose} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
            <path
                d="M194 158 L158 150 M192 164 L156 166 M194 170 L162 182 M262 156 L292 146 M264 162 L294 162 M262 168 L290 178"
                fill="none"
                stroke={P.cream}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Collar rosa con cascabel; el cascabel tiembla al bufar. */}
            <path d="M186 194 Q224 220 264 192" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
            <path d="M186 194 Q224 220 264 192" fill="none" stroke={P.rose} strokeWidth="6" strokeLinecap="round" />
            <g className="hw-shake">
                <circle cx="225" cy="219" r="10" fill={P.mustard} {...inked} />
                <path d="M217 223 Q225 231 233 223 L233 225 Q225 235 217 225 Z" fill={P.mustardDeep} />
                <path d="M225 221 L225 228" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="221" cy="215" r="2.4" fill={P.cream} />
            </g>

            {/* Chispas del bufido: abanico crema sobre la cabeza, lejos de los bigotes. */}
            <g
                className="hw-on hw-pop"
                style={v({ "--o": "50% 100%" })}
                fill="none"
                stroke={P.cream}
                strokeWidth="3.5"
                strokeLinecap="round"
            >
                <path d="M200 44 L195 31 M228 40 L228 27 M256 44 L261 31" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "gato-negro",
    name: "Gato negro",
    w: 300,
    h: 280,
    interactive: true,
    Art,
};

export default monster;
