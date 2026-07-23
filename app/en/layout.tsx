import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Custom software, web & app development in Mexico · Keting Media",
    description:
        "Nearshore custom software, web and mobile app development from Mexico City. Design, engineering and applied AI in one team. Same timezone as the US, senior work, 80%+ referral-driven.",
    keywords: [
        "nearshore software development mexico",
        "custom software development mexico",
        "software development company mexico",
        "web development mexico",
        "mobile app development mexico",
        "ai automation",
        "nearshore development",
    ],
    alternates: {
        canonical: "/en",
        languages: {
            "es-MX": "/",
            "en": "/en",
            "x-default": "/",
        },
    },
    openGraph: {
        title: "Keting Media · Custom software, web & app development in Mexico",
        description:
            "Nearshore custom software, web and app development from Mexico City. Design, engineering & AI in one team.",
        url: "/en",
        siteName: "Keting Media",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Custom software, web & app development in Mexico · Keting Media",
        description: "Nearshore development from Mexico City — design, engineering & AI in one team.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Custom software, web & app development",
                        serviceType: "Nearshore software development",
                        description:
                            "Custom software, web and mobile app development, e-commerce, SaaS platforms and AI automation, built end-to-end from Mexico City for companies in the US and LATAM.",
                        path: "/en",
                    }),
                    breadcrumb("English", "/en"),
                ]}
            />
            {children}
        </>
    );
}
