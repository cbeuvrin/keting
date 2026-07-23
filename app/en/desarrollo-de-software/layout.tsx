import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: { absolute: "Custom software & mobile app development in Mexico · Keting Media" },
    description:
        "Custom software and mobile app development in Mexico: web and mobile apps, multi-tenant SaaS platforms, internal systems and AI agents built into the core of the product. Engineering, product design and applied AI.",
    keywords: [
        "custom software development",
        "mobile app development",
        "saas platforms",
        "systems integration",
        "management systems",
        "ai automation",
        "ai agents",
    ],
    alternates: {
        canonical: "/en/desarrollo-de-software",
        languages: {
            "es-MX": "/desarrollo-de-software",
            "en": "/en/desarrollo-de-software",
            "x-default": "/desarrollo-de-software",
        },
    },
    openGraph: {
        title: "Custom software & mobile app development · Keting Media",
        description:
            "Mobile apps, platforms and custom AI agents for companies that need to scale beyond standard SaaS.",
        url: "/en/desarrollo-de-software",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Custom software & mobile app development · Keting Media",
        description: "Mobile apps, platforms and custom software with AI for ambitious companies.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Custom software & app development",
                        serviceType: "Custom software development",
                        description:
                            "Mobile apps, platforms/SaaS, internal systems, agents and hyper-personalized AI automation for scaling companies.",
                        path: "/en/desarrollo-de-software",
                    }),
                    breadcrumb("Custom software development", "/en/desarrollo-de-software"),
                ]}
            />
            {children}
        </>
    );
}
