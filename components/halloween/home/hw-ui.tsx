import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { HW_FONT } from "../fonts";
import { MONSTERS } from "../monsters";
import { P } from "../palette";

// Piezas compartidas de la versión Halloween del home. Cada sección las
// combina con su propio contenido; así las tarjetas, las orillas y los
// monstruos que se asoman se ven de la misma familia en toda la página.

export { HW_FONT };

/** Colores de página (los mismos del póster). */
export const HW = {
    page: "#141216",
    band: "#1b171e",
    ink: "#1c1a1e",
    cream: P.cream,
    bone: P.bone,
    mustard: P.mustard,
    pumpkin: P.pumpkin,
    lilac: P.lilac,
    plum: P.plum,
    rose: P.rose,
    teal: P.teal,
    sage: P.sage,
    moss: P.moss,
} as const;

/** Rayita + texto chiquito en mayúsculas, como los antetítulos del home. */
export function HwEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span className="block h-px w-10 bg-[#d8b36a]/70" />
            <span className={`${HW_FONT} text-[11px] uppercase tracking-[0.28em] text-[#f3ecd9]/65 md:text-xs`}>{children}</span>
        </div>
    );
}

type Tone = "ink" | "bone" | "plum" | "moss" | "pumpkin";

const TONES: Record<Tone, string> = {
    ink: "bg-[#1f1b22] text-[#f3ecd9] border-[#f3ecd9]/85",
    bone: "bg-[#ece3cf] text-[#1c1a1e] border-[#1c1a1e]",
    plum: "bg-[#4a3350] text-[#f3ecd9] border-[#1c1a1e]",
    moss: "bg-[#2f4a3c] text-[#f3ecd9] border-[#1c1a1e]",
    pumpkin: "bg-[#d98a4f] text-[#1c1a1e] border-[#1c1a1e]",
};

const SHADOWS = {
    mustard: "shadow-[8px_8px_0_#d8b36a]",
    pumpkin: "shadow-[8px_8px_0_#d98a4f]",
    lilac: "shadow-[8px_8px_0_#8e7cb3]",
    rose: "shadow-[8px_8px_0_#cf6f7e]",
    teal: "shadow-[8px_8px_0_#4f8c80]",
    none: "",
} as const;

/**
 * Tarjeta tipo calcomanía recortada a mano: esquinas desiguales, borde
 * grueso y sombra dura de color, un poco chueca. `stitched` cambia el borde
 * por una costura punteada. Es solo la caja: el contenido lo pone quien la usa.
 */
export function Sticker({
    tone = "ink",
    shadow = "mustard",
    tilt = 0,
    stitched = false,
    className = "",
    style,
    children,
}: {
    tone?: Tone;
    shadow?: keyof typeof SHADOWS;
    tilt?: number;
    stitched?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}) {
    return (
        <div
            className={`relative rounded-[2.2rem_1.6rem_2.6rem_1.4rem] border-2 ${stitched ? "border-dashed" : ""} ${TONES[tone]} ${SHADOWS[shadow]} ${className}`}
            style={{ rotate: tilt ? `${tilt}deg` : undefined, ...style }}
        >
            {children}
        </div>
    );
}

/**
 * Chorreado de cera/baba que cuelga del borde inferior de una tarjeta.
 * Se coloca `absolute` dentro de la tarjeta; `color` debe ser el del fondo
 * de la tarjeta para que parezca que escurre de ella.
 */
export function Drips({ color = P.cream, className = "" }: { color?: string; className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 240 26" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`}>
            <path
                d="M0 0 H240 V3 Q232 3 232 10 Q232 20 226 20 Q220 20 220 10 Q220 3 196 3 H150 Q144 3 144 15 Q144 26 137 26 Q130 26 130 14 Q130 3 118 3 H64 Q58 3 58 9 Q58 16 53 16 Q48 16 48 9 Q48 3 30 3 H18 Q14 3 14 7 Q14 11 11 11 Q8 11 8 7 Q8 3 0 3 Z"
                fill={color}
            />
        </svg>
    );
}

/**
 * Telaraña de esquina. En crema y con poca opacidad: decora sin competir.
 * `corner` indica en qué esquina de su contenedor se ancla.
 */
export function Cobweb({
    corner = "tl",
    size = 140,
    className = "",
    opacity = 0.35,
}: {
    corner?: "tl" | "tr" | "bl" | "br";
    size?: number;
    className?: string;
    opacity?: number;
}) {
    const flip = { tl: "", tr: "-scale-x-100", bl: "-scale-y-100", br: "-scale-100" }[corner];
    const pos = { tl: "left-0 top-0", tr: "right-0 top-0", bl: "left-0 bottom-0", br: "right-0 bottom-0" }[corner];
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={`pointer-events-none absolute ${pos} ${flip} ${className}`}
            style={{ opacity }}
        >
            <g fill="none" stroke={P.cream} strokeWidth="0.9" strokeLinecap="round">
                {/* Radios */}
                <path d="M0 0 L100 8 M0 0 L92 40 M0 0 L70 70 M0 0 L40 92 M0 0 L8 100" />
                {/* Hilos que cuelgan entre radios, cada vez más lejos de la esquina */}
                <path d="M20 1.6 Q16 7 18.4 8 Q14 13 14 14 Q9 16 7 18.4 Q5 16 1.6 20" />
                <path d="M42 3.4 Q34 12 38.6 16.8 Q30 24 29.4 29.4 Q22 32 16.8 38.6 Q10 36 3.4 42" />
                <path d="M66 5.3 Q54 18 60.7 26.4 Q48 38 46.2 46.2 Q36 50 26.4 60.7 Q16 56 5.3 66" />
                <path d="M92 7.4 Q76 26 84.9 36.9 Q66 54 64.3 64.3 Q52 70 36.9 84.9 Q24 80 7.4 92" />
            </g>
        </svg>
    );
}

/**
 * Un monstruo del póster que se asoma dentro de una sección. Es interactivo
 * igual que en el póster (hover o toque: reacciona; las pupilas siguen al
 * cursor), siempre que la página esté envuelta en <PosterStage>.
 *
 * `width` es el ancho en px; el alto sale de la proporción del monstruo.
 * `crop` recorta la parte de abajo (0–1) para que parezca que se asoma desde
 * detrás de algo: con 0.4 se ve solo el 60% de arriba.
 */
export function Peek({
    id,
    width,
    flip = false,
    crop = 0,
    delay = "0s",
    className = "",
    style,
}: {
    id: string;
    width: number;
    flip?: boolean;
    crop?: number;
    delay?: string;
    className?: string;
    style?: CSSProperties;
}) {
    const def = MONSTERS[id];
    if (!def) return null;
    const visibleH = def.h * (1 - crop);
    const height = Math.round((width * visibleH) / def.w);
    return (
        <svg
            aria-hidden="true"
            viewBox={`0 0 ${def.w} ${visibleH}`}
            width={width}
            height={height}
            className={`hw-scene overflow-visible ${className}`}
            style={style}
        >
            <g transform={flip ? `translate(${def.w} 0) scale(-1 1)` : undefined}>
                <g
                    className={def.interactive ? "hw-monster" : "hw-monster hw-deco"}
                    data-flip={flip ? "1" : undefined}
                    style={{ ["--bd" as string]: delay } as CSSProperties}
                >
                    <def.Art />
                </g>
            </g>
        </svg>
    );
}

/**
 * El "click →" de la esquina de las tarjetas de servicio, en versión
 * calcomanía: una calabacita que se asusta al pasar el mouse.
 */
export function HwCornerButton({
    href,
    label = "entra, si te atreves",
    className = "",
}: {
    href: string;
    label?: string;
    className?: string;
}) {
    return (
        <Link href={href} className={`group absolute bottom-7 right-7 z-30 flex items-center gap-3 ${className}`}>
            <span className={`${HW_FONT} hidden text-base text-[#f3ecd9] sm:inline`}>{label}</span>
            <span className="grid h-12 w-12 -rotate-6 place-items-center rounded-[45%_55%_50%_50%] border-2 border-[#1c1a1e] bg-[#d98a4f] shadow-[4px_4px_0_#d8b36a] transition-[rotate,translate] duration-300 group-hover:rotate-6 group-hover:translate-x-1 motion-reduce:transition-none">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                        d="M4 12 H18 M12 6 L18 12 L12 18"
                        fill="none"
                        stroke="#1c1a1e"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
        </Link>
    );
}

/** Indicador decorativo de "hay más abajo": un murcielaguito que rebota. */
export function HwScrollHint({ className = "" }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-[#d8b36a] ${className}`}
        >
            <svg viewBox="0 0 40 24" className="h-6 w-10 animate-bounce motion-reduce:animate-none">
                <path
                    d="M20 20 Q15 12 4 10 Q9 14 7 18 Q12 16 14 20 Q17 17 20 20 Q23 17 26 20 Q28 16 33 18 Q31 14 36 10 Q25 12 20 20 Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
}
