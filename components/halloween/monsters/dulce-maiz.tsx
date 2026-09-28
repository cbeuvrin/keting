import { INK, P, inked, v } from "../palette";
import type { MonsterDef } from "../types";

// Dulce de maíz (candy corn) con bracitos y la punta mordida: alguien ya le
// dio una probadita y él ni se enteró. Reacción: se derrite de gusto: ojitos
// felices ^^, boquita abierta, rubor, estrellitas, y tiembla de lado a lado.

function Art() {
    return (
        <g transform="translate(3 0)">
            {/* Tiembla desde la base, como gomita. */}
            <g className="hw-jiggle" style={v({ "--o": "50% 100%" })}>
                {/* Bracitos: palito cónico relleno que apunta arriba y afuera, detrás
                del cuerpo para que la unión quede tapada. Un trazo colgando se
                leía como asa de taza; la manita hueso contrasta con el fondo y con
                la franja naranja. Pivote en el hombro (abajo). */}
                <g className="hw-wave" style={v({ "--o": "100% 100%", "--wave": "30deg" })}>
                    <path d="M33 80 L12.5 69.5 Q10 71 11 74 L29 88 Z" fill={P.pumpkinDeep} {...inked} strokeWidth="3" />
                    <circle cx="10" cy="70" r="5.5" fill={P.bone} {...inked} strokeWidth="2.5" />
                </g>
                <g className="hw-wave" style={v({ "--o": "0% 100%", "--wave": "-30deg" })}>
                    <path d="M77 80 L97.5 69.5 Q100 71 99 74 L81 88 Z" fill={P.pumpkinDeep} {...inked} strokeWidth="3" />
                    <circle cx="100" cy="70" r="5.5" fill={P.bone} {...inked} strokeWidth="2.5" />
                </g>

                {/* Silueta en naranja; la punta hueso y la base mostaza van encima
                con los mismos bordes, y el contorno de tinta al final. */}
                <path
                    d="M55 10 C56.4 10 57.8 10.7 59.1 12 A8.5 8.5 0 0 0 66.7 26 C69.2 32.3 71.6 40 74 48 C80 66 86 82 92 98 C96 106 102 112 100 120 C98 132 78 134 55 134 C32 134 12 132 10 120 C8 112 14 106 18 98 C24 82 30 66 36 48 C42 28 48 10 55 10 Z"
                    fill={P.pumpkin}
                />
                <path
                    d="M55 10 C56.4 10 57.8 10.7 59.1 12 A8.5 8.5 0 0 0 66.7 26 C69.2 32.3 71.6 40 74 48 Q55 56 36 48 C42 28 48 10 55 10 Z"
                    fill={P.bone}
                />
                <path
                    d="M92 98 C96 106 102 112 100 120 C98 132 78 134 55 134 C32 134 12 132 10 120 C8 112 14 106 18 98 Q55 110 92 98 Z"
                    fill={P.mustard}
                />
                {/* Sombra del lado derecho en cada franja. */}
                <path d="M66.7 26 C69.2 32.3 71.6 40 74 48 Q70 50 66 51 C66 42 64 33 60 27 Q63 27 66.7 26 Z" fill={P.boneShade} />
                <path d="M74 48 C80 66 86 82 92 98 Q86 100 80 101 C80 84 76 64 66 51 Q70 50 74 48 Z" fill={P.pumpkinDeep} />
                <path d="M92 98 C96 106 102 112 100 120 C98 130 86 133 74 134 C84 124 84 112 80 101 Q86 100 92 98 Z" fill={P.mustardDeep} />
                {/* Rayado de papel impreso sobre la sombra naranja, y una grieta
                de azúcar en la base. */}
                <path d="M77 76 L80.5 74 M78.5 83 L82 81 M81.5 93 L85 91" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <path
                    d="M30 112 L36 118 L34 124"
                    fill="none"
                    stroke={P.mustardDeep}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Brillo ceroso a la izquierda y granitos de azúcar (trazos de
                largo cero con punta redonda = puntitos, en una sola forma). */}
                <path d="M44 30 C40 42 34 60 28 80" fill="none" stroke={P.cream} strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
                <path
                    d="M40 62 h0 M50 58 h0 M36 90 h0 M62 94 h0 M26 112 h0 M40 122 h0 M58 116 h0 M72 124 h0 M50 30 h0 M58 40 h0"
                    stroke={P.cream}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    opacity="0.7"
                />
                <path d="M36 48 Q55 56 74 48 M18 98 Q55 110 92 98" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
                <path
                    d="M55 10 C56.4 10 57.8 10.7 59.1 12 A8.5 8.5 0 0 0 66.7 26 C69.2 32.3 71.6 40 74 48 C80 66 86 82 92 98 C96 106 102 112 100 120 C98 132 78 134 55 134 C32 134 12 132 10 120 C8 112 14 106 18 98 C24 82 30 66 36 48 C42 28 48 10 55 10 Z"
                    fill="none"
                    {...inked}
                />

                {/* Carita en reposo. */}
                <g className="hw-off hw-eye">
                    <ellipse cx="43" cy="72" rx="6.5" ry="7.5" fill={P.eyeWhite} {...inked} strokeWidth="2.5" />
                    <ellipse cx="67" cy="72" rx="6.5" ry="7.5" fill={P.eyeWhite} {...inked} strokeWidth="2.5" />
                    <g className="hw-pupil" style={v({ "--pr": "2.5px" })}>
                        <circle cx="44" cy="73" r="3.6" fill={INK} />
                        <circle cx="42.8" cy="71.6" r="1.2" fill={P.cream} />
                        <circle cx="68" cy="73" r="3.6" fill={INK} />
                        <circle cx="66.8" cy="71.6" r="1.2" fill={P.cream} />
                    </g>
                </g>
                <path
                    className="hw-blink"
                    d="M37 73 Q43 78 49 73 M61 73 Q67 78 73 73"
                    fill="none"
                    stroke={INK}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                {/* Sonrisita con un dientecito chueco. */}
                <g className="hw-off">
                    <path d="M50 84 Q55 89 60 84" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
                    <path d="M55.5 86.6 L57.8 91.5 L59.6 85.4 Z" fill={P.bone} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
                </g>

                {/* De gusto: ojitos ^^, boca abierta y rubor. */}
                <g className="hw-on">
                    <path d="M36 74 Q43 64 50 74 M60 74 Q67 64 74 74" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M47 81 Q55 79 63 81 Q62 94 55 94 Q48 94 47 81 Z" fill={P.mouth} {...inked} strokeWidth="2.5" />
                    <path d="M50 90 Q55 86 60 90 Q58 93 55 93 Q52 93 50 90 Z" fill={P.tongue} />
                    <ellipse cx="32" cy="84" rx="6" ry="3.5" fill={P.roseLight} opacity="0.9" />
                    <ellipse cx="78" cy="84" rx="6" ry="3.5" fill={P.roseLight} opacity="0.9" />
                </g>
            </g>
            {/* Estrellitas de gusto de cuatro puntas: sobre el fondo, en crema y
            mostaza. */}
            <g className="hw-on hw-pop" style={v({ "--o": "50% 100%" })}>
                <path d="M16 27 Q17 35 25 36 Q17 37 16 45 Q15 37 7 36 Q15 35 16 27 Z" fill={P.cream} />
                <path d="M94 19 Q95 26 101 27 Q95 28 94 35 Q93 28 87 27 Q93 26 94 19 Z" fill={P.mustard} />
            </g>
        </g>
    );
}

const monster: MonsterDef = {
    id: "dulce-maiz",
    name: "Dulce de maíz",
    w: 116,
    h: 140,
    interactive: true,
    Art,
};

export default monster;
