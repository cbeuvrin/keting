import type { Lang } from "@/lib/i18n/dictionaries";
import { gluten } from "./fonts";
import { HalloweenHeader } from "./halloween-header";
import { HalloweenPoster } from "./halloween-poster";
import { HalloweenSections } from "./home/halloween-sections";
import { DESKTOP, MOBILE } from "./layouts";
import { PosterStage } from "./poster-stage";
import { SpiderScroll } from "./spider-scroll";

/**
 * La versión Halloween del home, la misma en /halloween y /en/halloween: el
 * póster de monstruos como portada y debajo todas las secciones del home con
 * su disfraz. Las secciones y la barra toman el idioma de la URL (useLang);
 * el póster se pinta en el servidor y lo recibe aquí.
 */
export function HalloweenPage({ lang }: { lang: Lang }) {
    return (
        // PosterStage envuelve TODA la página: así los monstruos que se asoman
        // en las secciones también siguen el cursor y reaccionan al toque.
        <PosterStage>
            <main className={`${gluten.variable} overflow-x-hidden bg-[#141216] text-[#f3ecd9]`}>
                <HalloweenHeader />
                <HalloweenPoster desktop={DESKTOP} mobile={MOBILE} lang={lang} />
                <HalloweenSections />
            </main>
            <SpiderScroll />
        </PosterStage>
    );
}
