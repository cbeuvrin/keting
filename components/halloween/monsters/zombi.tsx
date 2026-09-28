import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Zombi tierno: cabezota verde con un ojo más grande que el otro, ojeras,
// curitas en lugar de heridas y camisa rota con parches. Los dos brazos
// estirados al frente, como en las películas, pero con las manos flojitas.
// Reacción: menea los brazos (cada uno a su ritmo), los ojos se vuelven
// espirales, saca la lengua y le sale un globito con un corazón.

/** Espiral de Arquímedes centrada en (cx, cy): los ojos mareados. */
function spiral(cx: number, cy: number, rmax: number, turns: number) {
    const steps = Math.round(turns * 14);
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const a = t * turns * Math.PI * 2;
        const r = t * rmax;
        pts.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
}

function Art() {
    return (
        <g className="hw-sway" style={v({ "--o": "50% 100%", "--sw": "2deg", "--sd": "3.2s" })}>
            {/* Brazo de atrás: detrás del cuerpo para que la manga tape el hombro. */}
            <g className="hw-wave" style={v({ "--o": "0% 30%", "--wave": "-14deg" })}>
                <path d="M144 131 L184 128 C191 128 191 142 184 142 L144 143 Z" fill={P.sage} {...inked} />
                <path
                    d="M182 126 C194 123 201 131 199 139 L201 151 L195 149 L195 157 L189 153 L187 159 L182 150 C178 145 178 133 182 126 Z"
                    fill={P.sage}
                    {...inked}
                />
                {/* Manga del mismo teal que la de enfrente, con sombra abajo: en tealDeep se leía como hueco. */}
                <path d="M102 128 L146 125 L144 131 L150 136 L145 141 L148 146 L104 150 Z" fill={P.teal} {...inked} />
                <path d="M106 146 L144 142" stroke={P.tealDeep} strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Pies descalzos con deditos, detrás del pantalón. Separados y el de atrás
            en sombra, para que no se fundan en una sola mancha verde. */}
            <path d="M58 228 L80 228 C92 230 98 238 95 247 L55 247 C50 241 51 233 58 228 Z" fill={P.sage} {...inked} />
            <path d="M60 231 L80 231 C89 233 94 239 93 245 L57 245 C53 240 54 235 60 231 Z" fill={P.moss} opacity="0.6" />
            <path d="M106 228 L128 228 C140 230 146 238 143 247 L103 247 C98 241 99 233 106 228 Z" fill={P.sage} {...inked} />
            <path
                d="M84 238 L85 246 M90 239 L90 246 M132 238 L133 246 M138 239 L138 246"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Pantalón con la bastilla deshilachada; filo navyLight para que no se hunda en el fondo. */}
            <path
                d="M58 176 L120 176 L124 234 L116 230 L110 236 L104 230 L98 234 L92 204 L86 204 L82 234 L76 230 L70 236 L64 230 L56 234 Z"
                fill={P.navyDeep}
                {...inked}
            />
            <path d="M63 192 L61 226 M117 192 L119 226" stroke={P.navyLight} strokeWidth="3" strokeLinecap="round" />
            <path d="M100 206 L112 204 L114 216 L102 218 Z" fill={P.lilac} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />

            {/* Camisa rota: dobladillo en picos, sombra a la izquierda y parches cosidos. */}
            <path
                d="M56 132 C47 150 47 172 51 192 L58 185 L64 196 L72 187 L80 198 L88 188 L96 197 L104 186 L112 195 L120 186 L127 193 C131 172 131 150 123 132 C104 123 75 123 56 132 Z"
                fill={P.teal}
                {...inked}
            />
            <path d="M58 136 C52 152 51 170 53 186 L58 181 C57 166 58 150 64 136 Z" fill={P.tealDeep} />
            <path d="M79 127 L90 143 L101 127 Z" fill={P.sage} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M72 139 L87 141 L86 155 L71 154 Z" fill={P.mustard} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M62 164 L76 162 L77 175 L63 176 Z" fill={P.roseDeep} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
            <path
                d="M74 143 L78 147 M78 143 L74 147 M80 146 L84 150 M84 146 L80 150 M65 167 L69 171 M69 167 L65 171 M73 169 L77 173 M77 169 L73 173"
                stroke={INK}
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Brazo de enfrente: meneo con otro ritmo (jiggle por fuera, wave por dentro). */}
            <g className="hw-jiggle" style={v({ "--o": "0% 30%" })}>
                <g className="hw-wave" style={v({ "--o": "0% 30%", "--wave": "12deg" })}>
                    <path d="M138 152 L180 154 C187 154 187 168 180 168 L138 167 Z" fill={P.sage} {...inked} />
                    <path
                        d="M178 152 C190 149 197 157 195 165 L197 177 L191 175 L191 183 L185 179 L183 185 L178 176 C174 171 174 159 178 152 Z"
                        fill={P.sage}
                        {...inked}
                    />
                    {/* Curita en el antebrazo. */}
                    <path d="M154 152 L164 152 L164 169 L154 169 Z" fill={P.burlap} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
                    <path
                        d="M98 150 C104 144 120 144 140 146 L136 152 L142 158 L137 163 L141 169 C120 172 104 172 98 166 Z"
                        fill={P.teal}
                        {...inked}
                    />
                </g>
            </g>

            {/* Cuello y oreja detrás de la cabeza. */}
            <path d="M78 116 L98 116 L98 132 L78 132 Z" fill={P.sage} {...inked} />
            <path d="M42 76 C28 70 24 92 38 98 Z" fill={P.sage} {...inked} />

            {/* Cabezota abollada con sombra musgo y manchitas en la sien (nada de cicatriz
            cosida: esa es la seña de Frankenstein). */}
            <path
                d="M40 64 C33 88 38 112 56 122 C74 131 108 130 126 120 C142 110 146 84 140 62 C132 42 110 34 88 34 C66 34 46 44 40 64 Z"
                fill={P.sage}
                {...inked}
            />
            <path d="M131 66 C140 84 138 106 122 118 C131 104 133 86 127 70 Z" fill={P.moss} opacity="0.6" />
            <g fill={P.moss} opacity="0.5">
                <circle cx="127" cy="58" r="5" />
                <circle cx="136" cy="70" r="3" />
                <circle cx="121" cy="50" r="2.5" />
            </g>

            {/* Pelo alborotado: picos ciruela con mechones lila para que se lea en el negro. */}
            <path
                d="M36 64 C33 45 43 31 57 26 L55 11 L69 21 L75 5 L88 19 L100 7 L106 23 L122 13 L120 30 C136 34 145 48 142 64 C132 53 124 49 116 55 L108 44 L100 55 L90 44 L82 55 L72 45 L64 55 C54 51 44 55 36 64 Z"
                fill={P.plum}
                {...inked}
            />
            <path
                d="M58 31 L64 45 M84 22 L86 39 M104 26 L100 41 M122 35 L127 48 M70 25 L74 36"
                fill="none"
                stroke={P.lilac}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Curita en la frente. */}
            <g transform="rotate(-22 62 66)">
                <path
                    d="M47 61 L77 61 C80 61 80 71 77 71 L47 71 C44 71 44 61 47 61 Z"
                    fill={P.burlap}
                    stroke={INK}
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
                <path d="M57 62 L67 62 L67 70 L57 70 Z" fill={P.burlapShade} />
            </g>

            {/* Ojeras (se quedan en los dos estados). */}
            <path d="M53 96 Q64 103 75 96 M86 103 Q104 112 122 102" fill="none" stroke={P.moss} strokeWidth="3.5" strokeLinecap="round" />

            {/* Ojos disparejos en reposo. */}
            <g className="hw-off hw-eye">
                <ellipse cx="64" cy="83" rx="11" ry="12" fill={P.eyeWhite} {...inked} />
                <ellipse cx="104" cy="79" rx="19" ry="21" fill={P.eyeWhite} {...inked} />
                <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                    <circle cx="66" cy="85" r="6" fill={P.irisGold} />
                    <circle cx="66.5" cy="85.5" r="3" fill={INK} />
                    <circle cx="63.5" cy="82" r="1.6" fill={P.cream} />
                    <circle cx="106" cy="81" r="10" fill={P.irisGold} />
                    <circle cx="107" cy="82" r="5" fill={INK} />
                    <circle cx="102" cy="77" r="2.4" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked}>
                <path d="M52 85 Q64 93 76 85" />
                <path d="M84 81 Q104 93 124 81" />
            </g>

            {/* Boca en reposo: rayita chueca con un diente cuadrado que sale del labio de abajo
            (hacia abajo se leía como colmillo de vampiro). */}
            <g className="hw-off">
                <path d="M70 110 Q78 105 86 110 Q94 114 102 107" fill="none" {...inked} strokeWidth="3.5" />
                <path d="M88 108 L94 107 L95 113 L89 114 Z" fill={P.bone} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            </g>

            {/* Mareo: ojos en espiral y boca abierta. */}
            <g className="hw-on">
                <ellipse cx="64" cy="83" rx="12" ry="13" fill={P.eyeWhite} {...inked} />
                <ellipse cx="104" cy="79" rx="20" ry="22" fill={P.eyeWhite} {...inked} />
                <path
                    d={`${spiral(64, 83, 8, 2.2)} ${spiral(104, 79, 14, 2.6)}`}
                    fill="none"
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <path d="M68 106 C70 126 102 128 106 106 Q87 112 68 106 Z" fill={P.mouth} {...inked} />
                <ellipse cx="48" cy="104" rx="8" ry="5" fill={P.roseLight} opacity="0.85" />
            </g>
            {/* Lengua de fuera, colgando del labio de abajo. */}
            <g className="hw-tongue">
                <path
                    d="M78 116 C76 130 80 139 88 139 C96 139 99 129 97 116 Z"
                    fill={P.tongue}
                    stroke={INK}
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
                <path d="M87.5 121 L88 131" stroke={P.roseDeep} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Curita en la mejilla, encima de todo. */}
            <g transform="rotate(-30 124 114)">
                <path
                    d="M114 110 L134 110 C137 110 137 118 134 118 L114 118 C111 118 111 110 114 110 Z"
                    fill={P.burlap}
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
            </g>

            {/* Globito de amor, en crema porque va sobre el fondo. */}
            <g className="hw-on hw-pop" style={v({ "--o": "0% 100%" })}>
                <path d="M150 58 C144 50 146 28 164 22 C180 16 202 22 204 38 C206 54 190 62 172 58 L156 68 Z" fill={P.cream} {...inked} />
                <path
                    d="M175 50 C164 42 160 34 166 30 C170 27 174 30 175 34 C176 30 181 27 185 30 C190 35 185 43 175 50 Z"
                    fill={P.roseLight}
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "zombi",
    name: "Zombi",
    w: 212,
    h: 254,
    interactive: true,
    Art,
};

export default monster;
