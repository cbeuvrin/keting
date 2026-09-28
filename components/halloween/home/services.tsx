"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";
import { Cobweb, Drips, HW, HW_FONT, HwCornerButton, HwScrollHint, Peek } from "./hw-ui";

// Versión Halloween de components/layout/services.tsx. Misma estructura y los
// mismos efectos de scroll (la tarjeta se encoge y redondea, el título se
// rellena, la descripción sube con parallax); cambian la letra, la caja y los
// adornos.

// Cuadrícula del original convertida en costuras punteadas.
const STITCHES =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 .5H60M.5 0V60' fill='none' stroke='%23f3ecd9' stroke-width='1.2' stroke-dasharray='5 6' stroke-linecap='round'/%3E%3C/svg%3E\")";

// Relleno del título: color base tenue y el degradado recortado al texto que crece con el scroll.
const FILL = {
    color: "rgba(243, 236, 217, 0.16)",
    backgroundRepeat: "no-repeat",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    backgroundPosition: "0 0",
} as const;
const fillOf = (c: string) => `linear-gradient(to right, ${c}, ${c})`;

/** Murcielaguito que sustituye al asterisco decorativo del título. */
function TinyBat({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 40 24" className={className}>
            <path
                d="M20 20 Q15 12 4 10 Q9 14 7 18 Q12 16 14 20 Q17 17 20 20 Q23 17 26 20 Q28 16 33 18 Q31 14 36 10 Q25 12 20 20 Z"
                fill="currentColor"
            />
            <path d="M18 13 L17 9 L19.5 11.5 Z M22 13 L23 9 L20.5 11.5 Z" fill="currentColor" />
            <ellipse cx="20" cy="15" rx="3.2" ry="4.2" fill="currentColor" />
        </svg>
    );
}

// Radios e hilos de la telaraña de esquina (los mismos trazos que <Cobweb>).
const WEB =
    "M0 0 L100 8 M0 0 L92 40 M0 0 L70 70 M0 0 L40 92 M0 0 L8 100 M20 1.6 Q16 7 18.4 8 Q14 13 14 14 Q9 16 7 18.4 Q5 16 1.6 20 M42 3.4 Q34 12 38.6 16.8 Q30 24 29.4 29.4 Q22 32 16.8 38.6 Q10 36 3.4 42 M66 5.3 Q54 18 60.7 26.4 Q48 38 46.2 46.2 Q36 50 26.4 60.7 Q16 56 5.3 66";

/**
 * Telaraña en la esquina del teléfono. El video pasa de claro
 * a oscuro, así que va con doble trazo (tinta debajo, crema encima): una
 * <Cobweb> solo crema desaparecía sobre los cuadros blancos.
 */
function ScreenWeb() {
    return (
        <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute right-0 top-0 h-[66px] w-[66px] -scale-x-100">
            <path d={WEB} fill="none" stroke={HW.ink} strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
            <path d={WEB} fill="none" stroke={HW.cream} strokeWidth="1" strokeLinecap="round" opacity="0.9" />
        </svg>
    );
}

export function HwServices() {
    const { t } = useLang();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });

    const width = useTransform(scrollYProgress, [0, 0.5], ["100%", "80%"]);
    // Esquinas desiguales, como calcomanía recortada a mano: cada una llega a un radio distinto.
    const borderRadius = useTransform(scrollYProgress, [0, 0.5], ["0rem 0rem 0rem 0rem", "3.4rem 2.2rem 3.8rem 1.9rem"]);
    // La sombra dura aparece conforme la tarjeta se despega de las orillas; a 100% de ancho se saldría de la pantalla.
    const shadowOffset = useTransform(scrollYProgress, [0, 0.5], [0, 12]);
    const boxShadow = useTransform(shadowOffset, (o) => `${o}px ${o}px 0 ${HW.mustard}`);
    const dripOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);

    const descY = useTransform(scrollYProgress, [0, 0.6], [60, 0], { ease: cubicBezier(0.8, 0, 1, 1) });
    const titleFill = useTransform(scrollYProgress, [0, 0.4], ["0% 100%", "100% 100%"]);

    const href = enHref("/desarrollo-web", isEn);

    return (
        <motion.section
            ref={containerRef}
            style={{ width, borderRadius, ["--hw-shadow" as string]: boxShadow }}
            className="relative z-20 mx-auto mb-40 flex min-h-[60vh] w-full snap-start items-center justify-center overflow-x-hidden py-16 text-[#f3ecd9] max-md:!w-full md:h-[51vh] md:overflow-visible md:border-[3px] md:border-[#f3ecd9]/85 md:bg-[#1f1b22] md:py-0 md:[box-shadow:var(--hw-shadow)]"
        >
            {/* Costuras punteadas y telaraña de esquina (solo en escritorio, donde hay tarjeta) */}
            <div className="pointer-events-none absolute inset-0 hidden overflow-hidden rounded-[inherit] md:block">
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: STITCHES, backgroundSize: "60px 60px" }} />
                <Cobweb corner="tl" size={230} opacity={0.16} />
            </div>
            {/* En móvil no hay tarjeta: solo una telaraña chica en la esquina. */}
            <Cobweb corner="tl" size={120} opacity={0.14} className="md:hidden" />
            <div className="pointer-events-none absolute inset-3 hidden rounded-[inherit] border-2 border-dashed border-[#f3ecd9]/15 md:block" />

            {/* La cera mostaza de la sombra escurre por abajo; baja junto con la sombra. */}
            <motion.div
                aria-hidden="true"
                style={{ x: shadowOffset, y: shadowOffset, opacity: dripOpacity }}
                className="pointer-events-none absolute left-[14%] top-full hidden h-6 w-[30%] md:block"
            >
                <Drips color={HW.mustard} className="inset-0 h-full w-full" />
            </motion.div>

            {/* Arañita que cuelga del borde de arriba de la tarjeta. El tramo de hilo
                de arriba es fijo: el monstruo se mece desde la punta de su propio hilo. */}
            {/* Entre md y lg la araña es la chica y cuelga en el hueco entre el título y el teléfono. */}
            <div className="pointer-events-auto absolute right-5 top-0 z-30 flex flex-col items-center md:right-auto md:top-[-3px] md:left-[45%] lg:left-[40%] xl:left-[50%]">
                <span className="block h-4 w-[1.6px] bg-[#f3ecd9] lg:h-10" />
                <Peek id="arana-hilo" width={58} delay="0.6s" className="lg:hidden" />
                <Peek id="arana-hilo" width={72} delay="0.6s" className="hidden lg:block" />
            </div>

            <div className="container relative mx-auto flex h-full items-start px-6 md:items-center md:px-12">
                <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2 md:items-center md:gap-12">
                    {/* Texto */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex w-full flex-col items-start justify-center text-left"
                    >
                        <Link href={href} className="group block w-full cursor-pointer">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="mb-4 flex items-center gap-3 md:mb-6"
                            >
                                <span className="block h-px w-10 bg-[#d8b36a]/70" />
                                <span className={`${HW_FONT} text-[11px] uppercase tracking-[0.28em] text-[#f3ecd9]/65 md:text-xs`}>
                                    {t.services.eyebrow}
                                </span>
                            </motion.div>
                            <h2
                                className={`${HW_FONT} mb-4 w-full origin-left text-left text-5xl font-bold leading-[1.1] tracking-tight text-[#f3ecd9] transition-transform group-hover:scale-105 min-[400px]:text-6xl md:mb-8 md:text-6xl xl:text-7xl`}
                            >
                                {/* Dos spans hermanos y no uno dentro del otro: anidado, el mostaza del padre
                                    se transparentaba bajo la palabra lila y la manchaba a medio relleno. */}
                                <motion.span style={{ ...FILL, backgroundImage: fillOf(HW.mustard), backgroundSize: titleFill }}>
                                    {t.services.title}
                                </motion.span>{" "}
                                {/* El murcielaguito va fuera del flujo: en línea no cabía junto a "web" y bajaba solo a otro renglón. */}
                                <span className="relative">
                                    <motion.span
                                        style={{ ...FILL, backgroundImage: fillOf(HW.lilac), backgroundSize: titleFill }}
                                        className="font-medium"
                                    >
                                        {t.services.titleItalic}
                                    </motion.span>
                                    <TinyBat className="absolute left-full top-0 ml-2 h-6 w-10 rotate-12 text-[#d8b36a] md:ml-3 md:w-11" />
                                </span>
                            </h2>

                            {/* Separador animado: una costura punteada que se cose sola */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                className="mx-auto mb-8 h-[2px] md:mx-0"
                                style={{
                                    backgroundImage: `repeating-linear-gradient(to right, ${HW.mustard}99 0 8px, transparent 8px 14px)`,
                                }}
                            />

                            {/* Descripción con parallax */}
                            <motion.p
                                style={{
                                    y: descY,
                                    fontSize: "clamp(1.1rem, 1rem + 1vw, 1.3rem)",
                                }}
                                className="w-full text-left font-light leading-relaxed text-[#f3ecd9]/70"
                            >
                                {t.services.descIntro}{" "}
                                {t.services.descTags.map((tag, i) => (
                                    <span key={tag}>
                                        <strong className="font-bold text-[#f3ecd9]">{tag}</strong>
                                        {i < t.services.descTags.length - 2
                                            ? ", "
                                            : i === t.services.descTags.length - 2
                                              ? ` ${t.common.and} `
                                              : ""}
                                    </span>
                                ))}
                                {t.services.descTail}
                            </motion.p>
                        </Link>
                    </motion.div>

                    {/* Teléfono con el video (solo escritorio) */}
                    {/* En xl, un poco a la izquierda del original: el letrero del botón de la esquina (solo visible ahí) es más largo que "click". */}
                    <motion.div className="relative hidden h-full items-center justify-center md:flex xl:-translate-x-8">
                        {/* Murciélago escondido detrás del teléfono: asoma la cabeza y un ala por la derecha. */}
                        <div className="absolute left-1/2 top-[6%] z-0 translate-x-[100px] rotate-[14deg]">
                            <Peek id="murcielago" width={190} delay="1.2s" flip />
                        </div>

                        {/* Sobresale menos por arriba que por abajo, y en pantallas bajas es más chico: si no, la
                            esquina del teléfono se montaba sobre los botones del póster de arriba. */}
                        <Link
                            href={href}
                            aria-label="Ver el servicio de diseño y desarrollo web"
                            className="group relative z-10 -mb-[110px] -mt-[40px] block h-[610px] w-[300px] rotate-6 [@media(max-height:800px)]:h-[520px] [@media(max-height:800px)]:w-[256px] rounded-[3.5rem_3.1rem_3.7rem_3.3rem] shadow-[12px_12px_0_#d98a4f] transition-[rotate,translate,scale] duration-500 hover:-translate-y-2 hover:rotate-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b36a] active:scale-[0.98] motion-reduce:transition-none"
                        >
                            {/* Marco: calcomanía con borde de tinta y un filo crema para que se lea sobre la tarjeta */}
                            <div className="absolute inset-0 rounded-[inherit] border-[3px] border-[#f3ecd9]/90 bg-[#1c1a1e] p-[7px]">
                                <div className="relative h-full w-full overflow-hidden rounded-[3rem_2.6rem_3.2rem_2.8rem] border-2 border-[#1c1a1e] bg-black">
                                    {/* H.264/mp4: el .mov original era HEVC (no reproduce en Chrome/Firefox). */}
                                    <video
                                        src="/videos-raros/bideo3.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="h-full w-full object-cover"
                                        aria-label="Demo de diseño web y marketing digital por Keting Media"
                                    />
                                    {/* Reflejo del vidrio */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10" />

                                    {/* Isla dinámica */}
                                    <div className="absolute left-1/2 top-4 flex h-7 w-[100px] -translate-x-1/2 items-center justify-between rounded-full bg-black px-4 ring-1 ring-white/5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                                        <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                                    </div>
                                </div>
                                {/* Telaraña tendida en la esquina del marco (fuera de la pantalla para no tapar el video) */}
                                <ScreenWeb />
                            </div>

                            {/* Botones laterales, como calcomanías pegadas al marco */}
                            <div className="absolute left-[-7px] top-24 h-8 w-[6px] rounded-l-sm border-2 border-r-0 border-[#f3ecd9]/80 bg-[#8e7cb3]" />
                            <div className="absolute left-[-7px] top-36 h-12 w-[6px] rounded-l-sm border-2 border-r-0 border-[#f3ecd9]/80 bg-[#8e7cb3]" />
                            <div className="absolute left-[-7px] top-52 h-12 w-[6px] rounded-l-sm border-2 border-r-0 border-[#f3ecd9]/80 bg-[#8e7cb3]" />
                            <div className="absolute right-[-7px] top-40 h-20 w-[6px] rounded-r-sm border-2 border-l-0 border-[#f3ecd9]/80 bg-[#8e7cb3]" />
                        </Link>
                    </motion.div>
                </div>
            </div>
            {/* Entre md y xl, y en pantallas bajas, el teléfono llega hasta el letrero: ahí queda solo la calabacita. */}
            <HwCornerButton
                href={href}
                label="¿te atreves?"
                className="max-xl:[&>span:first-child]:hidden [@media(max-height:800px)]:[&>span:first-child]:hidden"
            />
            <HwScrollHint />
        </motion.section>
    );
}
