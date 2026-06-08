"use client";

import { useEffect, useState } from "react";

declare global {
    interface Window {
        google?: {
            translate?: {
                TranslateElement: new (
                    config: {
                        pageLanguage: string;
                        includedLanguages?: string;
                        autoDisplay?: boolean;
                    },
                    elementId: string,
                ) => void;
            };
        };
        googleTranslateElementInit?: () => void;
    }
}

/**
 * Carga el widget de Google Translate en background.
 * Renderiza un div oculto que recibe la inicialización del widget.
 * Solo se monta una vez, idealmente en el root layout.
 */
export function GoogleTranslateInit() {
    useEffect(() => {
        if (document.getElementById("gt-script")) return;

        window.googleTranslateElementInit = () => {
            if (!window.google?.translate?.TranslateElement) return;
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "es",
                    includedLanguages: "es,en",
                    autoDisplay: false,
                },
                "google_translate_element",
            );
        };

        const s = document.createElement("script");
        s.id = "gt-script";
        s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.body.appendChild(s);
    }, []);

    return (
        <>
            <div id="google_translate_element" style={{ display: "none" }} aria-hidden />
            {/* Ocultar la barra superior que Google inyecta */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .goog-te-banner-frame.skiptranslate,
                .goog-te-banner-frame,
                #goog-gt-tt,
                .skiptranslate iframe { display: none !important; }
                body { top: 0 !important; }
                .goog-te-spinner-pos,
                .VIpgJd-ZVi9od-ORHb-OEVmcd,
                .VIpgJd-ZVi9od-l4eHX-hSRGPd { display: none !important; }
            `,
                }}
            />
        </>
    );
}

/**
 * Hook para alternar el idioma usando la cookie googtrans del widget.
 */
export function useTranslate() {
    const [lang, setLang] = useState<"es" | "en">("es");

    useEffect(() => {
        const m = typeof document !== "undefined"
            ? document.cookie.match(/googtrans=([^;]+)/)
            : null;
        if (m && decodeURIComponent(m[1]).includes("/en")) setLang("en");
    }, []);

    const switchTo = (target: "es" | "en") => {
        const host = window.location.hostname;
        const value = target === "es" ? "/es/es" : "/es/en";
        // Cookie con dominio actual + variantes (root y con punto inicial)
        document.cookie = `googtrans=${value}; path=/; domain=${host}`;
        document.cookie = `googtrans=${value}; path=/; domain=.${host}`;
        document.cookie = `googtrans=${value}; path=/`;
        // Reload aplica la traducción
        window.location.reload();
    };

    return { lang, switchTo };
}
