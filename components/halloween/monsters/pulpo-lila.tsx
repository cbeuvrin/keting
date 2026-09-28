import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Pulpo lila con manchas. Cinco tentáculos que terminan en rizo, con
// ventosas rosas del lado de adentro de la curva.
// Reacción: se pone contento — los tentáculos se agitan cada uno a su ritmo,
// los ojos se vuelven arquitos felices y saca la lengua.

// Ventosas y tentáculos comparten trazo: el de las ventosas es más fino para
// que se lean como detalle y no como otra forma.
const sucker = { fill: P.rose, stroke: INK, strokeWidth: 2 } as const;

function Art() {
    return (
        <g className="hw-sway" style={v({ "--o": "50% 100%", "--sw": "1.5deg", "--sd": "5.2s" })}>
            {/* Tentáculos detrás de la cabeza: su raíz queda tapada. Cada uno
            gira sobre su propia raíz y con otro ángulo, para que no se agiten
            en bloque. Tubo que se afina y rizo de menos de una vuelta: el hueco
            del rizo queda abierto y no se vuelve un nudo de tinta. */}
            <g className="hw-wave" style={v({ "--o": "97% 68%", "--wave": "-26deg" })}>
                <path
                    d="M71.2 108.5 C68.3 109.5 59.2 113.2 54.1 114.7 C48.9 116.2 44.6 117.4 40.5 117.5 C36.4 117.6 33.1 117.4 29.6 115.5 C26.1 113.6 21.1 109.1 19.7 106.1 C18.3 103.1 19.9 99.5 21.4 97.5 C22.9 95.5 26.3 93.8 28.5 94.2 C30.8 94.6 33.9 99 34.9 99.9 A5 5 0 0 0 41.1 92.1 C39.1 90.7 34.2 84.1 29.5 83.8 C24.7 83.6 16.1 86.2 12.6 90.5 C9.1 94.9 6.7 103.9 8.3 109.9 C9.9 115.9 17.2 122.8 22.4 126.5 C27.6 130.3 33.6 131.7 39.5 132.5 C45.4 133.3 51.7 132.4 57.9 131.3 C64.2 130.1 73.7 126.5 76.8 125.5 Z"
                    fill={P.lilac}
                    {...inked}
                />
                <path
                    d="M29.5 121.9 a3.2 3.2 0 1 0 6.4 0 a3.2 3.2 0 1 0 -6.4 0 M18.7 115.2 a2.9 2.9 0 1 0 5.8 0 a2.9 2.9 0 1 0 -5.8 0 M12.4 104.8 a2.7 2.7 0 1 0 5.4 0 a2.7 2.7 0 1 0 -5.4 0 M16.5 94.1 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 M26.3 90.4 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0"
                    {...sucker}
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "4% 70%", "--wave": "24deg" })}>
                <path
                    d="M145.2 123.5 C148.3 124.5 157.9 128.3 164.3 129.3 C170.6 130.3 177.3 130.8 183.2 129.4 C189.2 128 195.3 125.3 200.1 121.2 C204.9 117 210.6 110.5 211.8 104.5 C213 98.5 210.9 89.5 207.3 85.4 C203.7 81.3 195 79.4 190.3 79.9 C185.5 80.3 180.8 86.7 178.9 88.1 A5 5 0 0 0 185.1 95.9 C186.2 95 189.5 90.7 191.7 90.1 C194 89.6 197.3 90.7 198.7 92.6 C200.1 94.5 201.3 98.5 200.2 101.5 C199.1 104.5 195.1 108.6 191.9 110.8 C188.7 113 184.8 114.3 180.8 114.6 C176.7 114.9 172.7 114 167.7 112.7 C162.7 111.3 153.7 107.5 150.8 106.5 Z"
                    fill={P.lilac}
                    {...inked}
                />
                <path
                    d="M185.4 118.1 a3.2 3.2 0 1 0 6.4 0 a3.2 3.2 0 1 0 -6.4 0 M196.2 110.7 a2.9 2.9 0 1 0 5.8 0 a2.9 2.9 0 1 0 -5.8 0 M202 99.8 a2.7 2.7 0 1 0 5.4 0 a2.7 2.7 0 1 0 -5.4 0 M198.4 89.2 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 M188.8 86.4 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0"
                    {...sucker}
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "88% 7%", "--wave": "16deg" })}>
                <path
                    d="M78.9 119.9 C77.8 122.8 75.4 131.7 72.4 137.2 C69.3 142.7 64.5 149.1 60.7 153 C56.9 157 53.1 160 49.6 161.1 C46.2 162.3 42.1 161.5 39.8 160 C37.5 158.5 35.8 154.6 35.8 152.2 C35.8 149.9 37.5 146.7 39.7 145.7 C41.9 144.6 47.5 145.9 49 146 A5 5 0 0 0 49 136 C46.5 136.1 38.4 133.7 34.3 136.3 C30.2 139 24.6 146.1 24.2 151.8 C23.9 157.4 27.5 166.2 32.2 170 C36.9 173.9 45.8 175.7 52.4 174.9 C58.9 174 65.5 169.6 71.3 165 C77.2 160.3 83.3 152.9 87.6 146.8 C91.9 140.6 95.6 131.2 97.1 128.1 Z"
                    fill={P.lilac}
                    {...inked}
                />
                <path
                    d="M58.4 165.1 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M43.7 170.2 a3.1 3.1 0 1 0 6.2 0 a3.1 3.1 0 1 0 -6.2 0 M29.5 163.6 a2.8 2.8 0 1 0 5.6 0 a2.8 2.8 0 1 0 -5.6 0 M26.4 149 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 M34.6 139.3 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0"
                    {...sucker}
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "12% 8%", "--wave": "-14deg" })}>
                <path
                    d="M125.4 130.1 C127.3 132.9 132.1 141.4 136.6 147.2 C141.2 153 146.8 160.3 152.7 165 C158.5 169.6 165.1 174 171.6 174.9 C178.2 175.7 187.1 173.9 191.8 170 C196.5 166.2 200.1 157.4 199.8 151.8 C199.4 146.1 193.8 139 189.7 136.3 C185.6 133.7 177.5 136.1 175 136 A5 5 0 0 0 175 146 C176.5 145.9 182.1 144.6 184.3 145.7 C186.5 146.7 188.2 149.9 188.2 152.2 C188.2 154.6 186.5 158.5 184.2 160 C181.9 161.5 177.8 162.3 174.4 161.1 C170.9 160 167.2 157.1 163.3 153 C159.5 149 154.8 142.3 151.4 136.8 C147.9 131.3 144.1 122.7 142.6 119.9 Z"
                    fill={P.lilac}
                    {...inked}
                />
                <path
                    d="M158.6 165.1 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M174.1 170.2 a3.1 3.1 0 1 0 6.2 0 a3.1 3.1 0 1 0 -6.2 0 M188.9 163.6 a2.8 2.8 0 1 0 5.6 0 a2.8 2.8 0 1 0 -5.6 0 M192.4 149 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 M184.4 139.3 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0"
                    {...sucker}
                />
            </g>
            <g className="hw-wave" style={v({ "--o": "23% 0%", "--wave": "-9deg" })}>
                <path
                    d="M101 130 C101.2 133.3 101.8 143.6 102 149.8 C102.2 155.9 100.8 161.4 102.1 167.1 C103.4 172.7 105.5 179.6 109.8 183.7 C114.1 187.7 122 192.1 127.8 191.3 C133.5 190.4 142 183.7 144.3 178.4 C146.5 173.1 144 163.5 141.2 159.6 C138.4 155.7 129.6 155.9 127.3 155.2 A5 5 0 0 0 124.7 164.8 C126 165.1 131.3 164.9 132.8 166.4 C134.3 167.9 134.8 171.5 133.7 173.6 C132.6 175.7 128.5 178.6 126.2 178.7 C124 178.9 121.6 176.6 120.2 174.3 C118.8 172 118 168.9 117.9 164.9 C117.9 160.9 119.5 156.1 120 150.2 C120.5 144.4 120.8 133.4 121 130 Z"
                    fill={P.lilac}
                    {...inked}
                />
                <path
                    d="M107.6 176.6 a3.4 3.4 0 1 0 6.8 0 a3.4 3.4 0 1 0 -6.8 0 M119.3 186.2 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M133.5 181.9 a2.8 2.8 0 1 0 5.6 0 a2.8 2.8 0 1 0 -5.6 0 M138.6 170.5 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 M133.4 160.4 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0"
                    {...sucker}
                />
            </g>

            {/* Cabeza: bulbo echado hacia atrás y a la derecha, orilla de abajo con
            ondas; sombra del lado derecho. */}
            <path
                d="M58 130 C46 104 42 62 64 36 C82 12 130 2 154 20 C176 38 178 92 164 130 C156 140 144 135 134 138 Q122 142 111 138 Q98 135 88 140 C76 144 64 140 58 130 Z"
                fill={P.lilac}
                {...inked}
            />
            <path d="M154 20 C176 38 178 92 164 130 C158 134 150 133 146 130 C158 100 160 64 146 34 Z" fill={P.lilacDeep} />
            {/* Manchas de la piel: una sola forma con varios óvalos. */}
            <path
                d="M78 38 a8 6 -20 1 0 16 0 a8 6 -20 1 0 -16 0 M103 22 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0 M116 42 a10 8 15 1 0 20 0 a10 8 15 1 0 -20 0 M64 62 a5 4 0 1 0 10 0 a5 4 0 1 0 -10 0 M134 68 a4 5 0 1 0 8 0 a4 5 0 1 0 -8 0 M92 60 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M60 86 a3 4 0 1 0 6 0 a3 4 0 1 0 -6 0"
                fill={P.lilacLight}
            />
            {/* Pequitas de tinta junto a la sombra: textura de piel sin sumar formas. */}
            <path
                d="M138 24 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0 M144 33 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M137 36 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 M144 50 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0 M75 76 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M68 74 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0"
                fill={INK}
            />

            {/* Cara en reposo. */}
            <g className="hw-off hw-eye">
                <ellipse cx="86" cy="96" rx="18" ry="21" fill={P.eyeWhite} {...inked} />
                <ellipse cx="136" cy="94" rx="19" ry="22" fill={P.eyeWhite} {...inked} />
                <g className="hw-pupil" style={v({ "--pr": "5px" })}>
                    <circle cx="89" cy="99" r="10.5" fill={P.irisTeal} />
                    <circle cx="90" cy="100" r="5.5" fill={INK} />
                    <circle cx="85" cy="95" r="2.4" fill={P.cream} />
                    <circle cx="139" cy="97" r="11" fill={P.irisTeal} />
                    <circle cx="140" cy="98" r="5.8" fill={INK} />
                    <circle cx="135" cy="93" r="2.5" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked}>
                <path d="M68 98 Q86 110 104 98" />
                <path d="M117 96 Q136 108 155 96" />
            </g>
            <path className="hw-off" d="M104 121 Q111 127 118 121" fill="none" {...inked} strokeWidth="3.5" />

            {/* Contento: ojos en arquito, boca abierta y cachetes. La boca es más
            ancha que la lengua para que se vea el borde oscuro alrededor. */}
            <g className="hw-on">
                <g fill="none" {...inked} strokeWidth="4.5">
                    <path d="M70 102 Q86 82 102 102" />
                    <path d="M119 100 Q136 79 153 100" />
                </g>
                <ellipse cx="66" cy="116" rx="10" ry="6" fill={P.roseLight} opacity="0.85" />
                <ellipse cx="158" cy="114" rx="10" ry="6" fill={P.roseLight} opacity="0.85" />
                <path d="M95 115 Q111 110 127 115 Q126 137 111 138 Q96 137 95 115 Z" fill={P.mouth} {...inked} />
            </g>
            <g className="hw-tongue">
                <path d="M104 128 C102 146 105 158 111 158 C117 158 120 146 118 128 Z" fill={P.tongue} {...inked} strokeWidth="3" />
                <path d="M111 134 L111.3 150" stroke={P.roseDeep} strokeWidth="2" strokeLinecap="round" />
            </g>
            {/* Destellos de gusto: sobre el fondo, así que en mostaza. */}
            <path
                className="hw-on hw-pop"
                style={v({ "--o": "50% 100%" })}
                d="M34 22 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z M186 30 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z"
                fill={P.mustard}
            />
        </g>
    );
}

const monster: MonsterDef = {
    id: "pulpo-lila",
    name: "Pulpo lila",
    w: 220,
    h: 200,
    interactive: true,
    Art,
};

export default monster;
