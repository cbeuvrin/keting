import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Conde Drácula tierno, de medio cuerpo. Diseño propio: cara lila pálida con
// ojeras, pelo engominado con pico de viuda y capa de cuello alto.
// Reacción: abre la capa como alas de murciélago, abre la boca enseñando los
// colmillos, los ojos se vuelven espirales hipnóticas y salen murcielaguitos.

// Espiral de semicírculos alternados (cada uno 2 unidades más ancho): sale
// continua con un solo path y sin trigonometría.
function spiral(cx: number, cy: number, turns: number) {
    let d = `M${cx} ${cy}`;
    for (let i = 1; i <= turns; i++) {
        const r = i * 2;
        const dx = i % 2 ? r * 2 : -r * 2;
        d += ` a${r} ${r} 0 0 1 ${dx} 0`;
    }
    return d;
}

// Murcielaguito crema: va sobre el fondo, así que nada de cuerpo de tinta.
const BAT =
    "M0 -6 L3 -7 L5 -12 L6 -5 C10 -10 16 -11 20 -7 Q17 -1 19 5 Q14 2 11 7 Q8 3 4 6 L0 9 L-4 6 Q-8 3 -11 7 Q-14 2 -19 5 Q-17 -1 -20 -7 C-16 -11 -10 -10 -6 -5 L-5 -12 L-3 -7 Z";

function Bat({ x, y, s }: { x: number; y: number; s: number }) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <g className="hw-on hw-pop" style={v({ "--o": "50% 50%" })}>
                <path d={BAT} fill={P.cream} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
                <circle cx="-2.5" cy="-2" r="1.3" fill={INK} />
                <circle cx="2.5" cy="-2" r="1.3" fill={INK} />
            </g>
        </g>
    );
}

function Art() {
    return (
        <g>
            {/* Alas de la capa, detrás del cuerpo: cada una en su grupo, pivote en
            el hombro y ángulos opuestos para que se abran hacia afuera. Las
            varillas en lilacDeep son la banda de luz que la separa del negro. */}
            <g className="hw-wave" style={v({ "--o": "100% 0%", "--wave": "18deg" })}>
                <path
                    d="M104 176 C72 182 42 212 24 258 C17 276 14 294 16 310 Q30 298 42 312 Q52 296 66 311 Q76 295 90 308 L108 304 Z"
                    fill={P.charcoal}
                    {...inked}
                />
                <path d="M102 190 C98 230 98 272 104 302 L92 306 C88 270 88 226 102 190 Z" fill={P.roseDeep} />
                <path
                    d="M98 184 C70 194 44 220 30 262 C24 280 20 294 20 304 Q32 296 42 306 Q52 292 66 305 Q76 291 88 302 M100 186 L42 306 M102 188 L66 306 M104 190 L90 304"
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                {/* Al abrirse, la capa enseña el forro rosa con sus varillas. */}
                <g className="hw-on">
                    <path
                        d="M102 186 C76 196 52 222 38 262 C32 278 30 292 32 302 Q42 294 50 304 Q58 292 68 303 Q78 291 90 300 L104 298 Z"
                        fill={P.roseDeep}
                    />
                    <path
                        d="M100 190 L46 298 M102 192 L70 298 M40 262 C54 226 74 204 100 192"
                        fill="none"
                        stroke={P.plum}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </g>
            </g>
            <g className="hw-wave" style={v({ "--o": "0% 0%", "--wave": "-18deg" })}>
                <path
                    d="M196 176 C228 182 258 212 276 258 C283 276 285 292 283 304 Q270 300 258 310 Q246 298 236 309 Q222 297 210 306 L192 304 Z"
                    fill={P.charcoal}
                    {...inked}
                />
                <path d="M198 190 C202 230 202 272 196 302 L208 306 C212 270 212 226 198 190 Z" fill={P.roseDeep} />
                <path
                    d="M202 184 C230 194 256 220 270 262 C276 280 279 292 279 299 Q268 297 258 305 Q246 294 236 304 Q222 293 210 301 M200 186 L258 306 M198 188 L234 306 M196 190 L210 304"
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <g className="hw-on">
                    <path
                        d="M198 186 C224 196 248 222 262 262 C268 278 270 292 268 302 Q258 294 250 304 Q242 292 232 303 Q222 291 210 300 L196 298 Z"
                        fill={P.roseDeep}
                    />
                    <path
                        d="M200 190 L254 298 M198 192 L230 298 M260 262 C246 226 226 204 200 192"
                        fill="none"
                        stroke={P.plum}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </g>
            </g>

            {/* Cuello alto: por fuera carbón, y desde el frente se ve el forro rosa
            con sus pliegues. */}
            <path
                d="M106 200 C80 172 56 120 44 66 C76 84 102 96 122 116 L178 116 C198 96 224 84 256 66 C244 120 220 172 194 200 Z"
                fill={P.charcoal}
                {...inked}
            />
            <path
                d="M112 194 C90 168 70 126 60 84 C86 98 106 108 124 124 L176 124 C194 108 214 98 240 84 C230 126 210 168 188 194 Z"
                fill={P.roseDeep}
            />
            <path
                d="M84 118 Q96 150 112 176 M100 108 Q106 136 118 160 M216 118 Q204 150 188 176 M200 108 Q194 136 182 160"
                fill="none"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.6"
            />
            <path
                d="M50 76 C62 118 80 160 104 194 M250 76 C238 118 220 160 196 194"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Saco ciruela (se despega de la capa carbón), camisa hueso con
            chorrera y medallón. */}
            <path d="M92 314 C90 250 104 204 150 196 C196 204 210 250 208 314 Z" fill={P.plum} {...inked} />
            <path d="M100 300 C100 256 110 222 128 206" fill="none" stroke={P.lilacDeep} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M124 200 L150 268 L176 200 Z" fill={P.bone} {...inked} strokeWidth="3" />
            <path
                d="M138 204 Q132 212 140 216 Q132 222 141 228 Q134 236 144 240 M162 204 Q168 212 160 216 Q168 222 159 228 Q166 236 156 240"
                fill="none"
                stroke={INK}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.45"
            />
            <path d="M124 200 L150 268 M176 200 L150 268" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path d="M128 202 Q150 236 172 202" fill="none" stroke={P.mustardDeep} strokeWidth="4" strokeLinecap="round" />
            <circle cx="150" cy="238" r="13" fill={P.mustard} {...inked} strokeWidth="3" />
            <path d="M150 229 L153 235 L159 237 L153 240 L150 247 L147 240 L141 237 L147 235 Z" fill={P.mustardDeep} />

            {/* Orejitas puntiagudas y cuello. */}
            <path d="M94 120 C82 112 74 104 70 100 C72 118 78 138 96 146 Z" fill={P.lilacLight} {...inked} />
            <path d="M206 120 C218 110 226 100 231 95 C229 116 222 138 204 146 Z" fill={P.lilacLight} {...inked} />
            <path d="M136 176 L136 204 L164 204 L164 176 Z" fill={P.lilac} />

            {/* Cabeza pálida con sombra al lado derecho. */}
            <path
                d="M150 62 C194 60 214 94 212 130 C211 164 188 186 150 187 C112 186 89 164 88 130 C87 96 106 63 150 62 Z"
                fill={P.lilacLight}
                {...inked}
            />
            <path d="M198 104 C212 130 206 164 180 180 C196 160 202 132 198 104 Z" fill={P.lilac} opacity="0.7" />

            {/* Pelo engominado con pico de viuda; los trazos azules dibujan el peinado
            hacia atrás y le dan el brillo que lo despega del fondo. */}
            <path
                d="M89 132 C80 84 106 50 150 50 C194 50 220 84 211 132 C206 110 198 96 184 88 C170 88 158 96 150 120 C142 96 130 88 116 88 C102 96 94 110 89 132 Z"
                fill={P.charcoal}
                {...inked}
            />
            <path
                d="M147 106 C142 86 128 72 108 70 M153 106 C160 88 174 76 194 76 M140 64 C128 60 114 64 104 74"
                fill="none"
                stroke={P.navyLight}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path d="M126 58 Q150 52 172 58" fill="none" stroke={P.cream} strokeWidth="3" strokeLinecap="round" opacity="0.5" />

            {/* Cejas y ojeras (quedan en los dos estados). */}
            <path d="M109 114 Q121 106 135 112 M165 108 Q179 102 191 110" fill="none" {...inked} strokeWidth="3.5" />
            <path
                d="M111 156 Q124 162 137 156 M163 152 Q176 158 189 152"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <path d="M149 142 Q154 148 148 151" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

            {/* Reposo: ojos rosa que siguen al cursor y sonrisa con colmillitos. */}
            <g className="hw-off hw-eye">
                <ellipse cx="124" cy="134" rx="14" ry="16" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                <ellipse cx="176" cy="130" rx="14" ry="16" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                    <circle cx="126" cy="137" r="8" fill={P.irisPink} />
                    <circle cx="127" cy="138" r="4" fill={INK} />
                    <circle cx="123" cy="134" r="2" fill={P.cream} />
                    <circle cx="178" cy="133" r="8" fill={P.irisPink} />
                    <circle cx="179" cy="134" r="4" fill={INK} />
                    <circle cx="175" cy="130" r="2" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked} strokeWidth="3.5">
                <path d="M110 136 Q124 146 138 136" />
                <path d="M162 132 Q176 142 190 132" />
            </g>
            <g className="hw-off">
                <path
                    d="M137 164 L141 173 L145 166 Z M155 166 L159 173 L163 164 Z"
                    fill={P.bone}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path d="M132 162 Q150 172 168 162" fill="none" {...inked} strokeWidth="3.5" />
            </g>

            {/* Reacción: ojos de hipnosis, boca abierta con colmillos y rubor. */}
            <g className="hw-on">
                <ellipse cx="124" cy="133" rx="16" ry="18" fill={P.charcoal} {...inked} strokeWidth="3.5" />
                <ellipse cx="176" cy="129" rx="16" ry="18" fill={P.charcoal} {...inked} strokeWidth="3.5" />
                <path
                    d={`${spiral(122, 133, 6)} ${spiral(174, 129, 6)}`}
                    fill="none"
                    stroke={P.mustard}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                />
                <path d="M128 158 Q150 152 172 158 Q170 186 150 188 Q130 186 128 158 Z" fill={P.mouth} {...inked} strokeWidth="3.5" />
                <path d="M138 176 Q150 170 162 176 Q158 184 150 184 Q142 184 138 176 Z" fill={P.tongue} />
                <path
                    d="M133 158 L138 174 L143 157 Z M157 157 L162 174 L167 158 Z"
                    fill={P.bone}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <ellipse cx="104" cy="160" rx="9" ry="5" fill={P.roseLight} opacity="0.8" />
                <ellipse cx="196" cy="160" rx="9" ry="5" fill={P.roseLight} opacity="0.8" />
            </g>
            <Bat x={40} y={44} s={1.6} />
            <Bat x={260} y={32} s={1.35} />
            <Bat x={30} y={170} s={1.25} />
        </g>
    );
}

const monster: MonsterDef = {
    id: "dracula",
    name: "Drácula",
    w: 300,
    h: 320,
    interactive: true,
    Art,
};

export default monster;
