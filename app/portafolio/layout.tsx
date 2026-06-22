import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Portafolio · Trabajo selecto para marcas que cambian su industria",
    description:
        "Casos seleccionados de Keting Media: legal-tech, gobernanza, salud, fintech, automotriz, e-commerce y branding. Diseño web, plataformas y producto digital.",
    keywords: [
        "portafolio diseño web",
        "casos de éxito agencia digital",
        "proyectos web méxico",
        "iudex",
        "gobernia",
        "toogo",
        "barmored",
    ],
    alternates: { canonical: "/portafolio" },
    openGraph: {
        title: "Portafolio · Keting Media",
        description:
            "Casos seleccionados: 8 industrias, una firma editorial. Diseño web, plataformas con IA y branding digital.",
        url: "/portafolio",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Portafolio · Keting Media",
        description: "8 industrias, una firma editorial. Casos seleccionados.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd data={breadcrumb("Portafolio", "/portafolio")} />
            {children}
        </>
    );
}
