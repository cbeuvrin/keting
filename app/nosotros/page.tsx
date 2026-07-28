import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";
import { CompanyAboutPage } from "@/components/about/company-about-page";
import { COMPANY_ABOUT } from "@/lib/about-content";
import { CASE_STUDIES } from "@/lib/case-studies";

export const metadata: Metadata = {
    title: "Nosotros · Diseño y desarrollo de software desde 2019",
    description:
        "Keting Media: empresa mexicana de desarrollo de software, web y apps a medida desde 2019. Ingeniería, diseño de producto e IA aplicada, dirigida por Carlos Beuvrin.",
    keywords: [
        "keting media",
        "quiénes somos",
        "empresa de desarrollo de software méxico",
        "carlos beuvrin",
        "agencia de desarrollo web cdmx",
    ],
    alternates: {
        canonical: "/nosotros",
        languages: {
            "es-MX": "/nosotros",
            en: "/en/about",
            "x-default": "/nosotros",
        },
    },
    openGraph: {
        title: "Nosotros · Keting Media",
        description:
            "Empresa mexicana de desarrollo de software, web y apps a medida desde 2019. Ingeniería, diseño de producto e IA aplicada.",
        url: "/nosotros",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Nosotros · Keting Media",
        description: "Desarrollo de software, web y apps a medida desde 2019.",
    },
};

// Tarjetas de caso ya resueltas a español — el componente cliente no recibe
// CASE_STUDIES completo (con es+en) para no filtrar prosa inglesa al HTML de esta página.
const workCards = CASE_STUDIES.map((study) => ({
    slug: study.slug,
    industry: study.es.industry,
    title: study.es.title,
    metricValue: study.metricValue,
    metricLabel: study.es.metricLabel,
}));

export default function NosotrosPage() {
    return (
        <>
            <JsonLd data={breadcrumb("Nosotros", "/nosotros")} />
            <CompanyAboutPage copy={COMPANY_ABOUT.es} lang="es" workCards={workCards} />
        </>
    );
}
