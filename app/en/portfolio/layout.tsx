import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";
import { OG_LOCALE } from "@/lib/seo/site";

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
        canonical: "/en/portfolio",
        languages: {
            es: "/portafolio",
            "en": "/en/portfolio",
            "x-default": "/portafolio",
        },
    },
    openGraph: {
        ...OG_LOCALE.en,
        title: "Portfolio · Keting Media",
        description:
            "Selected work: 8 industries, one editorial signature. Web design, AI platforms and digital branding.",
        url: "/en/portfolio",
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
            <JsonLd data={breadcrumb("Portfolio", "/en/portfolio")} />
            {children}
        </>
    );
}
