import type { Metadata } from "next";

// Página interna/experimental (duplica el home). No debe indexarse ni aparecer
// en Google para no generar contenido duplicado ni sitelinks confusos.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
    alternates: { canonical: "/" },
};

export default function SDLayout({ children }: { children: React.ReactNode }) {
    return children;
}
