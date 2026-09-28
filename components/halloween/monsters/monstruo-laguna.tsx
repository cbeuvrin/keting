import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Monstruo de la laguna, diseño propio: una rana-ajolote parada, cabeza ancha
// con ojos saltones arriba, cresta de aleta, branquias de volante en las
// mejillas y labios gruesos. Escamas en rayado por todo el cuerpo.
// Reacción: abre y agita las aletas y branquias, cierra los ojos, pone la
// boca en "O" y suelta burbujas.

// Hileras de escamas (medias lunas) a partir de un punto: una sola forma.
function scales(x0: number, y0: number, cols: number, rows: number, w: number, h: number) {
    let d = "";
    for (let r = 0; r < rows; r++) {
        const off = r % 2 ? w / 2 : 0;
        for (let c = 0; c < cols - (r % 2); c++) {
            const x = x0 + off + c * w;
            const y = y0 + r * h;
            d += `M${x} ${y} q${w / 2} ${h} ${w} 0 `;
        }
    }
    return d;
}

const f = (n: number) => Math.round(n * 10) / 10;

// Escamas de la panza: filas escalonadas que se achican hacia los bordes, con
// un temblor determinista para que no parezca olas impresas.
function bellyScales() {
    let d = "";
    const rows = [
        [150, 84, 116],
        [158, 80, 120],
        [166, 79, 121],
    ];
    rows.forEach(([y, x0, x1], r) => {
        let x = x0 + (r % 2 ? 4.5 : 0);
        while (x < x1 - 4) {
            const w = Math.max(6, 11 - Math.abs(x + 5 - 100) / 5);
            const jx = Math.sin(x * 1.7 + r) * 1.2;
            const jy = Math.cos(x * 2.3 + r * 3) * 1.3;
            d += `M${f(x + jx)} ${f(y + jy)} q${f(w / 2)} ${f(w * 0.75)} ${f(w)} 0 `;
            x += w + 0.5;
        }
    });
    // Escamas sueltas abajo: la textura se va deshaciendo.
    return d + "M87 178 q4 6 8 0 M104 181 q4.5 6 9 0 M95 189 q3.5 5 7 0";
}

// Mano palmeada: membrana clara con bordes cóncavos entre dedos y venas oscuras.
// La de la derecha cuelga; la izquierda está levantada saludando.
const HAND_R = "M148 174 C140 182 139 194 142 202 Q150 199 152 211 Q158 201 165 211 Q167 199 176 201 C177 190 172 180 164 174 Z";
const HAND_R_VEINS = "M152 180 L144 199 M155 182 L152 207 M158 182 L165 207 M161 180 L173 198";
const HAND_L = "M22 144 C15 140 8 132 8 123 Q16 126 15 114 Q22 122 25 110 Q30 120 37 116 C39 126 38 136 34 141 Z";
const HAND_L_VEINS = "M26 140 L11 125 M27 139 L17 117 M29 139 L25 113 M31 139 L35 119";

// Branquia de volante (tres dedos) hacia la izquierda; la derecha es su espejo.
const GILL = "M52 82 C38 68 20 68 14 78 C24 82 28 86 18 92 C28 98 32 100 22 110 C34 118 46 112 54 104 Z";
const GILL_VEINS = "M50 88 L22 79 M50 94 L22 93 M50 100 L28 108";
// La misma branquia abierta del todo: más grande y con cuatro dedos.
const GILL_OPEN = "M54 78 C44 58 24 48 12 54 C22 62 22 68 8 74 C20 84 20 90 6 98 C18 106 22 110 14 122 C32 126 46 116 56 104 Z";
const GILL_OPEN_VEINS = "M52 84 L18 58 M52 91 L13 77 M52 97 L11 98 M52 102 L20 118";

function Art() {
    return (
        <g>
            {/* Charquito bajo los pies: verde oscuro, se lee sobre el negro sin tinta. */}
            <ellipse cx="100" cy="229" rx="66" ry="8" fill={P.tealDeep} />
            <path
                d="M52 229 Q60 225 70 229 M130 230 Q140 226 150 230"
                fill="none"
                stroke={P.tealLight}
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Patas palmeadas, detrás del cuerpo. */}
            <path
                d="M66 198 C62 214 50 220 42 226 Q54 232 60 226 Q66 233 74 227 Q82 232 88 224 C88 214 86 206 84 198 Z M134 198 C138 214 150 220 158 226 Q146 232 140 226 Q134 233 126 227 Q118 232 112 224 C112 214 114 206 116 198 Z"
                fill={P.teal}
                {...inked}
            />
            <path
                d="M62 222 L68 212 M74 224 L76 212 M138 222 L132 212 M126 224 L124 212"
                stroke={P.tealDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Cuerpo de pera con sombra al lado derecho y escamas en rayado. */}
            <path d="M52 200 C44 160 56 124 80 120 L120 120 C144 124 156 160 148 200 C140 214 60 214 52 200 Z" fill={P.teal} {...inked} />
            <path
                d="M132 130 C148 150 152 180 144 202 C138 207 130 208 126 208 C136 184 138 154 126 132 Z"
                fill={P.tealDeep}
                opacity="0.7"
            />
            <path
                d={scales(56, 150, 2, 4, 10, 9) + scales(126, 150, 2, 4, 10, 9)}
                fill="none"
                stroke={P.tealDeep}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Panza clara con escamas de tinta. */}
            <path
                d="M72 196 C66 166 76 140 100 138 C124 140 134 166 128 196 C118 206 82 206 72 196 Z"
                fill={P.sage}
                {...inked}
                strokeWidth="3.5"
            />
            <path d={bellyScales()} fill="none" stroke={P.moss} strokeWidth="2" strokeLinecap="round" />

            {/* Brazo derecho colgando, con mano palmeada grande (que se lea la membrana). */}
            <path d="M140 136 C156 144 164 160 162 176 L150 177 C150 163 144 154 134 150 Z" fill={P.teal} {...inked} strokeWidth="3.5" />
            <path d={HAND_R} fill={P.tealLight} {...inked} strokeWidth="3.5" />
            <path d={HAND_R_VEINS} stroke={P.tealDeep} strokeWidth="1.5" strokeLinecap="round" />
            {/* Gotita escurriendo de la punta de la mano. */}
            <path
                d="M176 204 C172 212 172 218 176 219 C180 218 180 212 176 204 Z"
                fill={P.cream}
                stroke={INK}
                strokeWidth="2"
                strokeLinejoin="round"
            />

            {/* La cabeza va ladeada 5° (grupo sin clase) para romper la pose de juguete. */}
            <g transform="rotate(-5 100 90)">
                {/* Branquias de las mejillas, detrás de la cabeza. En reposo van
            plegadas; al reaccionar se abren (más grandes) y se agitan desde su base. */}
                <g className="hw-off">
                    <path d={GILL} fill={P.tealLight} {...inked} strokeWidth="3.5" />
                    <path d={GILL_VEINS} stroke={P.tealDeep} strokeWidth="2.5" strokeLinecap="round" />
                    <g transform="translate(200 0) scale(-1 1)">
                        <path d={GILL} fill={P.tealLight} {...inked} strokeWidth="3.5" />
                        <path d={GILL_VEINS} stroke={P.tealDeep} strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                </g>
                <g className="hw-on">
                    <g className="hw-wave" style={v({ "--o": "100% 50%", "--wave": "-20deg" })}>
                        <path d={GILL_OPEN} fill={P.tealLight} {...inked} strokeWidth="3.5" />
                        <path d={GILL_OPEN_VEINS} stroke={P.tealDeep} strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                    <g className="hw-wave" style={v({ "--o": "0% 50%", "--wave": "20deg" })}>
                        <g transform="translate(200 0) scale(-1 1)">
                            <path d={GILL_OPEN} fill={P.tealLight} {...inked} strokeWidth="3.5" />
                            <path d={GILL_OPEN_VEINS} stroke={P.tealDeep} strokeWidth="2.5" strokeLinecap="round" />
                        </g>
                    </g>
                </g>
            </g>

            {/* Brazo izquierdo saludando: el codo sale al lado y la mano sube por debajo
            de la branquia, para que no se esconda tras la cabeza. Se agita desde el hombro. */}
            <g className="hw-wave" style={v({ "--o": "95% 80%", "--wave": "-25deg" })}>
                <path d="M64 150 C50 160 32 162 22 144 L34 138 C40 148 50 146 62 134 Z" fill={P.teal} {...inked} strokeWidth="3.5" />
                <path d={HAND_L} fill={P.tealLight} {...inked} strokeWidth="3.5" />
                <path d={HAND_L_VEINS} stroke={P.tealDeep} strokeWidth="1.5" strokeLinecap="round" />
            </g>

            <g transform="rotate(-5 100 90)">
                {/* Cresta de aleta entre los ojos, también detrás de la cabeza. */}
                <g className="hw-wave" style={v({ "--o": "50% 100%", "--wave": "12deg" })}>
                    <path
                        d="M80 54 C74 34 82 18 94 22 C98 10 110 8 114 20 C124 14 134 28 124 54 Z"
                        fill={P.tealLight}
                        {...inked}
                        strokeWidth="3.5"
                    />
                    <path d="M88 50 L86 30 M101 48 L102 18 M114 50 L118 26" stroke={P.tealDeep} strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Montículos de los ojos saltones, detrás de la cabeza. */}
                <path
                    d="M52 64 C50 42 64 32 76 33 C90 34 98 46 96 62 Z M104 62 C102 46 110 34 124 33 C136 32 150 42 148 64 Z"
                    fill={P.teal}
                    {...inked}
                />
                {/* Gotita resbalando por el filo de la cresta hacia el ojo. */}
                <path
                    d="M130 21 C126 29 126 35 130 36 C134 35 134 29 130 21 Z"
                    fill={P.cream}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Cabeza ancha y aplanada, con escamitas arriba y pequitas. */}
                <path
                    d="M38 96 C36 66 62 50 100 50 C138 50 164 66 162 96 C160 118 136 130 100 130 C64 130 40 118 38 96 Z"
                    fill={P.teal}
                    {...inked}
                />
                <path d="M46 104 C50 116 66 124 84 127 C66 126 48 118 42 104 Z" fill={P.tealDeep} opacity="0.5" />
                <path
                    d={scales(46, 80, 2, 2, 9, 7) + scales(136, 80, 2, 2, 9, 7)}
                    fill="none"
                    stroke={P.tealDeep}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                {/* Fosas nasales. */}
                <path d="M94 88 l0 0 M106 88 l0 0" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
                <path
                    d="M58 100 l0 0 M64 104 l0 0 M56 108 l0 0 M142 100 l0 0 M136 104 l0 0 M144 108 l0 0"
                    stroke={P.tealDeep}
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Ojotes redondos con iris dorado. */}
                <g className="hw-off hw-eye">
                    <ellipse cx="75" cy="58" rx="16" ry="17" fill={P.eyeWhite} {...inked} />
                    <ellipse cx="125" cy="58" rx="16" ry="17" fill={P.eyeWhite} {...inked} />
                    {/* Iris 9 + recorrido 3.5: mirando de lado no se sale del blanco. */}
                    <g className="hw-pupil" style={v({ "--pr": "3.5px" })}>
                        <circle cx="77" cy="60" r="9" fill={P.irisGold} />
                        <circle cx="78" cy="61" r="5" fill={INK} />
                        <circle cx="73" cy="56" r="2.6" fill={P.cream} />
                        <circle cx="127" cy="60" r="9" fill={P.irisGold} />
                        <circle cx="128" cy="61" r="5" fill={INK} />
                        <circle cx="123" cy="56" r="2.6" fill={P.cream} />
                    </g>
                </g>
                <g className="hw-blink" fill="none" {...inked}>
                    <path d="M60 60 Q75 70 90 60" />
                    <path d="M110 60 Q125 70 140 60" />
                </g>

                {/* Labios gruesos cerrados, con una sonrisita. */}
                <g className="hw-off">
                    <path
                        d="M68 102 Q100 94 132 102 Q137 109 130 113 Q100 122 70 113 Q63 109 68 102 Z"
                        fill={P.sage}
                        {...inked}
                        strokeWidth="3.5"
                    />
                    <path d="M71 106 Q100 112 129 106" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Ojos cerrados: el párpado verde baja sobre cada ojo. Boca en "O". */}
                <g className="hw-on">
                    <path
                        d="M59 58 C59 44 68 40 75 40 C82 40 91 44 91 58 Q75 68 59 58 Z M109 58 C109 44 118 40 125 40 C132 40 141 44 141 58 Q125 68 109 58 Z"
                        fill={P.teal}
                        {...inked}
                    />
                    <path
                        d="M62 64 L58 70 M75 66 L75 73 M88 64 L92 70 M112 64 L108 70 M125 66 L125 73 M138 64 L142 70"
                        stroke={INK}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <ellipse cx="100" cy="108" rx="15" ry="14" fill={P.sage} {...inked} strokeWidth="3.5" />
                    <ellipse cx="100" cy="108" rx="7" ry="7.5" fill={P.mouth} stroke={INK} strokeWidth="2" />
                </g>
                {/* Burbujas que suben de la boca: crema, porque van sobre el fondo. */}
                <g className="hw-on hw-pop" style={v({ "--o": "0% 100%" })}>
                    <path
                        d="M112 90 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 Z M140 78 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 Z M160 50 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 Z"
                        fill="none"
                        stroke={P.cream}
                        strokeWidth="3"
                    />
                    <path d="M115 88 l0 0 M145 75 l0 0 M166 45 l0 0" stroke={P.cream} strokeWidth="3.5" strokeLinecap="round" />
                </g>

                {/* Gotita colgando de la barbilla. */}
                <path
                    d="M128 127 C124 135 124 141 128 142 C132 141 132 135 128 127 Z"
                    fill={P.cream}
                    stroke={INK}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "monstruo-laguna",
    name: "Monstruo de la laguna",
    w: 200,
    h: 240,
    interactive: true,
    Art,
};

export default monster;
