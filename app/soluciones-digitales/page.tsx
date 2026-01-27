"use client";

import { Header } from "@/components/layout/header";
import { SolucionesHero } from "@/components/layout/soluciones-hero";
import { Footer } from "@/components/layout/footer";

import { useState } from "react";

export default function SolucionesDigitalesPage() {
    const [headerTheme, setHeaderTheme] = useState<"light" | "dark">("light");

    return (
        <>
            <main className="min-h-screen bg-[#efeff1] text-foreground">
                <Header showLogo={true} forcedTheme={headerTheme} />
                <SolucionesHero onThemeChange={setHeaderTheme} />
                <div className="h-[50vh] flex items-center justify-center bg-white">
                    <p className="text-gray-400">Contenido adicional próximamente...</p>
                </div>
                <Footer />
            </main>
        </>
    );
}
