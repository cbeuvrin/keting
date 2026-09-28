"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactModal } from "@/components/pricing/contact-modal";
import { useLang } from "@/lib/i18n/lang-context";
import { SOCIAL } from "@/lib/social";
import { aboutHref, contactHref, enHref, toEn, toEs } from "@/lib/i18n/routes";
import { HW_FONT } from "./fonts";
import { HalloweenLogo } from "./halloween-logo";
import { Cobweb, Peek } from "./home/hw-ui";

// Barra y menú propios de la versión Halloween: mismos enlaces, idioma y
// "Hablemos" que el header del home, pero como calcomanía flotante, con la
// letra Gluten y un menú desplegable de noche de luna (bruja, Drácula,
// telarañas) en lugar del crema con asteriscos.
//
// Sobre el póster no se muestra: el póster ya trae su logo y sus botones, y la
// barra taparía el título. Aparece en cuanto el póster sale de la pantalla y a
// partir de ahí se esconde al bajar y vuelve al subir, igual que en el home.

// <PosterStage> solo vuelve a medir dónde están los monstruos al hacer scroll o
// cambiar el tamaño de la ventana; los del menú aparecen sin ninguna de las dos.
const relayout = () => window.dispatchEvent(new Event("hw:layout"));

const STARS = [
    { left: "9%", top: "16%", size: 14, delay: "0s", color: "#d8b36a" },
    { left: "38%", top: "7%", size: 10, delay: "1.2s", color: "#f3ecd9" },
    { left: "46%", top: "34%", size: 12, delay: "0.6s", color: "#d8b36a" },
    { left: "7%", top: "58%", size: 9, delay: "1.8s", color: "#f3ecd9" },
    { left: "34%", top: "70%", size: 15, delay: "0.3s", color: "#d8b36a" },
    { left: "24%", top: "46%", size: 8, delay: "2.1s", color: "#8e7cb3" },
];

export function HalloweenHeader() {
    const { t } = useLang();
    const router = useRouter();
    const pathname = usePathname() ?? "/halloween";
    const isEn = pathname === "/en" || pathname.startsWith("/en/");
    const reduced = useReducedMotion();

    const [pastPoster, setPastPoster] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        const update = () => {
            const y = window.scrollY;
            setPastPoster(y > window.innerHeight * 0.8);
            setHidden(y > lastY.current && y > 100);
            lastY.current = y;
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update, { passive: true });
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    useEffect(() => {
        if (!isMenuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isMenuOpen]);

    // Los mismos destinos que el menú del home; "wavy" es el subrayado que allá
    // lleva Blog, aquí ondulado en lila.
    const menuItems = [
        { label: t.nav.home, href: enHref("/#home", isEn) },
        { label: t.nav.webdesign, href: enHref("/desarrollo-web", isEn) },
        { label: t.nav.digital, href: enHref("/desarrollo-de-software", isEn) },
        { label: t.nav.automation, href: enHref("/automatizacion-de-procesos", isEn) },
        { label: t.nav.events, href: enHref("/software-para-eventos", isEn) },
        { label: t.nav.portfolio, href: enHref("/portafolio", isEn) },
        { label: t.nav.blog, href: enHref("/blog", isEn), wavy: true },
        { label: t.nav.about, href: aboutHref(isEn) },
    ];

    // El logo es el de Halloween: lleva al inicio de esta página, no al home normal.
    const toTop = (e: MouseEvent) => {
        if (pathname !== "/halloween") return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    };

    const closeMenu = () => setIsMenuOpen(false);
    const goEs = () => router.push(toEs(pathname));
    const goEn = () => router.push(toEn(pathname));

    return (
        <>
            <header
                inert={!pastPoster}
                className={cn(
                    "fixed inset-x-0 top-0 z-[70] px-3 pt-3 transition-[translate,opacity] duration-500 motion-reduce:transition-none md:px-8 md:pt-4",
                    !pastPoster && "pointer-events-none opacity-0",
                    pastPoster && hidden && "-translate-y-[140%]",
                )}
            >
                <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-4 rounded-[1.6rem_1.1rem_1.8rem_1.2rem] border-2 border-[#f3ecd9]/85 bg-[#1f1b22] pl-4 pr-3 shadow-[5px_5px_0_#d8b36a] md:h-[76px] md:pl-6 md:pr-4">
                    <div className="flex items-center gap-5">
                        <Link href="/halloween" onClick={toTop} aria-label="Keting Media">
                            <HalloweenLogo compact className="h-10 w-auto md:h-12" />
                        </Link>
                        <span aria-hidden="true" className="hidden h-8 border-l-2 border-dashed border-[#f3ecd9]/25 md:block" />
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="group hidden items-center gap-2.5 text-[#f3ecd9] transition-colors hover:text-[#d8b36a] md:flex"
                        >
                            <MenuGlyph className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none" />
                            <span className={cn(HW_FONT, "text-base font-bold")}>{t.nav.menu}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 md:gap-5">
                        <LangToggle isEn={isEn} onEs={goEs} onEn={goEn} className="hidden md:flex" />
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className={cn(
                                HW_FONT,
                                "hidden -rotate-2 rounded-[1.1rem_0.8rem_1.2rem_0.9rem] border-2 border-[#1c1a1e] bg-[#d98a4f] px-6 py-2.5 text-base font-bold text-[#1c1a1e] shadow-[3px_3px_0_#f3ecd9] transition-[rotate,translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:rotate-1 hover:shadow-[5px_5px_0_#f3ecd9] motion-reduce:transition-none md:block",
                            )}
                        >
                            {t.nav.letsTalk}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            aria-label={t.nav.openMenu}
                            className="group flex items-center text-[#f3ecd9] transition-colors hover:text-[#d8b36a] md:hidden"
                        >
                            <MenuGlyph className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none" />
                        </button>
                    </div>
                </div>
            </header>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label={t.nav.menu}
                            initial={reduced ? { opacity: 0 } : { x: "-100%" }}
                            animate={reduced ? { opacity: 1 } : { x: 0 }}
                            exit={reduced ? { opacity: 0 } : { x: "-100%" }}
                            transition={reduced ? { duration: 0.15 } : { type: "spring", damping: 30, stiffness: 300 }}
                            onAnimationComplete={relayout}
                            onScroll={relayout}
                            className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden bg-[#141216] text-[#f3ecd9]"
                        >
                            {/* Noche de luna en lugar de la cuadrícula y los asteriscos del menú normal */}
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                                <div className="absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full bg-[#ece3cf] opacity-[0.09] shadow-[0_0_140px_40px_rgba(216,179,106,0.35)] md:left-[16%] md:right-auto md:top-[5%] md:h-[400px] md:w-[400px]">
                                    <span className="absolute left-[22%] top-[55%] h-[16%] w-[16%] rounded-full bg-[#141216] opacity-30" />
                                    <span className="absolute left-[58%] top-[28%] h-[10%] w-[10%] rounded-full bg-[#141216] opacity-30" />
                                    <span className="absolute left-[64%] top-[64%] h-[7%] w-[7%] rounded-full bg-[#141216] opacity-30" />
                                </div>
                                <Cobweb corner="tl" size={150} opacity={0.14} className="hidden md:block" />
                                <Cobweb corner="br" size={280} opacity={0.14} />
                                {STARS.map((s, i) => (
                                    <StarGlyph
                                        key={i}
                                        className="absolute hidden animate-pulse motion-reduce:animate-none md:block"
                                        style={{
                                            left: s.left,
                                            top: s.top,
                                            width: s.size,
                                            height: s.size,
                                            color: s.color,
                                            animationDelay: s.delay,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* La bruja cruza frente a la luna; Drácula se asoma desde abajo */}
                            <motion.div
                                className="absolute left-[21%] top-[11%] z-[5] hidden md:block"
                                animate={reduced ? undefined : { y: [0, -12, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Peek id="bruja-escoba" width={250} />
                            </motion.div>
                            <div className="absolute bottom-0 left-[15%] z-[5] hidden md:block">
                                <Peek id="dracula" width={210} crop={0.38} delay="0.4s" />
                            </div>

                            <div className="absolute left-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-6 md:left-12">
                                <a
                                    href={SOCIAL.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="text-[#f3ecd9]/80 transition-[color,scale] hover:scale-110 hover:text-[#d8b36a]"
                                >
                                    <Facebook className="h-6 w-6" />
                                </a>
                                <a
                                    href={SOCIAL.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="text-[#f3ecd9]/80 transition-[color,scale] hover:scale-110 hover:text-[#d8b36a]"
                                >
                                    <Linkedin className="h-6 w-6" />
                                </a>
                                <a
                                    href={SOCIAL.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="text-[#f3ecd9]/80 transition-[color,scale] hover:scale-110 hover:text-[#d8b36a]"
                                >
                                    <Instagram className="h-6 w-6" />
                                </a>
                            </div>

                            <div className="relative z-10 flex min-h-full flex-col p-8 md:block md:p-12">
                                <button
                                    onClick={closeMenu}
                                    className="group mb-5 flex items-center gap-3 self-start text-[#f3ecd9] transition-colors hover:text-[#d8b36a] md:mb-8"
                                >
                                    <CloseGlyph className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" />
                                    <span className={cn(HW_FONT, "text-base font-bold")}>{t.nav.menu}</span>
                                </button>

                                <div className="mb-4 flex items-center justify-end gap-3 md:mb-6">
                                    <span className={cn(HW_FONT, "text-sm text-[#d8b36a] md:text-lg")}>
                                        {isEn ? "explore, if you dare" : "explora, si te atreves"}
                                    </span>
                                    <span className="block h-px w-10 bg-[#d8b36a]/50" />
                                </div>

                                <nav className="space-y-1">
                                    {menuItems.map((item, index) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: reduced ? 0 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="text-right"
                                        >
                                            <MenuLink href={item.href} onClick={closeMenu} wavy={item.wavy}>
                                                {item.label}
                                            </MenuLink>
                                        </motion.div>
                                    ))}

                                    {/* Contacto: ítem del menú en tablet/desktop (en móvil se usa el botón "Hablemos"), igual que en el home */}
                                    <motion.div
                                        initial={{ opacity: 0, x: reduced ? 0 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: menuItems.length * 0.05 }}
                                        className="hidden text-right md:block"
                                    >
                                        <MenuLink href={contactHref(isEn)} onClick={closeMenu}>
                                            {t.nav.contact}
                                        </MenuLink>
                                    </motion.div>
                                </nav>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-6 flex items-center justify-end gap-4 md:mt-10"
                                >
                                    <span className={cn(HW_FONT, "text-[11px] uppercase tracking-[0.25em] text-[#f3ecd9]/50 md:text-xs")}>
                                        {t.nav.idiom}
                                    </span>
                                    <span className="block h-px w-8 bg-[#f3ecd9]/20" />
                                    <LangToggle isEn={isEn} onEs={goEs} onEn={goEn} large className="flex" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45 }}
                                    className="mt-12 md:hidden"
                                >
                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            setIsContactOpen(true);
                                        }}
                                        className={cn(
                                            HW_FONT,
                                            "w-full rounded-[1.4rem_1rem_1.6rem_1.1rem] border-2 border-[#1c1a1e] bg-[#d98a4f] py-3.5 text-lg font-bold text-[#1c1a1e] shadow-[4px_4px_0_#f3ecd9]",
                                        )}
                                    >
                                        {t.nav.letsTalk}
                                    </button>
                                </motion.div>

                                {/* En celular Drácula va en el flujo, pegado al fondo: en pantallas bajas
                                    el menú hace scroll y uno absoluto taparía el botón de "Hablemos". */}
                                <div className="-mb-8 mt-auto pl-[18%] pt-8 md:hidden">
                                    <Peek id="dracula" width={130} crop={0.38} delay="0.4s" />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

/** Enlace grande del menú: al pasar el mouse se pinta de mostaza y le sale un murcielaguito. */
function MenuLink({ href, onClick, wavy = false, children }: { href: string; onClick: () => void; wavy?: boolean; children: string }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                HW_FONT,
                "group inline-flex items-center gap-3 py-0.5 text-[1.7rem] font-semibold leading-tight text-[#f3ecd9] transition-[color,translate] duration-300 hover:-translate-x-2 hover:text-[#d8b36a] motion-reduce:transition-none sm:text-4xl md:py-1 md:text-5xl",
            )}
        >
            <BatGlyph className="h-4 w-7 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:h-6 md:w-10" />
            <span
                className={
                    wavy
                        ? "underline decoration-[#8e7cb3] decoration-wavy decoration-2 underline-offset-[0.22em] [text-decoration-skip-ink:none] md:decoration-[3px]"
                        : undefined
                }
            >
                {children}
            </span>
        </Link>
    );
}

/** ES/EN como calcomanías chicas; la activa es la de hueso con sombra lila. */
function LangToggle({
    isEn,
    onEs,
    onEn,
    large = false,
    className,
}: {
    isEn: boolean;
    onEs: () => void;
    onEn: () => void;
    large?: boolean;
    className?: string;
}) {
    const pill = (active: boolean) =>
        cn(
            HW_FONT,
            "rounded-[0.7rem_0.5rem_0.8rem_0.55rem] border-2 font-bold transition-colors",
            large ? "px-3.5 py-1.5 text-base" : "px-2.5 py-1 text-sm",
            active
                ? "border-[#1c1a1e] bg-[#ece3cf] text-[#1c1a1e] shadow-[2px_2px_0_#8e7cb3]"
                : "border-transparent text-[#f3ecd9]/60 hover:text-[#f3ecd9]",
        );
    return (
        <div className={cn("items-center gap-1", className)}>
            <button onClick={onEs} className={pill(!isEn)} aria-label="Cambiar a español" aria-pressed={!isEn}>
                ES
            </button>
            <button onClick={onEn} className={pill(isEn)} aria-label="Switch to English" aria-pressed={isEn}>
                EN
            </button>
        </div>
    );
}

/** Tres rayas chuecas, como hechas a mano, en lugar de la hamburguesa. */
function MenuGlyph({ className }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
            <path
                d="M5 9.5 Q10.5 7.8 16 9.4 T27 8.6 M5 16.6 Q10 15.2 16 16.6 T27 16 M5 23.8 Q11.5 22.4 17 23.9 T24.5 23.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CloseGlyph({ className }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
            <path
                d="M8 8.5 Q15 15 24 24 M24.5 8 Q16 15.5 7.5 24.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function BatGlyph({ className }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 40 24" className={className}>
            <path
                d="M20 20 Q15 12 4 10 Q9 14 7 18 Q12 16 14 20 Q17 17 20 20 Q23 17 26 20 Q28 16 33 18 Q31 14 36 10 Q25 12 20 20 Z"
                fill="currentColor"
            />
        </svg>
    );
}

function StarGlyph({ className, style }: { className?: string; style?: CSSProperties }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style}>
            <path d="M12 0 Q13.5 10.5 24 12 Q13.5 13.5 12 24 Q10.5 13.5 0 12 Q10.5 10.5 12 0 Z" fill="currentColor" />
        </svg>
    );
}
