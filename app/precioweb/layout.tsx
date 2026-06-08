import type { Metadata } from "next";

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
    return children;
}
