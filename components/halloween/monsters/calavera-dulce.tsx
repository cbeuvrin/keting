import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Calaverita de azúcar (Día de Muertos): tierna, llena de florecitas y
// puntitos de glaseado. La mandíbula es una pieza aparte para que se caiga.
// Reacción: se le cae la mandíbula (se ven los dientes y la lengüita),
// le salen corazones en las cuencas y tiembla de gusto.

// Punto de glaseado: con linecap round, "M x y h0" pinta un punto; así un
// solo path lleva muchos puntitos y no se come el presupuesto de formas.
const dot = { fill: "none", strokeLinecap: "round" } as const;

function Art() {
    return (
        // Todo sube 4 unidades: la mandíbula caída y el temblor necesitan aire abajo.
        <g transform="translate(0 -4)">
            <g className="hw-sway" style={v({ "--o": "50% 100%", "--sw": "2.5deg", "--sd": "5.2s" })}>
                <g className="hw-jiggle" style={v({ "--o": "50% 80%" })}>
                    {/* Hueco de la boca: detrás de todo, solo se ve cuando cae la mandíbula. */}
                    <path d="M60 140 Q100 150 140 140 L140 164 Q100 174 60 164 Z" fill={P.mouth} {...inked} />
                    {/* Dientes de arriba: cuelgan del cráneo, tapados por la mandíbula en reposo. */}
                    <path
                        d="M62 144 Q100 154 138 144 L137 153 Q130 158 123 154 Q116 159 108 155 Q100 159 92 155 Q84 159 77 154 Q70 158 63 153 Z"
                        fill={P.bone}
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />

                    {/* Cráneo: frente ancha, pómulos marcados y base angosta. */}
                    <path
                        d="M100 12 C146 9 181 38 182 84 C183 108 174 124 158 130 C154 134 152 140 150 146 Q100 154 50 146 C48 140 46 134 42 130 C26 124 17 108 18 84 C19 40 54 15 100 12 Z"
                        fill={P.bone}
                        {...inked}
                    />
                    <path d="M36 58 C24 80 24 108 40 124 C45 128 48 125 45 120 C33 104 33 80 44 62 Z" fill={P.boneShade} />

                    {/* Florecita de la frente y arco de puntitos de glaseado. */}
                    <path
                        d="M100 40 C96.1 31.9 100 28 100 28 C100 28 103.9 31.9 100 40 Z M100 40 C105.1 32.6 110.4 34 110.4 34 C110.4 34 109 39.3 100 40 Z M100 40 C109 40.7 110.4 46 110.4 46 C110.4 46 105.1 47.4 100 40 Z M100 40 C103.9 48.1 100 52 100 52 C100 52 96.1 48.1 100 40 Z M100 40 C94.9 47.4 89.6 46 89.6 46 C89.6 46 91 40.7 100 40 Z M100 40 C91 39.3 89.6 34 89.6 34 C89.6 34 94.9 32.6 100 40 Z"
                        fill={P.teal}
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <circle cx="100" cy="40" r="3.6" fill={P.mustard} stroke={INK} strokeWidth="2" />
                    <path
                        d="M77.7 34.6h0M84.2 26.9h0M94.3 22.6h0M105.7 22.6h0M115.8 26.9h0M122.3 34.6h0"
                        {...dot}
                        stroke={P.rose}
                        strokeWidth="5"
                    />

                    {/* Pétalos de glaseado alrededor de las cuencas. */}
                    <path
                        d="M93.5 93.6 Q96.2 104.9 85.6 108.6 Q81.5 119.3 71 115.8 Q61.6 121.7 55.2 112.4 Q44.1 111.3 44.3 99.6 Q35.8 91.9 42.5 82.4 Q39.8 71.1 50.4 67.4 Q54.5 56.7 65 60.2 Q74.4 54.3 80.8 63.6 Q91.9 64.7 91.7 76.4 Q100.2 84.1 93.5 93.6 Z"
                        fill={P.roseLight}
                        stroke={INK}
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M157.5 82.4 Q164.2 91.9 155.7 99.6 Q155.9 111.3 144.8 112.4 Q138.4 121.7 129 115.8 Q118.5 119.3 114.4 108.6 Q103.8 104.9 106.5 93.6 Q99.8 84.1 108.3 76.4 Q108.1 64.7 119.2 63.6 Q125.6 54.3 135 60.2 Q145.5 56.7 149.6 67.4 Q160.2 71.1 157.5 82.4 Z"
                        fill={P.tealLight}
                        stroke={INK}
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    {/* Puntitos en los pómulos. */}
                    <path d="M54.7 123.3h0M46.3 118.3h0M39.5 111.2h0M34.7 102.5h0" {...dot} stroke={P.teal} strokeWidth="5" />
                    <path d="M165.3 102.4h0M160.5 111.2h0M153.7 118.3h0M145.4 123.3h0" {...dot} stroke={P.rose} strokeWidth="5" />

                    {/* Nariz de triángulo redondeado; los corazones se guardan para la reacción. */}
                    <path
                        d="M100 129 C97 125 91 119 92 116 Q100 109 108 116 C109 119 103 125 100 129 Z"
                        fill={P.mouth}
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />

                    {/* Cempasúchil de un lado: dos coronas de pétalos rizados y hojita. */}
                    <path
                        d="M146 44 C136 50 126 50 120 46 C128 40 138 40 146 44 Z"
                        fill={P.moss}
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M170 32 Q175.6 37.7 167.8 39.6 Q170 48.1 161.8 44.7 Q158.7 50.5 154 45.9 Q146.6 52.5 146.8 42.6 Q140.7 41.8 142.6 35.9 Q133.8 32 142.6 28.1 Q139.7 21.5 146.8 21.4 Q147.5 13.3 154 18.1 Q159 11 161.8 19.3 Q168.3 17.8 167.8 24.4 Q177.6 25.6 170 32 Z"
                        fill={P.pumpkin}
                        {...inked}
                        strokeWidth="3"
                    />
                    <path
                        d="M163.4 35.1 Q165.3 41.4 159 39.4 Q155.9 45.9 152.9 39.4 Q147.5 40.4 148.6 35 Q141.3 31.9 148.6 28.9 Q147.8 23.7 153 24.6 Q156.1 17.5 159.1 24.6 Q164.9 23.3 163.4 29 Q169.3 32.1 163.4 35.1 Z"
                        fill={P.mustard}
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <circle cx="156" cy="32" r="3.4" fill={P.mustardDeep} stroke={INK} strokeWidth="2" />

                    {/* Cuencas en reposo con brillitos que siguen al cursor. */}
                    <g className="hw-off hw-eye">
                        <path
                            d="M68 68 C82 68 88 80 86 93 C84 104 77 108 68 108 C58 108 50 101 50 90 C50 78 57 68 68 68 Z"
                            fill={P.mouth}
                            {...inked}
                        />
                        <path
                            d="M132 68 C118 68 112 80 114 93 C116 104 123 108 132 108 C142 108 150 101 150 90 C150 78 143 68 132 68 Z"
                            fill={P.mouth}
                            {...inked}
                        />
                        <g className="hw-pupil" style={v({ "--pr": "5px" })}>
                            <circle cx="72" cy="84" r="6.5" fill={P.cream} />
                            <circle cx="63" cy="96" r="2.6" fill={P.cream} />
                            <circle cx="136" cy="84" r="6.5" fill={P.cream} />
                            <circle cx="127" cy="96" r="2.6" fill={P.cream} />
                        </g>
                    </g>
                    <g className="hw-blink" fill="none" {...inked}>
                        <path d="M52 90 Q68 102 84 90" />
                        <path d="M116 90 Q132 102 148 90" />
                    </g>

                    {/* Reacción: cuencas con corazoncitos que brotan. */}
                    <g className="hw-on">
                        <path
                            d="M68 68 C82 68 88 80 86 93 C84 104 77 108 68 108 C58 108 50 101 50 90 C50 78 57 68 68 68 Z"
                            fill={P.mouth}
                            {...inked}
                        />
                        <path
                            d="M132 68 C118 68 112 80 114 93 C116 104 123 108 132 108 C142 108 150 101 150 90 C150 78 143 68 132 68 Z"
                            fill={P.mouth}
                            {...inked}
                        />
                    </g>
                    <g className="hw-on hw-pop" style={v({ "--o": "50% 50%" })}>
                        <path
                            d="M68 102 C56 94 54 84 60 80 C64 78 67 80 68 84 C69 80 72 78 76 80 C82 84 80 94 68 102 Z"
                            fill={P.rose}
                            stroke={INK}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                    </g>
                    <g className="hw-on hw-pop" style={v({ "--o": "50% 50%" })}>
                        <path
                            d="M132 102 C120 94 118 84 124 80 C128 78 131 80 132 84 C133 80 136 78 140 80 C146 84 144 94 132 102 Z"
                            fill={P.rose}
                            stroke={INK}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                    </g>

                    {/* Mandíbula: al reaccionar baja y deja ver dientes y lengüita. */}
                    <g className="hw-hop" style={v({ "--hop": "18px" })}>
                        {/* Dientes de abajo: asoman sobre el borde de la mandíbula para que se lea como quijada. */}
                        <path
                            className="hw-on"
                            d="M64 150 Q100 158 136 150 L135 144 Q129 139 123 144 Q116 139 108 143 Q100 139 92 143 Q84 139 77 144 Q71 139 65 144 Z"
                            fill={P.bone}
                            stroke={INK}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M50 146 Q100 154 150 146 C152 158 146 166 132 170 Q100 178 68 170 C54 166 48 158 50 146 Z"
                            fill={P.bone}
                            {...inked}
                        />
                        <path d="M56 154 C58 162 64 167 74 170 Q70 164 66 156 Z" fill={P.boneShade} />
                        <path d="M76 162h0M88 165h0M100 166h0M112 165h0M124 162h0" {...dot} stroke={P.teal} strokeWidth="4.5" />
                        {/* Lengüita: sale del hueco y cuelga por encima del labio de la mandíbula. */}
                        <g className="hw-on">
                            <path
                                d="M86 146 Q100 142 114 146 C116 160 110 170 100 170 C90 170 84 160 86 146 Z"
                                fill={P.tongue}
                                stroke={INK}
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                            />
                            <path d="M100 151 L100 161" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                        </g>
                    </g>
                    {/* Sonrisa cosida: la costura se curva para que en reposo sonría. */}
                    <path
                        fill="none"
                        className="hw-off"
                        d="M60 145 Q100 163 140 145 M66 141.5 L66 153.5 M78 145.3 L78 157.3 M89 147.3 L89 159.3 M100 148 L100 160 M111 147.3 L111 159.3 M122 145.3 L122 157.3 M134 141.5 L134 153.5"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "calavera-dulce",
    name: "Calaverita de azúcar",
    w: 200,
    h: 200,
    interactive: true,
    Art,
};

export default monster;
