"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/i18n/lang-context";

const STORAGE_KEY = "keting_cookie_consent";

export function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const { t } = useLang();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const reveal = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (!stored) setVisible(true);
            } catch {
                setVisible(true);
            }
        };

        // Aparece DESPUÉS de que la página termine de cargar (evento load) + un
        // respiro, para que no tape el título mientras el hero entra.
        const onLoaded = () => {
            timer = setTimeout(reveal, 1800);
        };

        if (document.readyState === "complete") {
            onLoaded();
        } else {
            window.addEventListener("load", onLoaded, { once: true });
        }

        return () => {
            clearTimeout(timer);
            window.removeEventListener("load", onLoaded);
        };
    }, []);

    const decide = (value: "accepted" | "rejected") => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ value, date: new Date().toISOString() }),
            );
        } catch {
            /* ignora si localStorage no está disponible */
        }
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-[60] pointer-events-none"
                >
                    <div className="bg-[#0a0a0a] text-white rounded-2xl shadow-2xl border border-white/10 p-5 md:p-6 pointer-events-auto relative">
                        {/* Botón cerrar discreto */}
                        <button
                            onClick={() => decide("rejected")}
                            aria-label="Cerrar aviso"
                            className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Eyebrow editorial */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="block w-8 h-px bg-white/40" />
                            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/60 font-sans">
                                {t.common.cookies}
                            </span>
                        </div>

                        <p className="text-sm leading-relaxed text-white/80 mb-5 pr-6">
                            {t.cookie.text}{" "}
                            <Link
                                href="/aviso-de-privacidad"
                                className="font-[family-name:var(--font-playfair)] italic font-normal text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
                            >
                                {t.cookie.moreInfo}
                            </Link>
                            .
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decide("accepted")}
                                className="flex-1 bg-white text-black px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/90 transition-colors"
                            >
                                {t.cookie.accept}
                            </button>
                            <button
                                onClick={() => decide("rejected")}
                                className="px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
                            >
                                {t.cookie.reject}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
