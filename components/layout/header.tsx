"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon, ArrowUpRight, X, Facebook, Linkedin, Instagram } from "lucide-react";
import { ContactModal } from "@/components/pricing/contact-modal";
import { useLang } from "@/lib/i18n/lang-context";


// Items se generan en el render usando el dictionary

// HeaderProps updated to include initialColor and forcedTheme
export function Header({ className, showLogo = true, initialColor = "black", forcedTheme }: { className?: string; showLogo?: boolean; initialColor?: "black" | "white", forcedTheme?: "light" | "dark" }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastY, setLastY] = useState(0);
    const { lang, setLang, t } = useLang();

    // styles: estilo editorial por palabra → "italic" (cursiva Playfair),
    // "bold" (mayúscula + subrayado), "italicUnderline" (cursiva + subrayado).
    const menuItems = [
        { label: t.nav.home, href: "/#home", styles: ["italic"] },
        { label: t.nav.webdesign, href: "/webdesing", styles: ["italic"] },
        { label: t.nav.digital, href: "/soluciones-digitales", styles: ["italic"] },
        { label: t.nav.price, href: "/precioweb", styles: ["italic"] },
        { label: t.nav.portfolio, href: "/portafolio", styles: ["italic"] },
        { label: t.nav.blog, href: "/blog", styles: ["italicUnderline"] },
    ];

    const underline = "underline decoration-2 md:decoration-[3px] underline-offset-[0.12em] decoration-black/80";
    const wordStyle = (token: string) => {
        if (token === "bold") return cn("font-heading font-normal uppercase tracking-[1px]", underline);
        if (token === "italicUnderline") return cn("font-[family-name:var(--font-playfair)] italic font-normal tracking-tight", underline);
        return "font-[family-name:var(--font-playfair)] italic font-normal tracking-tight"; // italic
    };

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Toggle background on scroll
        setIsScrolled(latest > 20);

        // Hide on scroll down, Show on scroll up
        if (latest > lastY && latest > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        setLastY(latest);
    });

    // Tema dark = fondo de página oscuro detrás del header → header transparente con texto blanco
    // Tema light (default) = fondo claro → header con fondo blanco y texto negro
    const isDark = forcedTheme === "dark";

    const backgroundColor = isDark
        ? (isScrolled ? "bg-[#0a0a0a]/80 backdrop-blur-xl" : "bg-transparent")
        : (isScrolled ? "bg-[#FAFAFA]/95 backdrop-blur-xl" : "bg-[#FAFAFA]");

    const textColor = isDark ? "text-white" : "text-black";
    const dividerColor = isDark ? "bg-white/20" : "bg-gray-200";
    const buttonBg = isDark
        ? "bg-white text-black hover:bg-white/90"
        : "bg-black text-white hover:bg-zinc-800";
    const logoSrc = isDark ? "/keting-logo-white.png" : "/keting-logo-black.png";

    return (
        <>
            <motion.header
                className={cn(
                    "fixed top-0 left-0 right-0 transition-all duration-500 z-[70] py-6",
                    backgroundColor,
                    !isVisible && "-translate-y-full"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full px-6 md:px-12 lg:px-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{
                                width: showLogo ? "auto" : 0,
                                opacity: showLogo ? 1 : 0
                            }}
                            className="overflow-visible flex items-center pr-2"
                        >
                            <Link href="/">
                                <motion.div className="cursor-pointer">
                                    <img
                                        src={logoSrc}
                                        alt="Keting Media"
                                        className="h-9 md:h-10 w-auto object-contain transition-opacity duration-500"
                                    />
                                </motion.div>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: showLogo ? 24 : 0,
                                opacity: showLogo ? 1 : 0
                            }}
                            className={cn("w-[1px] mx-2 hidden md:block transition-colors duration-500", dividerColor)}
                        />

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className={cn("hidden md:flex items-center gap-3 group transition-colors duration-500", textColor)}
                        >
                            <MenuIcon className="w-8 h-8 stroke-[1.5] group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-heading font-normal tracking-[1px] uppercase">{t.nav.menu}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className={cn(
                                "hidden md:block px-8 py-3 rounded-2xl text-sm font-bold transition-colors shadow-lg",
                                buttonBg
                            )}
                        >
                            {t.nav.letsTalk}
                        </button>

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className={cn("md:hidden flex items-center group transition-colors duration-500", textColor)}
                        >
                            <MenuIcon className="w-8 h-8 stroke-[1.5] group-hover:scale-110 transition-transform" />
                        </button>

                    </div>
                </div>
            </motion.header>

            {/* Contact Modal - rendered outside header to avoid stacking context issues */}
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            {/* Slide-in Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-full bg-[#F5F5F0] z-[70] overflow-y-auto"
                        >
                            {/* Capa decorativa: cuadrícula + asteriscos en movimiento (estilo editorial del sitio) */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div
                                    className="absolute inset-0 opacity-[0.05]"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
                                        backgroundSize: "60px 60px",
                                    }}
                                />
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-12 -right-20 text-[18rem] md:text-[28rem] text-black/[0.04] select-none font-light leading-none inline-block origin-center"
                                >*</motion.span>
                                <motion.span
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                                    className="absolute -bottom-16 -left-12 text-[12rem] md:text-[20rem] text-black/[0.04] select-none font-light leading-none inline-block origin-center"
                                >*</motion.span>
                            </div>

                            <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10">
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Facebook className="w-6 h-6" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Linkedin className="w-6 h-6" />
                                </a>
                                <a href="#" className="hover:scale-110 transition-transform">
                                    <Instagram className="w-6 h-6" />
                                </a>
                            </div>

                            <div className="relative z-10 p-8 md:p-12">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 mb-5 md:mb-8 group"
                                >
                                    <X className="w-8 h-8 stroke-[1.5] group-hover:rotate-90 transition-transform" />
                                    <span className="text-sm font-bold tracking-widest uppercase">{t.nav.menu}</span>
                                </button>

                                {/* Eyebrow editorial en Playfair italic */}
                                <div className="flex items-center justify-end gap-3 mb-4 md:mb-6">
                                    <span className="font-[family-name:var(--font-playfair)] italic text-black/40 text-sm md:text-lg">explora</span>
                                    <span className="block w-10 h-px bg-black/30" />
                                </div>

                                <nav className="space-y-1">
                                    {menuItems.map((item, index) => {
                                        const words = item.label.split(" ");
                                        return (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="text-right"
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="inline-block text-2xl md:text-5xl py-0.5 md:py-1.5 transition-all duration-300 hover:-translate-x-2 hover:text-black/55"
                                                >
                                                    {words.map((word, wi) => (
                                                        <span
                                                            key={wi}
                                                            className={wordStyle(item.styles[wi] ?? item.styles[item.styles.length - 1])}
                                                        >
                                                            {word}
                                                            {wi < words.length - 1 ? " " : ""}
                                                        </span>
                                                    ))}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Contacto: ítem del menú en tablet/desktop (en móvil se usa el botón "Hablemos") */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: menuItems.length * 0.05 }}
                                        className="hidden md:block text-right"
                                    >
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsContactOpen(true);
                                            }}
                                            className="inline-block text-2xl md:text-5xl py-0.5 md:py-1.5 transition-all duration-300 hover:-translate-x-2 hover:text-black/55 font-[family-name:var(--font-playfair)] italic font-normal tracking-tight"
                                        >
                                            {t.nav.contact}
                                        </button>
                                    </motion.div>
                                </nav>

                                {/* Toggle de idioma */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-6 md:mt-10 flex items-center justify-end gap-4"
                                >
                                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/40">
                                        {t.nav.idiom}
                                    </span>
                                    <span className="block w-8 h-px bg-black/20" />
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setLang("es")}
                                            className={`px-3 py-1.5 text-sm font-medium tracking-wider uppercase transition-all ${
                                                lang === "es"
                                                    ? "bg-black text-white rounded-md"
                                                    : "text-black/50 hover:text-black"
                                            }`}
                                        >
                                            ES
                                        </button>
                                        <span className="text-black/20">·</span>
                                        <button
                                            onClick={() => setLang("en")}
                                            className={`px-3 py-1.5 text-sm font-medium tracking-wider uppercase transition-all ${
                                                lang === "en"
                                                    ? "bg-black text-white rounded-md"
                                                    : "text-black/50 hover:text-black"
                                            }`}
                                        >
                                            EN
                                        </button>
                                    </div>
                                </motion.div>

                                {/* CTA "Hablemos" — botón negro SOLO en móvil (en tablet/desktop va el ítem "Contacto") */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45 }}
                                    className="md:hidden mt-5"
                                >
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsContactOpen(true);
                                        }}
                                        className="w-full bg-black text-white py-3 md:py-3.5 rounded-2xl text-sm md:text-base font-bold tracking-[1px] uppercase hover:bg-zinc-800 transition-colors shadow-lg"
                                    >
                                        {t.nav.letsTalk}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
