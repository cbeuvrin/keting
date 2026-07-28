import type { Metadata } from "next";
import { JsonLd, breadcrumbTrail, person } from "@/components/seo/json-ld";
import { AuthorAboutPage } from "@/components/about/author-about-page";
import { AUTHOR_ABOUT } from "@/lib/about-content";
import { AUTHOR } from "@/lib/author";

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
            <AuthorAboutPage copy={AUTHOR_ABOUT.es} lang="es" />
        </>
    );
}
