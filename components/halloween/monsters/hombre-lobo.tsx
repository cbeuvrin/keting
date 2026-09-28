import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Hombre lobo, cabeza y hombros. Pelaje ciruela con borde de luz lila para que
// la silueta no se pierda en el fondo negro, y una bufanda teal rota que le da
// cara de lobo friolento más que de lobo feroz. El hocico largo, la trufa ancha
// y los dos colmillos son lo que lo separa de un gato: nada de bigotes ni ":3".
// Reacción: aúlla — la cabeza se estira y se ladea, el hocico sube, cierra los
// ojos apretados, abre la boca en O con colmillos y lengua, salen ondas de
// aullido y la punta de la bufanda se agita.

function Art() {
    return (
        <g>
            {/* Hombros: pelaje ciruela con borde en zigzag. */}
            <path
                d="M14 294 L20 274 L12 266 L28 256 L22 244 L42 240 L40 228 L62 228 C90 214 130 210 160 210 C190 210 230 214 258 228 L280 228 L278 240 L298 244 L292 256 L308 266 L300 274 L306 294 Z"
                fill={P.plum}
                {...inked}
            />
            {/* Sombra carbón del lado derecho, a medias como la de la cabeza: sólida se leía
            como un hueco. Deja una franja ciruela junto a la banda de luz, así el zigzag
            se ve como pelo iluminado con sombra adentro. */}
            <path
                d="M214 218 C236 222 250 228 258 236 L270 240 L280 252 L278 262 L288 270 L284 278 L288 292 L250 292 C248 270 240 246 214 218 Z"
                fill={P.charcoal}
                opacity="0.5"
            />
            {/* Banda de luz lila siguiendo todo el zigzag: sin ella el busto se funde con el negro. */}
            <path
                d="M14 294 L20 274 L12 266 L28 256 L22 244 L42 240 L40 228 L62 228 C90 214 130 210 160 210 C190 210 230 214 258 228 L280 228 L278 240 L298 244 L292 256 L308 266 L300 274 L306 294 L298 294 L292 275 L298 267 L285 259 L288 249 L271 248 L272 236 L256 236 C230 222 190 218 160 218 C130 218 90 222 64 236 L48 236 L49 247 L32 249 L35 259 L22 267 L28 275 L22 294 Z"
                fill={P.lilacDeep}
            />
            {/* Mechones del pelaje: cortos y pegados al cuerpo, en lila oscuro para que se vean sobre el ciruela. */}
            <path
                d="M54 262 Q62 270 58 282 M66 256 Q74 264 72 276 M86 264 Q92 272 90 284 M234 262 Q228 272 232 284 M246 256 Q240 266 244 278 M258 264 Q252 272 256 284"
                fill="none"
                stroke={P.lilacDeep}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Mechón del pecho, ciruela, asomando bajo la bufanda. */}
            <path
                d="M122 240 L198 240 L194 262 L184 254 L178 276 L169 260 L160 288 L151 260 L142 276 L136 254 L126 262 Z"
                fill={P.lilacDeep}
                {...inked}
                strokeWidth="3"
            />

            {/* Punta suelta de la bufanda: detrás de la banda para que ésta tape su unión. */}
            <g className="hw-wave" style={v({ "--o": "50% 0%", "--wave": "14deg" })}>
                <path
                    d="M200 236 L236 234 C240 252 243 270 241 288 L233 279 L226 292 L218 280 L209 290 C207 272 203 254 200 236 Z"
                    fill={P.teal}
                    {...inked}
                />
                <path d="M205 240 L207 252 M229 239 L230 249 M207 276 L208 284" stroke={P.tealDeep} strokeWidth="3" strokeLinecap="round" />
                {/* Remiendo cosido con una cruz en cada esquina: la bufanda ya aulló muchas lunas. */}
                <path d="M210 254 L236 251 L238 271 L212 274 Z" fill={P.mustard} {...inked} strokeWidth="2.5" />
                <path
                    d="M212 255 L216 259 M216 255 L212 259 M230 253 L234 257 M234 253 L230 257 M232 265 L236 269 M236 265 L232 269 M214 266 L218 270 M218 266 L214 270"
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </g>

            {/* Banda de la bufanda, con tejido de canalé y el borde roto. */}
            <path
                d="M86 214 C120 228 200 228 236 212 C244 222 244 238 236 248 L226 246 L220 255 L210 250 C170 258 130 258 104 250 L96 257 L90 248 L84 246 C78 236 80 222 86 214 Z"
                fill={P.teal}
                {...inked}
            />
            <path
                d="M84 238 C122 250 198 252 239 240 L236 246 L226 246 L220 253 L210 248 C170 256 130 256 104 248 L96 255 L90 246 L85 244 Z"
                fill={P.tealDeep}
            />
            <path
                d="M98 226 L96 244 M112 230 L111 248 M208 230 L209 248 M222 226 L224 244"
                stroke={P.tealDeep}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Cabeza: se ladea (wave, pivote en el cuello) y se estira al aullar. */}
            <g className="hw-wave" style={v({ "--o": "50% 100%", "--wave": "-12deg" })}>
                <g className="hw-stretch">
                    {/* Orejas detrás de la cabeza; se sacuden al aullar. */}
                    <g className="hw-wave" style={v({ "--o": "100% 100%", "--wave": "-12deg" })}>
                        <path d="M94 112 L70 30 C92 36 118 56 134 80 Z" fill={P.plum} {...inked} />
                        <path d="M96 98 L80 46 C94 52 108 64 118 78 Z" fill={P.rose} />
                        <path d="M88 64 L96 70 M92 78 L100 82" stroke={P.roseDeep} strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                    <g className="hw-wave" style={v({ "--o": "0% 100%", "--wave": "12deg" })}>
                        <path d="M226 112 L250 30 C228 36 202 56 186 80 Z" fill={P.plum} {...inked} />
                        <path d="M224 98 L240 46 C226 52 212 64 202 78 Z" fill={P.rose} />
                        <path d="M232 64 L224 70 M228 78 L220 82" stroke={P.roseDeep} strokeWidth="2.5" strokeLinecap="round" />
                    </g>

                    {/* Cráneo con copete y cachetes de pelo en zigzag. */}
                    <path
                        d="M80 100 C90 82 104 72 120 66 L128 48 L140 62 L152 42 L162 60 L174 44 L182 62 L196 52 L200 68 C218 74 232 86 240 100 L262 104 L246 120 L272 132 L250 144 L270 160 L246 170 L260 188 L236 192 C224 210 206 224 190 230 L182 244 L172 233 L160 248 L148 233 L138 244 L130 230 C114 224 96 210 84 192 L60 188 L74 170 L50 160 L70 144 L48 132 L74 120 L58 104 Z"
                        fill={P.plum}
                        {...inked}
                    />
                    {/* Sombra carbón del lado derecho; del izquierdo, mechones de luz lila siguiendo el cachete. */}
                    <path
                        d="M236 106 L256 108 L242 122 L264 132 L246 144 L262 160 L242 170 L252 186 L234 188 C242 164 244 132 236 106 Z"
                        fill={P.charcoal}
                        opacity="0.75"
                    />
                    <path
                        d="M94 110 L78 118 L90 122 L76 132 L96 128 Z M90 140 L74 148 L88 152 L76 162 L94 158 Z M92 170 L80 178 L92 180 L86 190 L100 182 Z"
                        fill={P.lilacDeep}
                    />
                    <path d="M124 70 L130 56 L140 68 L152 50 L160 66 C146 66 134 68 124 74 Z" fill={P.lilacDeep} />
                    {/* Antifaz carbón en la frente, como marca de lobo. */}
                    <path
                        d="M134 72 C146 88 154 98 160 108 C166 98 174 88 186 72 C176 80 168 84 160 85 C152 84 144 80 134 72 Z"
                        fill={P.charcoal}
                    />
                    <path d="M112 88 L118 98 M204 88 L200 98 M210 100 L204 108" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />

                    {/* Cejas y ojos de pupila rasgada. */}
                    <path d="M100 106 C112 96 130 98 144 110 C130 106 114 106 102 114 Z" fill={INK} />
                    <path d="M220 106 C208 96 190 98 176 110 C190 106 206 106 218 114 Z" fill={INK} />
                    <g className="hw-off hw-eye">
                        <ellipse cx="122" cy="126" rx="17" ry="14" fill={P.mustard} {...inked} />
                        <ellipse cx="198" cy="126" rx="17" ry="14" fill={P.mustard} {...inked} />
                        <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                            <ellipse cx="124" cy="127" rx="3.6" ry="10" fill={INK} />
                            <circle cx="117" cy="121" r="2.6" fill={P.cream} />
                            <ellipse cx="200" cy="127" rx="3.6" ry="10" fill={INK} />
                            <circle cx="193" cy="121" r="2.6" fill={P.cream} />
                        </g>
                    </g>
                    <g className="hw-blink" fill="none" {...inked}>
                        <path d="M105 127 Q122 138 139 127" />
                        <path d="M181 127 Q198 138 215 127" />
                    </g>
                    {/* Aullido: ojos apretados. */}
                    <g className="hw-on">
                        <path d="M104 130 Q122 112 140 130 M180 130 Q198 112 216 130" fill="none" {...inked} strokeWidth="4.5" />
                        <path d="M100 138 L106 134 M220 138 L214 134" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
                    </g>

                    {/* Hocico: sube al aullar, como si apuntara a la luna. */}
                    <g className="hw-hop" style={v({ "--hop": "-8px" })}>
                        {/* Trompa larga, más larga que ancha, con mechones en zigzag a los lados. */}
                        <path
                            d="M124 172 L112 176 L120 181 L106 186 L118 190 M196 172 L208 176 L200 181 L214 186 L202 190"
                            fill="none"
                            stroke={P.lilacDeep}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M150 106 C154 101 166 101 170 106 C173 122 176 136 186 146 C200 158 202 190 194 208 C188 222 174 228 160 228 C146 228 132 222 126 208 C118 190 120 158 134 146 C144 136 147 122 150 106 Z"
                            fill={P.lilac}
                            {...inked}
                        />
                        <path
                            d="M155 112 C157 110 161 110 163 112 C163 124 162 134 160 142 C158 134 156 124 155 112 Z M134 166 C137 158 142 154 148 154 C143 160 140 166 138 174 Z"
                            fill={P.lilacLight}
                        />
                        {/* Trufa ancha y chata. */}
                        <path d="M144 160 C150 150 170 150 176 160 C172 168 148 168 144 160 Z" fill={INK} />
                        <ellipse cx="153" cy="156" rx="4" ry="1.8" fill={P.cream} opacity="0.8" />

                        {/* Boca en reposo: alta y corta, con barbilla debajo; si baja hasta el fondo
                        del hocico, la cara se vuelve de caballo o de calcetín. */}
                        <g className="hw-off">
                            <path d="M142 206 Q160 214 178 206" fill="none" stroke={P.lilacDeep} strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M160 166 L160 182 M138 182 Q160 192 182 182" fill="none" {...inked} strokeWidth="3.5" />
                            <path
                                d="M143.5 184 L146 193 L148.5 184 Z M171.5 184 L174 193 L176.5 184 Z"
                                fill={P.bone}
                                {...inked}
                                strokeWidth="2.5"
                            />
                        </g>

                        {/* Aullido: boca en O vertical con colmillos. */}
                        <g className="hw-on">
                            <path
                                d="M140 186 C142 178 178 178 180 186 C184 214 174 238 160 240 C146 238 136 214 140 186 Z"
                                fill={P.mouth}
                                {...inked}
                            />
                            <path
                                d="M144 184 L149 199 L154 182 Z M166 182 L171 199 L176 184 Z"
                                fill={P.bone}
                                {...inked}
                                strokeWidth="2.5"
                            />
                        </g>
                        <path
                            className="hw-tongue"
                            d="M148 214 Q160 204 172 214 Q170 230 160 230 Q150 230 148 214 Z"
                            fill={P.tongue}
                            {...inked}
                            strokeWidth="2.5"
                        />
                    </g>
                </g>
            </g>

            {/* Ondas del aullido: sobre el fondo, así que en mostaza y crema. */}
            <g className="hw-on hw-pop" style={v({ "--o": "0% 100%" })} fill="none" strokeWidth="4" strokeLinecap="round">
                <path d="M262 62 Q278 50 274 32" stroke={P.mustard} />
                <path d="M280 78 Q302 60 294 30" stroke={P.cream} />
                <path d="M58 62 Q42 50 46 32" stroke={P.mustard} />
                <path d="M40 78 Q18 60 26 30" stroke={P.cream} />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "hombre-lobo",
    name: "Hombre lobo",
    w: 320,
    h: 300,
    interactive: true,
    Art,
};

export default monster;
