import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Ojo alado: un globo ocular suelto que revolotea con alitas de murciélago.
// Reacción: le da pena — baja el párpado, se sonroja y aletea como loco.

// Ala izquierda; la derecha es la misma reflejada. Borde de abajo festoneado
// y "dedos" en lilacDeep, que salen de la unión y llegan a cada punta del
// festón, para que el plum no se funda con el fondo.
function Wing() {
    return (
        <>
            <path
                d="M58 50 C46 30 28 20 8 26 C14 34 15 40 11 47 C19 46 24 52 22 59 C30 56 36 60 36 67 C44 61 51 59 58 62 Z"
                fill={P.plum}
                {...inked}
            />
            <path
                d="M54 50 L12 29 M54 52 L15 46 M54 55 L25 57 M55 58 L37 64"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </>
    );
}

function Art() {
    return (
        // Bajado 8: aire arriba para el vaivén y las rayitas de pena.
        <g transform="translate(0 8)">
            <g className="hw-float" style={v({ "--fd": "2.9s", "--fa": "-7px" })}>
                {/* Nervio óptico colgando como colita; va sobre el fondo, así que sin tinta. */}
                <path d="M80 86 C76 94 86 98 82 106" fill="none" stroke={P.rose} strokeWidth="4.5" strokeLinecap="round" />

                {/* Alas: aletean fuerte al reaccionar (afuera) y en reposo solo se mecen
                despacio desde la unión (adentro). hw-buzz, encima del vaivén, se veía
                frenético. La derecha lleva --sw negativo para que las dos bajen a la vez. */}
                <g className="hw-flap" style={v({ "--o": "100% 50%" })}>
                    <g className="hw-sway" style={v({ "--o": "100% 50%", "--sw": "6deg", "--sd": "1.2s" })}>
                        <Wing />
                    </g>
                </g>
                <g className="hw-flap" style={v({ "--o": "0% 50%" })}>
                    <g className="hw-sway" style={v({ "--o": "0% 50%", "--sw": "-6deg", "--sd": "1.2s" })}>
                        <g transform="matrix(-1 0 0 1 160 0)">
                            <Wing />
                        </g>
                    </g>
                </g>

                {/* Globo ocular: contorno un poco chueco (bultito a la derecha), sombra
                hueso abajo a la derecha y venitas; dos largas se ramifican hacia el iris. */}
                <path
                    d="M80 23 C98 22 111 33 113 45 Q116 50 115 57 C115 75 99 90 80 89 C60 89 44 74 45 56 C45 38 61 24 80 23 Z"
                    fill={P.eyeWhite}
                    {...inked}
                />
                <path d="M108 37 C117 50 116 70 102 82 C92 88 78 90 66 86 C90 85 108 68 108 37 Z" fill={P.boneShade} />
                <path
                    d="M47 48 L55 50 L59 46 M55 50 L60 57 M48 66 L56 64 L60 68 M112 44 L104 47 L101 43 M104 47 L100 53 M111 66 L103 64 L100 69 M70 25 L72 32 L68 36 M46 58 Q54 58 60 54 Q62 50 66 50 M114 60 Q106 60 101 65 Q99 69 95 70"
                    fill="none"
                    stroke={P.roseDeep}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <g className="hw-off hw-eye">
                    <g className="hw-pupil" style={v({ "--pr": "7px" })}>
                        <circle cx="81" cy="57" r="17" fill={P.irisTeal} stroke={INK} strokeWidth="2.5" />
                        <circle cx="82" cy="58" r="8.5" fill={INK} />
                        <circle cx="75" cy="51" r="3.6" fill={P.cream} />
                    </g>
                </g>

                {/* Parpadeo en reposo: un párpado corto que solo baja hasta la mitad.
                Distinto del de la reacción para que ésta no pierda la sorpresa. */}
                <path
                    className="hw-blink"
                    d="M45 56 C45 34 60 22 80 22 C100 22 115 34 115 56 L113 60 Q80 72 47 60 Z"
                    fill={P.plum}
                    stroke={INK}
                    strokeWidth="3"
                    strokeLinejoin="round"
                />

                {/* Pena: el iris se asoma mirando abajo a la izquierda y un párpado
                pesado (más bajo que el del parpadeo, y con pestañas) le tapa la mitad
                de arriba. El globo y las venitas siguen a la vista, así que se lee como
                ojo apenado y no como otra carita. */}
                <g className="hw-on">
                    {/* Rubor antes que el iris y metido en el globo: así no pisa el contorno. */}
                    <ellipse cx="55" cy="74" rx="6" ry="3.5" fill={P.roseLight} opacity="0.9" />
                    <ellipse cx="103" cy="76" rx="6" ry="3.5" fill={P.roseLight} opacity="0.9" />
                    <circle cx="72" cy="73" r="12" fill={P.irisTeal} stroke={INK} strokeWidth="2.5" />
                    <circle cx="70" cy="76" r="6" fill={INK} />
                    <circle cx="66.5" cy="72.5" r="2.2" fill={P.cream} />
                    <path d="M45 56 C45 34 60 22 80 22 C100 22 115 34 115 56 L114 61 Q80 78 46 61 Z" fill={P.plum} {...inked} />
                    <path d="M54 36 C62 28 74 25 86 26" fill="none" stroke={P.lilacDeep} strokeWidth="3" strokeLinecap="round" />
                    <path
                        d="M58 67 L54 74 M80 70 L80 77 M102 67 L106 74"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>
                {/* Rayitas de pena sobre el fondo: en crema, no en tinta. */}
                <g
                    className="hw-on hw-pop"
                    style={v({ "--o": "50% 100%" })}
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                    strokeLinecap="round"
                >
                    <path d="M62 14 L58 6" />
                    <path d="M80 12 L80 4" />
                    <path d="M98 14 L102 6" />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "ojo-alado",
    name: "Ojo alado",
    w: 160,
    h: 120,
    interactive: true,
    Art,
};

export default monster;
