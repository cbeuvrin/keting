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

    const menuItems = [
        { label: t.nav.home, href: "/#home" },
        { label: t.nav.webdesign, href: "/webdesing" },
        { label: t.nav.digital, href: "/soluciones-digitales" },
        { label: t.nav.price, href: "/precioweb" },
        { label: t.nav.portfolio, href: "/portafolio" },
        { label: t.nav.blog, href: "/blog" },
    ];

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
                            <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-6">
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

                            <div className="p-8 md:p-12">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 mb-16 group"
                                >
                                    <X className="w-8 h-8 stroke-[1.5] group-hover:rotate-90 transition-transform" />
                                    <span className="text-sm font-bold tracking-widest uppercase">{t.nav.menu}</span>
                                </button>

                                <nav className="space-y-1">
                                    {menuItems.map((item, index) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block text-4xl md:text-6xl font-heading font-normal uppercase tracking-[1px] py-2 hover:tracking-wider hover:text-gray-500 transition-all duration-300 text-right"
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* Toggle de idioma */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-12 md:mt-16 flex items-center justify-end gap-4"
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
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
