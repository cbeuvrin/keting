import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Momia bolita: un frijol envuelto en vendas, con un solo ojo asomando por un
// hueco y una venda cruzada tapando el otro. Las vendas se leen por la costura
// curva de tinta (cuelga al centro, siguiendo el volumen), la franja de sombra
// que deja cada una sobre la de abajo y los escalones del contorno donde acaban.
// Reacción: se espanta — la venda cruzada se cae por el costado y destapa el
// segundo ojo muy abierto, abre la boca, tirita y la venda suelta se agita.

function Art() {
    return (
        <g className="hw-shake">
            {/* Venda suelta en reposo: cabito corto que nace en la costura de abajo, con el
                extremo en dos picos. Baja, lejos de la cabeza, para que no se lea como oreja.
                Detrás del cuerpo para tapar su unión. */}
            <g className="hw-off">
                <path d="M156 156 C168 160 174 170 174 184 L168 178 L162 186 C162 176 158 168 150 166 Z" fill={P.bone} {...inked} />
                <path d="M165 167 L168 174" stroke={P.boneShade} strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Al asustarse, la venda del ojo se desenrolla: tira larga que cuelga de la costura
                hasta el piso por el costado, lejos de la cara. */}
            <g className="hw-on">
                <g className="hw-wave" style={v({ "--o": "0% 0%", "--wave": "10deg" })}>
                    <path
                        d="M150 120 C166 126 176 144 176 168 C176 180 178 190 180 200 L172 194 L166 202 C166 186 164 170 160 156 C158 142 152 132 144 128 Z"
                        fill={P.bone}
                        {...inked}
                        strokeWidth="3.5"
                    />
                    <path d="M168 150 L170 160 M171 180 L172 188" stroke={P.boneShade} strokeWidth="2.5" strokeLinecap="round" />
                </g>
            </g>

            {/* Bracitos y patitas vendados; el derecho asoma bajo la venda suelta. */}
            <path d="M28 138 C16 140 8 150 12 160 C16 168 28 164 34 156 Z" fill={P.bone} {...inked} />
            <path d="M160 140 C172 142 178 152 174 160 C170 166 160 162 156 154 Z" fill={P.bone} {...inked} />
            <path d="M58 196 C54 208 60 216 72 214 C82 212 84 204 80 196 Z" fill={P.bone} {...inked} />
            <path d="M104 196 C100 208 106 216 118 214 C128 212 130 204 126 196 Z" fill={P.bone} {...inked} />

            {/* Cuerpo: frijol abollado, con un escalón donde acaba cada venda. */}
            <path
                d="M88 32 C112 30 132 40 146 58 C156 70 161 84 162 96 L166 99 C166 104 165 108 164 110 L160 114 C161 132 158 150 156 163 L160 167 C154 180 146 188 136 192 C120 206 100 208 86 206 C60 204 38 192 26 170 C20 160 20 154 21 150 L17 146 C16 142 17 137 18 132 L22 129 C20 118 20 108 22 100 L18 96 C26 64 54 34 88 32 Z"
                fill={P.bone}
                {...inked}
            />
            {/* Sombra del lado derecho para volumen. */}
            <path
                d="M146 64 C160 88 162 136 150 166 C144 182 132 194 120 200 C136 176 146 150 148 118 C149 98 148 80 146 64 Z"
                fill={P.boneShade}
            />
            {/* Franja de sombra que cada venda proyecta sobre la de abajo. */}
            <path
                d="M40 67 Q88 77 136 59 M26 93 Q92 109 160 101 M20 137 Q84 119 162 115 M24 155 Q88 173 156 165 M48 195 Q100 191 146 175"
                fill="none"
                stroke={P.boneShade}
                strokeWidth="7"
            />
            {/* Costuras de las vendas. */}
            <path
                d="M38 62 Q88 72 138 54 M24 88 Q92 104 162 96 M18 132 Q84 114 164 110 M22 150 Q88 168 158 160 M46 190 Q100 186 148 170 M120 178 L150 164"
                fill="none"
                stroke={INK}
                strokeWidth="3"
                strokeLinecap="round"
            />
            {/* Rayado de tela gastada. */}
            <path
                d="M60 40 L57 48 M66 37 L62 50 M73 40 L71 45 M26 108 L23 116 M32 105 L28 119 M38 110 L36 115 M106 140 L103 149 M113 142 L111 147 M120 137 L115 150 M58 170 L56 176 M64 168 L61 178"
                stroke={P.boneShade}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Hueco del ojo que sí asoma. */}
            <path d="M44 100 C54 92 76 92 86 99 C88 108 83 117 72 119 C59 121 47 115 44 108 Z" fill={P.mouth} {...inked} strokeWidth="3" />
            <g className="hw-off hw-eye">
                <ellipse cx="65" cy="106" rx="12" ry="9.5" fill={P.eyeWhite} />
                <g className="hw-pupil" style={v({ "--pr": "3px" })}>
                    <circle cx="67" cy="107" r="6.5" fill={P.irisGold} />
                    <circle cx="67.5" cy="107.5" r="3.2" fill={INK} />
                    <circle cx="64" cy="104" r="1.8" fill={P.cream} />
                </g>
            </g>
            <g className="hw-blink">
                <ellipse cx="65" cy="106" rx="12" ry="9.5" fill={P.boneShade} />
                <path d="M53 107 Q65 114 77 107" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Boca en reposo: una rayita chueca entre dos vendas. */}
            <path
                className="hw-off"
                d="M52 141 Q58 137 64 141 Q70 145 76 140"
                fill="none"
                stroke={INK}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Susto: segundo hueco con ojo enorme, ojo de alfiler y boca abierta. */}
            <g className="hw-on">
                {/* Tapa la costura entre los dos huecos: con ese puente de tinta los ojos parecían lentes. */}
                <path d="M89 92 L97 92 L97 109 L89 109 Z" fill={P.bone} />
                <path
                    d="M100 92 C112 86 132 88 142 96 C145 108 140 120 128 122 C114 124 100 116 98 104 Z"
                    fill={P.mouth}
                    {...inked}
                    strokeWidth="3"
                />
                {/* Blancos casi llenando el hueco: si queda mucho aro oscuro parecen lentes de sol. */}
                <ellipse cx="121" cy="105" rx="19" ry="14" fill={P.eyeWhite} />
                <ellipse cx="65" cy="106" rx="16" ry="11.5" fill={P.eyeWhite} />
                <circle cx="121" cy="105" r="3.4" fill={INK} />
                <circle cx="65" cy="106" r="3.4" fill={INK} />
                {/* Brillito sobre la pupila (en el blanco no se vería) y cejas de susto: con eso son ojos, no lentes. */}
                <circle cx="119.8" cy="103.8" r="1.4" fill={P.cream} />
                <circle cx="63.8" cy="104.8" r="1.4" fill={P.cream} />
                <path d="M50 90 Q58 83 70 86 M108 84 Q120 77 134 82" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
                <path
                    d="M78 133 C84 129 100 129 104 135 C106 145 100 151 92 151 C84 151 76 145 78 133 Z"
                    fill={P.mouth}
                    {...inked}
                    strokeWidth="3"
                />
                <path
                    d="M82 137 L85 141 L88 136 L91 141 L94 136 L97 141 L100 137"
                    fill="none"
                    stroke={P.bone}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </g>

            {/* Venda cruzada que tapa el segundo ojo. */}
            <g className="hw-off">
                <path
                    d="M92 84 C114 86 140 96 158 110 L152 132 C134 120 112 114 88 112 C86 102 88 92 92 84 Z"
                    fill={P.bone}
                    {...inked}
                    strokeWidth="3.5"
                />
                <path d="M96 106 C116 108 136 116 152 126" fill="none" stroke={P.boneShade} strokeWidth="4" strokeLinecap="round" />
                <path
                    d="M108 92 L106 100 M120 95 L118 103 M132 100 L130 108"
                    stroke={P.boneShade}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
            </g>

            {/* Rayitas de susto sobre el fondo, en crema, y una gota de sudor. */}
            <g
                className="hw-on hw-pop"
                style={v({ "--o": "100% 100%" })}
                fill="none"
                stroke={P.cream}
                strokeWidth="3.5"
                strokeLinecap="round"
            >
                <path d="M30 42 L20 32" />
                <path d="M22 64 L8 62" />
                <path d="M48 26 L44 12" />
            </g>
            <path
                className="hw-on"
                d="M152 26 C158 34 162 40 158 46 C154 50 148 46 148 40 C148 36 150 32 152 26 Z"
                fill={P.sky}
                {...inked}
                strokeWidth="2.5"
            />
        </g>
    );
}

const monster: MonsterDef = {
    id: "momia",
    name: "Momia",
    w: 196,
    h: 220,
    interactive: true,
    Art,
};

export default monster;
