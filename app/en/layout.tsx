import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: { absolute: "Custom Software, Web & App Development in Mexico · Keting Media" },
    description:
        "Mexican software development company: custom software, web and mobile apps. From your website to the internal system that runs your business. Design, engineering and AI in one team.",
    keywords: [
        "software development",
        "software development company",
        "custom software development",
        "web development mexico",
        "mobile app development",
        "app development",
        "web applications",
        "custom e-commerce",
        "saas platforms",
        "next.js web development",
        "custom software",
        "ai-powered digital solutions",
        "keting media",
        "carlos beuvrin",
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
        title: "Keting Media · Custom Software, Web & App Development in Mexico",
        description:
            "Custom software, web and mobile app development in Mexico. Design, engineering and applied AI in one team.",
        url: "/en",
        siteName: "Keting Media",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Software, Web & Apps Development · Mexico · AI",
        description: "Custom software, e-commerce, platforms and apps powered by AI for ambitious businesses.",
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
