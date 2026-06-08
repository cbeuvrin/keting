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
 * Para volver a español: borra la cookie (no la setea a /es/es, lo cual fallaba).
 */
export function useTranslate() {
    const [lang, setLang] = useState<"es" | "en">("es");

    useEffect(() => {
        if (typeof document === "undefined") return;
        const m = document.cookie.match(/googtrans=([^;]+)/);
        const value = m ? decodeURIComponent(m[1]) : "";
        if (value.includes("/en")) setLang("en");
        else setLang("es");
    }, []);

    const clearCookie = (host: string) => {
        const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
        // Borra en TODAS las variantes posibles de path/domain
        document.cookie = `googtrans=; expires=${expire}; path=/;`;
        document.cookie = `googtrans=; expires=${expire}; path=/; domain=${host};`;
        document.cookie = `googtrans=; expires=${expire}; path=/; domain=.${host};`;
        // Variante para subdominios anidados
        const parts = host.split(".");
        if (parts.length > 1) {
            const root = "." + parts.slice(-2).join(".");
            document.cookie = `googtrans=; expires=${expire}; path=/; domain=${root};`;
        }
    };

    const switchTo = (target: "es" | "en") => {
        const host = window.location.hostname;

        if (target === "es") {
            // Volver a español: borrar cookie y recargar
            clearCookie(host);
        } else {
            // Traducir a inglés
            const value = "/es/en";
            document.cookie = `googtrans=${value}; path=/`;
            document.cookie = `googtrans=${value}; path=/; domain=${host}`;
            document.cookie = `googtrans=${value}; path=/; domain=.${host}`;
        }

        // Pequeño delay para asegurar escritura de cookies antes del reload
        setTimeout(() => window.location.reload(), 50);
    };

    return { lang, switchTo };
}
