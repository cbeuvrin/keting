import type { Metadata } from "next";
import { gluten } from "@/components/halloween/fonts";
import { PosterStage } from "@/components/halloween/poster-stage";
import { HalloweenPoster } from "@/components/halloween/halloween-poster";
import { HalloweenHeader } from "@/components/halloween/halloween-header";
import { SpiderScroll } from "@/components/halloween/spider-scroll";
import { HalloweenSections } from "@/components/halloween/home/halloween-sections";
import { DESKTOP, MOBILE } from "@/components/halloween/layouts";

// Versión Halloween del home: el póster de monstruos como portada y debajo
// todas las secciones del home con su disfraz. Se llega desde el botón del
// hero. Es de temporada, así que no se indexa: fuera de octubre sería una
// página rara en los resultados, y no aporta nada que el home no diga ya.

export const metadata: Metadata = {
    title: "Versión Halloween",
    description:
        "El home de Keting Media en versión Halloween: un póster lleno de monstruos que reaccionan cuando les pasas el mouse encima.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/halloween" },
};

export default function HalloweenPage() {
    return (
        // PosterStage envuelve TODA la página: así los monstruos que se asoman
        // en las secciones también siguen el cursor y reaccionan al toque.
        <PosterStage>
            <main className={`${gluten.variable} overflow-x-hidden bg-[#141216] text-[#f3ecd9]`}>
                <HalloweenHeader />
                <HalloweenPoster desktop={DESKTOP} mobile={MOBILE} />
                <HalloweenSections />
            </main>
            <SpiderScroll />
        </PosterStage>
    );
}
