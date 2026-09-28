import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Ratita lila clara de hocico puntiagudo que no suelta su trocito de queso.
// Lila claro (no lila) para no fundirse con la bruja bolita si quedan juntas.
// Reacción: cierra los ojos de gusto, abre la boquita enseñando los dos
// dientes y agita la cola.

function Art() {
    return (
        <g>
            {/* Cola detrás del cuerpo: el pivote queda en la unión, tapada por la panza.
            Doble trazo (tinta ancha + rosa encima) para que tenga contorno. */}
            <g className="hw-wave" style={v({ "--o": "0% 100%", "--wave": "-22deg" })}>
                <path
                    d="M98 98 C124 104 142 94 142 76 C142 60 126 56 120 68 C116 76 126 82 131 73"
                    fill="none"
                    stroke={INK}
                    strokeWidth="9"
                    strokeLinecap="round"
                />
                <path
                    d="M98 98 C124 104 142 94 142 76 C142 60 126 56 120 68 C116 76 126 82 131 73"
                    fill="none"
                    stroke={P.roseLight}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </g>

            {/* Orejas redondas rosas. */}
            <ellipse cx="45" cy="25" rx="15" ry="14" fill={P.lilacLight} {...inked} />
            <ellipse cx="46" cy="26" rx="8" ry="7.5" fill={P.roseLight} />
            <ellipse cx="109" cy="23" rx="16" ry="15" fill={P.lilacLight} {...inked} />
            <ellipse cx="108" cy="24" rx="8.5" ry="8" fill={P.roseLight} />

            {/* Cuerpo de pera: cabeza y panza en una sola pieza. */}
            <path
                d="M52 24 C62 12 94 11 104 23 C114 36 117 60 114 80 C112 98 100 107 78 107 C55 107 42 99 40 80 C38 60 42 36 52 24 Z"
                fill={P.lilacLight}
                {...inked}
            />
            <path d="M104 32 C112 48 114 70 110 88 C106 98 98 102 90 104 C102 92 106 70 101 40 Z" fill={P.lilac} />
            {/* Pelito rayado en los costados. Sin rayas en la coronilla: ahí la
            leían como gato atigrado. */}
            <path
                d="M49 46 L45 51 M47 58 L43 63 M46 70 L42 75 M47 82 L43 87 M106 50 L109 56"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Hocico en gota hacia abajo: es lo que la hace rata y no ratón ni hámster. */}
            <path
                d="M64 50 Q78 44 92 50 Q88 64 78 70 Q68 64 64 50 Z"
                fill={P.bone}
                fillOpacity="0.7"
                stroke={P.lilac}
                strokeWidth="2"
                strokeLinejoin="round"
            />

            {/* Ojitos de botón que siguen al cursor. */}
            <g className="hw-off hw-eye">
                <ellipse cx="66" cy="44" rx="7" ry="8" fill={P.eyeWhite} stroke={INK} strokeWidth="3" />
                <ellipse cx="90" cy="44" rx="7" ry="8" fill={P.eyeWhite} stroke={INK} strokeWidth="3" />
                <g className="hw-pupil" style={v({ "--pr": "2px" })}>
                    <circle cx="67" cy="45" r="3.8" fill={INK} />
                    <circle cx="65.5" cy="43" r="1.6" fill={P.cream} />
                    <circle cx="91" cy="45" r="3.8" fill={INK} />
                    <circle cx="89.5" cy="43" r="1.6" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
                <path d="M59 45 Q66 50 73 45" />
                <path d="M83 45 Q90 50 97 45" />
            </g>

            <ellipse cx="78" cy="58" rx="6" ry="4.5" fill={P.rose} stroke={INK} strokeWidth="2.5" />
            <path
                className="hw-off"
                d="M72 66 Q75 70 78 65 Q81 70 84 66"
                fill="none"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Contento: ojos cerrados en arco, boquita abierta con dos dientes y rubor. */}
            <g className="hw-on">
                <path d="M59 47 Q66 38 73 47 M83 47 Q90 38 97 47" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
                <path
                    d="M72 64 Q78 62 84 64 C84 71 81 75 78 75 C75 75 72 71 72 64 Z"
                    fill={P.mouth}
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M74.5 64 L78 63.5 L78 68 L74.5 68 Z M78 63.5 L81.5 64 L81.5 68 L78 68 Z"
                    fill={P.bone}
                    stroke={INK}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <ellipse cx="55" cy="56" rx="7" ry="4" fill={P.roseLight} opacity="0.9" />
                <ellipse cx="101" cy="56" rx="7" ry="4" fill={P.roseLight} opacity="0.9" />
            </g>

            {/* Bigotes en crema: cruzan del cuerpo al fondo y la tinta ahí se perdería. */}
            <path d="M70 59 L46 54 M70 63 L46 65 M86 59 L110 54 M86 63 L110 65" stroke={P.cream} strokeWidth="2" strokeLinecap="round" />

            {/* Patitas de abajo. */}
            <ellipse cx="62" cy="106" rx="9" ry="4.5" fill={P.roseLight} stroke={INK} strokeWidth="2.5" />
            <ellipse cx="94" cy="106" rx="9" ry="4.5" fill={P.roseLight} stroke={INK} strokeWidth="2.5" />

            {/* Queso abrazado: cara con hoyos y canto más oscuro. */}
            <path d="M46 96 L108 74 L116 70 L116 94 L108 100 Z" fill={P.mustardDeep} {...inked} strokeWidth="3" />
            <path d="M46 96 L108 74 L108 100 Z" fill={P.mustard} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <ellipse cx="82" cy="90" rx="4.5" ry="3.5" fill={P.mustardDeep} />
            <ellipse cx="98" cy="85" rx="3" ry="2.5" fill={P.mustardDeep} />
            <ellipse cx="100" cy="94" rx="2.5" ry="2" fill={P.mustardDeep} />
            <ellipse cx="58" cy="89" rx="6" ry="5" fill={P.roseLight} stroke={INK} strokeWidth="2.5" />
            <ellipse cx="106" cy="82" rx="6" ry="5" fill={P.roseLight} stroke={INK} strokeWidth="2.5" />
        </g>
    );
}

const monster: MonsterDef = {
    id: "rata",
    name: "Ratita con queso",
    w: 150,
    h: 114,
    interactive: true,
    Art,
};

export default monster;
