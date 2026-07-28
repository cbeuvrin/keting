import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";
import { CompanyAboutPage } from "@/components/about/company-about-page";
import { COMPANY_ABOUT } from "@/lib/about-content";
import { CASE_STUDIES } from "@/lib/case-studies";

export const metadata: Metadata = {
    title: { absolute: "About us · Custom software development since 2019 · Keting Media" },
    description:
        "Keting Media: Mexican custom software, web and app development company since 2019. Engineering, product design and applied AI, led by Carlos Beuvrin.",
    keywords: [
        "keting media",
        "about us",
        "software development company mexico",
        "carlos beuvrin",
        "web development agency mexico city",
    ],
    alternates: {
        canonical: "/en/about",
        languages: {
            "es-MX": "/nosotros",
            en: "/en/about",
            "x-default": "/nosotros",
        },
    },
    openGraph: {
        title: "About us · Keting Media",
        description:
            "Mexican custom software, web and app development company since 2019. Engineering, product design and applied AI.",
        url: "/en/about",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About us · Keting Media",
        description: "Custom software, web and app development since 2019.",
    },
};

// Case-study cards already resolved to English — the client component never
// receives the full bilingual CASE_STUDIES array, so no Spanish prose leaks
// into this page's HTML.
const workCards = CASE_STUDIES.map((study) => ({
    slug: study.slug,
    industry: study.en.industry,
    title: study.en.title,
    metricValue: study.metricValue,
    metricLabel: study.en.metricLabel,
}));

export default function AboutPageEn() {
    return (
        <>
            <JsonLd data={breadcrumb("About", "/en/about")} />
            <CompanyAboutPage copy={COMPANY_ABOUT.en} lang="en" workCards={workCards} />
        </>
    );
}
