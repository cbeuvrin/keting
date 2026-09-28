import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Bruja bolita: una pelusa lila de un solo ojo con sombrero de bruja chueco,
// demasiado grande para ella.
// Reacción: el sombrero pega un brinco, el ojo se cierra de gusto y sonríe
// con la boca abierta.

function Art() {
    return (
        // Bajado 12 para dejar aire arriba al brinco del sombrero.
        <g transform="translate(0 12)">
            {/* Patitas detrás del pelo. */}
            <path d="M68 206 C62 218 66 226 78 226 C88 226 90 218 86 208 Z" fill={P.lilacDeep} {...inked} />
            <path d="M104 208 C100 218 104 226 114 226 C126 226 128 218 122 206 Z" fill={P.lilacDeep} {...inked} />

            {/* Mechones largos que asoman bajo el ala: así hay pelo también arriba. Van
            detrás del cuerpo para que éste tape su raíz. */}
            <path
                d="M46 124 Q26 124 18 108 Q28 114 35 112 Q30 104 32 94 Q40 108 50 114 Z M144 116 Q164 118 174 104 Q164 108 158 106 Q164 98 162 88 Q154 102 142 106 Z"
                fill={P.lilac}
                {...inked}
            />

            {/* Cuerpo: borde de pelo irregular (picos de distinto largo y algunos
            mechones redondeados) y sombra lilacDeep abajo a la derecha. */}
            <path
                d="M157 150 L165 160 L157 164 L160 171 L148 176 L155 187 L142 188 L140 200 L130 196 L126 203 L118 206 Q119 229 102 207 L93 221 L88 205 L80 210 L72 205 L62 211 L60 196 Q45 197 48 188 Q26 198 40 176 L25 176 L38 163 L29 156 L31 150 L27 144 L35 136 L27 127 L41 124 L41 113 L47 111 L43 98 L61 105 Q58 89 73 96 L81 88 L88 93 L94 80 L102 94 L110 87 L118 95 L129 93 L129 105 Q146 91 142 112 L149 114 L150 124 L161 129 L154 137 L167 140 L157 150 Z"
                fill={P.lilac}
                {...inked}
            />
            <path
                d="M118 95 L129 93 L129 105 Q146 91 142 112 L149 114 L150 124 L161 129 L154 137 L167 140 L157 150 L165 160 L157 164 L160 171 L148 176 L155 187 L142 188 L140 200 L130 196 L126 203 L118 206 Q119 229 102 207 L93 221 L88 205 L80 210 L72 205 L62 211 L60 196 C82 204 118 198 138 180 C152 166 154 146 150 128 C146 114 132 100 118 95 Z"
                fill={P.lilacDeep}
            />
            {/* Mechones sueltos: la textura de pelusa. */}
            <path
                d="M42 140 L50 149 L56 137 M50 172 L55 177 L59 170 M62 120 L65 116 L68 120 M122 118 L126 113 L131 119 M70 192 L73 196 L76 191 M40 132 Q46 126 54 128 M130 128 Q136 124 142 130"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* El ojo único. */}
            <g className="hw-off hw-eye">
                <ellipse cx="94" cy="150" rx="29" ry="30" fill={P.eyeWhite} {...inked} />
                <g className="hw-pupil" style={v({ "--pr": "7px" })}>
                    <circle cx="96" cy="153" r="16" fill={P.irisPink} />
                    <circle cx="97" cy="154" r="8" fill={INK} />
                    <circle cx="90" cy="146" r="3.5" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked}>
                <path d="M66 152 Q94 168 122 152" />
                <path d="M74 160 L68 168 M94 166 L94 175 M114 160 L120 168" strokeWidth="3" />
            </g>

            {/* Boquita en reposo con un colmillito. */}
            <g className="hw-off">
                <path d="M84 194 Q95 202 108 193" fill="none" {...inked} strokeWidth="3.5" />
                <path d="M100 197 L103 204 L106 196 Z" fill={P.bone} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            </g>

            {/* Gusto: ojo cerrado en arco, sonrisa abierta y mejillas. */}
            <g className="hw-on">
                <path d="M70 158 C76 138 112 138 118 158" fill="none" {...inked} strokeWidth="5.5" />
                <path d="M70 158 L64 152 M118 158 L124 152" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
                <path d="M76 184 Q95 188 114 183 C114 198 106 208 95 208 C84 208 76 198 76 184 Z" fill={P.mouth} {...inked} />
                <path d="M84 201 Q95 193 106 201 Q101 207 95 207 Q89 207 84 201 Z" fill={P.tongue} />
                <path d="M100 186 L103 193 L106 186 Z" fill={P.bone} />
                <ellipse cx="54" cy="176" rx="12" ry="7" fill={P.roseLight} opacity="0.85" />
                <ellipse cx="136" cy="174" rx="12" ry="7" fill={P.roseLight} opacity="0.85" />
            </g>

            {/* Sombrero: brinca solo él. Oscuro, con filo lila para que no se pierda en el fondo. */}
            <g className="hw-hop" style={v({ "--hop": "-20px" })}>
                {/* Chueco: la inclinación va en un <g> propio, dentro del que brinca. */}
                <g transform="rotate(-8 95 108)">
                    <path
                        d="M50 102 C62 76 78 52 92 32 C100 20 114 14 128 18 C140 22 150 30 158 42 C144 36 130 34 120 40 C112 62 122 84 140 100 Z"
                        fill={P.charcoal}
                        {...inked}
                    />
                    <path
                        d="M62 90 C72 70 86 50 98 34 C104 28 112 24 122 24"
                        fill="none"
                        stroke={P.lilacDeep}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Pliegue de la tela que sigue la curva del cono. */}
                    <path d="M112 50 Q108 66 116 82" fill="none" stroke={P.lilacDeep} strokeWidth="2.5" strokeLinecap="round" />
                    <path
                        d="M56 88 C84 82 112 82 134 88 L139 99 C112 93 82 93 51 100 Z"
                        fill={P.mustard}
                        stroke={INK}
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path d="M84 83 L102 82 L103 96 L85 97 Z" fill={P.mustardDeep} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
                    <path d="M89 87 L98 87 L98 92 L89 92 Z" fill={P.charcoal} />
                    <path d="M18 108 C30 92 148 84 172 96 C180 104 162 112 96 114 C44 116 10 116 18 108 Z" fill={P.charcoal} {...inked} />
                    <path d="M30 104 C60 96 130 92 162 97" fill="none" stroke={P.lilacDeep} strokeWidth="3" strokeLinecap="round" />
                </g>
            </g>
            {/* Chispitas de brinco, en crema porque caen sobre el fondo. */}
            <g
                className="hw-on hw-pop"
                style={v({ "--o": "50% 100%" })}
                fill="none"
                stroke={P.cream}
                strokeWidth="3.5"
                strokeLinecap="round"
            >
                <path d="M16 84 L6 76" />
                <path d="M174 80 L184 70" />
                <path d="M178 96 L186 94" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "bruja-bolita",
    name: "Bruja bolita",
    w: 190,
    h: 244,
    interactive: true,
    Art,
};

export default monster;
