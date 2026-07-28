import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDY_SLUGS, CASE_STUDIES_PUBLISHED_DATE, getCaseStudy } from "@/lib/case-studies";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { JsonLd, breadcrumbTrail } from "@/components/seo/json-ld";
import { AUTHOR } from "@/lib/author";

const SITE_URL = "https://ketingmedia.com";

export async function generateStaticParams() {
    return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) return {};
    const c = study.es;

    return {
        title: `${c.title} · Caso de éxito`,
        description: c.summary.slice(0, 160),
        alternates: {
            canonical: `/casos/${slug}`,
            languages: {
                "es-MX": `/casos/${slug}`,
                en: `/en/case-studies/${slug}`,
                "x-default": `/casos/${slug}`,
            },
        },
        openGraph: {
            title: `${c.title} · Caso de éxito · Keting Media`,
            description: c.summary,
            url: `/casos/${slug}`,
            type: "article",
            images: [{ url: study.image }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${c.title} · Keting Media`,
            description: c.summary,
            images: [study.image],
        },
    };
}

export default async function CasoPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) notFound();
    const c = study.es;

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: c.title,
        description: c.summary,
        image: [`${SITE_URL}${study.image}`],
        datePublished: CASE_STUDIES_PUBLISHED_DATE,
        dateModified: CASE_STUDIES_PUBLISHED_DATE,
        inLanguage: "es-MX",
        author: {
            "@type": "Person",
            name: AUTHOR.name,
            jobTitle: AUTHOR.jobTitle,
            url: AUTHOR.linkedin,
        },
        publisher: {
            "@type": "Organization",
            name: "Keting Media",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/keting-logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/casos/${slug}` },
    };

    return (
        <>
            <JsonLd
                data={[
                    articleJsonLd,
                    breadcrumbTrail([
                        { name: "Inicio", path: "/" },
                        { name: "Casos de éxito", path: "/casos" },
                        { name: c.title, path: `/casos/${slug}` },
                    ]),
                ]}
            />
            <CaseStudyPage study={study} lang="es" />
        </>
    );
}
