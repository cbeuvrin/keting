import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Mano zombi que asoma de un montoncito de tierra, con un ojo en el dorso.
// Nada de gore: piel verde salvia, costuras y anillos de fantasía.
// Reacción: cada dedo se menea por su lado, el ojo se cierra feliz y
// aparece una sonrisa con rubor debajo del ojo.

const dot = { fill: "none", strokeLinecap: "round" } as const;
const detail = { stroke: INK, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Art() {
    return (
        <g>
            {/* Todo lo que sale de la tierra se mece despacio; el montoncito va fuera
            y encima, así tapa la base del antebrazo. */}
            <g className="hw-sway" style={v({ "--o": "50% 100%", "--sw": "3deg", "--sd": "4.2s" })}>
                {/* Dedos detrás de la mano, chuecos como de zombi: cada uno oscila desde
                su base con otro ángulo y otro ritmo (--wd/--wdl), así el meneo no sale
                sincronizado. La uña va metida en la yema para que se vea verde alrededor. */}
                <g className="hw-wave" style={v({ "--o": "50% 100%", "--wave": "-16deg", "--wd": "560ms", "--wdl": "0s" })}>
                    <path d="M66 82 C61 66 54 52 55 38 C56 26 70 24 72 36 C73 48 77 62 81 80 Z" fill={P.sage} {...inked} />
                    <path d="M59 35 Q63.5 30 68 35 L67 39 Q63.5 41 60 39 Z" fill={P.bone} transform="rotate(-8 63.5 36)" {...detail} />
                    <path d="M59 52 Q65 55 72 51 M62 63 Q68 66 75 62" fill="none" {...detail} />
                </g>
                <g className="hw-wave" style={v({ "--o": "50% 100%", "--wave": "12deg", "--wd": "480ms", "--wdl": "-120ms" })}>
                    <path d="M80 78 C78 58 82 40 79 26 C78 13 96 11 97 23 C99 38 96 58 97 78 Z" fill={P.sage} {...inked} />
                    <path d="M83.5 22 Q88 17 92.5 22 L91.5 26 Q88 28 84.5 26 Z" fill={P.bone} {...detail} />
                    {/* Anillo con piedrita. */}
                    <path d="M80 62 Q89 67 98 62 L98 53 Q89 58 80 53 Z" fill={P.mustard} {...detail} />
                    <circle cx="89" cy="58" r="3.4" fill={P.teal} stroke={INK} strokeWidth="2" />
                    <path d="M83 40 Q88 43 94 40" fill="none" {...detail} />
                </g>
                <g className="hw-wave" style={v({ "--o": "50% 100%", "--wave": "-20deg", "--wd": "620ms", "--wdl": "-260ms" })}>
                    <path d="M96 78 C99 62 99 46 104 34 C107 22 121 24 118 36 C115 48 114 64 111 80 Z" fill={P.sage} {...inked} />
                    <path
                        d="M106 32 Q110.5 27 115 32 L114 36 Q110.5 38 107 36 Z"
                        fill={P.bone}
                        transform="rotate(14 110.5 33)"
                        {...detail}
                    />
                    <path d="M99 64 Q106 68 113 64 L114 56 Q107 60 100 56 Z" fill={P.mustard} {...detail} />
                    <path d="M103 46 Q108 49 114 46" fill="none" {...detail} />
                </g>
                <g className="hw-wave" style={v({ "--o": "40% 100%", "--wave": "22deg", "--wd": "440ms", "--wdl": "-60ms" })}>
                    <path
                        d="M109 84 C112 72 116 64 122 54 C125 46 128 38 134 42 C140 46 136 52 134 58 C130 68 126 76 123 88 Z"
                        fill={P.sage}
                        {...inked}
                    />
                    <path
                        d="M127 45 Q131 41 135 45 L134 48.5 Q131 50.5 128 48.5 Z"
                        fill={P.bone}
                        transform="rotate(28 131 46)"
                        {...detail}
                    />
                    <path d="M118 67 Q123 70 128 67" fill="none" {...detail} />
                </g>
                <g className="hw-wave" style={v({ "--o": "100% 80%", "--wave": "18deg", "--wd": "600ms", "--wdl": "-340ms" })}>
                    <path
                        d="M64 108 C55 102 46 96 40 88 C34 82 30 76 35 71 C40 67 45 71 48 76 C53 82 60 88 67 92 Z"
                        fill={P.sage}
                        {...inked}
                    />
                    <path
                        d="M34.5 73 Q38.5 69 42.5 73 L41.5 76.5 Q38.5 78.5 35.5 76.5 Z"
                        fill={P.bone}
                        transform="rotate(-40 38.5 74)"
                        {...detail}
                    />
                    <path d="M46 94 Q50 88 52 81" fill="none" {...detail} />
                </g>

                {/* Antebrazo con costura y manchitas; se hunde en la tierra. */}
                <path d="M74 118 C72 140 70 158 66 178 L114 178 C110 158 108 140 108 118 Z" fill={P.sage} {...inked} />
                <path d="M100 124 C102 140 104 152 106 166 L110 166 C108 150 106 136 106 122 Z" fill={P.moss} />
                <path d="M72 142 Q90 149 108 142 M78 137 L77 148 M88 140 L88 151 M98 140 L99 150" fill="none" {...detail} />
                <path d="M80 160h0M86 166h0M94 158h0" {...dot} stroke={P.moss} strokeWidth="5" />

                {/* Dorso de la mano con sombra del lado derecho. Sin nudillos de tinta:
                encima del ojo se leían como cejas. */}
                <path
                    d="M60 86 C58 72 72 66 92 65 C113 64 127 71 126 87 C127 104 121 119 109 127 Q92 131 76 127 C63 120 58 104 60 86 Z"
                    fill={P.sage}
                    {...inked}
                />
                <path d="M119 78 C126 92 124 110 112 123 L107 121 C116 109 119 93 114 80 Z" fill={P.moss} />
                <path d="M69 114h0M74 120h0M114 88h0" {...dot} stroke={P.moss} strokeWidth="5" />

                {/* Ojo del dorso, con pestañitas; la pupila sigue al cursor. */}
                <g className="hw-off hw-eye">
                    <path d="M78 81 L75 75 M92 78 L92 72 M106 81 L109 75" fill="none" {...detail} />
                    <ellipse cx="92" cy="96" rx="18" ry="15" fill={P.eyeWhite} {...inked} />
                    <g className="hw-pupil" style={v({ "--pr": "5px" })}>
                        <circle cx="94" cy="98" r="9" fill={P.irisPink} />
                        <circle cx="95" cy="99" r="4.6" fill={INK} />
                        <circle cx="90" cy="94" r="2.3" fill={P.cream} />
                    </g>
                </g>
                <g className="hw-blink" fill="none" {...inked}>
                    <path d="M74 95 Q92 108 110 95" />
                    <path d="M80 102 L77 108 M92 104 L92 110 M104 102 L107 108" strokeWidth="2.5" />
                </g>

                {/* Reacción: ojo cerrado feliz, sonrisa con lengüita y rubor. */}
                <g className="hw-on">
                    <path d="M78 101 Q92 82 106 101" fill="none" {...inked} strokeWidth="5" />
                    <path d="M80 110 Q92 126 104 110 Q92 114 80 110 Z" fill={P.mouth} {...inked} strokeWidth="3" />
                    <path d="M86 117 Q92 113 98 117 Q92 122 86 117 Z" fill={P.tongue} />
                    <ellipse cx="70" cy="108" rx="7" ry="4" fill={P.roseLight} opacity="0.85" />
                    <ellipse cx="114" cy="108" rx="7" ry="4" fill={P.roseLight} opacity="0.85" />
                </g>
            </g>

            {/* Montoncito de tierra: ciruela con banda lila para que se lea contra el
            fondo, puntitos de grumos, piedritas y dos matas de pasto. */}
            <path d="M8 194 C10 172 32 158 58 156 C74 150 108 150 124 156 C150 158 172 172 174 194 Z" fill={P.plum} {...inked} />
            <path
                d="M14 186 C18 172 36 162 58 160 C74 154 108 154 124 160 C146 162 164 172 168 186 C160 176 144 168 122 166 C108 161 76 161 62 166 C40 168 24 176 14 186 Z"
                fill={P.lilacDeep}
            />
            <path
                d="M30 184h0M46 176h0M62 184h0M84 178h0M104 186h0M122 176h0M140 184h0M156 182h0"
                {...dot}
                stroke={P.charcoal}
                strokeWidth="5.5"
            />
            <path d="M38 188h0M72 174h0M96 172h0M132 188h0M150 174h0" {...dot} stroke={P.lilacLight} strokeWidth="3.5" />
            <path d="M34 168 Q32 154 26 146 Q34 150 40 161 Q40 150 45 139 Q49 152 50 165 Z" fill={P.sage} {...detail} />
            <path d="M136 163 Q138 150 142 142 Q145 151 146 157 Q149 147 157 140 Q155 154 154 166 Z" fill={P.sage} {...detail} />
            <ellipse cx="54" cy="170" rx="6" ry="4" fill={P.boneShade} {...detail} />
            <ellipse cx="128" cy="168" rx="4.5" ry="3.2" fill={P.boneShade} {...detail} />
        </g>
    );
}

const monster: MonsterDef = {
    id: "mano-zombi",
    name: "Mano zombi",
    w: 180,
    h: 200,
    interactive: true,
    Art,
};

export default monster;
