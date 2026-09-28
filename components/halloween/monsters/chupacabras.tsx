import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Chupacabras tierno, agachado en cuatro patas y mirando de frente. Travieso,
// no aterrador: cabezona, orejotas, ojos de gato dorados y costillitas.
// Cuerpo ciruela oscuro, así que lleva banda de luz en el lomo y hocico claro
// para que la cara se lea contra el negro.
// Reacción: se le erizan las púas (crecen y salen púas extra), menea las
// orejas, cierra los ojos feliz y saca la lengua con una sonrisa chueca.

const legSolid = { fill: P.plum, ...inked, strokeWidth: 3.5 } as const;

function Art() {
    return (
        <g>
            {/* Cola delgada detrás de todo; la punta de púa se menea al reaccionar. */}
            <g className="hw-wave" style={v({ "--o": "0% 100%", "--wave": "-18deg" })}>
                <path d="M168 120 C194 118 206 98 198 74" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
                <path d="M168 120 C194 118 206 98 198 74" fill="none" stroke={P.plum} strokeWidth="5.5" strokeLinecap="round" />
                {/* Filo de luz por fuera de la curva: sin él la cola se pierde en el negro. */}
                <path d="M170 121.5 C196 119.5 208 98 200 75" fill="none" stroke={P.lilacDeep} strokeWidth="2" strokeLinecap="round" />
                <path d="M190 80 L197 54 L209 76 Q199 70 190 80 Z" fill={P.lilac} {...inked} strokeWidth="3" />
            </g>

            {/* Púas extra que salen al erizarse (entre las normales, más altas). */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                <path
                    d="M103 90 L100 46 L114 84 Z M119 84 L122 38 L131 82 Z M136 82 L146 40 L149 84 Z M152 86 L168 48 L165 92 Z"
                    fill={P.lilacLight}
                    {...inked}
                    strokeWidth="3"
                />
            </g>
            {/* Fila de púas del lomo, con rayado. Se estiran hacia arriba al erizarse. */}
            <g className="hw-stretch">
                <path
                    d="M92 94 Q92 76 94 60 Q104 74 110 88 Z M108 86 Q110 68 114 50 Q122 66 126 82 Z M124 82 Q128 64 134 48 Q140 64 142 82 Z M140 83 Q146 66 155 52 Q158 70 157 86 Z M155 90 Q162 76 173 62 Q174 80 170 96 Z"
                    fill={P.lilac}
                    {...inked}
                    strokeWidth="3.5"
                />
                <path
                    d="M97 82 L102 78 M97 90 L104 85 M113 70 L119 66 M113 79 L121 74 M129 66 L136 63 M129 76 L138 72 M147 70 L154 68 M146 79 L155 76 M163 80 L169 78 M162 89 L168 87"
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </g>

            {/* Patas del fondo: más oscuras que las cercanas para que se queden atrás,
            con un filo lila al frente para que no se pierdan en el negro. Tienen
            codo/corvejón: muslo ancho arriba, espinilla delgada y pie. */}
            <path
                d="M92 118 C86 134 90 146 96 152 L94 166 Q93 172 101 172 L109 172 Q111 167 104 165 L106 150 C104 140 106 128 108 118 Z M162 124 C160 140 168 148 176 152 L172 166 Q171 172 179 172 L187 172 Q189 167 182 165 L186 150 C184 140 182 130 178 124 Z"
                fill={P.charcoal}
                {...inked}
                strokeWidth="3.5"
            />
            <path
                d="M93 126 C90 136 92 145 97 151 L96 163 M165 132 C165 141 170 147 176 150 L173 163"
                fill="none"
                stroke={P.lilac}
                strokeWidth="3"
                opacity="0.8"
                strokeLinecap="round"
            />

            {/* Cuerpo flaco con banda de luz en el lomo y costillitas dibujadas. */}
            <path
                d="M84 124 C80 98 100 80 130 80 C158 80 178 96 176 118 C174 136 156 144 130 144 C104 144 86 140 84 124 Z"
                fill={P.plum}
                {...inked}
            />
            <path d="M98 92 C114 84 148 82 168 100" fill="none" stroke={P.lilacDeep} strokeWidth="5" strokeLinecap="round" />
            <path
                d="M108 102 Q113 116 108 132 M119 100 Q124 116 119 134 M130 100 Q135 116 130 135"
                fill="none"
                stroke={P.lilac}
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            {/* Pelo erizado de la panza en zigzag (el anca tapa el final). */}
            <path
                d="M94 134 l4 5 l4 -4 l4 5 l4 -4 l4 5 l4 -4 l4 5 l4 -4 l4 5 l4 -4 l4 5 l4 -4"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {/* Anca y pata trasera cercana. */}
            <path
                d="M146 140 C144 150 150 156 158 158 L150 166 Q147 172 155 172 L163 172 Q165 167 159 165 L167 156 C166 148 162 142 160 138 Z"
                {...legSolid}
            />
            <path d="M142 112 C146 100 170 100 176 116 C180 132 172 148 158 150 C150 148 146 140 144 130 Z" fill={P.plum} {...inked} />
            <path
                d="M150 112 l5 4 M160 108 l5 4 M164 120 l5 4 M152 126 l5 4"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Pata delantera cercana, que nace del pecho (no de la barbilla). */}
            <path
                d="M58 118 C52 136 56 148 62 154 L60 168 Q59 173 68 173 L76 172 Q78 167 70 165 L72 150 C70 140 72 128 74 120 Z"
                {...legSolid}
            />
            {/* Hombro que une la pata al cuerpo, con mechón de pelo en el pecho. */}
            <path d="M66 118 C62 132 70 140 86 140 C96 138 100 128 96 118 Z" fill={P.plum} {...inked} />
            <path
                d="M70 131 L74 136 L78 131 L82 137 L86 131 L90 136"
                fill="none"
                stroke={P.lilacLight}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Deditos en lila claro: la tinta se perdería sobre la pata oscura. */}
            <path
                d="M64 168 l0 4 M68.5 168 l0 4 M73 168 l0 4 M154 167 l0 4 M158.5 167 l0 4 M163 167 l0 4 M100 168 l0 4 M104 168 l0 4 M178 168 l0 4 M182 168 l0 4"
                stroke={P.lilacLight}
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Orejotas detrás de la cabeza; se menean desde la base. */}
            <g className="hw-wave" style={v({ "--o": "100% 100%", "--wave": "-18deg" })}>
                <path d="M42 54 C28 42 14 28 6 12 C26 16 44 30 54 44 Z" fill={P.plum} {...inked} />
                <path d="M38 47 C29 38 21 30 16 22 C28 26 38 34 45 43 Z" fill={P.roseDeep} />
            </g>
            <g className="hw-wave" style={v({ "--o": "0% 100%", "--wave": "18deg" })}>
                <path d="M82 44 C94 30 108 18 124 10 C120 28 108 44 94 56 Z" fill={P.plum} {...inked} />
                <path d="M89 44 C98 34 107 26 116 20 C113 30 104 40 95 49 Z" fill={P.roseDeep} />
            </g>

            {/* Cabezota. */}
            <path
                d="M24 86 C20 58 40 38 66 38 C92 38 112 56 110 84 C108 104 98 118 84 124 C74 130 58 130 48 124 C32 116 26 104 24 86 Z"
                fill={P.plum}
                {...inked}
            />
            <path d="M34 66 C40 52 52 45 66 44" fill="none" stroke={P.lilacDeep} strokeWidth="4" strokeLinecap="round" />
            {/* Hocico claro con fosas nasales: donde vive la expresión. */}
            <path
                d="M42 102 C42 92 55 89 67 91 C79 89 94 92 94 102 C94 116 82 124 67 124 C53 124 42 116 42 102 Z"
                fill={P.lilacLight}
                {...inked}
                strokeWidth="3.5"
            />
            <path d="M60 98 l0 0 M74 98 l0 0" stroke={INK} strokeWidth="5" strokeLinecap="round" />

            {/* Ojotes de gato dorados. */}
            <g className="hw-off hw-eye">
                <ellipse cx="48" cy="77" rx="17" ry="19" fill={P.irisGold} {...inked} />
                <ellipse cx="86" cy="77" rx="17" ry="19" fill={P.irisGold} {...inked} />
                <g className="hw-pupil" style={v({ "--pr": "5px" })}>
                    <ellipse cx="50" cy="79" rx="3.6" ry="12" fill={INK} />
                    <ellipse cx="88" cy="79" rx="3.6" ry="12" fill={INK} />
                    <circle cx="43" cy="71" r="3.4" fill={P.cream} />
                    <circle cx="81" cy="71" r="3.4" fill={P.cream} />
                </g>
            </g>
            {/* Cejas chuecas (una arriba, otra abajo): la cara de "algo trama". Van
            en lila claro porque la tinta no se ve sobre la cabeza oscura. */}
            <path
                className="hw-off"
                d="M33 52 Q46 51 60 60 M74 54 Q88 42 103 49"
                fill="none"
                stroke={P.lilacLight}
                strokeWidth="4"
                strokeLinecap="round"
            />
            {/* Párpados con bajo-trazo lila claro: la tinta sola no se ve sobre el ciruela. */}
            <g className="hw-blink" fill="none" strokeLinecap="round">
                <path d="M34 79 Q48 88 62 79 M72 79 Q86 88 100 79" stroke={P.lilacLight} strokeWidth="6" />
                <path d="M34 79 Q48 88 62 79 M72 79 Q86 88 100 79" stroke={INK} strokeWidth="4" />
            </g>
            {/* Sonrisita chueca con dos colmillitos. */}
            <g className="hw-off">
                <path
                    d="M58 111 L60 118 L63 112 Z M75 110 L77 117 L79 109 Z"
                    fill={P.bone}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path d="M52 108 Q64 115 84 105" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
            </g>

            {/* Feliz: ojos cerrados en arco, boca chueca abierta con colmillos. */}
            <g className="hw-on">
                <path d="M35 82 Q48 67 61 82 M73 82 Q86 67 99 82" fill="none" stroke={P.lilacLight} strokeWidth="6" strokeLinecap="round" />
                <path d="M35 82 Q48 67 61 82 M73 82 Q86 67 99 82" fill="none" {...inked} />
                <path
                    d="M34 60 Q46 52 58 58 M76 58 Q88 52 100 60"
                    fill="none"
                    stroke={P.lilacLight}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <path d="M48 104 Q66 110 88 99 Q84 124 64 124 Q50 120 48 104 Z" fill={P.mouth} {...inked} strokeWidth="3.5" />
                <path
                    d="M56 107 L58 115 L62 108 Z M76 105 L79 113 L81 103 Z"
                    fill={P.bone}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <ellipse cx="36" cy="100" rx="7" ry="4" fill={P.roseLight} opacity="0.8" />
                <ellipse cx="100" cy="98" rx="7" ry="4" fill={P.roseLight} opacity="0.8" />
            </g>
            {/* Lengua que cuelga de lado (va sobre el hocico y el fondo: rosa con tinta). */}
            <g className="hw-tongue">
                <path d="M60 118 C58 130 62 140 70 140 C78 140 80 130 76 116 Z" fill={P.tongue} {...inked} strokeWidth="3" />
                <path d="M68 122 L69 134" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "chupacabras",
    name: "Chupacabras",
    w: 220,
    h: 180,
    interactive: true,
    Art,
};

export default monster;
