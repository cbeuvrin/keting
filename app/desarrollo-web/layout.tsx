import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Diseño y desarrollo web en CDMX y todo México",
    description:
        "Agencia de diseño y desarrollo web a medida en Ciudad de México (CDMX) y todo el país: sitios, aplicaciones web, e-commerce y landing pages con Next.js y SEO técnico.",
    keywords: [
        "diseño web",
        "desarrollo web",
        "aplicaciones web",
        "e-commerce a medida",
        "landing pages",
        "seo técnico",
        "next.js",
        "desarrollo web cdmx",
        "agencia de desarrollo web ciudad de méxico",
    ],
    alternates: {
        canonical: "/desarrollo-web",
        languages: {
            "es-MX": "/desarrollo-web",
            "en": "/en/desarrollo-web",
            "x-default": "/desarrollo-web",
        },
    },
    openGraph: {
        title: "Diseño y desarrollo web a medida · Keting Media",
        description:
            "Sitios, aplicaciones web, e-commerce y landing pages a medida con Next.js, SEO técnico y máximo rendimiento.",
        url: "/desarrollo-web",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Diseño y desarrollo web a medida · Keting Media",
        description: "Sitios, web apps, e-commerce y landing pages a medida con Next.js y SEO técnico.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Diseño y desarrollo web a medida",
                        serviceType: "Diseño y desarrollo web",
                        description:
                            "Sitios, aplicaciones web, e-commerce y landing pages a medida con UX/UI, desarrollo (Next.js, React), SEO técnico y rendimiento.",
                        path: "/desarrollo-web",
                    }),
                    breadcrumb("Diseño y desarrollo web", "/desarrollo-web"),
                ]}
            />
            {children}
        </>
    );
}
