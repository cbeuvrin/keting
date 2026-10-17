"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { CATEGORIAS, TRABAJOS, TOTAL_TRABAJOS, type Trabajo } from "@/lib/trabajos";

// Todo el trabajo, en un carrusel por tipo de proyecto.
//
// La página principal del portafolio dedica una sección de pantalla completa a
// cada proyecto: funciona con diez, no con catorce y subiendo. Aquí el criterio
// es el contrario — que se pueda barrer todo de un vistazo y comparar dentro de
// una misma categoría, que es como pregunta quien está evaluando si contratarte.

/** Fondo cuadriculado del sitio, tenue. */
function GridBg() {
    return (
        <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.5]"
            style={{
                backgroundImage:
                    "linear-gradient(to right, rgba(29,29,31,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,29,31,0.05) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)",
            }}
        />
    );
}

function TarjetaTrabajo({ t }: { t: Trabajo }) {
    const destino = t.url ?? (t.caseSlug ? `/casos/${t.caseSlug}` : undefined);
    const dominio = t.url?.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const Marco = (
        <div className="relative">
            {/* Sombra al piso, como en las fichas del portafolio */}
            <div className="absolute -inset-x-6 -bottom-5 h-10 bg-[#1d1d1f]/15 blur-3xl rounded-full pointer-events-none" />

            {t.bareImage ? (
                <img
                    src={t.image}
                    alt={`${t.nombre} — ${t.linea}`}
                    loading="lazy"
                    className="relative w-full h-[248px] md:h-[286px] object-contain drop-shadow-2xl"
                    draggable={false}
                />
            ) : (
                <div className="relative rounded-xl overflow-hidden bg-[#1a1a1a] ring-1 ring-black/20 shadow-2xl p-[0.35rem]">
                    <div className="flex items-center gap-3 px-3 py-2 bg-[#222] rounded-t-lg">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="block w-2 h-2 rounded-full bg-[#FF5F57]" />
                            <span className="block w-2 h-2 rounded-full bg-[#FEBC2E]" />
                            <span className="block w-2 h-2 rounded-full bg-[#28C840]" />
                        </div>
                        <div className="flex-1 mx-2 h-5 rounded bg-white/5 flex items-center px-2.5 min-w-0">
                            <span className="text-[10px] text-white/50 font-mono truncate">
                                {dominio ?? "app interna · sin sitio público"}
                            </span>
                        </div>
                        {t.url && (
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">Live</span>
                            </div>
                        )}
                    </div>
                    <div className="overflow-hidden rounded-b-lg bg-white">
                        <img
                            src={t.image}
                            alt={`${t.nombre} — ${t.linea}`}
                            loading="lazy"
                            className="w-full h-[220px] md:h-[258px] object-cover object-top"
                            draggable={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <article className="snap-start shrink-0 w-[82vw] sm:w-[420px] lg:w-[480px]">
            {destino ? (
                <a
                    href={destino}
                    {...(t.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={`${t.nombre} — ${t.linea}`}
                    className="block transition-transform duration-500 hover:-translate-y-2 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d1d1f] rounded-xl"
                >
                    {Marco}
                </a>
            ) : (
                Marco
            )}

            <div className="mt-7">
                <h3 className="text-2xl md:text-[1.75rem] font-light tracking-tight text-[#1d1d1f]">{t.nombre}</h3>
                <p className="text-[#1d1d1f]/65 font-light leading-relaxed mt-2 text-[0.95rem]">{t.linea}</p>

                <div className="flex flex-wrap gap-2 mt-5">
                    {t.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] font-mono uppercase tracking-widest border border-[#1d1d1f]/20 text-[#1d1d1f]/70 px-2.5 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
                    {t.url && (
                        <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#1d1d1f] hover:text-[#1d1d1f]/60 transition-colors"
                        >
                            Ver el sitio
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    )}
                    {t.caseSlug && (
                        <Link
                            href={`/casos/${t.caseSlug}`}
                            className="inline-flex items-center gap-1.5 text-sm text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors underline decoration-1 underline-offset-4"
                        >
                            Leer el caso
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}

/**
 * Carrusel horizontal. Va sobre scroll nativo con anclaje: se arrastra con el
 * dedo en móvil, con la rueda o con las flechas, y funciona igual sin
 * JavaScript. Las flechas mueven exactamente una tarjeta.
 */
function Carrusel({ items }: { items: Trabajo[] }) {
    const pista = useRef<HTMLDivElement>(null);
    const [puedeIzq, setPuedeIzq] = useState(false);
    const [puedeDer, setPuedeDer] = useState(false);

    const medir = useCallback(() => {
        const el = pista.current;
        if (!el) return;
        setPuedeIzq(el.scrollLeft > 8);
        setPuedeDer(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        medir();
        const el = pista.current;
        if (!el) return;
        const ro = new ResizeObserver(medir);
        ro.observe(el);
        return () => ro.disconnect();
    }, [medir]);

    const mover = (dir: 1 | -1) => {
        const el = pista.current;
        if (!el) return;
        const tarjeta = el.querySelector("article");
        // El ancho de una tarjeta más el hueco: así siempre queda una alineada,
        // en vez de dejar media asomando.
        const paso = tarjeta ? tarjeta.clientWidth + 32 : el.clientWidth * 0.8;
        el.scrollBy({ left: paso * dir, behavior: "smooth" });
    };

    return (
        <div className="relative">
            <div
                ref={pista}
                onScroll={medir}
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {items.map((t) => (
                    <TarjetaTrabajo key={t.nombre} t={t} />
                ))}
                {/* Aire al final para que la última tarjeta no quede pegada al borde */}
                <span aria-hidden className="shrink-0 w-2 md:w-12" />
            </div>

            {(puedeIzq || puedeDer) && (
                <div className="flex items-center gap-3 mt-8">
                    <button
                        type="button"
                        onClick={() => mover(-1)}
                        disabled={!puedeIzq}
                        aria-label="Anterior"
                        className="w-11 h-11 rounded-full border border-[#1d1d1f]/20 grid place-items-center text-[#1d1d1f] transition-colors hover:bg-[#1d1d1f] hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#1d1d1f]"
                    >
                        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                    <button
                        type="button"
                        onClick={() => mover(1)}
                        disabled={!puedeDer}
                        aria-label="Siguiente"
                        className="w-11 h-11 rounded-full border border-[#1d1d1f]/20 grid place-items-center text-[#1d1d1f] transition-colors hover:bg-[#1d1d1f] hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#1d1d1f]"
                    >
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                    <span className="ml-2 text-xs font-mono uppercase tracking-[0.25em] text-[#1d1d1f]/35">
                        {items.length} {items.length === 1 ? "proyecto" : "proyectos"}
                    </span>
                </div>
            )}
        </div>
    );
}

function Seccion({ cat }: { cat: (typeof CATEGORIAS)[number] }) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const suave = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
    const giro = useTransform(suave, [0, 1], [0, 540]);

    return (
        <section ref={ref} className="relative py-24 md:py-32 overflow-clip">
            <GridBg />
            <motion.span
                style={{ rotate: giro }}
                aria-hidden
                className="absolute top-[8%] right-[4%] text-[8rem] md:text-[13rem] text-[#1d1d1f]/[0.06] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >
                *
            </motion.span>

            <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex items-start justify-between gap-8 mb-12 md:mb-16">
                    <div className="min-w-0">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                            <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60">{cat.eyebrow}</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                            className="uppercase leading-[1] tracking-tight text-[#1d1d1f]"
                        >
                            <span className="block text-3xl md:text-5xl lg:text-6xl font-light">{cat.tituloTop}</span>
                            <span className="block text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 px-[0.08em] pb-[0.14em]">
                                {cat.tituloItalic}
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, delay: 0.15 }}
                            className="text-base md:text-lg text-[#1d1d1f]/70 font-light leading-relaxed max-w-xl mt-8"
                        >
                            {cat.intro}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full bg-[#1d1d1f] flex items-center justify-center"
                    >
                        <span className="font-[family-name:var(--font-playfair)] italic text-2xl md:text-3xl text-white">
                            {cat.badge}
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* El carrusel sale del contenedor por la izquierda para que se note
                que hay más a la derecha, sin recortar la primera tarjeta. */}
            <div className="relative pl-6 md:pl-12 lg:pl-[max(6rem,calc((100vw-80rem)/2+6rem))]">
                <Carrusel items={TRABAJOS[cat.id]} />
            </div>
        </section>
    );
}

export function Trabajos() {
    return (
        <main className="bg-[#FAFAFA] text-[#1d1d1f]">
            {/* Portada */}
            <section className="relative overflow-clip px-6 md:px-12 lg:px-24 pt-32 md:pt-44 pb-16 md:pb-24">
                <GridBg />
                <div className="relative max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3 mb-10"
                    >
                        <Link
                            href="/portafolio"
                            className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 hover:text-[#1d1d1f] transition-colors"
                        >
                            Portafolio
                        </Link>
                        <span className="block w-8 h-px bg-[#1d1d1f]/25" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/60">Todo el trabajo</span>
                    </motion.div>

                    <h1 className="uppercase leading-[0.95] tracking-tight">
                        <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                            className="block text-5xl md:text-7xl lg:text-8xl font-light"
                        >
                            Todo el
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="block text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 px-[0.06em] pb-[0.12em]"
                        >
                            trabajo
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-base md:text-xl text-[#1d1d1f]/70 font-light leading-relaxed max-w-2xl mt-10"
                    >
                        {TOTAL_TRABAJOS} proyectos en producción, agrupados por lo que son: sitios,
                        tiendas, plataformas y software que no existía antes de construirlo.
                        Todos con su enlace, para que los abras y los juzgues tú.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.45 }}
                        className="flex flex-wrap gap-x-8 gap-y-3 mt-12"
                    >
                        {CATEGORIAS.map((c) => (
                            <a
                                key={c.id}
                                href={`#${c.id}`}
                                className="group inline-flex items-baseline gap-2 text-sm text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors"
                            >
                                <span className="font-mono text-[10px] tracking-widest text-[#1d1d1f]/35">{c.badge}</span>
                                {c.eyebrow}
                                <span className="text-[#1d1d1f]/30">({TRABAJOS[c.id].length})</span>
                            </a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {CATEGORIAS.map((cat) => (
                <div key={cat.id} id={cat.id} className="scroll-mt-24">
                    <Seccion cat={cat} />
                </div>
            ))}

            {/* Cierre */}
            <section className="relative bg-[#1a1a1a] text-white px-6 md:px-12 lg:px-24 py-28 md:py-36 overflow-clip">
                <div className="relative max-w-7xl mx-auto">
                    <h2 className="uppercase leading-[1] tracking-tight">
                        <span className="block text-4xl md:text-6xl lg:text-7xl font-light">¿Y lo tuyo</span>
                        <span className="block text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-2 px-[0.06em] pb-[0.12em]">
                            dónde encaja?
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-xl mt-8">
                        Si no lo ves aquí, probablemente sea porque todavía no existe. Ese es
                        justamente el tipo de encargo que nos gusta.
                    </p>
                    <Link
                        href="/contacto"
                        className="group inline-flex items-center gap-2 text-base font-medium mt-12 border-b border-white/30 pb-2 hover:border-white transition-colors"
                    >
                        Cuéntanos qué necesitas
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
