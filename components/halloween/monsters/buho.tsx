import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Búho verde azulado parado en una ramita. Todo cabeza y ojos, con penachos
// de tres puntas en vez de orejas lisas (si no, se lee como gato), un copetito
// en la coronilla y la panza con escamas sueltas y desiguales, no un estampado.
// Reacción: se derrite de gusto — ladea la cabeza, cierra los ojos, se
// sonroja y se esponja (se aplasta y le salen plumas por los lados).

function Art() {
    return (
        <g>
            {/* Ramita con una hoja colgando por debajo, lejos de las plumas esponjadas;
                de paso llena el hueco de abajo de la caja. No se mueve con el búho. */}
            <path d="M104 132 C110 140 116 143 124 143 C124 136 118 131 110 130 Z" fill={P.sage} {...inked} strokeWidth="3" />
            <path d="M4 128 C36 124 88 128 126 120 L127 130 C92 138 40 136 5 139 Z" fill={P.moss} {...inked} />

            {/* Búho: ladeo (pivote en las patas) por fuera, esponjado por dentro. */}
            <g className="hw-wave" style={v({ "--o": "50% 100%", "--wave": "14deg" })}>
                <g className="hw-squish">
                    {/* Plumón esponjado en festones: detrás del cuerpo, solo asoma al reaccionar. */}
                    <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                        <path
                            d="M30 70 Q14 70 18 80 Q6 86 16 94 Q4 102 16 108 Q10 118 30 116 Z"
                            fill={P.tealLight}
                            {...inked}
                            strokeWidth="3"
                        />
                        <path
                            d="M100 70 Q116 70 112 80 Q124 86 114 94 Q126 102 114 108 Q120 118 100 116 Z"
                            fill={P.tealLight}
                            {...inked}
                            strokeWidth="3"
                        />
                    </g>

                    {/* Cuerpo con penachos de tres puntas. */}
                    <path
                        d="M30 40 L22 20 L30 26 L26 10 L36 22 L40 14 L44 28 C56 24 74 24 86 28 L90 14 L94 22 L104 10 L100 26 L108 20 L100 40 C110 60 112 90 104 110 C96 124 80 130 65 130 C50 130 34 124 26 110 C18 90 20 60 30 40 Z"
                        fill={P.teal}
                        {...inked}
                    />
                    <path d="M100 42 C110 62 110 92 102 110 C96 120 88 126 78 128 C92 112 98 86 96 62 Z" fill={P.tealDeep} />
                    {/* Alas plegadas con puntas de pluma y un poco de rayado. */}
                    <path
                        d="M28 74 C18 90 22 110 34 120 L38 112 L40 120 C44 104 42 88 36 76 Z"
                        fill={P.tealDeep}
                        {...inked}
                        strokeWidth="3"
                    />
                    <path
                        d="M102 74 C112 90 108 110 96 120 L92 112 L90 120 C86 104 88 88 94 76 Z"
                        fill={P.tealDeep}
                        {...inked}
                        strokeWidth="3"
                    />
                    <path
                        d="M31 88 L28 96 M34 98 L31 106 M99 88 L102 96 M96 98 L99 106"
                        stroke={INK}
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.7"
                    />
                    {/* Panza clara con escamas en V sueltas, en tresbolillo y con huecos. */}
                    <path
                        d="M46 80 C56 74 74 74 84 80 C92 94 90 114 80 122 C72 126 58 126 50 122 C40 114 38 94 46 80 Z"
                        fill={P.tealLight}
                    />
                    <path
                        d="M51 86 L56 92 L61 86 M68 88 L73 94 L78 88 M45 98 L49 103 L53 98 M60 100 L63.5 104 L67 100 M75 98 L81 105 L87 98 M52 110 L58 117 L64 110 M71 112 L74.5 116 L78 112 M60 120 L63 123 L66 120"
                        fill="none"
                        stroke={P.tealDeep}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M25 22 L30 30 M29 14 L32 26 M40 19 L40 27 M105 22 L100 30 M101 14 L98 26 M90 19 L90 27 M60 26 L62 32 M65 24 L65 32 M70 26 L68 32 M56 33 L65 39 L74 33"
                        fill="none"
                        stroke={P.tealDeep}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Antifaz claro alrededor de los ojos. */}
                    <path
                        d="M65 42 C56 32 30 32 25 52 C22 70 44 78 65 70 C86 78 108 70 105 52 C100 32 74 32 65 42 Z"
                        fill={P.tealLight}
                        {...inked}
                        strokeWidth="3"
                    />

                    {/* Ojos enormes que siguen al cursor. */}
                    <g className="hw-off hw-eye">
                        <circle cx="46" cy="54" r="16" fill={P.mustard} {...inked} />
                        <circle cx="84" cy="53" r="17.5" fill={P.mustard} {...inked} />
                        <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                            <circle cx="47" cy="55" r="8" fill={INK} />
                            <circle cx="43" cy="51" r="2.6" fill={P.cream} />
                            <circle cx="85" cy="54" r="8.8" fill={INK} />
                            <circle cx="80.5" cy="49.5" r="2.8" fill={P.cream} />
                        </g>
                    </g>
                    <path className="hw-blink" d="M32 56 Q46 64 60 56 M70 56 Q84 64 98 56" fill="none" {...inked} />

                    {/* De gusto: ojitos cerrados en arco y cachetes rosas. */}
                    <g className="hw-on">
                        <path d="M33 58 Q46 46 59 58 M71 58 Q84 46 97 58" fill="none" {...inked} strokeWidth="4.5" />
                        <ellipse cx="34" cy="72" rx="7" ry="4" fill={P.roseLight} opacity="0.9" />
                        <ellipse cx="96" cy="72" rx="7" ry="4" fill={P.roseLight} opacity="0.9" />
                    </g>

                    {/* Pico. */}
                    <path d="M58 64 C62 62 68 62 72 64 L65 78 Z" fill={P.mustardDeep} {...inked} strokeWidth="3" />

                    {/* Patitas agarradas a la rama: primero un contorno de tinta para que no se fundan con el musgo. */}
                    <path
                        d="M50 124 L46 132 M54 125 L54 133 M58 124 L62 132 M72 124 L68 132 M76 125 L76 133 M80 124 L84 132"
                        stroke={INK}
                        strokeWidth="7"
                        strokeLinecap="round"
                    />
                    <path
                        d="M50 124 L46 132 M54 125 L54 133 M58 124 L62 132 M72 124 L68 132 M76 125 L76 133 M80 124 L84 132"
                        stroke={P.mustardDeep}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "buho",
    name: "Búho",
    w: 130,
    h: 150,
    interactive: true,
    Art,
};

export default monster;
