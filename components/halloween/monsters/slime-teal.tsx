import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Slime de baba verde azulada. Cuerpo de gota con la punta enroscada,
// chorreados que caen al charco, burbujas y un huesito flotando adentro.
// Lo "translúcido" se sugiere con tonos: el hueso va apagado y con contorno
// teal en vez de tinta, como visto a través de la baba.
// Reacción: se aplasta y tiembla como gelatina, aprieta los ojos (> <) y abre
// una bocota enorme con hilos de baba; salen gotitas volando.

function Art() {
    return (
        <g>
            {/* Charco: fuera del aplastado para que el piso no se mueva. */}
            <path
                d="M14 151 C12 141 28 136 42 137 C72 133 138 133 164 136 C182 136 190 144 186 153 C182 161 158 164 100 164 C46 164 16 161 14 151 Z"
                fill={P.teal}
                {...inked}
            />

            <g className="hw-jiggle" style={v({ "--o": "50% 100%" })}>
                <g className="hw-squish">
                    {/* Cuerpo: la orilla de abajo cuelga en chorreados sobre el charco
                    y a cada lado se escurre un lóbulo de baba (parte de la silueta,
                    no una gota suelta). */}
                    <path
                        d="M26 144 C23 130 22 120 22 114 C21 120 20 127 16 127 C12 127 12 120 14 112 C17 98 24 84 36 70 C48 46 72 32 96 30 C102 22 104 14 112 10 C118 8 124 10 122 16 C118 16 114 20 116 28 C142 30 166 48 174 80 C178 90 182 98 184 106 C185 112 185 122 182 122 C179 122 178 118 178 112 C178 124 177 132 176 140 Q172 145 165 142 C160 142 162 159 155.5 159 C149 159 151 143 145 143 Q130 146 117 142 C111 142 113 162 105 162 C97 162 99 145 92 145 Q74 148 63 143 C57 143 58 157 51.5 157 C45 157 47 144 40 144 Q31 146 26 144 Z"
                        fill={P.tealLight}
                        {...inked}
                    />
                    <path
                        d="M146 40 C164 52 172 74 174 96 C176 116 174 134 172 146 L164 146 C168 124 168 100 162 80 C158 64 152 52 140 42 Z"
                        fill={P.teal}
                    />
                    {/* Brillo de baba, en crema como reflejo. */}
                    <path d="M38 104 C38 90 42 78 50 66" fill="none" stroke={P.cream} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                    <circle cx="40" cy="117" r="2.6" fill={P.cream} opacity="0.8" />

                    {/* Burbujas atrapadas: una forma para todas, más su brillito. */}
                    <path
                        d="M156 108 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M156 126 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M165 132 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M36 132 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M55 123 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0"
                        fill={P.sky}
                        stroke={P.teal}
                        strokeWidth="2"
                    />
                    <path
                        d="M158.5 105 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0 M157.5 124.5 a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0 M37.5 130.5 a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0"
                        fill={P.cream}
                    />

                    {/* Huesito flotando adentro: una mancha irregular más oscura detrás
                    da profundidad (un óvalo perfecto se leía como calcomanía). */}
                    <path d="M108 56 C110 42 132 36 150 40 C160 44 156 58 142 62 C128 66 110 66 108 56 Z" fill={P.teal} opacity="0.35" />
                    <g transform="translate(128 56) rotate(-18)" opacity="0.6">
                        <path
                            d="M-9 -3.5 H9 C10 -9 16 -10 17.5 -6 C21 -6.5 22.5 -1 19 0 C22.5 1 21 6.5 17.5 6 C16 10 10 9 9 3.5 H-9 C-10 9 -16 10 -17.5 6 C-21 6.5 -22.5 1 -19 0 C-22.5 -1 -21 -6.5 -17.5 -6 C-16 -10 -10 -9 -9 -3.5 Z"
                            fill={P.bone}
                            stroke={P.tealDeep}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                    </g>

                    {/* Baba que tapa la punta izquierda del hueso y reflejo de la
                    superficie cruzándolo: venden que está adentro. */}
                    <path d="M104 66 Q109 58 117 60" fill="none" stroke={P.tealLight} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                    <path d="M112 62 Q132 44 156 46" fill="none" stroke={P.cream} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                    {/* Surcos de baba que bajan hacia los chorreados. */}
                    <path
                        d="M155 118 Q157 128 155.5 138 M105 124 Q103 132 105 140 M51 122 Q53 130 51.5 136"
                        fill="none"
                        stroke={P.teal}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Ojos desiguales: uno grandote y uno chiquito con párpado caído. */}
                    <g className="hw-off hw-eye">
                        <ellipse cx="78" cy="76" rx="23" ry="26" fill={P.eyeWhite} {...inked} />
                        <ellipse cx="132" cy="86" rx="12" ry="13" fill={P.eyeWhite} {...inked} />
                        <g className="hw-pupil" style={v({ "--pr": "4px" })}>
                            <circle cx="81" cy="80" r="12" fill={P.irisGold} />
                            <circle cx="82" cy="81" r="6" fill={INK} />
                            <circle cx="77" cy="75" r="2.6" fill={P.cream} />
                            <circle cx="134" cy="89" r="6" fill={P.irisGold} />
                            <circle cx="134.5" cy="89.5" r="3.2" fill={INK} />
                            <circle cx="132" cy="87" r="1.3" fill={P.cream} />
                        </g>
                        <path d="M119 82 Q132 70 145 82 Q132 87 119 82 Z" fill={P.tealLight} {...inked} strokeWidth="3" />
                    </g>
                    <g className="hw-blink" fill="none" {...inked}>
                        <path d="M56 78 Q78 92 100 78" />
                        <path d="M121 88 Q132 95 143 88" />
                    </g>
                    <g className="hw-off">
                        <path d="M92 114 Q102 122 114 112" fill="none" {...inked} strokeWidth="3.5" />
                        {/* Hilo de baba largo y delgado, con contorno teal: en tinta se leía como colmillo. */}
                        <path
                            d="M114 114 C116 123 117 131 114 135 C111 135 111 125 114 114 Z"
                            fill={P.tealLight}
                            stroke={P.teal}
                            strokeWidth="2"
                        />
                        <circle cx="113.5" cy="131" r="1" fill={P.cream} />
                    </g>

                    {/* Bocota: ojos apretados y boca que ocupa media panza, con
                    hilos de baba de labio a labio. */}
                    <g className="hw-on">
                        <g fill="none" {...inked} strokeWidth="4.5">
                            <path d="M58 64 L80 76 L58 88" />
                            <path d="M142 78 L126 86 L142 94" />
                        </g>
                        <path d="M58 100 Q103 88 148 98 Q146 142 104 150 Q62 146 58 100 Z" fill={P.mouth} {...inked} />
                        <path d="M76 138 Q100 118 130 134 Q118 148 103 149 Q86 148 76 138 Z" fill={P.tongue} />
                        {/* Hilos de baba de labio a lengua, con una gota a medio camino
                        para que se lean como líquido y no como grietas. */}
                        <path
                            d="M82 98 C79 112 87 124 83 140 M124 97 C128 110 120 122 124 138"
                            fill="none"
                            stroke={P.tealLight}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                        />
                        <path d="M80 118 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M121 116.5 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0" fill={P.tealLight} />
                    </g>
                </g>
            </g>

            {/* Gotitas que salen volando: sobre el fondo, con relleno claro. */}
            <path
                className="hw-on hw-pop"
                style={v({ "--o": "50% 100%" })}
                d="M21 50 C27 59 29 67 23 71 C17 74 12 68 14 62 C15 58 18 55 21 50 Z M184 42 C190 51 192 59 186 63 C180 66 175 60 177 54 C178 50 181 47 184 42 Z M166 14 C170 19 171 24 167 26 C163 28 160 24 161 21 C162 19 164 17 166 14 Z"
                fill={P.tealLight}
                {...inked}
                strokeWidth="2.5"
            />
        </g>
    );
}

const monster: MonsterDef = {
    id: "slime-teal",
    name: "Slime de baba",
    w: 200,
    h: 170,
    interactive: true,
    Art,
};

export default monster;
