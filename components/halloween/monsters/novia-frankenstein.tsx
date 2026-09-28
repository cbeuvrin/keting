import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// La novia de Frankenstein, versión tierna y propia: colmena altísima con dos
// mechones en rayo, piel verde salvia con costuras y cuello de holanes.
// Reacción: se electrifica — el peinado se eriza y crece, saltan chispas,
// abre los ojos como platos, hace boca de "O" y se lleva las manos a la cara.

function Art() {
    return (
        // Bajamos un poco para dejar aire arriba: el peinado crece al reaccionar.
        <g transform="translate(0 6)">
            {/* Peinado detrás de la cara: la cara tapa la parte baja y el estirón
            (pivote abajo) solo empuja la torre hacia arriba. */}
            <g className="hw-stretch">
                {/* Pelos erizados: asoman por arriba solo al reaccionar. */}
                <g className="hw-on">
                    <path
                        d="M66 68 L56 38 L76 52 L78 20 L96 46 L106 18 L116 46 L138 24 L142 72 Z"
                        fill={P.lilacDeep}
                        {...inked}
                        strokeWidth="3"
                    />
                    {/* Banda de luz en cada púa: contrasta con el lila oscuro. */}
                    <path
                        d="M64 58 L60 46 M80 48 L81 34 M100 42 L105 28 M122 44 L130 35"
                        fill="none"
                        stroke={P.lilacLight}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </g>
                <path
                    d="M46 246 C24 200 28 160 44 140 C28 108 40 76 62 58 C78 44 94 40 106 42 C132 44 150 62 158 90 C166 114 162 130 156 140 C174 160 176 200 154 246 Z"
                    fill={P.charcoal}
                    {...inked}
                />
                {/* Mechones del peinado: banda de luz que dibuja la colmena y la
                despega del fondo. */}
                <path
                    d="M48 132 C40 110 44 86 64 64 M152 136 C160 114 158 90 138 60 M52 124 Q66 112 82 118 Q98 124 108 114 Q124 104 150 120 M60 82 Q74 72 90 78 Q104 84 116 74 Q128 66 142 78 M40 204 C32 180 36 160 48 146 M160 204 C168 180 164 160 152 146 M68 62 Q100 38 136 58"
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                {/* Los dos mechones en rayo, hueso con filo de tinta. */}
                <path
                    d="M62 168 L72 138 L58 124 L74 100 L62 86 L84 52 M140 166 L132 140 L148 128 L126 106 L142 88 L118 54"
                    fill="none"
                    stroke={INK}
                    strokeWidth="11"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                <path
                    d="M62 168 L72 138 L58 124 L74 100 L62 86 L84 52 M140 166 L132 140 L148 128 L126 106 L142 88 L118 54"
                    fill="none"
                    stroke={P.bone}
                    strokeWidth="6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </g>

            {/* Cuello: solo asoma una tira; la costura va en la mejilla. */}
            <path d="M88 232 C86 242 86 252 88 258 L112 258 C114 252 114 242 112 232 Z" fill={P.sage} {...inked} />

            {/* Vestido de novia con mangas abullonadas: le da hombros y la cabeza
            ya no parece asomarse de un capullo. */}
            <path d="M38 280 C38 264 54 254 72 250 L128 250 C146 254 162 264 162 280 Q100 283 38 280 Z" fill={P.bone} {...inked} />
            <path
                d="M82 262 Q80 270 82 280 M118 262 Q120 270 118 280"
                fill="none"
                stroke={P.boneShade}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path d="M22 266 C16 248 30 234 48 238 C64 240 72 254 66 268 C54 278 32 278 22 266 Z" fill={P.bone} {...inked} />
            <path d="M178 264 C184 247 170 234 152 238 C137 241 128 254 134 267 C146 277 168 277 178 264 Z" fill={P.bone} {...inked} />
            <path
                d="M34 242 Q39 256 32 270 M48 240 Q54 256 48 274 M60 246 Q64 258 60 270 M166 242 Q161 256 168 268 M152 240 Q146 256 152 274 M140 246 Q136 258 140 270"
                fill="none"
                stroke={P.boneShade}
                strokeWidth="3"
                strokeLinecap="round"
            />
            {/* Holán del escote. */}
            <path
                d="M56 254 Q66 264 76 254 Q85 266 94 256 Q100 266 106 256 Q115 266 124 254 Q134 264 144 254 C124 250 76 250 56 254 Z"
                fill={P.cream}
                stroke={INK}
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <path
                d="M100 262 L88 256 L88 270 Z M100 262 L112 256 L112 270 Z"
                fill={P.rose}
                stroke={INK}
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <circle cx="100" cy="262" r="3.5" fill={P.roseDeep} stroke={INK} strokeWidth="2" />

            {/* Cara salvia con sombra musgo y el frente del peinado. */}
            <path
                d="M100 148 C136 146 154 172 152 200 C150 228 128 244 100 244 C72 244 50 228 48 200 C46 172 64 146 100 148 Z"
                fill={P.sage}
                {...inked}
            />
            <path d="M140 172 C154 194 150 222 126 236 C142 214 146 194 140 172 Z" fill={P.moss} opacity="0.8" />
            <path
                d="M49 188 C50 158 78 142 100 152 C122 142 150 158 151 188 C138 170 118 164 100 168 C82 164 62 170 49 188 Z"
                fill={P.charcoal}
                {...inked}
                strokeWidth="3"
            />
            <path
                d="M62 170 C72 160 86 155 96 157 M138 170 C128 160 114 155 104 157"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Costura de la mejilla. */}
            <path d="M60 220 L76 229 M65 218 L62 225 M72 222 L69 229" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />

            {/* Rasgos de la cara, bajados a la altura de la cara nueva. */}
            <g transform="translate(0 8)">
                {/* Reposo: ojos dorados con pestañas largas y labios rosas. */}
                <g className="hw-off hw-eye">
                    <ellipse cx="82" cy="190" rx="12" ry="14" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                    <ellipse cx="118" cy="190" rx="12" ry="14" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                    <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                        <circle cx="83" cy="193" r="6.5" fill={P.irisGold} />
                        <circle cx="84" cy="194" r="3.2" fill={INK} />
                        <circle cx="81" cy="190" r="1.6" fill={P.cream} />
                        <circle cx="119" cy="193" r="6.5" fill={P.irisGold} />
                        <circle cx="120" cy="194" r="3.2" fill={INK} />
                        <circle cx="117" cy="190" r="1.6" fill={P.cream} />
                    </g>
                    <path
                        d="M72 180 L66 174 M77 177 L74 170 M128 180 L134 174 M123 177 L126 170"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>
                <g className="hw-blink" fill="none" {...inked} strokeWidth="3">
                    <path d="M71 191 Q82 199 93 191 M73 195 L68 201 M79 198 L77 204" />
                    <path d="M107 191 Q118 199 129 191 M127 195 L132 201 M121 198 L123 204" />
                </g>
                <path
                    className="hw-off"
                    d="M91 216 Q96 212 100 215 Q104 212 109 216 Q100 223 91 216 Z"
                    fill={P.roseDeep}
                    stroke={INK}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />

                {/* Reacción: ojos como platos, boca en "O", rubor y manos a las mejillas. */}
                <g className="hw-on">
                    <ellipse cx="82" cy="189" rx="14" ry="17" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                    <ellipse cx="118" cy="189" rx="14" ry="17" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                    <circle cx="82" cy="190" r="3.5" fill={INK} />
                    <circle cx="118" cy="190" r="3.5" fill={INK} />
                    <path
                        d="M70 176 L63 168 M76 172 L73 163 M130 176 L137 168 M124 172 L127 163"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <ellipse cx="100" cy="220" rx="8" ry="10" fill={P.mouth} stroke={P.roseDeep} strokeWidth="4" />
                    <ellipse cx="68" cy="212" rx="7" ry="4" fill={P.roseLight} opacity="0.85" />
                    <ellipse cx="132" cy="212" rx="7" ry="4" fill={P.roseLight} opacity="0.85" />
                </g>
                <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                    <path
                        d="M40 222 C34 208 38 190 50 186 C56 184 60 190 58 196 C62 190 68 194 64 202 C66 210 62 220 56 226 Z"
                        fill={P.sage}
                        {...inked}
                        strokeWidth="3"
                    />
                    <path
                        d="M160 222 C166 208 162 190 150 186 C144 184 140 190 142 196 C138 190 132 194 136 202 C134 210 138 220 144 226 Z"
                        fill={P.sage}
                        {...inked}
                        strokeWidth="3"
                    />
                    <path
                        d="M44 200 L52 194 M44 208 L54 202 M46 216 L55 210 M156 200 L148 194 M156 208 L146 202 M154 216 L145 210"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>
            </g>

            {/* Chispas: van sobre el fondo, en crema y mostaza. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })} strokeLinecap="round" strokeLinejoin="round">
                <path d="M40 58 L30 70 L40 72 L30 86" fill="none" stroke={P.mustard} strokeWidth="3.5" />
                <path d="M164 48 L172 62 L162 64 L172 78" fill="none" stroke={P.mustard} strokeWidth="3.5" />
                <path
                    d="M38 118 L38 132 M31 125 L45 125 M160 110 L160 124 M153 117 L167 117 M150 4 L150 14 M145 9 L155 9"
                    fill="none"
                    stroke={P.cream}
                    strokeWidth="3"
                />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "novia-frankenstein",
    name: "Novia de Frankenstein",
    w: 200,
    h: 292,
    interactive: true,
    Art,
};

export default monster;
