import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms and Conditions",
    description: "Terms and conditions for the use of Keting Media's services.",
    alternates: {
        canonical: "/en/terminos-y-condiciones",
        languages: {
            "es-MX": "/terminos-y-condiciones",
            "en": "/en/terminos-y-condiciones",
            "x-default": "/terminos-y-condiciones",
        },
    },
    robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
