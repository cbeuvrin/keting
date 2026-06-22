import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Diseño Web · Sitios editoriales y e-commerce que escalan",
    description:
        "Diseño web editorial, e-commerce y landing pages de alto impacto en México. Estrategia, UX/UI, desarrollo a medida y SEO técnico. AI Engineering · Producción 2026.",
    keywords: [
        "diseño web méxico",
        "desarrollo web a medida",
        "diseño ux ui",
        "ecommerce shopify",
        "landing pages",
        "seo técnico",
    ],
    alternates: { canonical: "/webdesing" },
    openGraph: {
        title: "Diseño Web · Keting Media",
        description:
            "Sitios editoriales, e-commerce y plataformas a medida — diseñadas para escalar marcas ambiciosas en México.",
        url: "/webdesing",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Diseño Web · Keting Media",
        description: "Sitios editoriales y plataformas a medida que escalan negocios.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Diseño y desarrollo web a medida",
                        serviceType: "Diseño y desarrollo web",
                        description:
                            "Sitios editoriales, e-commerce y landing pages a medida con UX/UI, desarrollo (Next.js, React), SEO técnico y rendimiento.",
                        path: "/webdesing",
                    }),
                    breadcrumb("Diseño Web", "/webdesing"),
                ]}
            />
            {children}
        </>
    );
}
