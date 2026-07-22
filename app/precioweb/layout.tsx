import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Precio Web · Cuánto cuesta una web profesional en México",
    description:
        "Tarifas claras para diseño web profesional, e-commerce y landing pages en México. Sin sorpresas, sin paquetes inflados. Precio inicial, alcance y tiempos transparentes.",
    keywords: [
        "precio diseño web méxico",
        "cuánto cuesta una página web",
        "costo desarrollo web",
        "tarifa agencia diseño web",
        "presupuesto ecommerce",
    ],
    alternates: { canonical: "/precioweb" },
    // Página retirada de buscadores a petición del usuario (jul 2026): la remoción
    // en Search Console es temporal; el noindex la hace permanente. La página sigue
    // accesible por URL directa. Para re-indexar: quitar este bloque + reagregar a
    // sitemap/llms.txt/menú.
    robots: { index: false, follow: false },
    openGraph: {
        title: "Precio Web · Keting Media",
        description: "Tarifas transparentes para diseño web, e-commerce y landing pages.",
        url: "/precioweb",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Precio Web · Keting Media",
        description: "Tarifas claras, sin paquetes inflados.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd data={breadcrumb("Precio Web", "/precioweb")} />
            {children}
        </>
    );
}
