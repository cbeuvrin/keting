import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Araña gorda y peluda, casi una bola de pelo con patas. Reacción: le da
// cosquillas — agita las ocho patas, cierra los seis ojitos y abre los
// colmillos en una risa.

// Cada pata es un trazo doble (tinta gruesa debajo, ciruela encima): dos
// patas por path en vez de contornear cada una, para no gastar formas.
// Cada pata tiene rodilla (dos tramos de largo distinto con quiebre marcado)
// y las cuatro de cada lado se abren en abanico: arriba, de lado, atrás, abajo.
// El lado derecho es el espejo del izquierdo (x → 220 − x).
const LEFT_FRONT = "M72 86 Q60 48 38 30 Q24 38 12 60 M64 100 Q46 78 28 80 Q16 92 8 116";
const LEFT_BACK = "M66 120 Q44 110 28 118 Q18 138 24 166 M80 132 Q66 138 50 142 Q42 152 44 168";
const RIGHT_FRONT = "M148 86 Q160 48 182 30 Q196 38 208 60 M156 100 Q174 78 192 80 Q204 92 212 116";
const RIGHT_BACK = "M154 120 Q176 110 192 118 Q202 138 196 166 M140 132 Q154 138 170 142 Q178 152 176 168";

function Leg({ d, hair }: { d: string; hair: string }) {
    return (
        <>
            <path d={d} fill="none" stroke={INK} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} fill="none" stroke={P.plum} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pelitos hacia afuera de la pata: en lila, la tinta no se vería sobre el fondo.
            Nacen sobre el ciruela (a 3.5 del eje) para que no floten separados por la tinta. */}
            <path d={hair} fill="none" stroke={P.lilac} strokeWidth="2.5" strokeLinecap="round" />
        </>
    );
}

function Art() {
    return (
        // Corrido a la derecha y abajo para que las puntas no se salgan de la caja al agitarse.
        <g transform="translate(8 4)">
            {/* Patas detrás del cuerpo, en cuatro grupos que se agitan con ángulos distintos. */}
            <g className="hw-wave" style={v({ "--o": "100% 80%", "--wave": "14deg" })}>
                <Leg
                    d={LEFT_FRONT}
                    hair="M56.5 58 L48.5 62.5 M44.5 31.5 L51 25 M22 39 L14.5 34.5 M10 56 L2.5 51.5 M41 85.5 L37.5 94 M15 91.5 L7.5 86.5 M5.5 112 L-3 110.5"
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "100% 10%", "--wave": "-12deg" })}>
                <Leg
                    d={LEFT_BACK}
                    hair="M42 118 L42 127 M19.5 132.5 L10.5 131 M19 155.5 L10 155.5 M63 142 L66.5 150.5 M42 150 L33.5 146.5 M40 165 L31.5 166.5"
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "0% 80%", "--wave": "-16deg" })}>
                <Leg
                    d={RIGHT_FRONT}
                    hair="M163.5 58 L171.5 62.5 M175.5 31.5 L169 25 M198 39 L205.5 34.5 M210 56 L217.5 51.5 M179 85.5 L182.5 94 M205 91.5 L212.5 86.5 M214.5 112 L223 110.5"
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "0% 10%", "--wave": "10deg" })}>
                <Leg
                    d={RIGHT_BACK}
                    hair="M178 118 L178 127 M200.5 132.5 L209.5 131 M201 155.5 L210 155.5 M157 142 L153.5 150.5 M178 150 L186.5 146.5 M180 165 L188.5 166.5"
                />
            </g>

            {/* Cuerpo: bola con borde de pelo en zigzag irregular. */}
            <path
                d="M110 41 L116 52 L124 47 L128 53 L138 49 L139 58 L150 51 L149 65 L158 63 L160 71 L169 71 L163 82 L175 83 L169 91 L180 96 L170 102 L178 109 L167 112 L174 120 L165 123 L170 133 L159 133 L164 143 L151 141 L152 153 L140 146 L137 154 L128 150 L124 159 L116 155 L110 164 L104 155 L95 163 L92 150 L83 157 L80 146 L70 152 L69 141 L60 144 L61 133 L51 131 L55 123 L48 120 L53 112 L44 108 L49 102 L44 96 L53 92 L45 84 L57 81 L51 72 L60 70 L61 61 L69 62 L71 55 L79 56 L83 46 L91 51 L95 43 L104 50 Z"
                fill={P.plum}
                {...inked}
            />
            {/* Lado en sombra abajo a la derecha: la bola tiene volumen, no es un plano. */}
            <path d="M170 92 C174 116 162 140 128 151 C150 138 158 118 158 96 Z" fill={INK} opacity="0.3" />
            {/* Banda de luz arriba a la izquierda, con borde interior en picos de pelo que
            se cierra en curva, y filo de luz abajo a la derecha sobre la sombra. */}
            <path d="M58 100 C56 74 76 56 102 52 L96 60 L90 58 L86 66 L78 68 L76 78 L70 82 Q66 92 58 100 Z" fill={P.lilacDeep} />
            <path d="M166 106 C168 122 158 138 140 146" fill="none" stroke={P.lilacDeep} strokeWidth="4" strokeLinecap="round" />
            {/* Mechones de pelo dibujados y sombra del lado derecho. */}
            <path
                d="M60 118 Q64 124 62 132 M74 136 Q78 142 76 148 M150 60 Q148 66 152 72 M160 100 Q166 106 164 114 M152 126 Q156 132 152 140 M136 136 Q140 142 136 148"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M92 146 Q94 152 90 156 M124 146 Q122 152 126 156"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Racimo de seis ojitos: dos grandes, dos medianos y dos chiquitos arriba. */}
            <g className="hw-off hw-eye" style={v({ "--bd": "2.1s" })}>
                <g fill={P.irisPink} {...inked} strokeWidth="3">
                    <ellipse cx="96" cy="98" rx="11" ry="12" />
                    <ellipse cx="125" cy="97" rx="11" ry="12" />
                    <ellipse cx="77" cy="86" rx="7" ry="7.5" />
                    <ellipse cx="144" cy="85" rx="7" ry="7.5" />
                    <ellipse cx="102" cy="75" rx="5.5" ry="6" />
                    <ellipse cx="120" cy="74" rx="5.5" ry="6" />
                </g>
                <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                    <g fill={INK}>
                        <circle cx="97" cy="100" r="5.5" />
                        <circle cx="126" cy="99" r="5.5" />
                        <circle cx="78" cy="87" r="3.5" />
                        <circle cx="145" cy="86" r="3.5" />
                        <circle cx="102" cy="76" r="2.8" />
                        <circle cx="120" cy="75" r="2.8" />
                    </g>
                    <g fill={P.cream}>
                        <circle cx="94" cy="96" r="2" />
                        <circle cx="123" cy="95" r="2" />
                    </g>
                </g>
            </g>
            {/* Párpados del parpadeo en reposo, en lila claro: la tinta no se lee sobre ciruela. */}
            <path
                className="hw-blink"
                d="M85 99 Q96 107 107 99 M114 98 Q125 106 136 98 M70 87 Q77 92 84 87 M137 86 Q144 91 151 86 M97 76 Q102 80 107 76 M115 75 Q120 79 125 75"
                fill="none"
                stroke={P.lilacLight}
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            {/* Boquita cerrada con colmillitos juntos. */}
            <g className="hw-off">
                <path d="M98 118 Q110 124 122 118" fill="none" {...inked} strokeWidth="3" />
                <path d="M103 120 L106 130 L109 121 M111 121 L114 130 L117 120" fill={P.bone} {...inked} strokeWidth="2.5" />
            </g>

            {/* Cosquillas: ojos cerrados de risa (arcos hacia arriba), colmillos abiertos y rubor. */}
            <g className="hw-on">
                <path
                    d="M85 102 Q96 90 107 102 M114 101 Q125 89 136 101 M70 89 Q77 82 84 89 M137 88 Q144 81 151 88 M97 78 Q102 73 107 78 M115 77 Q120 72 125 77"
                    fill="none"
                    stroke={P.lilacLight}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
                <path d="M96 116 C100 114 120 114 124 116 C126 132 94 132 96 116 Z" fill={P.mouth} {...inked} strokeWidth="3" />
                <path d="M102 124 Q110 118 118 124 Q114 128 110 128 Q106 128 102 124 Z" fill={P.tongue} />
                <path d="M92 114 L96 126 L101 116 Z M119 116 L124 126 L128 114 Z" fill={P.bone} {...inked} strokeWidth="2.5" />
                <ellipse cx="70" cy="110" rx="8" ry="4.5" fill={P.roseLight} opacity="0.8" />
                <ellipse cx="150" cy="109" rx="8" ry="4.5" fill={P.roseLight} opacity="0.8" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "arana-peluda",
    name: "Araña peluda",
    w: 236,
    h: 182,
    interactive: true,
    Art,
};

export default monster;
