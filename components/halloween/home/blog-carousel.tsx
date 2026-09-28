"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { articles } from "@/lib/blog-data";
import { optimizeImageUrl } from "@/lib/blog-utils";
import { useLang } from "@/lib/i18n/lang-context";
import { EN_ARTICLES } from "@/lib/blog-en";
import { Cobweb, HW, HW_FONT, HwEyebrow, Peek } from "./hw-ui";
import { v } from "../palette";

// Versión Halloween de components/layout/blog-carousel.tsx.
//
// Mismo carrusel que la original: se desplaza solo, se arrastra con inercia,
// las flechas cambian el sentido, las tarjetas se inclinan con la velocidad y
// se enderezan al pasar el mouse. Mismos artículos (Supabase en ES, el repo en
// EN). Cambia el disfraz: cada tarjeta es una calcomanía (algunas con forma de
// lápida), la categoría es una etiqueta pegada a mano, la sombra dura escurre
// y las flechas son botones calcomanía. El búho lee desde las flechas y el
// cuervo cuida el enlace a todos los artículos.

type Article = (typeof articles)[0];

// ─── Disfraces de tarjeta ─────────────────────────────────────────────────────
// La original pinta cada tarjeta con el color/acento guardado en la base; aquí
// se rotan tonos de la paleta del póster para que todas sean de la familia.
type Variant = {
    bg: string;
    fg: string;
    border: string;
    shadow: string;
    tagBg: string;
    tagFg: string;
    /** Forma de lápida: arco arriba y la etiqueta centrada. */
    tomb?: boolean;
    /** Telaraña en la esquina de arriba a la derecha. */
    web?: boolean;
    /** Dónde escurre la sombra (izquierda y ancho, en %). */
    drip?: [number, number];
};

const VARIANTS: Variant[] = [
    { bg: "#1f1b22", fg: HW.cream, border: HW.cream, shadow: HW.mustard, tagBg: HW.mustard, tagFg: HW.ink, web: true, drip: [18, 44] },
    { bg: HW.bone, fg: HW.ink, border: HW.ink, shadow: HW.pumpkin, tagBg: "#4a3350", tagFg: HW.cream, tomb: true },
    { bg: "#4a3350", fg: HW.cream, border: HW.ink, shadow: HW.lilac, tagBg: HW.bone, tagFg: HW.ink, drip: [40, 38] },
    { bg: "#2f4a3c", fg: HW.cream, border: HW.ink, shadow: HW.rose, tagBg: HW.pumpkin, tagFg: HW.ink, web: true },
    { bg: HW.bone, fg: HW.ink, border: HW.ink, shadow: HW.teal, tagBg: HW.rose, tagFg: HW.ink, drip: [14, 50] },
    { bg: "#1f1b22", fg: HW.cream, border: HW.cream, shadow: HW.lilac, tagBg: HW.lilac, tagFg: HW.ink, tomb: true },
];

// Esquinas desiguales, recortadas a mano; cada tarjeta la suya.
const RADII = ["2.2rem 1.6rem 2.6rem 1.4rem", "1.5rem 2.5rem 1.7rem 2.3rem", "2.6rem 1.3rem 2rem 2.4rem", "1.7rem 2.3rem 2.5rem 1.5rem"];
const TOMB_RADIUS = "10rem 10rem 1.8rem 2.2rem / 7.5rem 7.5rem 1.8rem 2.2rem";

// ─── Dibujitos ────────────────────────────────────────────────────────────────
const BAT_PATH =
    "M32 30 Q28 22 24 21 Q20 13 6 9 Q11 15 9 21 Q15 18 17 24 Q21 21 24 26 Q27 24 32 30 Q37 24 40 26 Q43 21 47 24 Q49 18 55 21 Q53 15 58 9 Q44 13 40 21 Q36 22 32 30 Z M29 20 L28.5 14.5 L31 18 L33 18 L35.5 14.5 L35 20 Z";

/** Murcielaguito: sustituye al asterisco del título. */
function Bat({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 64 34" className={className}>
            <path d={BAT_PATH} fill="currentColor" />
        </svg>
    );
}

/** Murciélago que revolotea (quieto con movimiento reducido: hw-scene lo apaga). */
function FlyingBat({ className = "", delay = "0s", size = 30 }: { className?: string; delay?: string; size?: number }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 64 34" width={size} className={`hw-scene pointer-events-none absolute h-auto ${className}`}>
            <g className="hw-float" style={v({ "--fd": "2.9s", "--fa": "-7px", "--bd": delay })}>
                <path d={BAT_PATH} fill={HW.cream} />
            </g>
        </svg>
    );
}

/** Estrellita de cuatro puntas que titila. */
function Twinkle({ className = "", delay = "0s", color = HW.mustard }: { className?: string; delay?: string; color?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`hw-scene pointer-events-none absolute ${className}`}>
            <g className="hw-twinkle" style={v({ "--bd": delay, "--td": "3s" })}>
                <path d="M10 1 Q11 9 19 10 Q11 11 10 19 Q9 11 1 10 Q9 9 10 1 Z" fill={color} />
            </g>
        </svg>
    );
}

/** Telaraña de esquina para dentro de la tarjeta, en el color de su tinta. */
function CardWeb({ color }: { color: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute right-0 top-0 h-[92px] w-[92px] -scale-x-100 md:h-[104px] md:w-[104px]"
            style={{ opacity: 0.32 }}
        >
            <g fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round">
                <path d="M0 0 L100 8 M0 0 L92 40 M0 0 L70 70 M0 0 L40 92 M0 0 L8 100" />
                <path d="M20 1.6 Q16 7 18.4 8 Q14 13 14 14 Q9 16 7 18.4 Q5 16 1.6 20" />
                <path d="M42 3.4 Q34 12 38.6 16.8 Q30 24 29.4 29.4 Q22 32 16.8 38.6 Q10 36 3.4 42" />
                <path d="M66 5.3 Q54 18 60.7 26.4 Q48 38 46.2 46.2 Q36 50 26.4 60.7 Q16 56 5.3 66" />
            </g>
        </svg>
    );
}

/** Chorreado de la sombra dura: cuelga del borde de abajo, desplazado como la sombra. */
function ShadowDrip({ color, left, width }: { color: string; left: number; width: number }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 240 26"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-[calc(100%+7px)] h-6"
            style={{ left: `calc(${left}% + 8px)`, width: `${width}%` }}
        >
            <path
                d="M0 0 H240 V3 Q232 3 232 10 Q232 20 226 20 Q220 20 220 10 Q220 3 196 3 H150 Q144 3 144 15 Q144 26 137 26 Q130 26 130 14 Q130 3 118 3 H64 Q58 3 58 9 Q58 16 53 16 Q48 16 48 9 Q48 3 30 3 H18 Q14 3 14 7 Q14 11 11 11 Q8 11 8 7 Q8 3 0 3 Z"
                fill={color}
            />
        </svg>
    );
}

/** Flecha trazada a mano (izquierda o derecha). */
function HandArrow({ dir, className = "" }: { dir: "left" | "right"; className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
            <path
                d={dir === "right" ? "M4 12.5 Q11 11.4 18.5 12 M12.5 6 L18.5 12 L12 18" : "M20 11.5 Q13 12.6 5.5 12 M11.5 18 L5.5 12 L12 6"}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ─── Tarjeta ──────────────────────────────────────────────────────────────────
function HwBlogCard({
    article,
    index,
    tilt,
    velocity,
    basePath,
}: {
    article: Article;
    index: number;
    tilt: number;
    velocity: number;
    basePath: string;
}) {
    // Inclinación extra según la velocidad del carrusel (igual que la original).
    const liveRotation = tilt + velocity * 0.08;
    const s = VARIANTS[index % VARIANTS.length];
    const radius = s.tomb ? TOMB_RADIUS : RADII[index % RADII.length];
    // La etiqueta se pega un poco chueca, cada una distinto.
    const tagTilt = [-3, 2, -1.5, 2.5][index % 4];

    return (
        <Link href={`${basePath}/${article.slug}`} className="relative z-30 block">
            <motion.article
                whileTap={{ scale: 0.98 }}
                style={{ rotate: liveRotation, color: s.fg }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group relative h-[380px] w-[280px] flex-shrink-0 cursor-pointer select-none md:h-[420px] md:w-[320px]"
            >
                {s.drip && <ShadowDrip color={s.shadow} left={s.drip[0]} width={s.drip[1]} />}

                <div
                    className="absolute inset-0 overflow-hidden border-[3px]"
                    style={{
                        backgroundColor: s.bg,
                        borderColor: s.border,
                        borderRadius: radius,
                        boxShadow: `8px 8px 0 ${s.shadow}`,
                    }}
                >
                    {/* Imagen del artículo, apagada; se aviva al pasar el mouse. */}
                    <div
                        className="absolute inset-0 opacity-15 grayscale transition-all duration-700 group-hover:opacity-30 group-hover:grayscale-0"
                        style={{
                            backgroundImage: `url(${optimizeImageUrl(article.image || "/images/blog/placeholder.png", 700)})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {s.web && <CardWeb color={s.fg} />}

                    {/* En la lápida, un murcielaguito grabado en la punta del arco. */}
                    {s.tomb && <Bat className="absolute left-1/2 top-7 h-5 w-10 -translate-x-1/2 opacity-40" />}

                    {/* Cifra decorativa */}
                    <div
                        className={`${HW_FONT} pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-[120px] leading-none opacity-[0.07]`}
                    >
                        {String(article.id).padStart(2, "0")}
                    </div>

                    {/* Contenido */}
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-7">
                        <h3 className={`${HW_FONT} line-clamp-4 text-lg font-normal leading-[1.2] md:text-xl`} style={{ color: s.fg }}>
                            {article.title}
                        </h3>
                        <p className="line-clamp-3 text-sm leading-relaxed opacity-75">{article.excerpt}</p>
                        <div className="relative mt-2 flex items-center justify-between pt-4">
                            {/* Costura en vez de la línea fina */}
                            <span
                                aria-hidden="true"
                                className="absolute left-0 right-0 top-0 h-[2px] rounded-full opacity-35"
                                style={{ background: `repeating-linear-gradient(90deg, ${s.fg} 0 9px, transparent 9px 16px)` }}
                            />
                            <span className="text-xs font-medium opacity-65">
                                {article.author} · {article.date}
                            </span>
                            <span
                                className="grid h-9 w-9 -rotate-6 place-items-center rounded-[45%_55%_50%_50%] border-2 transition-[rotate] duration-300 group-hover:rotate-6 motion-reduce:transition-none"
                                style={{ backgroundColor: s.tagBg, color: s.tagFg, borderColor: HW.ink }}
                            >
                                <HandArrow dir="right" className="h-4 w-4 -rotate-45" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Categoría: etiqueta pegada a mano. En la lápida va centrada bajo el arco. */}
                <div
                    className={`${HW_FONT} absolute z-10 rounded-[0.9rem_0.55rem_1rem_0.5rem] border-2 px-3 pb-1 pt-1.5 text-[11px] uppercase leading-tight tracking-[0.1em] ${
                        s.tomb ? "left-1/2 top-[4.6rem] w-max max-w-[78%] -translate-x-1/2 text-center" : "left-6 right-10 top-6 w-fit"
                    }`}
                    style={{
                        backgroundColor: s.tagBg,
                        color: s.tagFg,
                        borderColor: HW.ink,
                        boxShadow: `3px 3px 0 ${HW.ink}`,
                        rotate: `${tagTilt}deg`,
                    }}
                >
                    {article.category}
                </div>
            </motion.article>
        </Link>
    );
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Componente ───────────────────────────────────────────────────────────────
export function HwBlogCarousel() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    // El blog inglés vive en el repo (lib/blog-en) y no trae `id`: se completa
    // aquí. El color/acento de la original no hace falta: aquí manda el disfraz.
    const enCards = EN_ARTICLES.map((a, i) => ({ ...a, id: i + 1 })) as unknown as typeof articles;
    const initial = isEn ? enCards : articles;
    const basePath = isEn ? "/en/blog" : "/blog";

    const [allArticles, setAllArticles] = useState(initial);
    const CARD_WIDTH = 340; // ancho de tarjeta + separación
    const [totalWidth, setTotalWidth] = useState(CARD_WIDTH * initial.length);

    useEffect(() => {
        if (isEn) return;
        const fetchDynamicArticles = async () => {
            const { data } = await supabase
                .from("articles")
                // Solo las columnas que usa la tarjeta (sin `content`, que pesa mucho).
                .select("id, slug, title, excerpt, category, image, color, accent, author, date")
                .order("created_at", { ascending: false });

            if (data && data.length > 0) {
                setAllArticles(data as unknown as typeof articles);
                setTotalWidth(CARD_WIDTH * data.length);
            }
        };
        fetchDynamicArticles();
    }, [isEn]);

    const tilts = allArticles.map((_, i) => ((i * 137 + 31) % 29) - 14);

    // El título sale del diccionario; la primera palabra lleva el subrayado.
    const [firstWord, ...restWords] = t.blog.title1.split(" ");

    // --- Estado ---
    const [direction, setDirection] = useState<1 | -1>(1);
    const [velocity, setVelocity] = useState(0);
    const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

    // --- Refs (para no leer estado viejo dentro del rAF) ---
    const offsetRef = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const directionRef = useRef<1 | -1>(1);
    const dragStartXRef = useRef(0);
    const dragLastXRef = useRef(0);
    const dragVelocityRef = useRef(0);
    const momentumRef = useRef(0);

    useEffect(() => {
        directionRef.current = direction;
    }, [direction]);

    // ── Bucle de animación (idéntico a la original) ──────────────────────────
    useAnimationFrame((_, delta) => {
        const dt = delta / 1000;
        let step = 0;

        if (draggingRef.current) {
            step = dragVelocityRef.current;
        } else if (Math.abs(momentumRef.current) > 0.5) {
            momentumRef.current *= 0.92;
            step = momentumRef.current;
        } else {
            momentumRef.current = 0;
            step = directionRef.current * dt * 80;
        }

        offsetRef.current = (((offsetRef.current + step) % totalWidth) + totalWidth) % totalWidth;

        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
        }

        setVelocity(step);
    });

    // ── Arrastre ──────────────────────────────────────────────────────────────
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        // Sin setPointerCapture para que los clics en las tarjetas sigan funcionando.
        draggingRef.current = true;
        dragStartXRef.current = e.clientX;
        dragLastXRef.current = e.clientX;
        dragVelocityRef.current = 0;
        momentumRef.current = 0;
        setCursor("grabbing");
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        dragVelocityRef.current = dragLastXRef.current - e.clientX;
        dragLastXRef.current = e.clientX;
    }, []);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        const totalDrag = Math.abs(dragStartXRef.current - e.clientX);

        draggingRef.current = false;
        setCursor("grab");
        momentumRef.current = dragVelocityRef.current;

        // Más de 20px es arrastre, no clic: el carrusel sigue en ese sentido.
        if (totalDrag > 20) {
            const dragDirection = dragStartXRef.current - e.clientX > 0 ? 1 : -1;
            directionRef.current = dragDirection;
            setDirection(dragDirection);
        }
        dragVelocityRef.current = 0;
    }, []);

    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        if (Math.abs(dragStartXRef.current - e.clientX) > 20) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    const handleLeft = useCallback(() => {
        setDirection(-1);
        directionRef.current = -1;
    }, []);

    const handleRight = useCallback(() => {
        setDirection(1);
        directionRef.current = 1;
    }, []);

    const arrowClass = (active: boolean, tiltClass: string) =>
        `group grid h-14 w-14 place-items-center border-2 transition-all duration-300 motion-reduce:transition-none ${tiltClass} ${
            active
                ? "border-[#1c1a1e] bg-[#d98a4f] text-[#1c1a1e] shadow-[4px_4px_0_#d8b36a]"
                : "border-[#f3ecd9]/45 bg-[#1f1b22] text-[#f3ecd9]/55 shadow-[4px_4px_0_#4a3350] hover:border-[#f3ecd9] hover:text-[#f3ecd9]"
        }`;

    return (
        <section id="blog" className="relative w-full overflow-hidden bg-[#141216] pb-24 pt-12 text-[#f3ecd9] md:pb-32 md:pt-20">
            {/* Banda suave, como el fundido de fondo de la original. */}
            <div className="absolute inset-0 bg-[#1b171e] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
            <Cobweb corner="tr" size={170} opacity={0.24} className="h-[110px] w-[110px] md:h-[170px] md:w-[170px]" />

            {/* ── Encabezado ── */}
            <div className="container relative z-10 mx-auto mb-16 px-6 md:px-12">
                <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                    <div className="relative">
                        <HwEyebrow className="mb-4 md:mb-6">{t.blog.eyebrow}</HwEyebrow>
                        <h2 className={`${HW_FONT} text-4xl font-normal leading-[1.08] text-[#f3ecd9] md:text-7xl`}>
                            <span className="relative inline-block">
                                {firstWord}
                                {/* Subrayado a mano que se dibuja al entrar, con el tiempo de la original. */}
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 200 14"
                                    preserveAspectRatio="none"
                                    className="absolute bottom-0 left-0 h-2.5 w-full overflow-visible md:bottom-0.5 md:h-3.5"
                                >
                                    <motion.path
                                        d="M3 8 Q28 3 52 7 T102 7 T152 6 T197 7"
                                        fill="none"
                                        stroke={HW.mustard}
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </svg>
                            </span>{" "}
                            {restWords.join(" ")}
                            <br />
                            <span className="text-[#d8b36a]">{t.blog.title2}</span>
                            <Bat className="ml-2 inline-block h-5 w-9 rotate-12 align-top text-[#f3ecd9]/40 md:ml-3 md:h-8 md:w-14" />
                        </h2>
                        <FlyingBat className="-right-12 top-4 md:-right-24 md:top-4" size={34} delay="-0.8s" />
                        <FlyingBat className="-right-2 top-14 hidden md:-right-4 md:top-[4.5rem] md:block" size={22} delay="-2s" />
                        <Twinkle className="-left-3 top-[4.2rem] h-3 w-3 md:-left-6 md:top-24 md:h-4 md:w-4" delay="-1s" />
                    </div>

                    {/* Flechas: botones calcomanía. El búho lee encaramado en ellas. */}
                    <div className="relative flex w-full items-center gap-4 md:w-auto">
                        <div className="pointer-events-auto absolute bottom-[-6px] right-1 w-[84px] md:bottom-[calc(100%-4px)] md:right-[-10px] md:w-[108px]">
                            <Peek id="buho" width={108} delay="-0.6s" className="h-auto w-full" />
                        </div>
                        <button
                            onClick={handleLeft}
                            aria-label="Mover hacia la izquierda"
                            className={`${arrowClass(direction === -1, "-rotate-3")} rounded-[45%_55%_48%_52%]`}
                        >
                            <HandArrow dir="left" className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button
                            onClick={handleRight}
                            aria-label="Mover hacia la derecha"
                            className={`${arrowClass(direction === 1, "rotate-2")} rounded-[55%_45%_52%_48%]`}
                        >
                            <HandArrow dir="right" className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>

                {/* Pista: costuras en vez de las líneas finas */}
                <div className="mt-6 flex items-center gap-3 md:mt-8">
                    <span className="block h-[2px] w-8 rounded-full bg-[repeating-linear-gradient(90deg,rgba(243,236,217,0.35)_0_8px,transparent_8px_14px)]" />
                    <span className={`${HW_FONT} text-[11px] uppercase tracking-[0.28em] text-[#f3ecd9]/55 md:text-xs`}>
                        {t.blog.hintLeft} <span className="normal-case tracking-normal text-[#d8b36a]">{t.blog.hintMid}</span>{" "}
                        {t.blog.hintRight}
                    </span>
                    <span className="block h-[2px] flex-1 rounded-full bg-[repeating-linear-gradient(90deg,rgba(243,236,217,0.18)_0_8px,transparent_8px_14px)]" />
                </div>
            </div>

            {/* ── Carril ── */}
            <div
                className="relative z-10 w-full overflow-hidden"
                style={{ cursor }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={handleContainerClick}
            >
                {/* Fundido de abajo para que el corte no sea seco. */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-12 bg-gradient-to-t from-[#1b171e] to-transparent" />

                {/* Tres copias de las tarjetas para el bucle sin costura. */}
                <div ref={trackRef} className="flex gap-6 px-6 pb-24 pt-16 will-change-transform" style={{ width: `${totalWidth * 3}px` }}>
                    {[...allArticles, ...allArticles, ...allArticles].map((article, i) => (
                        <HwBlogCard
                            key={`${article.id}-${i}`}
                            article={article}
                            index={i % allArticles.length}
                            tilt={tilts[i % allArticles.length]}
                            velocity={velocity}
                            basePath={basePath}
                        />
                    ))}
                </div>
            </div>

            {/* ── Enlace a todos: el cuervo lo señala con el pico. ── */}
            <div className="container relative z-10 mx-auto mt-4 flex justify-center px-6 md:px-12 lg:justify-end">
                <div className="flex items-end gap-2 md:gap-4">
                    {/* Luna llena detrás: el cuervo es de tinta y sin ella se pierde en el fondo. */}
                    <div className="relative w-[56px] shrink-0 md:w-[100px]">
                        <svg aria-hidden="true" viewBox="0 0 60 60" className="pointer-events-none absolute left-[9%] top-[7%] w-[76%]">
                            <circle cx="30" cy="30" r="28" fill={HW.bone} opacity="0.92" />
                            <circle cx="21" cy="22" r="5" fill="#d3c8ae" />
                            <circle cx="38" cy="36" r="7" fill="#d3c8ae" />
                            <circle cx="36" cy="16" r="3" fill="#d3c8ae" />
                        </svg>
                        <Peek id="cuervo-sombrero" width={100} delay="-1.4s" className="relative h-auto w-full" />
                    </div>
                    <Link
                        href={basePath}
                        className={`${HW_FONT} group mb-3 inline-flex items-center gap-2.5 whitespace-nowrap text-[11px] uppercase tracking-[0.16em] md:gap-3 md:tracking-[0.24em] text-[#f3ecd9]/60 transition-colors hover:text-[#f3ecd9] md:mb-5 md:text-xs`}
                    >
                        <span className="block h-[2px] w-5 rounded-full bg-[#d8b36a]/60 md:w-8 transition-all duration-300 group-hover:w-12 group-hover:bg-[#d8b36a] motion-reduce:transition-none" />
                        {t.blog.viewAll}
                        <HandArrow dir="right" className="h-4 w-4 text-[#d8b36a] transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
