import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Dragoncito sentado, mirando a la izquierda: panzón, con crestas rayadas,
// panza de escamas y alitas de murciélago.
// Reacción: estornuda — aprieta los ojos (> <), abre la boca, le salen
// bocanadas de humo y una llamita por la nariz y las alitas aletean.

const dot = { fill: "none", strokeLinecap: "round" } as const;
const detail = { stroke: INK, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Art() {
    return (
        // Corrido a la derecha: el estornudo sale por la izquierda y necesita aire.
        <g transform="translate(20 0)">
            {/* Alitas detrás del cuerpo; el aleteo pivota en la unión con la espalda. */}
            <g className="hw-flap" style={v({ "--o": "0% 100%" })}>
                <path
                    d="M146 94 C154 76 170 60 196 56 C198 66 194 72 188 76 C196 80 194 90 186 92 C176 96 160 98 146 94 Z"
                    fill={P.lilacDeep}
                    {...inked}
                />
                <path d="M148 93 L192 60 M148 93 L188 84" fill="none" stroke={P.lilac} strokeWidth="3" strokeLinecap="round" />
            </g>
            <g className="hw-flap" style={v({ "--o": "0% 100%" })}>
                <path
                    d="M128 98 C132 70 150 40 180 26 C182 40 180 50 176 56 C184 58 186 68 180 74 C188 78 186 90 178 92 C166 98 146 100 128 98 Z"
                    fill={P.lilac}
                    {...inked}
                />
                <path
                    d="M132 96 L176 32 M132 96 L176 60 M132 96 L178 80"
                    fill="none"
                    stroke={P.lilacDeep}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </g>

            {/* Cola enroscada con manchitas claras. */}
            <path
                d="M150 162 C176 166 206 154 208 126 C210 102 190 90 176 100 C166 108 170 122 182 120 C188 118 190 110 186 106 C196 108 198 120 194 132 C188 148 170 150 150 142 Z"
                fill={P.teal}
                {...inked}
            />
            <path d="M164 156h0M178 154h0M192 146h0M200 132h0M202 118h0" {...dot} stroke={P.tealLight} strokeWidth="5.5" />

            {/* Crestas rayadas en nuca y espalda (detrás de la cabeza). */}
            <path
                d="M110 30 L124 5 L130 37 Z M125 36 L154 22 L138 52 Z M133 52 L162 56 L137 72 Z"
                fill={P.rose}
                {...inked}
                strokeWidth="3"
            />
            <path
                d="M117 22 L126 18 M119 30 L128 27 M133 36 L145 29 M135 44 L143 40 M140 57 L152 58 M138 64 L146 64"
                fill="none"
                {...detail}
                strokeWidth="2"
            />

            {/* Cuernitos. */}
            <path d="M66 34 C60 22 62 12 70 10 C74 18 78 26 80 30 Z" fill={P.bone} {...inked} strokeWidth="3" />
            <path d="M84 28 C82 16 86 8 94 6 C96 14 96 22 96 26 Z" fill={P.boneShade} {...inked} strokeWidth="3" />

            {/* Cuerpo panzón con sombra, panza de escamas, patitas y bracito. */}
            <path
                d="M72 98 C58 114 58 148 74 164 C92 176 140 176 156 162 C170 146 166 110 148 94 C132 82 92 84 72 98 Z"
                fill={P.teal}
                {...inked}
            />
            <path d="M150 104 C162 120 162 148 150 160 C146 163 143 160 146 156 C154 142 154 122 144 108 Z" fill={P.tealDeep} />
            <path
                d="M78 112 C70 128 72 152 88 164 C104 172 126 170 136 160 C144 146 142 124 130 112 C116 102 90 102 78 112 Z"
                fill={P.mustard}
                {...detail}
                strokeWidth="3"
            />
            <path
                d="M82 124 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 M76 138 q6.4 6 12.8 0 q6.4 6 12.8 0 q6.4 6 12.8 0 q6.4 6 12.8 0 q6.4 6 12.8 0 M84 152 q6.5 6 13 0 q6.5 6 13 0 q6.5 6 13 0 q6.5 6 13 0"
                fill="none"
                stroke={P.mustardDeep}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path d="M78 160 C68 162 66 174 76 175 L102 175 C106 168 100 160 90 158 Z" fill={P.teal} {...inked} />
            <path d="M124 160 C116 162 116 175 126 175 L150 175 C154 168 146 158 136 158 Z" fill={P.teal} {...inked} />
            <path
                d="M84 108 C76 116 76 132 86 137 C94 140 99 133 95 127 C91 122 91 115 94 109 Z"
                fill={P.teal}
                {...detail}
                strokeWidth="3"
            />
            <path d="M72 168h0M78 172h0M120 168h0M126 172h0M84 134h0M90 138h0" {...dot} stroke={P.bone} strokeWidth="4.5" />

            {/* Cabeza redonda con hocico hacia la izquierda. */}
            <path
                d="M30 86 C24 78 28 66 40 64 C44 42 62 24 92 24 C122 24 140 44 138 68 C136 92 118 104 92 104 C72 104 60 100 48 98 C38 96 34 92 30 86 Z"
                fill={P.teal}
                {...inked}
            />
            <path d="M126 50 C134 66 130 88 112 98 C108 100 106 97 110 94 C124 84 128 66 122 52 Z" fill={P.tealDeep} />
            {/* Escamitas en la nuca, lejos de los ojos para que no parezcan cejas. */}
            <path
                d="M112 82 q4 4 8 0 M118 70 q4 4 8 0 M104 92 q4 4 8 0 M122 58 q3 3 6 0"
                fill="none"
                stroke={P.tealLight}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path d="M34 74h0M42 71h0" {...dot} stroke={INK} strokeWidth="4.5" />
            <ellipse cx="84" cy="84" rx="8" ry="4.5" fill={P.roseLight} opacity="0.8" />

            {/* Boca en reposo: sonrisita con colmillito. */}
            <g className="hw-off">
                <path d="M50 94 L53 99 L56 94.6" fill={P.bone} {...detail} strokeWidth="2" />
                <path d="M38 90 Q48 97 62 92" fill="none" {...detail} strokeWidth="3" />
            </g>

            {/* Ojos en reposo, con pupilas que siguen al cursor. */}
            <g className="hw-off hw-eye">
                <ellipse cx="66" cy="56" rx="12" ry="14" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                <ellipse cx="101" cy="54" rx="13" ry="15" fill={P.eyeWhite} {...inked} strokeWidth="3.5" />
                <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                    <circle cx="64" cy="58" r="7" fill={P.irisGold} />
                    <circle cx="63" cy="59" r="3.6" fill={INK} />
                    <circle cx="60" cy="55" r="1.9" fill={P.cream} />
                    <circle cx="99" cy="56" r="7.5" fill={P.irisGold} />
                    <circle cx="98" cy="57" r="3.8" fill={INK} />
                    <circle cx="95" cy="53" r="2" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink" fill="none" {...inked}>
                <path d="M54 58 Q66 66 78 58" />
                <path d="M88 56 Q101 65 114 56" />
            </g>

            {/* Estornudo: ojos apretados, boca abierta. */}
            <g className="hw-on" fill="none" {...inked} strokeWidth="4.5">
                <path d="M58 48 L74 57 L58 66" />
                <path d="M110 45 L93 55 L110 65" />
            </g>
            <path className="hw-on" d="M40 90 Q50 88 60 92 Q56 104 46 100 Q40 97 40 90 Z" fill={P.mouth} {...inked} strokeWidth="3" />

            {/* Humo y llamita: van sobre el fondo, así que en crema y calabaza. */}
            <g className="hw-on hw-pop" style={v({ "--o": "100% 50%" })}>
                <path
                    d="M16.4 55 Q17.6 62.6 8.7 61.3 Q2.5 68.2 -2.5 60.7 Q-10.5 60.2 -8.9 53.5 Q-15.1 47 -5.5 45.2 Q-2.3 38.8 5 42 Q13.9 37.5 14.7 46.4 Q21.7 49.8 16.4 55 Z"
                    fill={P.cream}
                    {...detail}
                    strokeWidth="3"
                />
                <path
                    d="M10.9 104.8 Q13 111.9 4.5 111.7 Q-1.7 118 -6.4 110.9 Q-13.7 109.2 -10.9 103.2 Q-14 95.4 -4.5 96.3 Q1.5 91.8 6.4 97.1 Q15.5 98 10.9 104.8 Z"
                    fill={P.cream}
                    {...detail}
                    strokeWidth="3"
                />
                <path
                    d="M32.6 35.1 Q30.9 41.5 24.6 38.4 Q17.6 39.2 18.6 32.8 Q15.9 27 22.8 26.1 Q28.1 21.7 31.5 27.5 Q37.4 30.7 32.6 35.1 Z"
                    fill={P.cream}
                    {...detail}
                />
                <path d="M32 78 C22 66 6 62 -14 68 C-2 74 -2 82 -12 90 C4 94 22 90 32 78 Z" fill={P.pumpkin} {...detail} strokeWidth="3" />
                <path d="M27 78 C20 72 10 71 0 74 C8 77 8 82 1 86 C11 87 20 84 27 78 Z" fill={P.mustard} />
                <path d="M-14 80h0M26 58h0M30 100h0" {...dot} stroke={P.mustard} strokeWidth="4.5" />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "dragoncito",
    name: "Dragoncito",
    w: 240,
    h: 180,
    interactive: true,
    Art,
};

export default monster;
