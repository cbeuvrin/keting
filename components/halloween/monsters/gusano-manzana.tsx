import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Manzana rosa apagado con un gusanito de lentes asomado por un agujero.
// Reacción: el gusano sale disparado hacia arriba, se estira, cierra los
// ojos detrás de los lentes y saca la lengua.
//
// Truco de capas: el gusano se dibuja DENTRO del agujero y encima va un
// parche de manzana que tapa su parte de abajo. Así, al saltar, nunca se le
// ve la cola (sin clipPath, que el póster no permite).

function Art() {
    return (
        <g>
            {/* Tallo y hoja: sobre el fondo, en tonos claros sobre tinta. El
            tallo va grueso con un reflejo para que no sea una rayita. */}
            <path d="M68 62 C66 50 68 42 74 34" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
            <path d="M68 62 C66 50 68 42 74 34" fill="none" stroke={P.pumpkinDeep} strokeWidth="6" strokeLinecap="round" />
            <path d="M67 56 C66.5 49 68 43 71.5 38" fill="none" stroke={P.pumpkin} strokeWidth="2" strokeLinecap="round" />
            <g className="hw-sway" style={v({ "--o": "100% 100%", "--sw": "6deg", "--sd": "3.6s" })}>
                <path d="M70 48 C58 34 40 32 28 42 C40 52 56 56 70 48 Z" fill={P.moss} {...inked} />
                <path d="M66 48 C54 44 44 42 34 42" fill="none" stroke={P.sage} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Manzana: dos lomos arriba con el hundido del tallo. */}
            <path
                d="M70 62 C84 50 116 48 128 68 C142 92 132 128 104 136 C92 140 82 136 72 138 C60 140 46 138 36 132 C10 118 6 84 22 66 C34 52 56 52 70 62 Z"
                fill={P.rose}
                {...inked}
            />
            <path d="M128 72 C140 96 130 126 104 134 C96 136 90 136 84 135 C112 124 128 104 128 72 Z" fill={P.roseDeep} />
            <path d="M34 72 C24 84 22 100 26 112" fill="none" stroke={P.cream} strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
            {/* Manchita pasada, puntitos de manzana, rayado y línea de contorno
            en la sombra. */}
            <path d="M43 101 C46 98 52 99 54 102 C55.5 105 51 108.5 47 107.5 C43 107 41 104 43 101 Z" fill={P.roseDeep} opacity="0.6" />
            <path
                d="M44 90 h0 M56 108 h0 M38 118 h0 M64 124 h0 M76 90 h0 M84 116 h0"
                stroke={P.roseLight}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M108 126 L112 122 M113 119 L117 115 M117.5 112 L121 108.5"
                fill="none"
                stroke={INK}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M122 84 C127 98 125 112 116 122 M112 128 L106 131"
                fill="none"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.7"
            />

            {/* Agujero. */}
            <ellipse cx="100" cy="80" rx="15" ry="8" fill={P.mouth} {...inked} />

            {/* Gusano: salta y se estira desde el agujero. */}
            <g className="hw-hop" style={v({ "--hop": "-12px" })}>
                <g className="hw-stretch">
                    {/* Cuerpo de tubo: tinta ancha abajo y salvia encima. */}
                    <path d="M100 100 C100 76 97 64 103 50" fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" />
                    <path d="M100 100 C100 76 97 64 103 50" fill="none" stroke={P.sage} strokeWidth="13" strokeLinecap="round" />
                    {/* Anillos del cuerpo, en tinta para que se lean chiquitos. El de
                    abajo asoma en el agujero y se ve completo al saltar. */}
                    <path
                        d="M94 84 Q100 87 106 84 M94 72 Q100 75 106 72 M94 62 Q100 65 106 62"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.6"
                    />
                    {/* Cabeza. */}
                    <path
                        d="M104 26 C116 26 120 36 118 44 C116 52 110 55 102 54 C92 53 88 46 89 39 C90 31 96 26 104 26 Z"
                        fill={P.sage}
                        {...inked}
                    />
                    <path d="M92 46 C94 52 100 54 106 54" fill="none" stroke={P.moss} strokeWidth="3" strokeLinecap="round" />

                    {/* Lentes: los cristales se quedan, lo de adentro cambia. Cada
                    forma lleva los dos lentes. Debajo, el cristal claro con el
                    borde de tinta por fuera; encima, el tinte azul y el armazón
                    mostaza, que es lo que hace que se lean como lentes y no
                    como ojos saltones. */}
                    <path
                        d="M90.5 38 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0 M105.5 38 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0"
                        fill={P.eyeWhite}
                        stroke={INK}
                        strokeWidth="6"
                    />
                    <path
                        d="M90.5 38 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0 M105.5 38 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0"
                        fill={P.sky}
                        fillOpacity="0.35"
                        stroke={P.mustardDeep}
                        strokeWidth="3"
                    />
                    {/* Puente y patillas cortas hacia la cabeza. */}
                    <path
                        d="M103.5 37.5 L105.5 37.5 M90.5 37 L88 36 M118.5 37 L119.5 36"
                        fill="none"
                        stroke={P.mustardDeep}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <g className="hw-off hw-eye">
                        <g className="hw-pupil" style={v({ "--pr": "2px" })}>
                            <circle cx="98" cy="39" r="2.8" fill={INK} />
                            <circle cx="113" cy="39" r="2.8" fill={INK} />
                        </g>
                    </g>
                    <path
                        className="hw-blink"
                        d="M93 39 Q97 42 101 39 M108 39 Q112 42 116 39"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                    <path className="hw-off" d="M101 47 Q105 50 109 47" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

                    {/* Reacción: ojos apretados ><, boca abierta y lengua. */}
                    <g className="hw-on">
                        <path
                            d="M93 36 L99 39 L93 42 M116 36 L110 39 L116 42"
                            fill="none"
                            stroke={INK}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M99 46 Q105 45 111 46 Q110 52 105 52 Q100 52 99 46 Z"
                            fill={P.mouth}
                            stroke={INK}
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </g>
                    {/* Reflejo del cristal, encima de todo lo de adentro. */}
                    <path d="M93 35 L96 33 M108 35 L111 33" fill="none" stroke={P.cream} strokeWidth="1.8" strokeLinecap="round" />
                    <g className="hw-tongue">
                        <path
                            d="M102 50 Q102 60 105 60 Q108 60 108 50 Z"
                            fill={P.tongue}
                            stroke={INK}
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </g>
                </g>
            </g>

            {/* Parche de manzana que tapa la parte de abajo del gusano, y el
            borde inferior del agujero encima. */}
            {/* Angosto a propósito: si llega a la sombra de la derecha se nota
            el escalón. */}
            <path d="M85 80 Q100 96 115 80 L114 110 Q100 118 84 110 Z" fill={P.rose} />
            <path d="M85 80 Q100 96 115 80" fill="none" {...inked} strokeWidth="3.5" />

            {/* Susto-gusto: líneas de impulso en crema sobre el fondo. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })} fill="none" stroke={P.cream} strokeWidth="3" strokeLinecap="round">
                <path d="M80 30 L72 22" />
                <path d="M126 30 L134 22" />
                <path d="M128 44 L138 42" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "gusano-manzana",
    name: "Gusano de manzana",
    w: 150,
    h: 144,
    interactive: true,
    Art,
};

export default monster;
