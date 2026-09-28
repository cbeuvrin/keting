"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useLang } from "@/lib/i18n/lang-context";
import { SOCIAL } from "@/lib/social";
import { enHref, toEn, toEs, aboutHref, contactHref } from "@/lib/i18n/routes";
import { HalloweenLogo } from "../halloween-logo";
import { P, v } from "../palette";
import { Cobweb, HW_FONT, Peek } from "./hw-ui";

// Versión Halloween de components/layout/footer.tsx.
//
// Mismas columnas, mismos enlaces, mismo selector de idioma y mismos efectos
// de scroll que la original. Cambia el disfraz: el KETING gigante pasa a ser
// el logo de Halloween (reacciona al mouse), el asterisco que gira con el
// scroll es una telaraña, y la línea bajo el logo se vuelve el suelo de un
// panteón del que sale una mano zombi, con una lápida y un fantasma que se
// asoma detrás de ella.

/** Telaraña redonda completa: sustituye al asterisco gigante que gira con el scroll. */
function OrbWeb({ className = "" }: { className?: string }) {
    const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
    // Espiral de hilos: cada vuelta un poco más lejos del centro y con un leve
    // pandeo hacia dentro entre radio y radio, como hilo que cuelga.
    const rings = [14, 25, 36, 47, 58, 69, 80, 91];
    const ring = (r: number) =>
        spokes
            .map((a, i) => {
                const b = spokes[(i + 1) % spokes.length];
                const x1 = 100 + Math.cos(a) * r;
                const y1 = 100 + Math.sin(a) * r;
                const x2 = 100 + Math.cos(b) * r;
                const y2 = 100 + Math.sin(b) * r;
                const mid = (a + (i === spokes.length - 1 ? b + Math.PI * 2 : b)) / 2;
                const cx = 100 + Math.cos(mid) * r * 0.86;
                const cy = 100 + Math.sin(mid) * r * 0.86;
                return `${i === 0 ? `M${x1.toFixed(1)} ${y1.toFixed(1)}` : ""} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
            })
            .join(" ");
    return (
        <svg aria-hidden="true" viewBox="0 0 200 200" className={className}>
            <g fill="none" stroke={P.cream} strokeLinecap="round">
                <path
                    d={spokes
                        .map((a) => `M100 100 L${(100 + Math.cos(a) * 98).toFixed(1)} ${(100 + Math.sin(a) * 98).toFixed(1)}`)
                        .join(" ")}
                    strokeWidth="1.1"
                />
                {rings.map((r) => (
                    <path key={r} d={ring(r)} strokeWidth="0.9" />
                ))}
            </g>
        </svg>
    );
}

/** Llamita de vela que titila: el "estamos disponibles" en vez del puntito verde. */
function Flame() {
    return (
        <svg aria-hidden="true" viewBox="0 0 12 18" className="hw-scene h-[18px] w-3 shrink-0">
            <g className="hw-flicker" style={v({ "--o": "50% 100%" })}>
                <path d="M6 1 Q11 8 9.6 12.4 Q8.4 16 6 16 Q3.6 16 2.4 12.4 Q1 8 6 1 Z" fill={P.mustard} />
                <path d="M6 7 Q8.4 10.6 7.6 12.8 Q7 14.4 6 14.4 Q5 14.4 4.4 12.8 Q3.6 10.6 6 7 Z" fill={P.pumpkin} />
            </g>
        </svg>
    );
}

/** Murcielaguito que sube al pasar el mouse: la flecha de "volver arriba". */
function BatUp() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 64 34"
            className="h-4 w-8 text-[#d8b36a] transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6 motion-reduce:transition-none"
        >
            <path
                d="M32 30 Q28 22 24 21 Q20 13 6 9 Q11 15 9 21 Q15 18 17 24 Q21 21 24 26 Q27 24 32 30 Q37 24 40 26 Q43 21 47 24 Q49 18 55 21 Q53 15 58 9 Q44 13 40 21 Q36 22 32 30 Z M29 20 L28.5 14.5 L31 18 L33 18 L35.5 14.5 L35 20 Z"
                fill="currentColor"
            />
        </svg>
    );
}

/**
 * Costura punteada en lugar de las líneas finas del original (la misma que
 * usan los testimonios), para que las orillas se vean de la misma familia.
 */
function Seam({ className = "" }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={`h-[3px] w-full rounded-full bg-[repeating-linear-gradient(90deg,rgba(243,236,217,0.22)_0_13px,transparent_13px_23px)] ${className}`}
        />
    );
}

/**
 * Lo que sale de la tierra: la caja recorta por abajo en la línea del suelo,
 * así el contenido "emerge" cuando el suelo entra en pantalla (lo dispara el
 * contenedor del suelo con sus variantes). El padding de arriba deja aire
 * para que las reacciones (dedos que se menean, rayitas del susto) no se corten.
 */
function Emerge({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <div className={`absolute bottom-0 overflow-hidden pt-10 ${className}`}>
            <motion.div
                variants={{ under: { y: "105%" }, out: { y: 0 } }}
                transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-end"
            >
                {children}
            </motion.div>
        </div>
    );
}

const linkClass = "text-sm text-[#f3ecd9]/80 transition-colors hover:text-[#d8b36a]";
const colTitle = `${HW_FONT} mb-5 text-xs uppercase tracking-[0.24em] text-[#d8b36a]/85`;
const smallLabel = `${HW_FONT} mb-1 block text-[11px] uppercase tracking-[0.14em] text-[#f3ecd9]/45`;
const socialClass =
    "flex h-10 w-10 items-center justify-center border-2 border-[#f3ecd9]/30 text-[#f3ecd9]/75 transition-all hover:-translate-y-0.5 hover:border-[#1c1a1e] hover:bg-[#d8b36a] shadow-[2px_2px_0_rgba(142,124,179,0.35)] hover:text-[#1c1a1e] hover:shadow-[3px_3px_0_#8e7cb3] motion-reduce:transition-none";

export function HwFooter() {
    const { t } = useLang();
    const router = useRouter();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const reduce = useReducedMotion();
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.6 });
    const rotateWeb = useTransform(smooth, [0, 1], [0, 540]);
    const watermarkX = useTransform(smooth, [0, 1], ["-8%", "8%"]);

    return (
        <footer ref={ref} className="relative overflow-hidden bg-[#141216] text-[#f3ecd9]">
            {/* Cuadrícula de fondo sutil, en crema para que no se pierda en el casi-negro. */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(243,236,217,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(243,236,217,0.7) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />
            <Cobweb corner="tl" size={170} opacity={0.2} className="h-[100px] w-[100px] md:h-[170px] md:w-[170px]" />

            {/* Telaraña gigante girando con el scroll (el asterisco del original). En móvil va
                arriba del logo y más tenue para no amontonarse con la G y su araña. */}
            <motion.div
                style={{ rotate: rotateWeb }}
                className="pointer-events-none absolute right-[-6%] top-[2%] h-[6.5rem] w-[6.5rem] select-none opacity-[0.045] sm:right-[4%] sm:top-[8%] sm:h-[12rem] sm:w-[12rem] sm:opacity-[0.07] md:h-[18rem] md:w-[18rem]"
            >
                <OrbWeb className="h-full w-full" />
            </motion.div>

            <div className="container relative mx-auto px-6 pb-12 pt-20 md:px-12 md:pt-28 lg:px-20">
                {/* Logo grande centrado con el mismo logo gigante semi-transparente detrás */}
                <div className="relative mb-28 flex items-center justify-center overflow-hidden sm:mb-24 md:mb-20">
                    {/* Marca de agua: la envoltura corta el mouse para que solo reaccione el de enfrente. */}
                    <motion.div
                        style={{ x: watermarkX }}
                        aria-hidden
                        className="pointer-events-none absolute w-[200%] max-w-none select-none opacity-[0.07] md:w-[180%] lg:w-[160%]"
                    >
                        <HalloweenLogo className="h-auto w-full" />
                    </motion.div>

                    {/* Logo en primer plano: es un monstruo más, reacciona al hover y al toque. */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-[80%] max-w-[900px] md:w-[70%] lg:w-[60%]"
                    >
                        <HalloweenLogo className="h-auto w-full" />
                    </motion.div>
                </div>

                {/* Línea separadora = el suelo del panteón. Lo que sale de la tierra se
                    apoya en ella; los monstruos son decorativos para lectores de pantalla. */}
                {/* Se observa el suelo entero y no la línea: arranca con ancho cero y
                    en móvil el navegador no llegaba a darla por visible. */}
                <motion.div
                    initial={reduce ? false : "under"}
                    whileInView="out"
                    viewport={{ once: true, margin: "-10%" }}
                    className="relative mb-10 md:mb-14"
                >
                    <Emerge className="left-0 md:left-[1%]">
                        <Peek id="mano-zombi" width={150} delay="-0.8s" className="h-auto w-[78px] md:w-[130px] lg:w-[150px]" />
                    </Emerge>
                    {/* Matitas sueltas para que el centro del suelo no quede pelón en escritorio. */}
                    <Emerge delay={0.15} className="pointer-events-none left-[34%] hidden md:block">
                        <Peek id="pasto" width={60} delay="-1.4s" />
                    </Emerge>
                    <Emerge delay={0.35} className="pointer-events-none left-[63%] hidden md:block">
                        <Peek id="calabacitas" width={48} />
                    </Emerge>
                    <Emerge delay={0.25} className="right-0 pl-10 md:right-[1%] md:pl-16">
                        {/* El fantasma va detrás de la lápida y se asoma por su hombro. */}
                        <Peek
                            id="fantasma-sabana"
                            width={112}
                            crop={0.3}
                            delay="-2.1s"
                            className="-mr-6 h-auto w-[58px] md:-mr-10 md:w-[100px] lg:-mr-12 lg:w-[112px]"
                        />
                        <Peek id="lapida" width={110} className="relative h-auto w-[62px] md:w-[100px] lg:w-[110px]" />
                    </Emerge>

                    <motion.div
                        variants={{ under: { scaleX: 0 }, out: { scaleX: 1 } }}
                        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-[3px] w-full origin-left rounded-full bg-[#f3ecd9]/25"
                    />
                </motion.div>

                {/* Grid de 4 columnas */}
                <div className="mb-14 grid grid-cols-2 gap-10 md:mb-20 md:grid-cols-4 md:gap-8">
                    {/* Servicios */}
                    <div>
                        <div className={colTitle}>{t.footer.servicesTitle}</div>
                        <ul className="space-y-3">
                            <li>
                                <Link href={enHref("/desarrollo-web", isEn)} className={linkClass}>
                                    {t.nav.webdesign}
                                </Link>
                            </li>
                            <li>
                                <Link href={enHref("/desarrollo-de-software", isEn)} className={linkClass}>
                                    {t.nav.digital}
                                </Link>
                            </li>
                            <li>
                                <Link href={enHref("/automatizacion-de-procesos", isEn)} className={linkClass}>
                                    {t.nav.automation}
                                </Link>
                            </li>
                            <li>
                                <Link href={enHref("/software-para-eventos", isEn)} className={linkClass}>
                                    {t.nav.events}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Recursos */}
                    <div>
                        <div className={colTitle}>{t.footer.resourcesTitle}</div>
                        <ul className="space-y-3">
                            <li>
                                <Link href={enHref("/portafolio", isEn)} className={linkClass}>
                                    {t.nav.portfolio}
                                </Link>
                            </li>
                            <li>
                                <Link href={enHref("/blog", isEn)} className={linkClass}>
                                    {t.nav.blog}
                                </Link>
                            </li>
                            <li>
                                <Link href={aboutHref(isEn)} className={linkClass}>
                                    {t.nav.about}
                                </Link>
                            </li>
                            {/* Como en la original: en móvil es el único camino a la página
                                de contacto y el único enlace a ella que ve un rastreador. */}
                            <li>
                                <Link href={contactHref(isEn)} className={linkClass}>
                                    {t.nav.contact}
                                </Link>
                            </li>
                            <li>
                                <Link href={enHref("/", isEn)} className={linkClass}>
                                    {t.nav.home}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <div className={colTitle}>{t.footer.contactTitle}</div>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <span className={smallLabel}>{t.footer.emailLabel}</span>
                                <Link
                                    href="mailto:info@ketingmedia.com"
                                    className="group inline-flex items-center gap-1 text-[#f3ecd9]/85 transition-colors hover:text-[#d8b36a]"
                                >
                                    info@ketingmedia.com
                                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </Link>
                            </li>
                            <li>
                                <span className={smallLabel}>{t.footer.phoneLabel}</span>
                                <Link href="tel:5543830150" className="text-[#f3ecd9]/85 transition-colors hover:text-[#d8b36a]">
                                    +52 55 4383 0150
                                </Link>
                            </li>
                            <li>
                                <span className={smallLabel}>{t.footer.cityLabel}</span>
                                <span className="text-[#f3ecd9]/85">{t.footer.cityValue}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Síguenos + idioma */}
                    <div>
                        <div className={colTitle}>{t.footer.followTitle}</div>
                        {/* Botones como calcomanías redondas, cada una recortada distinto. */}
                        <div className="mb-8 flex gap-3">
                            <a
                                href={SOCIAL.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className={`${socialClass} -rotate-3 rounded-[42%_58%_38%_62%/55%_45%_60%_40%]`}
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href={SOCIAL.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className={`${socialClass} rotate-2 rounded-[60%_40%_55%_45%/42%_58%_40%_60%]`}
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                                href={SOCIAL.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className={`${socialClass} -rotate-1 rounded-[38%_62%_58%_42%/60%_40%_55%_45%]`}
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                        </div>

                        {/* Disponibilidad */}
                        <div className="mb-6">
                            <span className={smallLabel}>{t.footer.availability}</span>
                            <span className="flex items-center gap-2 text-sm text-[#f3ecd9]/85">
                                <Flame />
                                {t.footer.availabilityValue}
                            </span>
                        </div>

                        {/* Toggle idioma */}
                        <div>
                            <span className={`${smallLabel} mb-2`}>{t.nav.idiom}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => router.push(toEs(pathname ?? "/"))}
                                    className={`${HW_FONT} rounded-[0.8rem_0.5rem_0.9rem_0.45rem] border-2 px-3 pb-0.5 pt-1.5 text-xs uppercase tracking-wider transition-all ${
                                        !isEn
                                            ? "-rotate-2 border-[#1c1a1e] bg-[#d8b36a] text-[#1c1a1e] shadow-[3px_3px_0_#8e7cb3]"
                                            : "border-transparent text-[#f3ecd9]/50 hover:text-[#f3ecd9]"
                                    }`}
                                >
                                    ES
                                </button>
                                <span className="text-[#f3ecd9]/25">·</span>
                                {/* No hay /en/halloween: desde la versión de temporada, EN lleva al home en inglés. */}
                                <button
                                    onClick={() => router.push(pathname?.startsWith("/halloween") ? "/en" : toEn(pathname ?? "/"))}
                                    className={`${HW_FONT} rounded-[0.5rem_0.9rem_0.45rem_0.8rem] border-2 px-3 pb-0.5 pt-1.5 text-xs uppercase tracking-wider transition-all ${
                                        isEn
                                            ? "rotate-2 border-[#1c1a1e] bg-[#d8b36a] text-[#1c1a1e] shadow-[3px_3px_0_#8e7cb3]"
                                            : "border-transparent text-[#f3ecd9]/50 hover:text-[#f3ecd9]"
                                    }`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Línea inferior */}
                <Seam className="mb-8" />

                {/* Línea legal */}
                <div
                    className={`${HW_FONT} flex flex-col items-start justify-between gap-6 text-xs uppercase tracking-[0.12em] text-[#f3ecd9]/45 md:flex-row md:items-center`}
                >
                    <p>
                        &copy; {new Date().getFullYear()} Keting Media · {t.footer.rights}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link href={enHref("/aviso-de-privacidad", isEn)} className="transition-colors hover:text-[#f3ecd9]">
                            {t.footer.privacy}
                        </Link>
                        <Link href={enHref("/terminos-y-condiciones", isEn)} className="transition-colors hover:text-[#f3ecd9]">
                            {t.footer.terms}
                        </Link>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="group inline-flex items-center gap-2 uppercase transition-colors hover:text-[#f3ecd9]"
                            aria-label={t.footer.backToTop}
                        >
                            {t.footer.backToTop}
                            <BatUp />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
