"use client";

import { Header } from "@/components/layout/header";
import { SolucionesHero } from "@/components/layout/soluciones-hero";
import { Footer } from "@/components/layout/footer";
import { useState } from "react";
import {
    HeroBajada,
    NuestroEnfoque,
    DondeLoAplicamos,
    IntegracionSistemas,
    AppsHiperpersonalizadas,
    CasosDeExitoIntro,
    GoberniaShowcase,
    IvanShowcase,
    DidisShowcase,
    IaComoAliado,
    Cierre,
} from "./Sections";
import { FaqSection } from "@/components/seo/faq-section";
import { useLang } from "@/lib/i18n/lang-context";

export default function SolucionesDigitalesPage() {
    const { t } = useLang();
    const [headerTheme, setHeaderTheme] = useState<"light" | "dark">("light");

    return (
        <main className="min-h-screen bg-[#efeff1] text-foreground">
            <Header showLogo={true} forcedTheme={headerTheme} />
            <SolucionesHero onThemeChange={setHeaderTheme} />

            <HeroBajada />
            <NuestroEnfoque />
            <DondeLoAplicamos />
            <IntegracionSistemas />
            <AppsHiperpersonalizadas />
            <CasosDeExitoIntro />
            <GoberniaShowcase />
            <IvanShowcase />
            <DidisShowcase />
            <IaComoAliado />
            <Cierre />

            <FaqSection
                items={t.softwarePage.faq}
                eyebrow={t.softwarePage.faqEyebrow}
                titleLead={t.softwarePage.faqTitleLead}
                titleAccent={t.softwarePage.faqTitleAccent}
            />

            <Footer />
        </main>
    );
}
