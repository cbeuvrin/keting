import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";
import { CaseStudiesIndex } from "@/components/case-study/case-studies-index";

export const metadata: Metadata = {
    title: "Casos de éxito · Resultados reales de 9 marcas",
    description:
        "9 casos de éxito de Keting Media: legal-tech, gobernanza, salud dental, blindaje automotriz, e-commerce y más. El reto, la solución y el resultado de cada proyecto.",
    keywords: [
        "casos de éxito agencia digital",
        "casos de éxito desarrollo web méxico",
        "iudex",
        "gobernia",
        "toogo",
        "barmored security",
    ],
    alternates: {
        canonical: "/casos",
        languages: {
            "es-MX": "/casos",
            en: "/en/case-studies",
            "x-default": "/casos",
        },
    },
    openGraph: {
        title: "Casos de éxito · Keting Media",
        description: "9 marcas, 9 retos distintos. El reto, la solución y el resultado de cada proyecto.",
        url: "/casos",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Casos de éxito · Keting Media",
        description: "9 marcas, 9 retos distintos. Resultados reales.",
    },
};

export default function CasosPage() {
    return (
        <>
            <JsonLd data={breadcrumb("Casos de éxito", "/casos")} />
            <CaseStudiesIndex lang="es" />
        </>
    );
}
