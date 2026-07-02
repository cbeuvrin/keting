import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Blog · Guías sobre desarrollo de software, web, apps e IA",
    description:
        "Guías y análisis sobre desarrollo de software, aplicaciones web y móviles, e-commerce e IA aplicada — con precios y datos reales de México. Para fundadores y equipos que construyen productos digitales.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Blog · Keting Media",
        description: "Guías sobre desarrollo de software, web, apps e IA — con datos reales de México.",
        url: "/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog · Keting Media",
        description: "Guías sobre desarrollo de software, web, apps e IA — con datos reales de México.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd data={breadcrumb("Blog", "/blog")} />
            {children}
        </>
    );
}
