import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog · Ideas que inspiran sobre diseño web, IA y crecimiento digital",
    description:
        "Artículos, casos y guías sobre diseño web, SEO técnico, IA aplicada y estrategia digital. Recursos para fundadores, marketers y operadores en México y LATAM.",
    keywords: [
        "blog diseño web",
        "blog marketing digital",
        "ia aplicada negocios",
        "artículos seo",
        "blog ketingmedia",
    ],
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Blog · Keting Media",
        description: "Ideas que inspiran: diseño web, IA y crecimiento digital.",
        url: "/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog · Keting Media",
        description: "Ideas que inspiran: diseño web, IA y crecimiento digital.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
