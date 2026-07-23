import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: { absolute: "AI process automation & AI implementation in Mexico · Keting Media" },
    description:
        "Process automation and AI implementation for your company: automated workflows, AI agents and chatbots connected to your systems (ERP, CRM, WhatsApp) to eliminate repetitive manual work.",
    keywords: [
        "process automation",
        "automation with ai",
        "ai implementation for companies",
        "ai agents",
        "chatbots for businesses",
        "automate processes",
        "systems integration",
    ],
    alternates: {
        canonical: "/en/automatizacion-de-procesos",
        languages: {
            "es-MX": "/automatizacion-de-procesos",
            "en": "/en/automatizacion-de-procesos",
            "x-default": "/automatizacion-de-procesos",
        },
    },
    openGraph: {
        title: "AI process automation & implementation · Keting Media",
        description:
            "Workflows, AI agents and chatbots connected to your systems. Recover hours of manual work.",
        url: "/en/automatizacion-de-procesos",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI process automation & implementation · Keting Media",
        description: "Workflows, AI agents and chatbots connected to your systems (ERP, CRM, WhatsApp).",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "AI process automation",
                        serviceType: "Process automation and AI implementation",
                        description:
                            "Workflow automation, AI agents and chatbots integrated into the company's systems (ERP, CRM, WhatsApp) to eliminate repetitive manual work.",
                        path: "/en/automatizacion-de-procesos",
                    }),
                    breadcrumb("Process automation", "/en/automatizacion-de-procesos"),
                ]}
            />
            {children}
        </>
    );
}
