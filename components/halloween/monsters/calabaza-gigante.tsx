import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Calabaza gigante tallada. Achaparrada, con costillas marcadas y un zarcillo
// de vid rizado arriba. Reacción: la cara tallada se enciende desde dentro,
// la sonrisa se ensancha, salen chispas y la vid se agita.

function Art() {
    return (
        <g>
            {/* Vid: detrás del tallo para que su unión quede tapada. Se mece
            siempre un poquito y se agita al reaccionar. */}
            <g className="hw-sway" style={v({ "--o": "47% 90%", "--sw": "2deg", "--sd": "5.2s" })}>
                <g className="hw-wave" style={v({ "--o": "47% 90%", "--wave": "-12deg" })}>
                    {/* Zarcillo: sobre el fondo, así que el verde va encima de la tinta. */}
                    <path
                        d="M146 48 C134 32 130 14 110 12 C92 11 88 32 102 33 C112 34 113 22 104 22"
                        fill="none"
                        stroke={P.sage}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path d="M146 54 C130 30 100 26 82 40 C96 44 100 58 118 60 C130 62 140 60 146 54 Z" fill={P.moss} {...inked} />
                    <path
                        d="M140 54 C124 46 108 44 92 42 M118 50 L112 58 M124 49 L126 40"
                        fill="none"
                        stroke={P.sage}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path d="M156 52 C178 24 214 28 226 46 C212 46 206 64 186 63 C172 62 162 60 156 52 Z" fill={P.sage} {...inked} />
                    <path
                        d="M162 53 C180 50 200 48 218 46 M186 51 L180 42 M196 49 L200 58"
                        fill="none"
                        stroke={P.moss}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>
            </g>

            {/* Tallo torcido, detrás del cuerpo. */}
            <path d="M138 90 C138 72 134 58 140 44 C146 40 156 42 160 46 C156 60 158 74 164 90 Z" fill={P.moss} {...inked} />
            <path d="M146 50 C144 62 146 74 148 84" fill="none" stroke={P.sage} strokeWidth="2.5" strokeLinecap="round" />

            {/* Cuerpo: silueta achaparrada con hundidos donde se juntan las costillas. */}
            <path
                d="M150 86 C170 74 200 72 224 80 C258 90 282 122 280 164 C280 214 252 246 214 250 C196 253 180 250 167 245 C156 252 144 252 133 245 C120 251 100 254 84 250 C46 246 18 214 20 164 C20 120 44 90 78 80 C102 72 132 74 150 86 Z"
                fill={P.pumpkin}
                {...inked}
            />
            {/* Sombra plana del gajo derecho y el borde de cada costilla. */}
            <path d="M232 84 C262 116 262 212 232 246 C262 238 280 208 280 164 C280 122 260 94 232 84 Z" fill={P.pumpkinDeep} />
            <path d="M190 78 C214 112 214 206 192 248 C204 206 204 116 184 80 Z" fill={P.pumpkinDeep} />
            <path d="M112 78 C92 112 92 206 112 248 C104 206 102 116 120 80 Z" fill={P.pumpkinDeep} />
            <path d="M66 86 C40 118 40 214 70 246 C54 210 54 122 76 84 Z" fill={P.pumpkinDeep} />
            {/* Costillas en tinta. */}
            <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
                <path d="M112 78 C92 112 92 206 112 248" />
                <path d="M190 78 C214 112 214 206 192 248" />
                <path d="M66 86 C40 118 40 214 70 246" />
                <path d="M232 84 C262 116 262 212 232 246" />
            </g>
            {/* Rayado y rasguños de cáscara. */}
            <path
                d="M258 150 L266 146 M258 164 L268 160 M258 178 L267 175 M256 192 L265 190 M34 196 L40 206 M42 208 L46 216"
                fill="none"
                stroke={INK}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Manchitas de cáscara vieja. */}
            <g fill={P.pumpkinDeep}>
                <ellipse cx="150" cy="238" rx="5" ry="3" />
                <circle cx="162" cy="232" r="2.5" />
                <circle cx="36" cy="150" r="3" />
                <circle cx="30" cy="162" r="2" />
                <circle cx="228" cy="106" r="2.5" />
            </g>
            <path
                d="M80 100 C74 118 72 136 74 150 M160 96 C166 104 168 112 168 120"
                fill="none"
                stroke={P.cream}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.45"
            />

            {/* Cara tallada en reposo: huecos chuecos (un ojo más grande) con
            pupilitas que brillan. La franja mostaza es el grosor de la cáscara
            cortada, lo que hace que se lea como hueco y no como mancha. */}
            <g className="hw-off hw-eye">
                <path d="M82 156 L104 116 L128 154 Q104 162 82 156 Z" fill={P.mouth} {...inked} />
                <path d="M168 150 L198 100 L228 152 Q198 160 168 150 Z" fill={P.mouth} {...inked} />
                <path d="M86 154 L104 122 L107 128 L92 155 Z" fill={P.mustardDeep} />
                <path d="M173 149 L198 106 L201 113 L180 151 Z" fill={P.mustardDeep} />
                <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                    <circle cx="106" cy="144" r="6.5" fill={P.mustard} />
                    <circle cx="104" cy="142" r="2.2" fill={P.cream} />
                    <circle cx="200" cy="137" r="8" fill={P.mustard} />
                    <circle cx="197" cy="134" r="2.6" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" stroke={P.mouth} strokeWidth="6" strokeLinecap="round">
                <path d="M84 150 Q105 140 126 150" />
                <path d="M170 144 Q198 132 226 144" />
            </g>
            <g className="hw-off">
                <path
                    d="M66 184 L86 190 L94 180 L110 196 L124 186 L138 200 L150 188 L164 200 L178 184 L192 194 L202 176 L212 184 L236 170 Q226 214 150 222 Q80 218 66 184 Z"
                    fill={P.mouth}
                    {...inked}
                />
                <path d="M80 200 Q150 224 224 188 Q216 206 150 216 Q98 214 80 200 Z" fill={P.pumpkinDeep} />
            </g>

            {/* Encendida: la luz llena ojos y una sonrisa más ancha. */}
            <g className="hw-on hw-glow">
                <path d="M78 158 L104 110 L132 156 Q104 166 78 158 Z" fill={P.mustard} {...inked} />
                <path d="M164 152 L198 94 L232 154 Q198 164 164 152 Z" fill={P.mustard} {...inked} />
                <path d="M94 152 L104 132 L116 151 Q104 155 94 152 Z" fill={P.cream} />
                <path d="M186 148 L198 124 L212 149 Q198 153 186 148 Z" fill={P.cream} />
                <path
                    d="M48 174 L70 184 L80 172 L98 192 L114 180 L130 198 L148 184 L166 198 L182 180 L198 190 L214 168 L226 178 L254 160 Q246 228 150 236 Q58 232 48 174 Z"
                    fill={P.mustard}
                    {...inked}
                />
                <path d="M84 208 Q150 226 222 198 Q206 228 150 230 Q102 228 84 208 Z" fill={P.cream} />
                {/* Dos dientes de cáscara que se quedaron abajo. */}
                <path d="M114 236 L125 218 L136 236 Z M168 235 L178 216 L189 233 Z" fill={P.pumpkin} {...inked} strokeWidth="3" />
            </g>
            {/* Chispas de luz: van sobre el fondo, en mostaza y crema. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })} fill="none" strokeWidth="3.5" strokeLinecap="round">
                <path d="M30 96 L18 84 M22 118 L8 116" stroke={P.mustard} />
                <path d="M270 96 L282 84 M278 118 L292 116" stroke={P.mustard} />
                <path d="M40 76 L36 64 M260 76 L264 64" stroke={P.cream} />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "calabaza-gigante",
    name: "Calabaza gigante",
    w: 300,
    h: 260,
    interactive: true,
    Art,
};

export default monster;
