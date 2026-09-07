import type { Metadata } from "next";
import { GravityHeader } from "@/components/gravity/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd, breadcrumbTrail } from "@/components/seo/json-ld";
import { TOTAL_TRABAJOS, CATEGORIAS, TRABAJOS } from "@/lib/trabajos";
import { Trabajos } from "./Trabajos";

export const metadata: Metadata = {
    title: "Todo el trabajo · Sitios, tiendas, plataformas y software a la medida",
    description:
        `Los ${TOTAL_TRABAJOS} proyectos de Keting Media en producción, por categoría: sitios corporativos, e-commerce, plataformas SaaS y software a la medida. Cada uno con su enlace.`,
    keywords: [
        "portafolio desarrollo web méxico",
        "proyectos ecommerce méxico",
        "desarrollo saas méxico",
        "software a la medida méxico",
        "basham",
        "uhthoff",
        "serficor",
        "gobernia",
    ],
    alternates: { canonical: "/portafolio/trabajos" },
    // Página no listada: se comparte por enlace directo, no se indexa. Va por
    // meta y NO por robots.txt a propósito — un Disallow impediría al rastreador
    // leer justo esta etiqueta, que es la que saca la página del índice.
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
        title: "Todo el trabajo · Keting Media",
        description: `${TOTAL_TRABAJOS} proyectos en producción: sitios, tiendas, plataformas SaaS y software a la medida.`,
        url: "/portafolio/trabajos",
        type: "website",
    },
};

export default function TrabajosPage() {
    // Una lista por categoría, para que los buscadores y los modelos vean el
    // catálogo aunque no ejecuten el carrusel.
    const listas = CATEGORIAS.map((c) => ({
        "@type": "ItemList",
        name: c.eyebrow,
        numberOfItems: TRABAJOS[c.id].length,
        itemListElement: TRABAJOS[c.id].map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.nombre,
            description: t.linea,
            ...(t.url ? { url: t.url } : {}),
        })),
    }));

    return (
        <>
            <JsonLd
                data={breadcrumbTrail([
                    { name: "Inicio", path: "/" },
                    { name: "Portafolio", path: "/portafolio" },
                    { name: "Todo el trabajo", path: "/portafolio/trabajos" },
                ])}
            />
            <JsonLd data={{ "@context": "https://schema.org", "@graph": listas }} />
            <div className="min-h-screen bg-[#FAFAFA]">
                <GravityHeader />
                <Trabajos />
                <Footer />
            </div>
        </>
    );
}
