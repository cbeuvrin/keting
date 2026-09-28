import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Cuervo regordete de perfil con sombrerito de copa ladeado. Es carbón sobre
// casi-negro, así que las plumas se dibujan con trazos navyLight y el borde
// lleva luz; el pico y las patas mostaza hacen el resto.
// Reacción: grazna — abre el pico con lengüita, aprieta el ojo, despliega
// las alas (que se agitan) y el sombrero pega un brinco.

// Filas de plumas en escama: arquitos encadenados, un solo path.
const scales = (rows: [number, number, number][]) => rows.map(([x, y, n]) => `M${x} ${y}` + " q5 7 10 0".repeat(n)).join(" ");

function Art() {
    return (
        <g transform="translate(0 12)">
            {/* Cola: plumas largas detrás del cuerpo. */}
            <path
                d="M58 148 C42 158 24 170 10 184 C26 186 44 178 62 166 Z M62 160 C50 174 38 184 28 196 C42 196 56 186 68 172 Z"
                fill={P.charcoal}
                {...inked}
            />
            <path d="M54 156 L20 180 M62 168 L36 190" fill="none" stroke={P.navyLight} strokeWidth="2.5" strokeLinecap="round" />

            {/* Alas abiertas: solo al graznar; esta es la de atrás y se agita desde el hombro. */}
            <g className="hw-on">
                {/* Azul noche y un pelo transparente: así se separa del ala cercana y se lee más atrás. */}
                <g className="hw-wave" style={v({ "--o": "100% 100%", "--wave": "-8deg" })} opacity="0.9">
                    <path
                        d="M66 112 C52 90 34 72 16 58 Q24 72 16 80 Q28 84 20 96 Q32 98 26 110 Q40 110 36 122 Q48 120 52 130 Z"
                        fill={P.navyDeep}
                        {...inked}
                    />
                    <path d="M62 106 C48 88 32 72 19 62" fill="none" stroke={P.navyLight} strokeWidth="3.5" strokeLinecap="round" />
                    {/* Segundo filo siguiendo los dientes: así la silueta del ala se lee contra el fondo. */}
                    <path
                        d="M20 82 Q30 86 24 96 Q34 98 30 108 Q42 110 40 120"
                        fill="none"
                        stroke={P.lilac}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path d="M52 112 L28 94 M48 122 L34 112" fill="none" stroke={P.lilac} strokeWidth="2.5" strokeLinecap="round" />
                </g>
            </g>

            {/* Patitas: tinta gruesa y mostaza encima, así el dedo queda contorneado. */}
            <path
                d="M80 176 L80 190 L68 196 M80 190 L80 197 M80 190 L90 196 M106 178 L106 190 L96 196 M106 190 L106 197 M106 190 L118 196"
                fill="none"
                stroke={INK}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M80 176 L80 190 L68 196 M80 190 L80 197 M80 190 L90 196 M106 178 L106 190 L96 196 M106 190 L106 197 M106 190 L118 196"
                fill="none"
                stroke={P.mustard}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Cuerpo y cabeza en una sola bola. */}
            <path
                d="M60 176 C38 164 30 130 38 104 C46 76 70 56 100 56 C126 56 140 76 140 100 C140 116 136 128 138 144 C140 164 124 180 100 182 C86 184 72 182 60 176 Z"
                fill={P.charcoal}
                {...inked}
            />
            {/* Sombra ciruela en la panza y la espalda, bajo el ala: da volumen a la bola. */}
            <path d="M60 176 C44 164 38 146 40 128 C48 150 62 166 84 176 C76 180 68 179 60 176 Z" fill={P.plum} opacity="0.5" />
            <path
                d="M46 156 C34 130 40 96 62 76 M100 62 C116 62 128 70 133 82"
                fill="none"
                stroke={P.navyLight}
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            {/* Plumitas erizadas en la nuca: separan la cabeza del cuerpo. Van atrás de la
            cabeza, no arriba, porque ahí las taparía el sombrero. */}
            <path d="M63 70 Q59 66 60 61 M55 78 Q50 76 48 71" fill="none" stroke={P.navyLight} strokeWidth="2.5" strokeLinecap="round" />
            {/* Escamas del pecho, a la derecha del ala: siempre visibles. */}
            <path
                d={scales([
                    [112, 124, 2],
                    [116, 138, 2],
                    [114, 152, 2],
                ])}
                fill="none"
                stroke={P.lilac}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Escamas de la panza: el ala plegada las tapa, así que solo salen cuando se despliega. */}
            <path
                className="hw-on"
                d={scales([
                    [52, 138, 8],
                    [58, 152, 7],
                    [66, 166, 5],
                ])}
                fill="none"
                stroke={P.lilac}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Ala plegada en reposo, con puntas de pluma festoneadas. */}
            <g className="hw-off">
                <path
                    d="M50 104 C70 94 104 104 114 132 C120 150 112 168 98 172 Q92 162 84 170 Q78 160 68 166 Q64 154 54 156 C44 142 42 116 50 104 Z"
                    fill={P.charcoal}
                    {...inked}
                />
                <path
                    d="M55 108 C74 102 98 110 108 128 M62 124 C76 130 88 142 94 160"
                    fill="none"
                    stroke={P.navyLight}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                {/* Puntas de pluma en el festón. */}
                <path
                    d="M95 162 L97 169 M82 160 L84 167 M67 156 L68 163"
                    fill="none"
                    stroke={P.lilac}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
            </g>

            {/* Ala cercana abierta: al graznar se extiende hacia la izquierda desde el
            hombro, por debajo de la cabeza, con el borde de fuga festoneado en plumas. */}
            <g className="hw-on">
                <g className="hw-wave" style={v({ "--o": "100% 50%", "--wave": "14deg" })}>
                    <path
                        d="M88 128 C70 110 44 100 20 104 Q30 116 26 126 Q40 126 40 136 Q54 134 56 144 Q68 140 74 148 Z"
                        fill={P.charcoal}
                        {...inked}
                    />
                    <path d="M84 124 C68 111 46 104 25 106" fill="none" stroke={P.navyLight} strokeWidth="4" strokeLinecap="round" />
                    <path
                        d="M46 114 L29 121 M58 120 L42 131 M68 126 L56 139 M76 132 L70 143"
                        fill="none"
                        stroke={P.lilac}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>
            </g>

            {/* Ojo crema brillante que sigue al cursor; párpado en lila claro. */}
            <g className="hw-off hw-eye">
                <ellipse cx="112" cy="90" rx="13" ry="15" fill={P.cream} {...inked} />
                <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                    <circle cx="115" cy="92" r="6.5" fill={INK} />
                    <circle cx="112" cy="88" r="2.4" fill={P.cream} />
                </g>
            </g>
            <path
                className="hw-blink"
                d="M100 92 Q112 101 124 92"
                fill="none"
                stroke={P.lilacLight}
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Pico cerrado. */}
            <g className="hw-off">
                <path d="M134 88 Q156 90 174 104 Q156 112 134 114 Z" fill={P.mustard} {...inked} />
                <path d="M137 103 L168 104 Q154 111 137 111 Z" fill={P.mustardDeep} />
                <path d="M137 101 L166 104" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Graznido: ojo apretado, pico abierto con lengua y ondas de sonido en crema. */}
            <g className="hw-on">
                <path
                    d="M102 82 L119 91 L102 100"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M136 94 L166 80 Q174 104 166 126 L136 112 Z" fill={P.mouth} {...inked} />
                <path d="M140 106 Q152 100 160 106 Q150 112 140 110 Z" fill={P.tongue} />
                <path d="M133 84 Q156 72 176 68 Q164 90 137 100 Z" fill={P.mustard} {...inked} />
                <path d="M136 108 Q158 114 172 134 Q152 130 133 116 Z" fill={P.mustardDeep} {...inked} />
            </g>
            <g
                className="hw-on hw-pop"
                style={v({ "--o": "0% 100%" })}
                fill="none"
                stroke={P.cream}
                strokeWidth="3.5"
                strokeLinecap="round"
            >
                <path d="M148 60 Q156 52 152 42" />
                <path d="M162 66 Q174 60 174 48" />
            </g>

            {/* Sombrerito de copa: brinca al graznar. El ladeo va en un <g> aparte. */}
            <g className="hw-hop" style={v({ "--hop": "-16px" })}>
                <g transform="rotate(-12 96 50)">
                    <path d="M80 50 L78 20 Q96 15 114 20 L112 50 Z" fill={P.plum} {...inked} />
                    <path d="M79 38 L113 38 L112 48 L80 48 Z" fill={P.rose} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M83 24 L84 34" stroke={P.lilac} strokeWidth="3" strokeLinecap="round" />
                    <path d="M68 56 Q96 64 124 56 Q126 48 118 48 L74 48 Q66 48 68 56 Z" fill={P.plum} {...inked} />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "cuervo-sombrero",
    name: "Cuervo de sombrero",
    w: 184,
    h: 212,
    interactive: true,
    Art,
};

export default monster;
