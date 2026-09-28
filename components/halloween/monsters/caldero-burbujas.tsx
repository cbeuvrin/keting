import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Caldero de bruja que es un monstruo: la panza del caldero es su cara y el
// brebaje le burbujea en la cabeza. Reacción: le da un hervor — se aplasta,
// abre ojos enormes y la boca, y le brotan burbujas grandes hacia arriba.

function Art() {
    return (
        <g>
            <g className="hw-squish">
                {/* Patitas detrás de la panza, para que la unión quede tapada. */}
                <path d="M84 220 C78 240 78 254 92 255 C106 256 112 246 110 224 Z" fill={P.charcoal} {...inked} />
                <path d="M190 224 C188 246 194 256 208 255 C222 254 222 240 216 220 Z" fill={P.charcoal} {...inked} />
                {/* Luz lila por el lado de afuera y abajo de cada pata: sin ella se funden con el fondo. */}
                <path
                    d="M82 232 Q84 248 100 248 M200 248 Q214 248 218 232"
                    fill="none"
                    stroke={P.lilac}
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Panza: charcoal casi se funde con el fondo; la banda lila a la
                izquierda y el borde crema del aro le dan silueta. */}
                <path d="M50 116 C26 142 24 196 60 224 C96 250 204 250 240 224 C276 196 274 142 250 116 Z" fill={P.charcoal} {...inked} />
                <path d="M60 128 C42 154 42 198 72 226 C62 198 60 160 76 132 Z" fill={P.lilacDeep} />
                <path
                    d="M92 236 C130 248 176 248 214 238 C188 244 116 244 92 236 Z"
                    fill={P.lilacDeep}
                    stroke={P.lilacDeep}
                    strokeWidth="4"
                    strokeLinejoin="round"
                />
                <path d="M62 146 C56 162 56 178 60 192" fill="none" stroke={P.cream} strokeWidth="3" strokeLinecap="round" opacity="0.45" />
                {/* Borde de luz a la derecha: separa la panza del fondo en el lado de la sombra. */}
                <path d="M256 128 C270 156 268 196 244 222" fill="none" stroke={P.lilacDeep} strokeWidth="4" strokeLinecap="round" />
                {/* Rayado de sombra del lado derecho, en lila (la tinta no se ve sobre charcoal). */}
                <path
                    d="M236 150 L246 140 M234 166 L252 150 M234 182 L254 164 M230 200 L252 180 M222 216 L244 198"
                    stroke={P.lilacDeep}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                {/* Remaches del aro de hierro. */}
                <g fill={P.lilacDeep}>
                    <circle cx="76" cy="140" r="3.5" />
                    <circle cx="224" cy="140" r="3.5" />
                </g>

                {/* Cucharón: va antes del brebaje para que salga "de adentro". Mango curvo
                de grosor irregular rematado en gancho, para que no se lea como hueso. */}
                <path d="M196 104 C206 82 220 60 230 42 L242 48 C232 66 220 88 210 110 Z" fill={P.bone} {...inked} />
                <path
                    d="M230 42 C226 26 240 16 250 24 C256 30 252 40 244 40"
                    fill="none"
                    stroke={INK}
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                <path
                    d="M230 42 C226 26 240 16 250 24 C256 30 252 40 244 40"
                    fill="none"
                    stroke={P.bone}
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                <path d="M207 96 C214 80 224 64 234 50" fill="none" stroke={P.boneShade} strokeWidth="3" strokeLinecap="round" />

                {/* Aro del caldero y brebaje espumoso asomando. */}
                <ellipse cx="150" cy="112" rx="120" ry="20" fill={P.charcoal} {...inked} />
                <path
                    d="M36 106 C44 98 60 94 74 92 M226 92 C244 94 258 98 264 106"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.5"
                />
                <path
                    d="M42 112 C40 94 62 86 78 92 C86 74 112 72 122 84 C132 66 162 66 172 80 C184 70 212 74 216 90 C236 84 260 96 258 112 C240 122 60 122 42 112 Z"
                    fill={P.tealLight}
                    {...inked}
                />
                <path d="M190 90 C204 84 214 92 214 100 C226 96 244 102 250 110 C234 116 206 118 188 116 Z" fill={P.sage} />
                <path
                    d="M70 100 Q78 94 88 98 M132 86 Q142 80 152 84"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.7"
                />
                {/* Labio delantero del aro, con su brillo crema. */}
                <path
                    d="M30 112 C34 128 92 136 150 136 C208 136 266 128 270 112 C262 124 208 126 150 126 C92 126 38 124 30 112 Z"
                    fill={P.charcoal}
                    {...inked}
                />
                {/* Chorrito de brebaje que se derrama por el borde. */}
                <path
                    d="M96 120 C96 132 94 146 100 150 C106 154 110 146 108 134 C108 128 112 124 116 122 Z"
                    fill={P.tealLight}
                    {...inked}
                    strokeWidth="3"
                />
                <path
                    d="M46 124 C80 132 120 134 150 134"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.55"
                />
                <path d="M188 133 L204 131" stroke={P.cream} strokeWidth="3" strokeLinecap="round" opacity="0.55" />

                {/* Burbujitas en reposo: titilan como si reventaran. */}
                <g className="hw-twinkle" style={v({ "--td": "1.6s" })}>
                    <circle cx="104" cy="70" r="7" fill={P.tealLight} {...inked} strokeWidth="3" />
                </g>
                <g className="hw-twinkle" style={v({ "--td": "2.3s", "--bd": "0.5s" })}>
                    <circle cx="160" cy="58" r="5" fill={P.sage} {...inked} strokeWidth="3" />
                </g>
                <g className="hw-twinkle" style={v({ "--td": "1.9s", "--bd": "0.9s" })}>
                    <circle cx="70" cy="80" r="4" fill={P.tealLight} {...inked} strokeWidth="2.5" />
                </g>

                {/* Cara en reposo: ojos mostaza (brillan contra el hierro) y sonrisa. */}
                <g className="hw-off hw-eye" style={v({ "--bd": "1.2s" })}>
                    <ellipse cx="116" cy="172" rx="15" ry="17" fill={P.mustard} {...inked} />
                    <ellipse cx="184" cy="170" rx="16" ry="18" fill={P.mustard} {...inked} />
                    <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                        <circle cx="118" cy="175" r="7" fill={INK} />
                        <circle cx="115" cy="171" r="2.4" fill={P.cream} />
                        <circle cx="186" cy="173" r="7.5" fill={INK} />
                        <circle cx="183" cy="169" r="2.5" fill={P.cream} />
                    </g>
                </g>
                <g className="hw-blink" fill="none" stroke={P.mustard} strokeWidth="4" strokeLinecap="round">
                    <path d="M101 174 Q116 184 131 174" />
                    <path d="M168 172 Q184 182 200 172" />
                </g>
                <g className="hw-off">
                    <path d="M130 204 Q150 218 172 203" fill="none" stroke={P.mustard} strokeWidth="4" strokeLinecap="round" />
                    <path d="M160 209 L162 216 L167 208" fill={P.bone} />
                </g>

                {/* Hervor: ojos enormes con pupila chiquita, bocota y rubor. */}
                <g className="hw-on">
                    <ellipse cx="112" cy="168" rx="26" ry="30" fill={P.mustard} {...inked} />
                    <ellipse cx="188" cy="165" rx="27" ry="31" fill={P.mustard} {...inked} />
                    <circle cx="113" cy="170" r="5" fill={INK} />
                    <circle cx="189" cy="167" r="5" fill={INK} />
                    <path
                        d="M150 200 C164 200 170 210 168 220 C166 232 134 232 132 220 C130 210 136 200 150 200 Z"
                        fill={P.mouth}
                        stroke={P.mustard}
                        strokeWidth="3.5"
                    />
                    <path d="M137 224 Q150 213 163 224 Q158 230 150 230 Q142 230 137 224 Z" fill={P.tongue} />
                    <ellipse cx="80" cy="198" rx="11" ry="6" fill={P.roseLight} opacity="0.8" />
                    <ellipse cx="222" cy="196" rx="11" ry="6" fill={P.roseLight} opacity="0.8" />
                </g>
            </g>

            {/* Burbujas que brotan al reaccionar, fuera del aplastado para que no se
            deformen. Las dos grandes van en su propio grupo para que cada una crezca
            desde su base y no revienten todas como un solo bloque. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                <circle cx="94" cy="38" r="24" fill={P.tealLight} {...inked} />
                <path d="M80 32 Q84 22 94 21" fill="none" stroke={P.cream} strokeWidth="3.5" strokeLinecap="round" />
            </g>
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                <circle cx="156" cy="26" r="19" fill={P.sage} {...inked} />
                <path d="M145 21 Q149 13 156 12" fill="none" stroke={P.cream} strokeWidth="3" strokeLinecap="round" />
            </g>
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                <circle cx="198" cy="58" r="12" fill={P.tealLight} {...inked} />
                <circle cx="58" cy="66" r="8" fill={P.sage} {...inked} strokeWidth="3" />
                <circle cx="128" cy="56" r="6" fill={P.tealLight} {...inked} strokeWidth="3" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "caldero-burbujas",
    name: "Caldero burbujeante",
    w: 300,
    h: 262,
    interactive: true,
    Art,
};

export default monster;
