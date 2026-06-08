import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aviso de Privacidad",
    description: "Aviso de privacidad de Keting Media. Cómo recolectamos, usamos y protegemos tus datos.",
    alternates: { canonical: "/aviso-de-privacidad" },
    robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
