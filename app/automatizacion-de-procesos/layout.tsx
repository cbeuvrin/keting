import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

const title = "Automatización de procesos con IA en CDMX · Keting Media";
const description = "Automatizamos procesos con IA y WhatsApp conectados a tus sistemas. Diagnóstico desde $11,000 MXN y precio fijo. Tu equipo recupera horas cada semana.";

export const metadata: Metadata = {
    title: { absolute: title },
    description,
    keywords: [
        "automatización de procesos",
        "automatización con ia",
        "implementación de ia en empresas",
        "agentes de ia",
        "chatbots para empresas",
        "automatizar procesos",
        "integración de sistemas",
        "automatización de procesos cdmx",
        "agentes de ia ciudad de méxico",
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
        title,
        description,
        url: "/automatizacion-de-procesos",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
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
