import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Desarrollo de aplicaciones móviles y software a medida",
    description:
        "Desarrollo de aplicaciones móviles, plataformas y software a medida con IA para empresas mexicanas. Producto digital end-to-end: estrategia, diseño, ingeniería y crecimiento.",
    keywords: [
        "desarrollo de aplicaciones móviles",
        "desarrollo de apps",
        "desarrollo de software a medida",
        "plataformas saas",
        "integración de sistemas",
        "sistema de gestión",
        "automatización con ia",
        "agentes ia",
    ],
    alternates: { canonical: "/soluciones-digitales" },
    openGraph: {
        title: "Desarrollo de apps y software a medida con IA · Keting Media",
        description:
            "Apps móviles, plataformas y agentes IA a medida para empresas que necesitan escalar más allá del SaaS estándar.",
        url: "/soluciones-digitales",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Desarrollo de apps y software a medida con IA · Keting Media",
        description: "Apps móviles, plataformas y software a medida con IA para empresas ambiciosas.",
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
