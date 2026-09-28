import { BG, INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// El hombre invisible: no hay cuerpo, solo lo que lleva puesto flotando.
// Sombrero, lentes oscuros, cabeza vendada, bufanda y un abrigo vacío por
// cuyo cuello y mangas se ve el fondo.
// Reacción: el sombrero salta, los lentes se levantan y debajo aparecen dos
// ojitos sorprendidos, se le abre una boquita y la bufanda ondea.

function Art() {
    return (
        // Todo baja para que el sombrero tenga aire al saltar.
        <g transform="translate(0 20)">
            <g className="hw-float" style={v({ "--fd": "4.2s", "--fa": "-7px" })}>
                {/* Abrigo vacío: el cuello, las mangas y el bajo se rellenan con el
            color del fondo para que se vea que adentro no hay nadie. */}
                <path
                    d="M36 218 C32 196 36 174 54 162 L116 162 C134 174 138 196 134 218 Q110 226 85 222 Q60 226 36 218 Z"
                    fill={P.mustardDeep}
                    {...inked}
                />
                <path
                    d="M44 212 C42 194 44 178 54 170"
                    fill="none"
                    stroke={P.mustard}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.8"
                />
                {/* Por abajo se asoma el interior hueco; su borde de abajo es el bajo del abrigo. */}
                <ellipse cx="85" cy="221" rx="44" ry="5.5" fill={BG} stroke={INK} strokeWidth="3" />
                {/* Cuello del abrigo: hueco al fondo con filo ciruela, y las solapas. */}
                <ellipse cx="85" cy="164" rx="30" ry="8" fill={BG} stroke={INK} strokeWidth="7" />
                <ellipse cx="85" cy="164" rx="30" ry="8" fill="none" stroke={P.plum} strokeWidth="3" />
                <path d="M54 162 L74 204 L82 172 Z M116 162 L96 204 L88 172 Z" fill={P.mustard} {...inked} strokeWidth="3" />
                <circle cx="85" cy="192" r="3.5" fill={P.bone} stroke={INK} strokeWidth="2" />
                <circle cx="85" cy="207" r="3.5" fill={P.bone} stroke={INK} strokeWidth="2" />
                <path
                    d="M58 180 L66 196 M112 180 L104 196"
                    fill="none"
                    stroke={INK}
                    strokeWidth="2"
                    strokeDasharray="3 4"
                    strokeLinecap="round"
                    opacity="0.5"
                />
                {/* Mangas vacías que cuelgan flojas pegadas al abrigo, más cortas que el
            bajo y con el puño girado hacia adentro; un tono más claras para que
            se separen del cuerpo. */}
                <path d="M50 166 C36 176 30 190 32 202 L48 204 C48 192 50 184 56 178 Z" fill={P.mustard} {...inked} />
                <path d="M120 166 C134 176 140 190 138 202 L122 204 C122 192 120 184 114 178 Z" fill={P.mustard} {...inked} />
                <path
                    d="M41 182 Q38 191 39 198 M129 182 Q132 191 131 198"
                    fill="none"
                    stroke={P.mustardDeep}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <ellipse cx="40" cy="203" rx="8.5" ry="3.5" fill={BG} stroke={INK} strokeWidth="6" />
                <ellipse cx="40" cy="203" rx="8.5" ry="3.5" fill="none" stroke={P.plum} strokeWidth="2.5" />
                <ellipse cx="130" cy="203" rx="8.5" ry="3.5" fill={BG} stroke={INK} strokeWidth="6" />
                <ellipse cx="130" cy="203" rx="8.5" ry="3.5" fill="none" stroke={P.plum} strokeWidth="2.5" />

                {/* Lo de arriba flota un poco más alto que el abrigo: entre la bufanda
            y las solapas tiene que verse el hueco vacío del cuello. */}
                <g transform="translate(0 -14)">
                    {/* Cabeza vendada con su sombra; el rayado de arriba son las vueltas
            de venda más apretadas. */}
                    <path
                        d="M85 52 C109 52 122 72 122 98 C122 124 110 148 85 150 C60 148 48 124 48 98 C48 72 61 52 85 52 Z"
                        fill={P.bone}
                        {...inked}
                    />
                    <path d="M112 70 C122 92 120 124 102 144 C114 122 116 94 112 70 Z" fill={P.boneShade} />
                    <path
                        d="M56 76 L64 70 M60 82 L74 70 M68 82 L80 72 M78 82 L90 72 M88 82 L100 72 M98 82 L110 72 M108 82 L116 76"
                        fill="none"
                        stroke={P.boneShade}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <path
                        d="M50 86 Q85 94 120 84 M49 118 Q85 128 121 116 M53 132 Q85 142 117 130"
                        fill="none"
                        stroke={INK}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                    {/* Punta suelta de la venda: tira plana con el extremo deshilachado
                    y una línea de pliegue por el centro. */}
                    <path
                        d="M116 124 C126 128 136 136 138 148 L130 146 L132 154 L124 148 C124 138 120 132 112 130 Z"
                        fill={P.bone}
                        {...inked}
                        strokeWidth="2.5"
                    />
                    <path d="M118 128 C126 134 130 140 131 146" fill="none" stroke={P.boneShade} strokeWidth="2" strokeLinecap="round" />

                    {/* Bufanda enrollada; la punta ondea al reaccionar (pivote arriba, y va
            después del abrigo para quedar encima). */}
                    <path
                        d="M46 140 C66 148 104 148 124 140 C129 147 129 153 124 160 C104 168 66 168 46 160 C41 153 41 147 46 140 Z"
                        fill={P.teal}
                        {...inked}
                    />
                    <path
                        d="M58 146 C62 152 62 158 58 164 M84 150 C88 156 88 160 84 166 M110 146 C114 152 114 158 110 164"
                        fill="none"
                        stroke={P.tealDeep}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <g className="hw-wave" style={v({ "--o": "50% 0%", "--wave": "16deg" })}>
                        <path d="M54 156 L72 158 C74 174 70 190 66 206 L50 204 C54 190 56 172 54 156 Z" fill={P.teal} {...inked} />
                        <path d="M56 174 L71 176 M55 189 L68 191" fill="none" stroke={P.tealLight} strokeWidth="4" strokeLinecap="round" />
                        <path
                            d="M52 207 L51 215 M58 208 L58 216 M64 209 L64 216"
                            fill="none"
                            stroke={P.tealLight}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </g>

                    {/* Reacción: bajo los lentes aparecen huecos con ojitos crema y una boquita. */}
                    <g className="hw-on">
                        <ellipse cx="70" cy="102" rx="11" ry="12" fill={INK} />
                        <ellipse cx="100" cy="102" rx="11" ry="12" fill={INK} />
                        <circle cx="70" cy="102" r="6" fill={P.cream} />
                        <circle cx="100" cy="102" r="6" fill={P.cream} />
                        <circle cx="71" cy="103" r="2.4" fill={INK} />
                        <circle cx="101" cy="103" r="2.4" fill={INK} />
                        <ellipse cx="85" cy="128" rx="5" ry="6.5" fill={P.mouth} {...inked} strokeWidth="2.5" />
                    </g>

                    {/* Lentes redondos: se levantan al reaccionar. El reflejo sigue al
            cursor, así el personaje "mira" aunque no tenga ojos a la vista. */}
                    <g className="hw-hop" style={v({ "--hop": "-30px" })}>
                        <path
                            d="M50 98 L46 94 M120 98 L124 94 M82 100 Q85 96 88 100"
                            fill="none"
                            stroke={INK}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <circle cx="68" cy="102" r="14" fill={P.charcoal} {...inked} strokeWidth="3.5" />
                        <circle cx="102" cy="102" r="14" fill={P.charcoal} {...inked} strokeWidth="3.5" />
                        <g className="hw-eye">
                            <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                                <path
                                    d="M60 98 Q62 92 68 91 M94 98 Q96 92 102 91"
                                    fill="none"
                                    stroke={P.cream}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <circle cx="73" cy="107" r="1.8" fill={P.cream} />
                                <circle cx="107" cy="107" r="1.8" fill={P.cream} />
                            </g>
                        </g>
                        {/* Guiño: el reflejo se aplana un instante en una raya. */}
                        <path
                            className="hw-blink"
                            d="M62 100 L74 100 M96 100 L108 100"
                            fill="none"
                            stroke={P.cream}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </g>

                    {/* Sombrero de ala: salta. La banda lila del borde lo despega del fondo. */}
                    <g className="hw-hop" style={v({ "--hop": "-14px" })}>
                        <path d="M52 66 C50 46 54 32 60 26 C76 20 96 20 110 26 C116 32 120 46 118 66 Z" fill={P.plum} {...inked} />
                        <path
                            d="M58 58 C57 44 60 34 64 30 M112 58 C113 44 110 34 106 30"
                            fill="none"
                            stroke={P.lilacDeep}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path
                            d="M53 52 C72 58 98 58 117 52 L118 62 C98 68 72 68 52 62 Z"
                            fill={P.rose}
                            stroke={INK}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                        <path d="M30 68 C38 58 132 58 140 68 C132 78 38 78 30 68 Z" fill={P.plum} {...inked} />
                        <path d="M40 68 C60 64 110 64 130 68" fill="none" stroke={P.lilac} strokeWidth="3" strokeLinecap="round" />
                    </g>

                    {/* Líneas de salto, en crema porque caen sobre el fondo. */}
                    <g
                        className="hw-on hw-pop"
                        style={v({ "--o": "50% 100%" })}
                        fill="none"
                        stroke={P.cream}
                        strokeWidth="3"
                        strokeLinecap="round"
                    >
                        <path d="M34 34 L24 26" />
                        <path d="M136 34 L146 26" />
                        <path d="M30 50 L18 48" />
                        <path d="M140 50 L152 48" />
                    </g>
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "hombre-invisible",
    name: "Hombre invisible",
    w: 170,
    h: 256,
    interactive: true,
    Art,
};

export default monster;
