import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones",
    description: "Términos y condiciones de uso de los servicios de Keting Media.",
    alternates: { canonical: "/terminos-y-condiciones" },
    robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
