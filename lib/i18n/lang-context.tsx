"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { dictionaries, type Dictionary, type Lang } from "./dictionaries";

type LangContextValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: Dictionary;
};

const LangContext = createContext<LangContextValue>({
    lang: "es",
    setLang: () => {},
    t: dictionaries.es,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // El idioma lo manda la URL: /en o /en/... => inglés; el resto => español.
    const lang: Lang = pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "es";

    // Mantener el atributo lang del <html> sincronizado (a11y + SEO).
    useEffect(() => {
        document.documentElement.lang = lang === "en" ? "en" : "es-MX";
    }, [lang]);

    // setLang se conserva como no-op de estado (la navegación cambia el idioma);
    // los navs siguen llamándolo antes de router.push sin efecto adverso.
    const value: LangContextValue = {
        lang,
        setLang: () => {},
        t: dictionaries[lang],
    };

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
    return useContext(LangContext);
}
