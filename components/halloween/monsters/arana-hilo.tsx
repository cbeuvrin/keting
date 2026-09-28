import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Arañita tierna colgando de su hilo desde el borde de arriba. Se mece todo
// el tiempo. Reacción: se le resbala el hilo — cae un tramo, agita las
// patitas, aprieta los ojos y abre la boca.

// Patas: trazo doble (tinta gruesa debajo, lila encima) porque una pata
// solo de tinta desaparecería contra el fondo.
const LEGS_LEFT = "M26 138 Q14 124 10 132 M24 146 Q12 140 10 150 M24 154 Q12 156 10 166 M28 161 Q16 168 14 176";
const LEGS_RIGHT = "M54 138 Q66 124 70 132 M56 146 Q68 140 70 150 M56 154 Q68 156 70 166 M52 161 Q64 168 66 176";

function Legs({ d }: { d: string }) {
    return (
        <>
            <path d={d} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
            <path d={d} fill="none" stroke={P.lilac} strokeWidth="3" strokeLinecap="round" />
        </>
    );
}

function Art() {
    return (
        // Caja de 100 de ancho con el dibujo corrido 10: al mecerse, las patas
        // barren ~11 unidades a cada lado y no deben pisar a la pieza vecina.
        <g transform="translate(10 0)">
            {/* Pivote arriba al centro = el origen del hilo en el borde del póster. */}
            <g className="hw-sway" style={v({ "--o": "50% 0%", "--sw": "4deg", "--sd": "3.6s" })}>
                {/* Hilo de seda en crema: la tinta no se vería sobre el fondo. */}
                <path d="M40 0 L40 134" stroke={P.cream} strokeWidth="2.5" />

                <g className="hw-hop" style={v({ "--hop": "18px" })}>
                    {/* Tramo extra de hilo que baja con la araña: en reposo se encima
                    con el hilo fijo; al caer, llena el hueco y el hilo "se estira". */}
                    <path d="M40 104 L40 134" stroke={P.cream} strokeWidth="2.5" />

                    {/* Araña entera (patas, cuerpo y cara) 15% más grande alrededor del centro
                    del cuerpo, para que la carita se lea en el póster sin redibujar coordenadas. */}
                    <g transform="translate(40 152) scale(1.15) translate(-40 -152)">
                        <g className="hw-wave" style={v({ "--o": "100% 40%", "--wave": "22deg" })}>
                            <Legs d={LEGS_LEFT} />
                        </g>
                        <g className="hw-wave" style={v({ "--o": "0% 40%", "--wave": "-22deg" })}>
                            <Legs d={LEGS_RIGHT} />
                        </g>

                        {/* Cuerpo redondito con mechón arriba, donde se amarra el hilo. */}
                        <path
                            d="M40 130 C58 129 64 144 62 156 C60 170 50 175 40 175 C28 175 18 168 18 154 C18 140 26 130 40 130 Z"
                            fill={P.charcoal}
                            {...inked}
                        />
                        <path d="M24 146 C22 156 25 166 34 171 C28 162 27 152 31 142 Z" fill={P.lilacDeep} />
                        <path
                            d="M35 131 L33 124 M40 130 L40 123 M45 131 L47 124"
                            stroke={P.lilacDeep}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                        {/* Brillo crema arriba a la derecha y pelusa del lado de la sombra. */}
                        <path
                            d="M47 135 Q55 138 57 146"
                            fill="none"
                            stroke={P.cream}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            opacity="0.5"
                        />
                        <path d="M57 158 L54 161 M53 166 L50 168" stroke={P.lilacDeep} strokeWidth="2.5" strokeLinecap="round" />

                        {/* Ojos en reposo. */}
                        <g className="hw-off hw-eye" style={v({ "--bd": "3.3s" })}>
                            <ellipse cx="33" cy="148" rx="7" ry="8" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                            <ellipse cx="48" cy="148" rx="7" ry="8" fill={P.eyeWhite} {...inked} strokeWidth="3" />
                            <g className="hw-pupil" style={v({ "--pr": "2px" })}>
                                <circle cx="34" cy="150" r="3.6" fill={INK} />
                                <circle cx="49" cy="150" r="3.6" fill={INK} />
                                <circle cx="32.5" cy="148" r="1.3" fill={P.cream} />
                                <circle cx="47.5" cy="148" r="1.3" fill={P.cream} />
                            </g>
                        </g>
                        {/* Párpados en lila claro: arcos de tinta no se leerían sobre el cuerpo oscuro. */}
                        <path
                            className="hw-blink"
                            d="M27 149 Q33 154 39 149 M42 149 Q48 154 54 149"
                            fill="none"
                            stroke={P.lilacLight}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path
                            className="hw-off"
                            d="M36 161 Q41 165 46 161"
                            fill="none"
                            stroke={P.lilacLight}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Se resbala: ojos apretados, boquita en O y rubor. */}
                        <g className="hw-on">
                            <path
                                d="M28 144 L36 149 L28 153 M53 144 L45 149 L53 153"
                                fill="none"
                                stroke={P.lilacLight}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <ellipse cx="41" cy="163" rx="4.5" ry="5.5" fill={P.mouth} stroke={P.lilacLight} strokeWidth="2" />
                            <ellipse cx="26" cy="159" rx="4" ry="2.5" fill={P.roseLight} opacity="0.85" />
                            <ellipse cx="56" cy="159" rx="4" ry="2.5" fill={P.roseLight} opacity="0.85" />
                        </g>
                    </g>
                </g>
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "arana-hilo",
    name: "Arañita colgando",
    w: 100,
    h: 204,
    interactive: true,
    Art,
};

export default monster;
