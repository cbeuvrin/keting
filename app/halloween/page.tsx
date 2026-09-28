import type { Metadata } from "next";
import { HalloweenPage } from "@/components/halloween/halloween-page";

// Versión Halloween del home: el póster de monstruos como portada y debajo
// todas las secciones del home con su disfraz. Se llega desde el botón del
// hero. Es de temporada, así que no se indexa: fuera de octubre sería una
// página rara en los resultados, y no aporta nada que el home no diga ya.
// Su gemela en inglés es /en/halloween.

export const metadata: Metadata = {
    title: "Versión Halloween",
    description:
        "El home de Keting Media en versión Halloween: un póster lleno de monstruos que reaccionan cuando les pasas el mouse encima.",
    robots: { index: false, follow: true },
    alternates: {
        canonical: "/halloween",
        languages: { "es-MX": "/halloween", en: "/en/halloween", "x-default": "/halloween" },
    },
};

export default function Page() {
    return <HalloweenPage lang="es" />;
}
