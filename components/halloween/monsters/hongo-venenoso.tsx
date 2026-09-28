import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Hongo venenoso con carita en el tallo y faldita. Reacción: saluda como
// caballero — se quita el sombrero (sube y se ladea), levanta un bracito,
// cierra los ojos contento y abre la boca.

function Art() {
    return (
        // Bajado 8 para que el sombrero tenga aire al levantarse sin salirse de la caja.
        <g transform="translate(0 8)">
            {/* Bracitos detrás del tallo; el derecho es el que saluda. */}
            <path d="M44 92 C30 88 20 96 22 104 C24 111 34 110 40 102 Z" fill={P.bone} {...inked} />
            <g className="hw-wave" style={v({ "--o": "0% 60%", "--wave": "-38deg" })}>
                <path d="M86 92 C100 88 110 96 108 104 C106 111 96 110 90 102 Z" fill={P.bone} {...inked} />
            </g>

            {/* Tallo: se ensancha abajo como bulbo. */}
            <path d="M42 58 C40 90 36 118 32 134 C28 148 102 148 98 134 C94 118 90 90 88 58 Z" fill={P.bone} {...inked} />
            <path d="M84 64 C86 92 88 118 92 136 C96 142 88 144 84 140 C82 118 80 92 78 64 Z" fill={P.boneShade} />
            {/* Puntitos de tierra en el bulbo. */}
            <path
                d="M44 136 L46 138 M54 140 L55 142 M72 139 L74 141 M84 134 L86 137"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Faldita: volante ondulado a la altura de la cintura. */}
            <path
                d="M36 102 Q24 118 38 120 Q44 128 53 121 Q59 129 65 122 Q71 129 77 121 Q86 128 92 120 Q106 118 94 102 C78 108 52 108 36 102 Z"
                fill={P.bone}
                {...inked}
                strokeWidth="3.5"
            />
            <path
                d="M38 120 L42 110 M53 121 L54 111 M65 122 L65 111 M77 121 L76 111 M92 120 L88 110"
                stroke={P.boneShade}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Cara en reposo. */}
            <g className="hw-off hw-eye" style={v({ "--bd": "4.4s" })}>
                <ellipse cx="55" cy="85" rx="7" ry="8.5" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                <ellipse cx="76" cy="85" rx="7" ry="8.5" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                <g className="hw-pupil" style={v({ "--pr": "2.5px" })}>
                    <circle cx="56" cy="87" r="4" fill={INK} />
                    <circle cx="77" cy="87" r="4" fill={INK} />
                    <circle cx="54.5" cy="85" r="1.5" fill={P.cream} />
                    <circle cx="75.5" cy="85" r="1.5" fill={P.cream} />
                </g>
            </g>
            <path className="hw-blink" d="M48 86 Q55 92 62 86 M69 86 Q76 92 83 86" fill="none" {...inked} strokeWidth="3" />
            <path className="hw-off" d="M61 98 Q65.5 102 70 98" fill="none" {...inked} strokeWidth="3" />

            {/* Saludo: ojitos felices, boca abierta y rubor. */}
            <g className="hw-on">
                <path d="M48 88 Q55 79 62 88 M69 88 Q76 79 83 88" fill="none" {...inked} strokeWidth="3.5" />
                <path d="M58 95 C60 93 71 93 73 95 C74 105 57 105 58 95 Z" fill={P.mouth} {...inked} strokeWidth="3" />
                <path d="M61 101 Q65.5 97 70 101 Q68 104 65.5 104 Q63 104 61 101 Z" fill={P.tongue} />
                <ellipse cx="47" cy="96" rx="5" ry="3" fill={P.roseLight} opacity="0.9" />
                <ellipse cx="84" cy="96" rx="5" ry="3" fill={P.roseLight} opacity="0.9" />
            </g>

            {/* Sombrero: sube y se ladea al reaccionar. Las laminillas van en el
            mismo grupo para que se vean al levantarlo. */}
            <g className="hw-hop" style={v({ "--hop": "-18px" })}>
                <g className="hw-wave" style={v({ "--o": "20% 100%", "--wave": "-10deg" })}>
                    <path d="M18 62 C40 72 90 72 112 60 C102 78 30 80 18 62 Z" fill={P.boneShade} {...inked} strokeWidth="3" />
                    <path d="M40 70 L42 75 M56 72 L57 77 M72 72 L72 77 M88 70 L87 75" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                    <path d="M10 62 C4 40 28 16 62 18 C98 16 128 38 120 60 C104 72 26 74 10 62 Z" fill={P.roseDeep} {...inked} />
                    <path d="M16 56 C14 40 30 26 50 22 C36 32 26 42 24 60 Z" fill={P.rose} />
                    {/* Manchas del sombrero, irregulares, en un solo path. */}
                    <path
                        d="M34 36 C40 30 50 32 49 39 C48 46 36 46 34 36 Z M68 26 C74 22 82 25 80 31 C78 36 70 35 68 26 Z M94 38 C101 35 108 41 104 47 C100 52 91 46 94 38 Z M56 52 C60 49 66 51 64 56 C61 59 55 57 56 52 Z M24 50 C27 47 31 49 30 53 C28 56 23 54 24 50 Z M108 55 C111 54 114 56 112 59 C110 60 107 58 108 55 Z"
                        fill={P.bone}
                        {...inked}
                        strokeWidth="2.5"
                    />
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "hongo-venenoso",
    name: "Hongo venenoso",
    w: 130,
    h: 160,
    interactive: true,
    Art,
};

export default monster;
