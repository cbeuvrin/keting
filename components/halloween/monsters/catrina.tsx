import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// La Catrina, medio cuerpo. Distinta de la calaverita de azúcar a propósito:
// cara angosta y elegante, decoración fina de puntitos (no flores rellenas
// alrededor de los ojos) y todo el color fuerte se va al sombrero.
// Reacción: coquetea — abre el abanico y lo agita, cierra los ojos con
// pestañas, entreabre la sonrisa cosida y las flores del sombrero rebotan.

const f = (n: number) => Math.round(n * 10) / 10;

// Borde de volantes alrededor de (cx, cy): n lóbulos de radio r. Sirve para
// los pétalos arrugados del cempasúchil sin dibujar pétalo por pétalo.
// `jit` hace el radio irregular: sin eso el borde parece un engrane.
function ruffle(cx: number, cy: number, r: number, n: number, rot = 0, jit = 0) {
    let d = "";
    const rr = (i: number) => r * (1 + jit * Math.sin(i * 2.7));
    for (let i = 0; i <= n; i++) {
        const a = rot + (i / n) * Math.PI * 2;
        const x = cx + Math.cos(a) * rr(i % n);
        const y = cy + Math.sin(a) * rr(i % n);
        if (i === 0) {
            d += `M${f(x)} ${f(y)}`;
            continue;
        }
        const am = rot + ((i - 0.5) / n) * Math.PI * 2;
        const rm = rr(i - 0.5) * 1.32;
        d += ` Q${f(cx + Math.cos(am) * rm)} ${f(cy + Math.sin(am) * rm)} ${f(x)} ${f(y)}`;
    }
    return d + " Z";
}

// Rayitas radiales entre los pétalos: la textura de "papel arrugado" de la flor.
function petalLines(cx: number, cy: number, r0: number, r1: number, n: number, rot = 0) {
    let d = "";
    for (let i = 0; i < n; i++) {
        const a = rot + (i / n) * Math.PI * 2;
        d += `M${f(cx + Math.cos(a) * r0)} ${f(cy + Math.sin(a) * r0)} L${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)} `;
    }
    return d;
}

// Puntitos en arco (trazos de largo cero con punta redonda = un solo path).
// Ángulos en grados, 0 = derecha, 90 = abajo.
function dots(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n: number) {
    let d = "";
    for (let i = 0; i < n; i++) {
        const a = ((a0 + ((a1 - a0) * i) / (n - 1)) * Math.PI) / 180;
        d += `M${f(cx + Math.cos(a) * rx)} ${f(cy + Math.sin(a) * ry)} l0 0 `;
    }
    return d;
}

// Abanico abierto con el borde en ondas. Pivote en (cx, cy); ángulos en
// grados "de reloj de pared" (90 = arriba), del lado izquierdo al derecho.
const polar = (cx: number, cy: number, r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy - Math.sin(a) * r];
};
function fanShape(cx: number, cy: number, r: number, a0: number, a1: number, n: number) {
    const [sx, sy] = polar(cx, cy, r, a0);
    let d = `M${cx} ${cy} L${f(sx)} ${f(sy)}`;
    for (let i = 1; i <= n; i++) {
        const [qx, qy] = polar(cx, cy, r + 7, a0 + ((a1 - a0) * (i - 0.5)) / n);
        const [x, y] = polar(cx, cy, r, a0 + ((a1 - a0) * i) / n);
        d += ` Q${f(qx)} ${f(qy)} ${f(x)} ${f(y)}`;
    }
    return d + " Z";
}
function fanRibs(cx: number, cy: number, r: number, a0: number, a1: number, n: number) {
    let d = "";
    for (let i = 1; i < n; i++) {
        const [x, y] = polar(cx, cy, r, a0 + ((a1 - a0) * i) / n);
        d += `M${cx} ${cy} L${f(x)} ${f(y)} `;
    }
    return d;
}

const FAN = { cx: 190, cy: 250, r: 60, a0: 138, a1: 52 };

function Marigold({ x, y, r, rot = 0 }: { x: number; y: number; r: number; rot?: number }) {
    return (
        <>
            {/* Pompón: volantes irregulares encimados y sin centro oscuro (con
            centro parecería girasol). Las rayitas densas son los pétalos arrugados. */}
            <path d={ruffle(x, y, r, 17, rot, 0.12)} fill={P.mustard} {...inked} strokeWidth="3" />
            <path d={ruffle(x, y, r * 0.66, 10, rot + 0.3, 0.1)} fill={P.pumpkin} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
            <path d={ruffle(x, y, r * 0.4, 7, rot + 0.6, 0.1)} fill={P.pumpkin} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            <path
                d={petalLines(x, y, r * 0.5, r * 1.05, 17, rot + 0.18) + petalLines(x, y, r * 0.12, r * 0.34, 7, rot + 0.9)}
                stroke={INK}
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </>
    );
}

function Art() {
    return (
        <g>
            {/* Vestido: hombros anchos, sombra ciruela a la derecha y pliegues de tela. */}
            <path
                d="M30 296 C28 268 44 250 72 242 C90 236 104 234 120 234 C138 234 152 236 170 242 C198 250 214 268 210 296 Z"
                fill={P.roseDeep}
                {...inked}
            />
            <path d="M172 247 C194 255 205 272 203 293 L186 293 C188 274 182 260 168 252 Z" fill={P.plum} opacity="0.6" />
            <path
                d="M52 264 Q50 280 52 293 M70 256 Q68 276 70 293 M170 256 Q172 276 170 293 M188 264 Q190 280 188 293"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
            {/* Pechera de encaje: bordes en onda y agujeritos. */}
            <path
                d="M90 240 L150 240 C152 256 144 270 134 274 Q127 283 120 276 Q113 283 106 274 C96 270 88 256 90 240 Z"
                fill={P.bone}
                {...inked}
                strokeWidth="3"
            />
            <path
                d={dots(120, 248, 20, 18, 20, 160, 7) + dots(120, 248, 10, 9, 30, 150, 4)}
                stroke={P.roseDeep}
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Cuello alto con rayas de pliegue, camafeo y gorguera de encaje arriba. */}
            <path d="M90 204 C92 218 90 232 84 244 Q120 251 156 244 C150 232 148 218 150 204 Z" fill={P.roseDeep} {...inked} />
            <path
                d="M101 214 L99 245 M110 216 L109 247 M131 216 L132 247 M140 214 L142 245"
                stroke={INK}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M84 209 Q88 196 97 204 Q103 193 112 201 Q120 190 128 201 Q137 193 143 204 Q152 196 156 209 Q120 216 84 209 Z"
                fill={P.bone}
                {...inked}
                strokeWidth="3"
            />
            <ellipse cx="120" cy="236" rx="6" ry="7" fill={P.mustard} stroke={INK} strokeWidth="2.5" />

            {/* Cráneo angosto; la parte de arriba queda bajo el ala del sombrero. */}
            <path
                d="M80 116 C73 146 78 172 92 192 C98 208 108 219 120 219 C133 219 143 208 149 192 C163 172 167 146 160 116 Z"
                fill={P.bone}
                {...inked}
            />
            <path d="M85 126 C79 150 84 175 98 196 C92 176 89 152 93 126 Z" fill={P.boneShade} />

            {/* Decoración fina: puntitos rosa en arco sobre las cuencas, rayos teal
            abajo, rulitos en las mejillas y puntitos en la barbilla. */}
            <path
                d={dots(101, 150, 26, 27, 195, 345, 7) + dots(140, 150, 26, 27, 195, 345, 7) + dots(120, 208, 12, 3, 180, 0, 4)}
                stroke={P.rose}
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            <path
                d={dots(101, 151, 21, 22, 60, 140, 4) + dots(140, 151, 21, 22, 40, 120, 4) + "M120 133 L124 138 L120 143 L116 138 Z"}
                stroke={P.teal}
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <path
                d="M88 186 c-2 -6 6 -9 8 -4 c2 5 -5 8 -7 3 M152 186 c2 -6 -6 -9 -8 -4 c-2 5 5 8 7 3"
                fill="none"
                stroke={P.rose}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Nariz de corazón al revés. */}
            <path
                d="M120 163 C112 169 112 178 117 178 C119 178 120 176 120 174 C120 176 121 178 123 178 C128 178 128 169 120 163 Z"
                fill={P.mouth}
                stroke={INK}
                strokeWidth="2"
                strokeLinejoin="round"
            />

            {/* Cuencas abiertas con pupilitas de brillo que siguen al cursor. */}
            <g className="hw-off hw-eye">
                {/* Cuencas en gota con punta abajo (redondas parecían lentes). */}
                <path
                    d="M101 136 C110 136 115 142 115 150 C115 158 108 163 101 170 C94 163 87 158 87 150 C87 142 92 136 101 136 Z M140 136 C149 136 154 142 154 150 C154 158 147 163 140 170 C133 163 126 158 126 150 C126 142 131 136 140 136 Z"
                    fill={P.mouth}
                    {...inked}
                    strokeWidth="3"
                />
                <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                    <circle cx="103" cy="152" r="5" fill={P.cream} />
                    <circle cx="98" cy="158" r="2" fill={P.cream} />
                    <circle cx="142" cy="152" r="5" fill={P.cream} />
                    <circle cx="137" cy="158" r="2" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked}>
                <path d="M86 152 Q101 162 116 152" />
                <path d="M125 152 Q140 162 155 152" />
            </g>
            {/* Sonrisa de dientes cosidos. */}
            <path
                className="hw-off"
                d="M100 191 Q120 201 140 191 M104 187 L103 197 M112 190 L111 200 M120 191 L120 201 M128 190 L129 200 M136 187 L137 197"
                fill="none"
                stroke={INK}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Coqueta: ojos cerrados con pestañas, sonrisa entreabierta y chapitas. */}
            <g className="hw-on">
                <ellipse cx="88" cy="178" rx="10" ry="6" fill={P.roseLight} opacity="0.8" />
                <ellipse cx="152" cy="178" rx="10" ry="6" fill={P.roseLight} opacity="0.8" />
                <path
                    d="M86 150 Q101 162 116 150 M90 156 L84 162 M97 159 L94 166 M105 159 L106 166 M125 150 Q140 162 155 150 M135 159 L134 166 M143 159 L146 166 M150 156 L156 162"
                    fill="none"
                    {...inked}
                    strokeWidth="4"
                />
                <path d="M100 190 Q120 199 140 190 Q138 211 120 213 Q102 211 100 190 Z" fill={P.mouth} {...inked} strokeWidth="3" />
                <ellipse cx="120" cy="207" rx="8" ry="4.5" fill={P.tongue} />
                <path
                    d="M104 192 Q120 200 136 192 L135 198 Q120 205 105 198 Z"
                    fill={P.bone}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path d="M112 196 L112 201 M120 197 L120 203 M128 196 L128 201" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Aretes de gota a la altura de la sien, colgando fuera de la cara: se columpian al reaccionar. */}
            <g className="hw-wave" style={v({ "--o": "50% 0%", "--wave": "14deg" })}>
                <path
                    d="M68 160 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0 Z M72.5 168 C66 178 66 186 72.5 189 C79 186 79 178 72.5 168 Z"
                    fill={P.mustard}
                    stroke={INK}
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "50% 0%", "--wave": "-14deg" })}>
                <path
                    d="M163 160 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0 Z M167.5 168 C161 178 161 186 167.5 189 C174 186 174 178 167.5 168 Z"
                    fill={P.mustard}
                    stroke={INK}
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
            </g>

            {/* Sombrero enorme, un poco ladeado. El rotate va en un <g> sin clase. */}
            <g transform="rotate(-5 120 100)">
                {/* Plumas detrás de la copa, para que la copa tape su nacimiento. */}
                <g className="hw-wave" style={v({ "--o": "0% 100%", "--wave": "12deg" })}>
                    <path d="M150 78 C148 52 158 28 178 12 C186 38 178 64 162 84 Z" fill={P.lilacLight} {...inked} strokeWidth="3.5" />
                    <path d="M162 88 C172 58 190 34 216 20 C214 50 196 74 172 94 Z" fill={P.lilac} {...inked} strokeWidth="3.5" />
                    <path
                        d="M155 80 Q162 46 177 16 M166 90 Q188 56 213 23 M164 52 L173 55 M161 64 L171 68 M167 38 L176 40 M184 52 L194 56 M177 66 L188 72 M193 40 L203 42"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>
                {/* Copa ciruela con brillo lila y banda clara para que se lea sobre el negro. */}
                <path d="M60 104 C52 74 64 42 94 32 C122 24 162 30 178 52 C190 70 188 92 184 106 Z" fill={P.plum} {...inked} />
                <path d="M72 86 C70 66 78 50 94 42" fill="none" stroke={P.lilacDeep} strokeWidth="5" strokeLinecap="round" />
                <path d="M58 86 C96 79 146 79 186 86 L185 103 C146 96 96 96 60 103 Z" fill={P.lilac} {...inked} strokeWidth="3" />
                {/* Ala: plato ancho con filo de luz en el borde delantero. */}
                <path
                    d="M6 116 C0 98 58 90 120 90 C184 90 242 98 234 115 C228 130 180 131 120 131 C60 131 12 132 6 116 Z"
                    fill={P.plum}
                    {...inked}
                />
                <path
                    d="M16 118 C40 126 82 126 120 126 C168 126 208 123 226 114"
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <path
                    d="M26 106 C56 98 94 96 124 96"
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.8"
                />

                {/* Corona de cempasúchiles con hojitas sobre la banda: rebota al reaccionar. */}
                <g className="hw-hop" style={v({ "--hop": "-9px" })}>
                    <path
                        d="M40 100 Q24 84 12 94 Q24 108 40 100 Z M170 90 Q184 72 200 80 Q192 96 170 90 Z M100 76 Q104 62 116 60 Q116 74 100 76 Z"
                        fill={P.sage}
                        {...inked}
                        strokeWidth="3"
                    />
                    <Marigold x={50} y={102} r={12} rot={0.4} />
                    <Marigold x={160} y={94} r={13} rot={1.2} />
                    <Marigold x={128} y={90} r={16} rot={0.9} />
                    <Marigold x={98} y={92} r={14} rot={0.2} />
                    <Marigold x={72} y={88} r={18} />
                </g>
            </g>

            {/* Antebrazo en manga del vestido: une la mano al cuerpo. */}
            <path d="M154 294 C160 278 170 264 178 256 L204 260 C196 274 188 286 186 296 Z" fill={P.roseDeep} {...inked} />

            {/* Abanico cerrado en reposo (solo una varilla gruesa en la mano). */}
            <path
                className="hw-off"
                d="M188 248 L154 212 Q158 204 166 204 Q172 205 176 210 L194 246 Z M162 210 L189 246 M170 207 L191 245"
                fill={P.teal}
                {...inked}
                strokeWidth="3"
            />
            {/* Abanico abierto: aparece con rebote y se agita desde el pivote. */}
            <g className="hw-on hw-pop" style={v({ "--o": "55% 100%" })}>
                <g className="hw-wave" style={v({ "--o": "55% 100%", "--wave": "-16deg" })}>
                    <path d={fanShape(FAN.cx, FAN.cy, FAN.r, FAN.a0, FAN.a1, 7)} fill={P.teal} {...inked} strokeWidth="3.5" />
                    <path
                        d={fanRibs(FAN.cx, FAN.cy, FAN.r - 4, FAN.a0, FAN.a1, 7)}
                        stroke={P.tealDeep}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d={(() => {
                            const [sx, sy] = polar(FAN.cx, FAN.cy, FAN.r - 9, FAN.a0 - 3);
                            const [ex, ey] = polar(FAN.cx, FAN.cy, FAN.r - 9, FAN.a1 + 3);
                            return `M${f(sx)} ${f(sy)} A${FAN.r - 9} ${FAN.r - 9} 0 0 1 ${f(ex)} ${f(ey)}`;
                        })()}
                        fill="none"
                        stroke={P.bone}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="0 7"
                    />
                </g>
            </g>
            {/* Mano de hueso que sostiene el abanico (siempre visible). */}
            <path
                d="M178 247 C175 236 186 230 194 233 C203 236 207 246 203 254 C199 262 185 262 180 256 Z"
                fill={P.bone}
                {...inked}
                strokeWidth="3.5"
            />
            <path
                d="M185 240 Q192 237 199 242 M183 248 Q191 245 200 250"
                fill="none"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Puño de encaje sobre la muñeca, con el borde en ondas hacia la manga. */}
            <path
                d="M177 257 C186 252 196 253 205 258 L204 263 Q201 269 197 265 Q193 271 189 266 Q185 271 181 266 Q176 268 177 257 Z"
                fill={P.bone}
                {...inked}
                strokeWidth="3"
            />

            {/* Corazoncito que sale del abanico: va sobre el fondo, así que relleno rosa. */}
            <g className="hw-on hw-pop" style={v({ "--o": "0% 100%" })}>
                <path
                    d="M214 178 C204 170 204 160 210 160 C213 160 214 163 214 165 C214 163 215 160 218 160 C224 160 224 170 214 178 Z"
                    fill={P.rose}
                    {...inked}
                    strokeWidth="3"
                />
                <path d="M200 154 L196 146 M222 150 L228 144" fill="none" stroke={P.cream} strokeWidth="3" strokeLinecap="round" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "catrina",
    name: "La Catrina",
    w: 240,
    h: 300,
    interactive: true,
    Art,
};

export default monster;
