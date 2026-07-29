import type { Metadata } from "next";
import { JsonLd, breadcrumbTrail, person } from "@/components/seo/json-ld";
import { AuthorAboutPage } from "@/components/about/author-about-page";
import { AUTHOR_ABOUT } from "@/lib/about-content";
import { AUTHOR } from "@/lib/author";
import { CASE_STUDIES } from "@/lib/case-studies";
import { caseStudyHref } from "@/lib/i18n/routes";
import { EN_ARTICLES } from "@/lib/blog-en";

const COMPANY_GITHUB = "https://github.com/KetingMedia";

export const metadata: Metadata = {
    title: { absolute: "Carlos Beuvrin · AI Engineer & Founder of Keting Media" },
    description:
        "Carlos Beuvrin, AI Engineer and founder of Keting Media. Designs and builds end-to-end digital products: Iudex, Gobernia, Toogo, and Ivan Ivanovich Academy.",
    keywords: [
        "carlos beuvrin",
        "ai engineer mexico",
        "keting media founder",
        "software founder mexico",
    ],
    alternates: {
        canonical: "/en/about/carlos-beuvrin",
        languages: {
            "es-MX": "/nosotros/carlos-beuvrin",
            en: "/en/about/carlos-beuvrin",
            "x-default": "/nosotros/carlos-beuvrin",
        },
    },
    openGraph: {
        title: "Carlos Beuvrin · AI Engineer & Founder · Keting Media",
        description: AUTHOR_ABOUT.en.bioSections[0].body,
        url: "/en/about/carlos-beuvrin",
        type: "profile",
        images: [{ url: "/carlos-beuvrin.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Carlos Beuvrin · Keting Media",
        description: "AI Engineer and Founder of Keting Media.",
        images: ["/carlos-beuvrin.png"],
    },
};

// Casos de éxito, resueltos SOLO al inglés antes de pasarlos al componente
// cliente (ver nota en author-about-page.tsx) — nada de pasar el objeto
// CASE_STUDIES completo (bilingüe) como prop.
const caseStudies = CASE_STUDIES.map((cs) => ({
    slug: cs.slug,
    title: cs.en.title,
    industry: cs.en.industry,
    metricValue: cs.metricValue,
    metricLabel: cs.en.metricLabel,
    href: caseStudyHref(cs.slug, true),
}));

// Artículos reales del blog EN (subconjunto curado en el repo — lib/blog-en/).
const articles = EN_ARTICLES.slice(0, 6).map((a) => ({
    slug: a.slug,
    title: a.title,
    href: `/en/blog/${a.slug}`,
    category: a.category,
}));

export default function CarlosBeuvrinPageEn() {
    return (
        <>
            <JsonLd
                data={[
                    person({
                        name: AUTHOR.name,
                        jobTitle: AUTHOR_ABOUT.en.roleLabel,
                        description: AUTHOR_ABOUT.en.bioSections[0].body,
                        image: "/carlos-beuvrin.png",
                        path: "/en/about/carlos-beuvrin",
                        sameAs: [AUTHOR.linkedin, COMPANY_GITHUB],
                    }),
                    breadcrumbTrail([
                        { name: "Home", path: "/en" },
                        { name: "About", path: "/en/about" },
                        { name: "Carlos Beuvrin", path: "/en/about/carlos-beuvrin" },
                    ]),
                ]}
            />
            <AuthorAboutPage copy={AUTHOR_ABOUT.en} lang="en" caseStudies={caseStudies} articles={articles} />
        </>
    );
}
