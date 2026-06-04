"use client";

import { Header } from "@/components/layout/header";
import { SolucionesHero } from "@/components/layout/soluciones-hero";
import { Footer } from "@/components/layout/footer";
import { useState } from "react";
import {
    HeroBajada,
    NuestroEnfoque,
    DondeLoAplicamos,
    CasosDeExitoIntro,
    GoberniaShowcase,
    DidisShowcase,
    IaComoAliado,
    Cierre,
} from "./Sections";

export default function SolucionesDigitalesPage() {
    const [headerTheme, setHeaderTheme] = useState<"light" | "dark">("light");

    return (
        <main className="min-h-screen bg-[#efeff1] text-foreground">
            <Header showLogo={true} forcedTheme={headerTheme} />
            <SolucionesHero onThemeChange={setHeaderTheme} />

            <HeroBajada />
            <NuestroEnfoque />
            <DondeLoAplicamos />
            <CasosDeExitoIntro />
            <GoberniaShowcase />
            <DidisShowcase />
            <IaComoAliado />
            <Cierre />

            <Footer />
        </main>
    );
}
