import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";
import { OG_LOCALE } from "@/lib/seo/site";

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
        canonical: "/en/ai-process-automation",
        languages: {
            es: "/automatizacion-de-procesos",
            "en": "/en/ai-process-automation",
            "x-default": "/automatizacion-de-procesos",
        },
    },
    openGraph: {
        ...OG_LOCALE.en,
        title: "AI process automation & implementation · Keting Media",
        description:
            "Workflows, AI agents and chatbots connected to your systems. Recover hours of manual work.",
        url: "/en/ai-process-automation",
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
                        path: "/en/ai-process-automation",
                    }),
                    breadcrumb("Process automation", "/en/ai-process-automation"),
                ]}
            />
            {children}
        </>
    );
}
