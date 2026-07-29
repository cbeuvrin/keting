import type { Metadata } from "next";
import { JsonLd, breadcrumbTrail, person } from "@/components/seo/json-ld";
import { AuthorAboutPage } from "@/components/about/author-about-page";
import { AUTHOR_ABOUT } from "@/lib/about-content";
import { AUTHOR } from "@/lib/author";
import { CASE_STUDIES } from "@/lib/case-studies";
import { caseStudyHref } from "@/lib/i18n/routes";
import { articles as BLOG_ARTICLES } from "@/lib/blog-data";

const COMPANY_GITHUB = "https://github.com/KetingMedia";

export const metadata: Metadata = {
    title: "Carlos Beuvrin · Ingeniero de IA y Fundador de Keting Media",
    description:
        "Carlos Beuvrin, Ingeniero de IA y fundador de Keting Media. Diseña y construye productos digitales de extremo a extremo: Iudex, Gobernia, Toogo e Ivan Ivanovich Academy.",
    keywords: [
        "carlos beuvrin",
        "ingeniero de ia méxico",
        "fundador keting media",
        "ai engineer méxico",
    ],
    alternates: {
        canonical: "/nosotros/carlos-beuvrin",
        languages: {
            "es-MX": "/nosotros/carlos-beuvrin",
            en: "/en/about/carlos-beuvrin",
            "x-default": "/nosotros/carlos-beuvrin",
        },
    },
    openGraph: {
        title: "Carlos Beuvrin · Ingeniero de IA y Fundador · Keting Media",
        description: AUTHOR.bio,
        url: "/nosotros/carlos-beuvrin",
        type: "profile",
        images: [{ url: "/carlos-beuvrin.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Carlos Beuvrin · Keting Media",
        description: "Ingeniero de IA y Fundador de Keting Media.",
        images: ["/carlos-beuvrin.png"],
    },
};

// Casos de éxito, resueltos SOLO al español antes de pasarlos al componente
// cliente (ver nota en author-about-page.tsx) — nada de pasar el objeto
// CASE_STUDIES completo (bilingüe) como prop.
const caseStudies = CASE_STUDIES.map((cs) => ({
    slug: cs.slug,
    title: cs.es.title,
    industry: cs.es.industry,
    metricValue: cs.metricValue,
    metricLabel: cs.es.metricLabel,
    href: caseStudyHref(cs.slug, false),
}));

// Artículos reales del blog ES (estáticos, en el repo — ver lib/blog-data.ts).
// Se usan estos en vez de una consulta a Supabase en build/SSR para no atar
// esta página estática a disponibilidad de red/env en build (mismo criterio
// que ya usa app/blog/[slug]/page.tsx: busca primero en los estáticos).
const articles = BLOG_ARTICLES.slice(0, 6).map((a) => ({
    slug: a.slug,
    title: a.title,
    href: `/blog/${a.slug}`,
    category: a.category,
}));

export default function CarlosBeuvrinPage() {
    return (
        <>
            <JsonLd
                data={[
                    person({
                        name: AUTHOR.name,
                        jobTitle: AUTHOR.jobTitle,
                        description: AUTHOR.bio,
                        image: "/carlos-beuvrin.png",
                        path: "/nosotros/carlos-beuvrin",
                        sameAs: [AUTHOR.linkedin, COMPANY_GITHUB],
                    }),
                    breadcrumbTrail([
                        { name: "Inicio", path: "/" },
                        { name: "Nosotros", path: "/nosotros" },
                        { name: "Carlos Beuvrin", path: "/nosotros/carlos-beuvrin" },
                    ]),
                ]}
            />
            <AuthorAboutPage copy={AUTHOR_ABOUT.es} lang="es" caseStudies={caseStudies} articles={articles} />
        </>
    );
}
