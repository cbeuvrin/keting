import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Automatización de procesos con IA en México",
    description:
        "Automatización de procesos con IA en México: flujos, agentes y chatbots conectados a tus sistemas (ERP, CRM, WhatsApp). Recupera horas de trabajo manual y reduce errores.",
    keywords: [
        "automatización de procesos",
        "automatización con ia",
        "implementación de ia en empresas",
        "agentes de ia",
        "chatbots para empresas",
        "automatizar procesos",
        "integración de sistemas",
    ],
    alternates: {
        canonical: "/automatizacion-de-procesos",
        languages: {
            "es-MX": "/automatizacion-de-procesos",
            "en": "/en/automatizacion-de-procesos",
            "x-default": "/automatizacion-de-procesos",
        },
    },
    openGraph: {
        title: "Automatización de procesos con IA · Keting Media",
        description:
            "Flujos, agentes y chatbots conectados a tus sistemas. Recupera horas de trabajo manual.",
        url: "/automatizacion-de-procesos",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Automatización de procesos con IA · Keting Media",
        description: "Flujos, agentes y chatbots conectados a tus sistemas (ERP, CRM, WhatsApp).",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Automatización de procesos con IA",
                        serviceType: "Automatización de procesos e implementación de IA",
                        description:
                            "Automatización de flujos de trabajo, agentes de IA y chatbots integrados a los sistemas de la empresa (ERP, CRM, WhatsApp) para eliminar trabajo manual repetitivo.",
                        path: "/automatizacion-de-procesos",
                    }),
                    breadcrumb("Automatización de Procesos", "/automatizacion-de-procesos"),
                ]}
            />
            {children}
        </>
    );
}
