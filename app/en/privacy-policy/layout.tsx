import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Notice",
    description: "Privacy notice of Keting Media. How we collect, use, and protect your data.",
    alternates: {
        canonical: "/en/privacy-policy",
        languages: {
            es: "/aviso-de-privacidad",
            "en": "/en/privacy-policy",
            "x-default": "/aviso-de-privacidad",
        },
    },
    robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
