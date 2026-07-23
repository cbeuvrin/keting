"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { ContactModal } from "@/components/pricing/contact-modal";
import { Header } from "@/components/layout/header";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref, toEn, toEs } from "@/lib/i18n/routes";

export function GravityHeader({
    position = "right",
    mobileTheme = "dark",
}: {
    position?: "left" | "right";
    mobileTheme?: "light" | "dark";
}) {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);
    const { t } = useLang();
    const router = useRouter();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastY.current;
        const diff = latest - previous;

        // Solo reacciona si el cambio es significativo (evita parpadeo)
        if (Math.abs(diff) < 6) return;

        if (latest < 80) {
            // Cerca del tope: siempre visible
            setHidden(false);
        } else if (diff > 0) {
            // Scroll abajo: ocultar
            setHidden(true);
        } else {
            // Scroll arriba: mostrar
            setHidden(false);
        }

        lastY.current = latest;
    });

    const animateState = hidden
        ? { y: -120, opacity: 0 }
        : { y: 0, opacity: 1 };

    const transition = {
        type: "spring" as const,
        stiffness: 220,
        damping: 28,
        mass: 0.6,
    };

    return (
        <>
            {/* Mobile Header — usa el mismo Header del home para uniformidad */}
            <div className="md:hidden">
                <Header showLogo={true} forcedTheme={mobileTheme} />
            </div>

            {/* Desktop Header - Top Right/Left */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={animateState}
                transition={transition}
                className={`fixed top-6 z-50 items-center pointer-events-none hidden md:flex ${position === "left" ? "left-6" : "right-6"}`}
            >
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div className="bg-white border border-black/10 p-1.5 pl-6 pr-2 rounded-2xl flex items-center gap-1 shadow-2xl">
                        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center mr-4">
                            <img
                                src="/keting-logo-black.png"
                                alt="Keting Media"
                                className="h-8 md:h-9 w-auto object-contain"
                            />
                        </Link>
                        <nav className="flex items-center gap-5 px-2">
                            <Link href={enHref("/", isEn)} className="text-sm font-light text-zinc-600 hover:text-black transition-colors">{t.nav.home}</Link>
                            <Link href={enHref("/desarrollo-web", isEn)} className="text-sm font-light text-zinc-600 hover:text-black transition-colors">{t.nav.webdesignShort}</Link>
                            <Link href={enHref("/desarrollo-de-software", isEn)} className="text-sm font-light text-zinc-600 hover:text-black transition-colors">{t.nav.digitalShort}</Link>
                            <Link href={enHref("/automatizacion-de-procesos", isEn)} className="text-sm font-light text-zinc-600 hover:text-black transition-colors">{t.nav.automationShort}</Link>
                            <Link href={enHref("/portafolio", isEn)} className="text-sm font-light text-zinc-600 hover:text-black transition-colors">{t.nav.portfolio}</Link>
                        </nav>
                        {/* Toggle ES/EN */}
                        <div className="flex items-center gap-0.5 ml-3">
                            <button
                                onClick={() => router.push(toEs(pathname ?? "/"))}
                                className={`px-2 h-7 rounded-md text-[11px] font-bold tracking-wider uppercase transition-all ${
                                    !isEn ? "bg-black text-white" : "text-zinc-500 hover:text-black"
                                }`}
                                aria-label="Cambiar a español"
                            >
                                ES
                            </button>
                            <button
                                onClick={() => router.push(toEn(pathname ?? "/"))}
                                className={`px-2 h-7 rounded-md text-[11px] font-bold tracking-wider uppercase transition-all ${
                                    isEn ? "bg-black text-white" : "text-zinc-500 hover:text-black"
                                }`}
                                aria-label="Switch to English"
                            >
                                EN
                            </button>
                        </div>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="bg-black text-white px-6 h-10 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors ml-3"
                        >
                            {t.nav.letsTalk}
                        </button>
                    </div>
                </div>
            </motion.header>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}
