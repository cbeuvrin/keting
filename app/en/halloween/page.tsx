import type { Metadata } from "next";
import { HalloweenPage } from "@/components/halloween/halloween-page";

// Gemela en inglés de /halloween. Igual que la española: de temporada, fuera
// del índice y fuera del sitemap.

export const metadata: Metadata = {
    title: { absolute: "Halloween edition · Keting Media" },
    description: "The Keting Media homepage in its Halloween edition: a poster full of monsters that react when you hover over them.",
    robots: { index: false, follow: true },
    alternates: {
        canonical: "/en/halloween",
        languages: { "es-MX": "/halloween", en: "/en/halloween", "x-default": "/halloween" },
    },
    openGraph: {
        title: "Halloween edition · Keting Media",
        description: "A poster full of monsters that react when you hover over them.",
        url: "/en/halloween",
        siteName: "Keting Media",
        locale: "en_US",
        type: "website",
    },
};

export default function Page() {
    return <HalloweenPage lang="en" />;
}
