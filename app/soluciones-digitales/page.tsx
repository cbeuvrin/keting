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
    DidisShowcase,
    IaComoAliado,
    Cierre,
} from "./Sections";
import { FaqSection } from "@/components/seo/faq-section";

export default function SolucionesDigitalesPage() {
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
            <DidisShowcase />
            <IaComoAliado />
            <Cierre />

            <FaqSection
                items={[
                    { q: "¿Qué tipo de software desarrollan?", a: "Diseñamos y desarrollamos productos digitales a medida: aplicaciones web y móviles, plataformas SaaS multi-tenant, sistemas internos que operan el negocio y agentes de IA integrados al núcleo del producto." },
                    { q: "¿Cuánto cuesta una app o plataforma a medida en México?", a: "Una app móvil o plataforma SaaS a medida arranca desde $120,000 MXN, y un sistema interno desde $100,000 MXN. El precio final depende del alcance, las integraciones y la complejidad." },
                    { q: "¿Integran inteligencia artificial?", a: "Sí. Integramos modelos de IA en el núcleo del producto: desde onboarding y automatizaciones hasta sistemas multi-agente para procesos críticos del negocio." },
                    { q: "¿Cuánto tarda en construirse una plataforma?", a: "Una plataforma o app a medida toma desde 2 a 4 meses según la complejidad. Definimos alcance y entregables por fases para lanzar lo esencial pronto y escalar después." },
                ]}
            />

            <Footer />
        </main>
    );
}
