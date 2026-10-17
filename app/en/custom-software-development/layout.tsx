import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";
import { OG_LOCALE } from "@/lib/seo/site";

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
        canonical: "/en/custom-software-development",
        languages: {
            es: "/desarrollo-de-software",
            "en": "/en/custom-software-development",
            "x-default": "/desarrollo-de-software",
        },
    },
    openGraph: {
        ...OG_LOCALE.en,
        title: "Custom software & mobile app development · Keting Media",
        description:
            "Mobile apps, platforms and custom AI agents for companies that need to scale beyond standard SaaS.",
        url: "/en/custom-software-development",
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
                        path: "/en/custom-software-development",
                    }),
                    breadcrumb("Custom software development", "/en/custom-software-development"),
                ]}
            />
            {children}
        </>
    );
}
