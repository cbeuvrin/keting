import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: { absolute: "Portfolio · Selected work · Keting Media" },
    description:
        "Selected work by Keting Media: custom software, web, e-commerce and AI platforms for premium brands — Iudex, Gobernia, Toogo, Ivan Ivanovich and more.",
    keywords: [
        "web design portfolio",
        "digital agency case studies",
        "web projects mexico",
        "iudex",
        "gobernia",
        "toogo",
        "barmored",
    ],
    alternates: {
        canonical: "/en/portafolio",
        languages: {
            "es-MX": "/portafolio",
            "en": "/en/portafolio",
            "x-default": "/portafolio",
        },
    },
    openGraph: {
        title: "Portfolio · Keting Media",
        description:
            "Selected work: 8 industries, one editorial signature. Web design, AI platforms and digital branding.",
        url: "/en/portafolio",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Portfolio · Keting Media",
        description: "8 industries, one editorial signature. Selected work.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd data={breadcrumb("Portfolio", "/en/portafolio")} />
            {children}
        </>
    );
}
