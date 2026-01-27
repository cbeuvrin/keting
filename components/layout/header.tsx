"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon, ArrowUpRight, X, Facebook, Linkedin, Instagram } from "lucide-react";

const menuItems = [
    { label: "Home", href: "/#home" },
    { label: "Diseño web", href: "/gravity" },
    { label: "Soluciones digitales", href: "/soluciones-digitales" },
    { label: "Portafolio", href: "/#portafolio" },
    { label: "Contacto", href: "/#contacto" },
    { label: "Blog", href: "/#blog" },
];

// HeaderProps updated to include initialColor and forcedTheme
export function Header({ className, showLogo = true, initialColor = "black", forcedTheme }: { className?: string; showLogo?: boolean; initialColor?: "black" | "white", forcedTheme?: "light" | "dark" }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Removed internal showLogo state to accept prop
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // ... (comments omitted for brevity)

    // Determine logo: 
    // If forcedTheme is dark -> White Logo
    // If forcedTheme is light -> Black Logo
    // Else fall back to standard logic
    const effectiveLogoColor = forcedTheme === "dark" ? "white" : (forcedTheme === "light" ? "black" : (isScrolled ? "black" : initialColor));
    const currentLogo = effectiveLogoColor === "white" ? "/keting-logo-white.png" : "/keting-logo-black.png";

    return (
        <>
            <motion.header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    // Logic:
                    // If forcedTheme is set: use it.
                    // Else: use standard isScrolled logic.
                    forcedTheme === "dark"
                        ? "bg-transparent py-4 text-white"
                        : (forcedTheme === "light"
                            ? "bg-white/90 backdrop-blur-md py-4 text-[#333333]"
                            : (isScrolled ? "bg-white/90 backdrop-blur-md py-4 text-[#333333]" : "bg-transparent py-8")
                        ),
                    className
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                    {/* Left: Logo + Separator + Menu Trigger */}
                    <div className="flex items-center gap-6">

                        {/* Logo Container - Revealed after preloader */}
                        {/* Logo Container - Revealed after preloader */}
                        {/* WRAPPER FOR ROTATION & CIRCLE BG */}
                        {/* Logic: 
                            isWhiteLogo = !isScrolled && initialColor === "white".
                            If White Logo -> Circle BG = Black.
                            If Black Logo -> Circle BG = White.
                        */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{
                                width: showLogo ? "auto" : 0,
                                opacity: showLogo ? 1 : 0
                            }}
                            className="overflow-visible flex items-center pr-2" // Overflow visible for the badge effect?
                        >
                            <motion.div
                                className={cn(
                                    "p-2 rounded-full",
                                    // If effectiveLogoColor is white -> bg-black (to contrast)
                                    // If effectiveLogoColor is black -> bg-white
                                    effectiveLogoColor === "white" ? "bg-black" : "bg-white"
                                )}
                            >
                                <img
                                    src={currentLogo}
                                    alt="Keting Media"
                                    className="h-8 md:h-10 w-auto object-contain"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Vertical Separator */}
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: showLogo ? 24 : 0,
                                opacity: showLogo ? 1 : 0
                            }}
                            className="w-[1px] bg-gray-300 mx-2 hidden md:block" // Hidden on mobile if space is tight? User asked for it.
                        />

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex items-center gap-3 group"
                        >
                            <MenuIcon className="w-8 h-8 stroke-[1.5] group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-heading font-normal tracking-[1px] uppercase hidden md:block">menu</span>
                        </button>
                    </div>

                    {/* Right: Contact Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsContactOpen(!isContactOpen)}
                            className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full hover:border-black transition-colors shadow-sm text-[#333333]"
                        >
                            <span className="text-sm font-heading font-normal tracking-[1px] uppercase">Contacto</span>
                            <ArrowUpRight className={cn(
                                "w-4 h-4 transition-transform",
                                isContactOpen ? "rotate-180" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            )} />
                        </button>

                        {/* Contact Form Dropdown ... (unchanged) */}
                        <AnimatePresence>
                            {isContactOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-4 w-[320px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-100"
                                >
                                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Teléfono"
                                            className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-colors"
                                        >
                                            Enviar
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.header>

            {/* Slide-in Menu ... (unchanged) */}
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
                                    <span className="text-sm font-bold tracking-widest uppercase">MENU</span>
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
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
