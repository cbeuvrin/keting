import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Esqueleto bailarín: cráneo enorme de caricatura sobre un cuerpecito de
// huesos rellenos (sobre el fondo negro, las líneas sueltas se pierden; las
// formas claras con contorno se leen). Se mece siempre, como bailando.
// Reacción: se le cae la mandíbula, el cráneo brinca del cuello, saluda con
// el brazo y le salen estrellitas en las cuencas.

/** Silueta de hueso (palito con dos nudos en cada punta) de A a B, en un solo path. */
function bone(ax: number, ay: number, bx: number, by: number, hw: number, r: number) {
    const len = Math.hypot(bx - ax, by - ay);
    const ux = (bx - ax) / len;
    const uy = (by - ay) / len;
    const nx = -uy;
    const ny = ux;
    const k = r * 0.9;
    const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
    const p1 = pt(ax + ux * k + nx * hw, ay + uy * k + ny * hw);
    const p2 = pt(bx - ux * k + nx * hw, by - uy * k + ny * hw);
    const p3 = pt(bx + ux * r * 0.35, by + uy * r * 0.35);
    const p4 = pt(bx - ux * k - nx * hw, by - uy * k - ny * hw);
    const p5 = pt(ax + ux * k - nx * hw, ay + uy * k - ny * hw);
    const p6 = pt(ax - ux * r * 0.35, ay - uy * r * 0.35);
    const arc = `A${r} ${r} 0 1 0`;
    return `M${p1} L${p2} ${arc} ${p3} ${arc} ${p4} L${p5} ${arc} ${p6} ${arc} ${p1} Z`;
}

/** Estrella de cinco picos centrada en (cx, cy). */
function star(cx: number, cy: number, ro: number, ri: number) {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const r = i % 2 ? ri : ro;
        pts.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
    }
    return `M${pts.join(" L")} Z`;
}

function Art() {
    return (
        <g className="hw-sway" style={v({ "--o": "50% 100%", "--sw": "2.5deg", "--sd": "1.8s" })}>
            {/* Brazo en la cadera, detrás del cuerpo (en sombra: es el de atrás). */}
            <path d={bone(124, 154, 148, 180, 4.5, 6)} fill={P.boneShade} {...inked} />
            <path d={bone(148, 180, 116, 212, 4, 5.5)} fill={P.boneShade} {...inked} />

            {/* Piernas: la de enfrente con la rodilla doblada, la de atrás en patadita
            (en sombra). Cada pie nace del tobillo con un talón que tapa el nudo
            y deditos en la punta, para que no parezcan piezas sueltas. */}
            <path d={bone(108, 228, 134, 244, 4.5, 6)} fill={P.boneShade} {...inked} />
            <path d={bone(134, 244, 140, 268, 4, 5.5)} fill={P.boneShade} {...inked} />
            <path
                d="M136 264 C131 268 132 276 138 278 L160 278 C166 278 167 273 164 271 C166 268 162 265 159 267 C159 264 155 263 153 265 C152 263 148 263 147 266 L146 263 C143 259 138 260 136 264 Z"
                fill={P.boneShade}
                {...inked}
            />
            <path d={bone(86, 228, 66, 250, 4.5, 6)} fill={P.bone} {...inked} />
            <path d={bone(66, 250, 78, 276, 4, 5.5)} fill={P.bone} {...inked} />
            <path
                d="M86 272 C90 276 90 284 82 285 L60 285 C54 285 52 281 55 279 C53 276 57 274 60 276 C60 273 64 272 66 274 C67 272 70 272 72 274 L73 271 C76 266 83 267 86 272 Z"
                fill={P.bone}
                {...inked}
            />

            {/* Brazo que saluda: pivote en el hombro, detrás del cráneo. */}
            <g className="hw-wave" style={v({ "--o": "92% 92%", "--wave": "-18deg" })}>
                <path d={bone(68, 154, 44, 132, 4.5, 6)} fill={P.bone} {...inked} />
                <path d={bone(44, 132, 34, 102, 4, 5.5)} fill={P.bone} {...inked} />
                {/* Mano abierta de caricatura: cuatro dedos en abanico y el pulgar
                aparte, para que se lea "hola" hasta en chiquito. */}
                <path
                    d="M27 102 C22 98 20 93 22 88 L15 80 C12 76 17 72 21 75 L26 82 L22 70 C21 64 28 63 29 68 L31 79 L32 65 C33 59 40 60 39 65 L37 79 L42 70 C45 65 51 68 48 72 L41 86 L47 83 C52 81 55 87 51 90 L42 97 C39 101 34 104 27 102 Z"
                    fill={P.bone}
                    {...inked}
                />
            </g>

            {/* Columna y pelvis. */}
            <path d="M90 198 h14 v8 h-14 Z M91 207 h12 v8 h-12 Z" fill={P.bone} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path
                d="M80 212 C73 216 72 229 83 233 C90 235 94 231 97 227 C100 231 104 235 111 233 C122 229 121 216 114 212 C104 217 90 217 80 212 Z"
                fill={P.bone}
                {...inked}
            />
            <path
                d="M83 220 C85 216 90 218 89 223 C88 227 83 226 83 220 Z M111 220 C109 216 104 218 105 223 C106 227 111 226 111 220 Z"
                fill={P.mouth}
            />
            {/* Manita del brazo de atrás apoyada en la cadera, encima de la pelvis. */}
            <path
                d="M114 206 C120 204 125 208 124 213 L122 219 C121 221 118 221 118 219 L117 216 L115 220 C114 222 111 222 111 219 L111 216 L109 218 C107 219 105 217 106 215 L110 209 C111 207 112 206 114 206 Z"
                fill={P.boneShade}
                stroke={INK}
                strokeWidth="3"
                strokeLinejoin="round"
            />

            {/* Costillar: una sola forma clara con los huecos en oscuro, así
            las costillas se leen como bandas rellenas. */}
            <path
                d="M72 150 C60 162 58 184 70 197 C82 204 112 204 124 197 C136 184 134 162 122 150 C108 144 86 144 72 150 Z"
                fill={P.bone}
                {...inked}
            />
            <path d="M70 188 C84 197 110 197 124 188 C122 196 110 201 97 201 C84 201 72 197 70 188 Z" fill={P.boneShade} />
            <path
                d="M69 162 C77 157 85 157 91 159 L91 164 C84 162 78 163 70 168 Z M67 175 C76 170 85 170 91 172 L91 177 C84 175 77 176 68 181 Z M72 188 C79 184 86 184 91 185 L91 190 C85 189 80 190 75 193 Z M125 162 C117 157 109 157 103 159 L103 164 C110 162 116 163 124 168 Z M127 175 C118 170 109 170 103 172 L103 177 C110 175 117 176 126 181 Z M122 188 C115 184 108 184 103 185 L103 190 C109 189 114 190 119 193 Z"
                fill={P.mouth}
            />

            {/* Clavícula y vértebras del cuello. */}
            <path d={bone(66, 152, 128, 152, 3.5, 5)} fill={P.bone} {...inked} />
            <path d="M89 128 h16 v9 h-16 Z M90 138 h14 v9 h-14 Z" fill={P.bone} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

            {/* Mandíbula caída: fuera del cráneo que brinca, para que se separen. */}
            <g className="hw-on">
                <path
                    d="M66 136 C66 154 80 162 97 162 C114 162 128 154 128 136 C124 141 116 141 112 138 L108 143 L103 138 L97 143 L91 138 L86 143 L82 138 C78 141 70 141 66 136 Z"
                    fill={P.bone}
                    {...inked}
                />
            </g>

            <g className="hw-hop" style={v({ "--hop": "-12px" })}>
                {/* Mandíbula cerrada y boca abierta van detrás del cráneo. */}
                <path className="hw-off" d="M68 104 C68 124 80 133 97 133 C114 133 126 124 126 104 Z" fill={P.bone} {...inked} />
                <path className="hw-on" d="M70 104 C70 132 82 148 97 148 C112 148 124 132 124 104 Z" fill={P.mouth} {...inked} />

                {/* Cráneo: redondo pero chueco, con sombra a la izquierda, rayado en la sien y una grietita
                sin puntadas (las puntadas son de Frankenstein). */}
                <path
                    d="M58 100 C40 84 38 50 58 34 C76 18 120 16 138 33 C155 49 154 84 134 101 C130 107 126 111 118 111 L72 111 C66 111 61 106 58 100 Z"
                    fill={P.bone}
                    {...inked}
                />
                <path d="M58 44 C46 60 48 86 62 100 C57 84 57 62 67 46 Z" fill={P.boneShade} />
                <path
                    d="M130 38 L138 46 M136 50 L143 56 M138 62 L145 66 M104 20 L100 30 L105 36"
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />

                {/* Cuencas oscuras; los ojos son brillitos crema que siguen al cursor. */}
                <ellipse cx="76" cy="70" rx="15" ry="17" fill={P.mouth} {...inked} />
                <ellipse cx="118" cy="68" rx="17" ry="19" fill={P.mouth} {...inked} />
                <g className="hw-off hw-eye">
                    <g className="hw-pupil" style={v({ "--pr": "5px" })}>
                        <circle cx="78" cy="72" r="6" fill={P.cream} />
                        <circle cx="72" cy="64" r="2.2" fill={P.cream} />
                        <circle cx="120" cy="70" r="6.5" fill={P.cream} />
                        <circle cx="113" cy="61" r="2.4" fill={P.cream} />
                    </g>
                </g>
                {/* Párpados en crema: la tinta no se ve dentro de la cuenca. */}
                <path
                    className="hw-blink"
                    d="M67 72 Q76 78 85 72 M108 70 Q118 77 128 70"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <g className="hw-on" fill={P.mustard} stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
                    <path d={star(76, 70, 11, 4.8)} />
                    <path d={star(118, 68, 12, 5.2)} />
                </g>

                {/* Nariz de corazón al revés. */}
                <path
                    d="M97 86 C92 83 88 92 93 96 L97 100 L101 96 C106 92 102 83 97 86 Z"
                    fill={P.mouth}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Sonrisa cosida en reposo. */}
                <path
                    className="hw-off"
                    d="M70 108 Q97 124 124 108 M78 108 L76 118 M87 112 L86 122 M97 114 L97 124 M107 112 L108 122 M116 108 L118 118"
                    fill="none"
                    stroke={INK}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                {/* Carcajada muda: dientes de arriba y mejillas. */}
                <g className="hw-on">
                    <path
                        d="M76 110 h9 v7 q-4.5 3 -9 0 Z M87 110 h9 v8 q-4.5 3 -9 0 Z M98 110 h9 v8 q-4.5 3 -9 0 Z M109 110 h9 v7 q-4.5 3 -9 0 Z"
                        fill={P.bone}
                        stroke={INK}
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    <ellipse cx="58" cy="92" rx="9" ry="5" fill={P.roseLight} opacity="0.85" />
                    <ellipse cx="138" cy="90" rx="9" ry="5" fill={P.roseLight} opacity="0.85" />
                </g>
            </g>

            {/* Chispas del brinco, en crema porque caen sobre el fondo; bajitas para que el vaivén no las saque de la caja. */}
            <g
                className="hw-on hw-pop"
                style={v({ "--o": "50% 100%" })}
                fill="none"
                stroke={P.cream}
                strokeWidth="3.5"
                strokeLinecap="round"
            >
                <path d="M150 38 L162 28" />
                <path d="M156 58 L170 56" />
                <path d="M140 20 L144 10" />
            </g>
            {/* Líneas de baile junto a la patadita (siempre visibles). */}
            <path
                d="M164 246 Q172 254 168 264 M172 240 Q182 250 178 262"
                fill="none"
                stroke={P.cream}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.8"
            />
        </g>
    );
}

const monster: MonsterDef = {
    id: "esqueleto",
    name: "Esqueleto bailarín",
    w: 186,
    h: 290,
    interactive: true,
    Art,
};

export default monster;
