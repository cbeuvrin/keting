import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Soluciones Digitales · Apps hiper-personalizadas con IA",
    description:
        "Plataformas, apps y experiencias digitales con IA aplicada para empresas mexicanas. Producto digital end-to-end: estrategia, diseño, ingeniería y crecimiento.",
    keywords: [
        "soluciones digitales con ia",
        "desarrollo de apps a medida méxico",
        "plataformas saas",
        "consultoría producto digital",
        "automatización con ia",
        "agentes ia",
    ],
    alternates: { canonical: "/soluciones-digitales" },
    openGraph: {
        title: "Soluciones Digitales · Keting Media",
        description:
            "Apps, plataformas y agentes IA para empresas que necesitan escalar más allá del SaaS estándar.",
        url: "/soluciones-digitales",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Soluciones Digitales · Keting Media",
        description: "Apps hiper-personalizadas con IA para empresas ambiciosas.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Software y soluciones digitales a medida con IA",
                        serviceType: "Desarrollo de software y soluciones digitales",
                        description:
                            "Apps, plataformas/SaaS, agentes y automatización con IA hiper-personalizados para empresas que escalan.",
                        path: "/soluciones-digitales",
                    }),
                    breadcrumb("Soluciones Digitales", "/soluciones-digitales"),
                ]}
            />
            {children}
        </>
    );
}
