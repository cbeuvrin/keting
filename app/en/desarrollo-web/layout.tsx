import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: { absolute: "Custom web design & development in Mexico · Keting Media" },
    description:
        "Custom web design and development in Mexico: bespoke websites, e-commerce and landing pages built on Next.js and React, with technical SEO and speed. Design, engineering and AI in one team.",
    keywords: [
        "web design",
        "web development",
        "web applications",
        "custom e-commerce",
        "landing pages",
        "technical seo",
        "next.js",
    ],
    alternates: {
        canonical: "/en/desarrollo-web",
        languages: {
            "es-MX": "/desarrollo-web",
            "en": "/en/desarrollo-web",
            "x-default": "/desarrollo-web",
        },
    },
    openGraph: {
        title: "Custom web design & development · Keting Media",
        description:
            "Bespoke websites, web applications, e-commerce and landing pages built with Next.js, technical SEO and maximum performance.",
        url: "/en/desarrollo-web",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Custom web design & development · Keting Media",
        description: "Bespoke websites, web apps, e-commerce and landing pages built with Next.js and technical SEO.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Web design & development",
                        serviceType: "Web design and development",
                        description:
                            "Bespoke websites, web applications, e-commerce and landing pages with UX/UI, development (Next.js, React), technical SEO and performance.",
                        path: "/en/desarrollo-web",
                    }),
                    breadcrumb("Web design & development", "/en/desarrollo-web"),
                ]}
            />
            {children}
        </>
    );
}
