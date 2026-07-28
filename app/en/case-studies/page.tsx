import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";
import { CaseStudiesIndex } from "@/components/case-study/case-studies-index";

export const metadata: Metadata = {
    title: { absolute: "Case Studies · Real results from 9 brands · Keting Media" },
    description:
        "9 case studies from Keting Media: legal tech, corporate governance, dental health, vehicle armoring, e-commerce and more. The challenge, the solution and the result of every project.",
    keywords: [
        "digital agency case studies",
        "web development case studies mexico",
        "iudex",
        "gobernia",
        "toogo",
        "barmored security",
    ],
    alternates: {
        canonical: "/en/case-studies",
        languages: {
            "es-MX": "/casos",
            en: "/en/case-studies",
            "x-default": "/casos",
        },
    },
    openGraph: {
        title: "Case Studies · Keting Media",
        description: "9 brands, 9 different challenges. The challenge, the solution and the result of every project.",
        url: "/en/case-studies",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Case Studies · Keting Media",
        description: "9 brands, 9 different challenges. Real results.",
    },
};

export default function EnCaseStudiesPage() {
    return (
        <>
            <JsonLd data={breadcrumb("Case Studies", "/en/case-studies")} />
            <CaseStudiesIndex lang="en" />
        </>
    );
}
