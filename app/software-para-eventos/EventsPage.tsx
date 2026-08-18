"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/seo/faq-section";
import { Testimonials } from "@/components/layout/testimonials";
import { useLang } from "@/lib/i18n/lang-context";
import { caseStudyHref, contactHref } from "@/lib/i18n/routes";

// Página de servicio: software para eventos en vivo.
//
// Existe porque las dos mayores cuentas de Keting son productoras de eventos
// (Enso Media y Kaizen) y el sitio no lo decía en ninguna parte: le hablaba a un
// cliente final que quiere una web, no a un director de proyectos de una
// productora, que es quien de verdad compra.
//
// TODO lo que se afirma aquí viene de proyectos ejecutados. Las dos capacidades
// con caso propio enlazan a él; la tercera (Apizeal, con Kaizen) se describe sin
// enlace porque falta captura y cifra — antes que inventarlas, se queda sin caso.

// La cuadrícula del fondo, dibujada en canvas para que reaccione al mouse como
// una red: cada punto de cada línea se aparta del cursor con una caída
// gaussiana (cuanto más cerca, más se aparta) y el conjunto persigue al mouse
// con un poco de retraso, así el rebote se siente elástico y no pegado al
// puntero. En reposo —y para quien pide menos movimiento— dibuja exactamente
// la misma trama recta de 80px que tenía el CSS.
function GridNet() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let raf = 0, W = 0, H = 0, DPR = 1;
        // tx/ty = donde está el mouse; x/y = donde va la deformación (lo sigue con retraso)
        const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

        const resize = () => {
            DPR = Math.min(window.devicePixelRatio || 1, 2);
            const r = canvas.getBoundingClientRect();
            W = r.width; H = r.height;
            canvas.width = Math.round(W * DPR);
            canvas.height = Math.round(H * DPR);
        };
        resize();

        const onMove = (ev: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            mouse.tx = ev.clientX - r.left;
            mouse.ty = ev.clientY - r.top;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("resize", resize);

        const SAMPLE = 16; // muestreo dentro de cada línea: curvas suaves, no codos
        const RADIUS = 150; // alcance de la deformación
        const FORCE = 30;   // desplazamiento máximo en px

        // Trama imperfecta: la separación varía línea a línea (80px ± 22),
        // como cuadrícula trazada a mano. El "azar" sale de un hash del índice,
        // no de Math.random(): así el dibujo es idéntico en cada frame y en
        // cada visita, y no baila al redimensionar.
        const jitter = (i: number, salt: number) => {
            const n = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
            return (n - Math.floor(n)) - 0.5; // -0.5 .. 0.5
        };
        const lines = (limit: number, salt: number) => {
            const out: number[] = [];
            let pos = 0;
            for (let i = 0; pos < limit; i++) {
                pos += 80 + jitter(i, salt) * 44;
                if (pos < limit) out.push(pos);
            }
            return out;
        };

        const warp = (x: number, y: number): [number, number] => {
            if (reduce) return [x, y];
            const dx = x - mouse.x, dy = y - mouse.y;
            const d2 = dx * dx + dy * dy;
            const f = FORCE * Math.exp(-d2 / (RADIUS * RADIUS));
            if (f < 0.05) return [x, y];
            const d = Math.sqrt(d2) || 1;
            return [x + (dx / d) * f, y + (dy / d) * f];
        };

        const draw = () => {
            mouse.x += (mouse.tx - mouse.x) * 0.15;
            mouse.y += (mouse.ty - mouse.y) * 0.15;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.strokeStyle = "rgba(0,0,0,0.045)";
            ctx.lineWidth = 1;
            for (const y of lines(H, 1)) {
                ctx.beginPath();
                for (let x = 0; x <= W; x += SAMPLE) {
                    const [px, py] = warp(x, y);
                    if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
            for (const x of lines(W, 2)) {
                ctx.beginPath();
                for (let y = 0; y <= H; y += SAMPLE) {
                    const [px, py] = warp(x, y);
                    if (y === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" />;
}

// Revelado por línea con máscara, el mismo de /portafolio y /automatizacion.
function RiseText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <div className="overflow-hidden">
            <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
}

export function EventsPage() {
    const { t } = useLang();
    const e = t.eventsPage;
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;

    // Cursor propio del hero: dentro de él, el mouse es un círculo blanco con
    // la flecha de scroll (como el botón circular del bloque de soluciones,
    // pero siguiendo al puntero). Muelles para que persiga con inercia suave.
    // En pantallas táctiles no hay mousemove, así que sencillamente no aparece.
    const [cursorOn, setCursorOn] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const cursorXs = useSpring(cursorX, { stiffness: 400, damping: 40, mass: 0.6 });
    const cursorYs = useSpring(cursorY, { stiffness: 400, damping: 40, mass: 0.6 });

    // Efecto pegamento de la barra: una gota negra sigue al cursor dentro del
    // mismo filtro "goo" que envuelve a la barra (desenfoque + contraste del
    // canal alfa), así que cuando la gota se acerca, el negro de la barra se
    // estira hacia ella como si estuviera pegado, y el hilo se rompe al
    // alejarse. La gota encoge con la distancia y desaparece pasado el umbral;
    // el muelle del tamaño le da el chasquido de "despegarse".
    const barWrapRef = useRef<HTMLDivElement>(null);
    const BLOB = 88; // diámetro en px
    const blobX = useMotionValue(0);
    const blobY = useMotionValue(0);
    const blobScale = useMotionValue(0);
    const blobXs = useSpring(blobX, { stiffness: 350, damping: 30, mass: 0.5 });
    const blobYs = useSpring(blobY, { stiffness: 350, damping: 30, mass: 0.5 });
    const blobScaleS = useSpring(blobScale, { stiffness: 260, damping: 22 });


    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">
            <Header showLogo forcedTheme="light" />

            {/* ── HERO ──
                Cartel tipo pancarta: fondo blanco y una barra negra que cruza
                la pantalla con el titular dentro en blanco — la barra entra
                barriendo desde la izquierda (scaleX con origen izquierdo, como
                un subrayador) y después sube el texto. Debajo, a la derecha,
                el lema en la cursiva de la casa. El cursor dentro del hero es
                el círculo con flecha (negro aquí, porque el fondo es claro). */}
            <section
                onMouseMove={(ev) => {
                    cursorX.set(ev.clientX);
                    cursorY.set(ev.clientY);
                    if (!cursorOn) setCursorOn(true);
                    const r = barWrapRef.current?.getBoundingClientRect();
                    if (r) {
                        blobX.set(ev.clientX - r.left - BLOB / 2);
                        blobY.set(ev.clientY - r.top - BLOB / 2);
                        // Distancia del cursor al borde de la barra (0 = dentro)
                        const dx = Math.max(r.left - ev.clientX, 0, ev.clientX - r.right);
                        const dy = Math.max(r.top - ev.clientY, 0, ev.clientY - r.bottom);
                        const d = Math.hypot(dx, dy);
                        blobScale.set(d > 170 ? 0 : 0.35 + 0.65 * (1 - d / 170));
                    }
                }}
                onMouseLeave={() => {
                    setCursorOn(false);
                    blobScale.set(0);
                }}
                className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-clip md:cursor-none"
            >
                {/* Cuadrícula-red: se deforma alrededor del mouse y vuelve sola */}
                <GridNet />
                <AnimatePresence>
                    {cursorOn && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.25 }}
                            style={{ x: cursorXs, y: cursorYs }}
                            className="hidden md:flex fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#111111] items-center justify-center z-[65] pointer-events-none"
                        >
                            <motion.span
                                animate={{ y: [-3, 3, -3] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ArrowDown className="w-7 h-7 lg:w-9 lg:h-9 text-white" />
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* El filtro que hace el pegamento. Definición oculta: desenfoca
                    la silueta y recontrasta el alfa (a*22-11), con la imagen
                    original compuesta encima para que texto y bordes sigan
                    nítidos. La región del filtro se amplía en vertical para que
                    la gota no se recorte al salirse de la caja de la barra. */}
                <svg aria-hidden className="absolute w-0 h-0">
                    <defs>
                        <filter id="goo-hero" x="-10%" y="-250%" width="120%" height="600%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
                            <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
                                result="goo"
                            />
                            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                        </filter>
                    </defs>
                </svg>

                {/* La barra negra (+ la gota que persigue al cursor, dentro del
                    mismo filtro para que se fundan) */}
                <div ref={barWrapRef} className="relative w-[94vw] md:w-[78vw] max-w-[1560px]" style={{ filter: "url(#goo-hero)" }}>
                    {/* La gota que persigue al cursor: dentro del mismo filtro que
                        la barra, así el negro se estira hacia ella (pegamento) */}
                    <motion.div
                        aria-hidden
                        style={{ x: blobXs, y: blobYs, scale: blobScaleS, width: BLOB, height: BLOB }}
                        className="hidden md:block absolute top-0 left-0 rounded-full bg-[#111111] pointer-events-none"
                    />
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full bg-[#111111] origin-left"
                >
                    {/* Las tres palabras entran a destiempo y cada una a su
                        manera: SOFTWARE sube tras una máscara, la cursiva llega
                        desenfocada y se enfoca (como una lente), y EVENTOS
                        aparece con las letras abiertas que se aprietan a su
                        sitio. Los retrasos van encadenados a la barra. */}
                    <div className="px-[2.2vw] py-[2.2vw] md:py-[1.5vw]">
                        <h1 className="text-center uppercase !text-white whitespace-nowrap leading-none tracking-tight text-[clamp(1.9rem,6.1vw,7.6rem)]">
                            <span className="inline-block overflow-hidden align-bottom">
                                <motion.span
                                    initial={{ y: "112%" }}
                                    animate={{ y: "0%" }}
                                    transition={{ duration: 0.95, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-block font-light"
                                >
                                    {e.hero.h1Lines[0]}
                                </motion.span>
                            </span>{" "}
                            <motion.span
                                initial={{ opacity: 0, filter: "blur(12px)", scale: 1.12 }}
                                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                transition={{ duration: 0.95, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-block font-[family-name:var(--font-playfair)] italic font-normal normal-case text-[1.08em] align-bottom !text-white/50"
                            >
                                {e.hero.h1Lines[1]}
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0, letterSpacing: "0.14em" }}
                                animate={{ opacity: 1, letterSpacing: "-0.02em" }}
                                transition={{ duration: 1.1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-block font-medium"
                            >
                                {e.hero.h1Lines[2]}
                            </motion.span>
                        </h1>
                    </div>
                </motion.div>
                </div>

                {/* El lema, abajo a la derecha de la barra */}
                <div className="w-[94vw] md:w-[78vw] max-w-[1560px] flex justify-end">
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-7 md:mt-9 text-xl md:text-3xl font-[family-name:var(--font-playfair)] italic text-[#111111]"
                    >
                        {e.hero.heroLead}
                    </motion.p>
                </div>
            </section>

            {/* ── POR QUÉ ES DISTINTO ── */}
            <section className="relative py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#F5F5F0] overflow-hidden">
                <span className="absolute -top-10 right-[4%] text-[10rem] md:text-[16rem] text-[#1d1d1f]/[0.05] select-none font-light leading-none rotate-12 pointer-events-none">*</span>
                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-10 md:mb-14">
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 font-sans">{e.why.eyebrow}</span>
                    </div>
                    <h2 className="uppercase leading-[0.95] tracking-tight mb-12 md:mb-16">
                        <RiseText delay={0}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-light">{e.why.titleLead}</span>
                        </RiseText>
                        <RiseText delay={0.12}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-1 md:mt-2">
                                {e.why.titleAccent}
                            </span>
                        </RiseText>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 md:gap-14">
                        <p className="text-lg md:text-xl text-[#1d1d1f]/70 font-light leading-relaxed">{e.why.p1}</p>
                        <p className="text-lg md:text-xl text-[#1d1d1f]/70 font-light leading-relaxed">{e.why.p2}</p>
                    </div>
                </div>
            </section>

            {/* ── CAPACIDADES ── */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10 md:mb-14">
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 font-sans">
                            {e.capabilities.eyebrow}
                        </span>
                    </div>
                    <h2 className="uppercase leading-[0.95] tracking-tight mb-16 md:mb-20">
                        <RiseText delay={0}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-light">{e.capabilities.title}</span>
                        </RiseText>
                        <RiseText delay={0.12}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-1 md:mt-2">
                                {e.capabilities.titleAccent}
                            </span>
                        </RiseText>
                    </h2>

                    <div className="flex flex-col">
                        {e.capabilities.items.map((item, i) => (
                            <motion.div
                                key={item.n}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className={`py-10 md:py-12 grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-12 items-start border-t border-[#1d1d1f]/15 ${
                                    i === e.capabilities.items.length - 1 ? "border-b" : ""
                                }`}
                            >
                                <span className="font-mono text-sm text-[#1d1d1f]/40 pt-1">{item.n}</span>

                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3">{item.name}</h3>
                                    <p className="text-base md:text-lg text-[#1d1d1f]/70 font-light leading-relaxed max-w-2xl">
                                        {item.body}
                                    </p>
                                </div>

                                <div className="md:text-right md:pl-8">
                                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#1d1d1f]/40 font-mono mb-2">
                                        {item.proof}
                                    </span>
                                    {/* Solo enlaza lo que tiene caso publicado. Apizeal todavía
                                        no lo tiene (falta captura y cifra), así que se nombra
                                        sin enlace en vez de mandar a un destino inventado. */}
                                    {item.caseSlug && (
                                        <Link
                                            href={caseStudyHref(item.caseSlug, isEn)}
                                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#1d1d1f] hover:text-[#1d1d1f]/60 transition-colors"
                                        >
                                            {isEn ? "Read the case" : "Ver el caso"}
                                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CATÁLOGO ──
                Deliberadamente SEPARADO de la sección anterior. Arriba están las
                tres piezas entregadas, cada una con su caso; aquí está lo que se
                puede construir. Mezclarlas convertiría 44 capacidades en 44
                afirmaciones sobre el pasado, que es justo lo que no queremos.
                El "lead" hace explícita esa frontera en el propio texto. */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#EDEDE6]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10 md:mb-14">
                        <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50 font-sans">
                            {e.catalog.eyebrow}
                        </span>
                    </div>
                    <h2 className="uppercase leading-[0.95] tracking-tight mb-8">
                        <RiseText delay={0}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-light">{e.catalog.title}</span>
                        </RiseText>
                        <RiseText delay={0.12}>
                            <span className="block text-4xl md:text-7xl lg:text-8xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-1 md:mt-2">
                                {e.catalog.titleAccent}
                            </span>
                        </RiseText>
                    </h2>
                    <p className="text-base md:text-lg text-[#1d1d1f]/70 font-light leading-relaxed max-w-2xl mb-16 md:mb-20">
                        {e.catalog.lead}
                    </p>

                    <div className="flex flex-col">
                        {e.catalog.groups.map((group, i) => (
                            <motion.div
                                key={group.n}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-8%" }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className={`py-10 md:py-12 grid md:grid-cols-[minmax(0,15rem)_1fr] gap-6 md:gap-12 items-start border-t border-[#1d1d1f]/15 ${
                                    i === e.catalog.groups.length - 1 ? "border-b" : ""
                                }`}
                            >
                                {/* El título se queda fijo mientras se recorre su lista:
                                    con 44 renglones es fácil perder de vista en qué
                                    momento del evento estás leyendo. */}
                                <div className="md:sticky md:top-28">
                                    <span className="block font-mono text-sm text-[#1d1d1f]/40 mb-2">{group.n}</span>
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
                                        {group.name}
                                    </h3>
                                </div>

                                <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3.5">
                                    {group.items.map((item) => (
                                        <li key={item} className="flex gap-3 text-[#1d1d1f]/75 font-light leading-relaxed">
                                            <span aria-hidden className="text-[#1d1d1f]/30 select-none pt-0.5 text-sm">*</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <p className="mt-10 text-sm md:text-base text-[#1d1d1f]/55 font-light italic">
                        {e.catalog.note}
                    </p>
                </div>
            </section>

            {/* Testimonios reales — incluye el de Enso Media, que habla justo de un evento. */}
            <Testimonials />

            <FaqSection
                items={e.faq}
                eyebrow={e.faqEyebrow}
                titleLead={e.faqTitleLead}
                titleAccent={e.faqTitleAccent}
            />

            {/* ── CTA ── */}
            <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#1d1d1f] text-white overflow-hidden">
                <span className="absolute bottom-[-6%] left-[3%] text-[10rem] md:text-[18rem] text-white/[0.04] select-none font-light leading-none -rotate-12 pointer-events-none">*</span>
                <div className="max-w-3xl mx-auto relative text-center">
                    <h2 className="uppercase leading-[0.98] tracking-tight mb-8 text-white">
                        <span className="block text-4xl md:text-6xl lg:text-7xl font-light">{e.cta.titleLead}</span>
                        <span className="block text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-playfair)] italic font-normal normal-case mt-1">
                            {e.cta.titleAccent}
                        </span>
                    </h2>
                    <p className="text-lg text-white/70 font-light leading-relaxed mb-10">{e.cta.body}</p>
                    <Link
                        href={contactHref(isEn)}
                        className="inline-flex items-center justify-center px-9 py-4 bg-white text-[#1d1d1f] text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase hover:bg-white/85 transition-colors"
                    >
                        {e.cta.button}
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
