import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Murciélago regordete. Flota en reposo. Reacción: aletea, abre los ojos de
// par en par y enseña la boca con sus dos colmillos.
// Es de cuerpo oscuro: una banda lila por dentro del borde hace que la
// silueta se lea contra el negro, y los rasgos van en tonos claros porque la
// tinta sobre ciruela casi no se ve.

/** Ala izquierda; la derecha es la misma reflejada. Hombro en (84,64). */
function Wing() {
    return (
        <g>
            {/* Membrana festoneada: cada festón baja entre dos "dedos". */}
            <path d="M88 58 C70 36 42 26 10 36 Q28 56 18 80 Q36 74 42 94 Q56 84 66 102 Q76 88 90 94 Z" fill={P.plum} {...inked} />
            {/* Banda de luz del borde de ataque y sombra de la membrana. */}
            <path d="M84 60 C68 42 44 34 18 40" fill="none" stroke={P.lilacDeep} strokeWidth="4" strokeLinecap="round" />
            <path d="M84 70 L26 76 Q38 74 42 90 Q54 82 64 98 Q74 86 86 90 Z" fill={P.lilacDeep} opacity="0.55" />
            {/* Dedos del ala. */}
            <path d="M86 64 L20 76 M86 66 L42 92 M86 68 L66 100" fill="none" stroke={P.lilac} strokeWidth="2.5" strokeLinecap="round" />
        </g>
    );
}

function Art() {
    return (
        <g transform="translate(0 6)">
            <g className="hw-float" style={v({ "--fd": "2.9s", "--fa": "-6px" })}>
                {/* Alas detrás del cuerpo. El pivote va en el borde de ataque (arriba):
                así la membrana se pliega hacia arriba y se lee como aleteo, no
                como un ala que se encoge. */}
                <g className="hw-flap" style={v({ "--o": "100% 0%" })}>
                    <Wing />
                </g>
                <g className="hw-flap" style={v({ "--o": "0% 0%" })}>
                    <g transform="translate(220 0) scale(-1 1)">
                        <Wing />
                    </g>
                </g>

                {/* Patitas colgando. */}
                <path
                    d="M96 124 L94 136 M94 136 L90 140 M94 136 L98 140 M124 124 L126 136 M126 136 L122 140 M126 136 L130 140"
                    fill="none"
                    stroke={P.lilacLight}
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Orejotas puntiagudas. */}
                <path d="M78 64 C72 44 68 26 70 10 C86 18 100 34 108 50 Z" fill={P.plum} {...inked} />
                <path d="M82 54 C78 42 76 30 77 20 C88 28 94 36 98 46 Z" fill={P.rose} />
                <path d="M142 64 C148 44 152 26 150 10 C134 18 120 34 112 50 Z" fill={P.plum} {...inked} />
                <path d="M138 54 C142 42 144 30 143 20 C132 28 126 36 122 46 Z" fill={P.rose} />

                {/* Cuerpo-cabeza: una sola papa, con el borde de abajo en mechones
                de pelo; así se separa la cabeza lisa del cuerpo peludo. */}
                <path
                    d="M110 42 C142 42 152 66 150 92 L152 101 L146 103 L150 111 L143 112 L145 120 L138 119 L137 127 L130 124 L126 131 L120 127 L110 129 L100 127 L94 131 L90 124 L83 127 L82 119 L75 120 L77 112 L70 111 L74 103 L68 101 L70 90 C68 64 80 42 110 42 Z"
                    fill={P.plum}
                    {...inked}
                />
                <path d="M78 70 C72 92 78 112 94 122 C84 106 82 88 88 72 Z" fill={P.lilacDeep} />
                <path d="M104 47 C120 45 134 50 142 62" fill="none" stroke={P.lilacDeep} strokeWidth="3.5" strokeLinecap="round" />
                {/* Panza lila con pelito dibujado. Borde liso arriba: en zigzag se
                leía como una segunda boca. */}
                <path
                    d="M90 113 C98 107 122 107 130 113 C135 121 126 127 110 127 C94 127 85 121 90 113 Z"
                    fill={P.lilacLight}
                    {...inked}
                    strokeWidth="3"
                />
                <path
                    d="M100 115 L103 119 L106 115 M112 118 L115 122 L118 115 M106 122 L108 124"
                    fill="none"
                    stroke={P.lilac}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                {/* Rayado de pelo en el costado; lilac y no lilacDeep, que sobre
                ciruela no se veía. */}
                <path
                    d="M138 78 L145 75 M140 90 L147 88 M139 102 L146 102 M134 113 L140 115"
                    fill="none"
                    stroke={P.lilac}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.8"
                />
                {/* Mechones del pecho, sobre la panza. */}
                <path
                    d="M94 102 L97 107 L100 102 M107 104 L110 109 L113 104 M120 102 L123 107 L126 102"
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Copete: tres picos, grandes para que sobrevivan a escala 1. */}
                <path d="M98 46 L102 32 L108 43 L112 30 L117 43 L122 34 L124 47" fill={P.plum} {...inked} strokeWidth="3" />

                {/* Nariz de cochinito. */}
                <ellipse cx="110" cy="84" rx="6" ry="4.5" fill={P.roseDeep} {...inked} strokeWidth="2.5" />
                <circle cx="108" cy="84" r="1.2" fill={INK} />
                <circle cx="112" cy="84" r="1.2" fill={INK} />

                {/* Ojos en reposo. */}
                <g className="hw-off hw-eye">
                    <ellipse cx="94" cy="72" rx="9" ry="10" fill={P.mustard} {...inked} strokeWidth="3" />
                    <ellipse cx="126" cy="72" rx="9" ry="10" fill={P.mustard} {...inked} strokeWidth="3" />
                    <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                        <circle cx="95" cy="73" r="4.5" fill={INK} />
                        <circle cx="93" cy="71" r="1.6" fill={P.cream} />
                        <circle cx="127" cy="73" r="4.5" fill={INK} />
                        <circle cx="125" cy="71" r="1.6" fill={P.cream} />
                    </g>
                </g>
                <g className="hw-blink" fill="none" stroke={P.mustard} strokeWidth="3.5" strokeLinecap="round">
                    <path d="M86 74 Q94 80 102 74" />
                    <path d="M118 74 Q126 80 134 74" />
                </g>
                {/* Sonrisita con un colmillo. */}
                <g className="hw-off">
                    <path d="M102 93 Q110 98 118 93" fill="none" stroke={P.lilacLight} strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M111 94 L114 103 L117 94 Z" fill={P.bone} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
                </g>

                {/* Reacción: ojos enormes con pupila chiquita y boca abierta con
                los dos colmillos. */}
                <g className="hw-on">
                    <ellipse cx="93" cy="70" rx="12" ry="14" fill={P.mustard} {...inked} strokeWidth="3" />
                    <ellipse cx="127" cy="70" rx="12" ry="14" fill={P.mustard} {...inked} strokeWidth="3" />
                    <circle cx="93" cy="70" r="3" fill={INK} />
                    <circle cx="127" cy="70" r="3" fill={INK} />
                    <path d="M99 92 Q110 90 121 92 Q120 108 110 108 Q100 108 99 92 Z" fill={P.mouth} {...inked} strokeWidth="3" />
                    <path d="M103 103 Q110 99 117 103 Q114 107 110 107 Q106 107 103 103 Z" fill={P.tongue} />
                    <path d="M102 92 L104 99 L107 92 Z M113 92 L116 99 L118 92 Z" fill={P.bone} />
                </g>
                {/* Líneas de movimiento bajo cada punta de ala: tres trazos cortos
                paralelos, sobre el fondo, en crema. */}
                <g
                    className="hw-on hw-pop"
                    style={v({ "--o": "50% 0%" })}
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                    strokeLinecap="round"
                >
                    <path d="M14 100 L26 107 M22 111 L35 118 M32 121 L44 128" />
                    <path d="M206 100 L194 107 M198 111 L185 118 M188 121 L176 128" />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "murcielago",
    name: "Murciélago",
    w: 220,
    h: 150,
    interactive: true,
    Art,
};

export default monster;
