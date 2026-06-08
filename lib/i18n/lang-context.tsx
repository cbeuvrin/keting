"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dictionaries, type Dictionary, type Lang } from "./dictionaries";

const STORAGE_KEY = "keting_lang";

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
    const [lang, setLangState] = useState<Lang>("es");
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === "en" || stored === "es") {
                setLangState(stored);
                document.documentElement.lang = stored === "en" ? "en" : "es-MX";
            }
        } catch {
            /* noop */
        }
        setHydrated(true);
    }, []);

    const setLang = useCallback((newLang: Lang) => {
        setLangState(newLang);
        try {
            window.localStorage.setItem(STORAGE_KEY, newLang);
            document.documentElement.lang = newLang === "en" ? "en" : "es-MX";
        } catch {
            /* noop */
        }
    }, []);

    // Para evitar mismatch de hidratación, hasta que monte usamos el ES inicial
    const t = hydrated ? dictionaries[lang] : dictionaries.es;

    return (
        <LangContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang(): LangContextValue {
    return useContext(LangContext);
}
