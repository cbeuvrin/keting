import type { EnArticle } from "./types";

// Blog EN — subconjunto curado (plan GEO 4.5). Vive en el repo, no en Supabase:
// es un conjunto pequeño y estable, versionado en git, sin migración de esquema.
// Un archivo por artículo. Cada uno declara `esSlug` para el hreflang recíproco;
// el mapa de pares está en lib/i18n/routes.ts → BLOG_SLUG_PAIRS, así que al
// añadir un artículo aquí hay que añadir también su par allí.
import customSoftwareDevelopmentMexicoCityCosts from "./custom-software-development-mexico-city-costs";
import howMuchDoesACustomWebOrAppCostInMexico from "./how-much-does-a-custom-web-or-app-cost-in-mexico";
import nextjsVsWordpressForBusiness from "./nextjs-vs-wordpress-for-business";
import customOnlineStoreVsShopify from "./custom-online-store-vs-shopify";
import whyNobodyCanGuaranteeAiSearchRankings from "./why-nobody-can-guarantee-ai-search-rankings";
import canIBuildMyAppOrWebsiteWithAiAloneVibeCoding from "./can-i-build-my-app-or-website-with-ai-alone-vibe-coding";
import lovableWhatItIsWhatItCostsAndWhereItFallsShort from "./lovable-what-it-is-what-it-costs-and-where-it-falls-short";
import whatIsToogoAndWhatIsItFor from "./what-is-toogo-and-what-is-it-for";

// --- Pendiente de traducir (existe como archivo con TODO, NO importado aún) ---
// import flutterVsReactNativeForCrossPlatformApps from "./flutter-vs-react-native-for-cross-platform-apps";

// El orden es el de aparición en /en/blog y en el carrusel del home inglés:
// primero los de mayor intención comercial para el mercado nearshore.
export const EN_ARTICLES: EnArticle[] = [
    customSoftwareDevelopmentMexicoCityCosts,
    howMuchDoesACustomWebOrAppCostInMexico,
    whyNobodyCanGuaranteeAiSearchRankings,
    canIBuildMyAppOrWebsiteWithAiAloneVibeCoding,
    nextjsVsWordpressForBusiness,
    lovableWhatItIsWhatItCostsAndWhereItFallsShort,
    customOnlineStoreVsShopify,
    whatIsToogoAndWhatIsItFor,
];

export const EN_ARTICLE_SLUGS: string[] = EN_ARTICLES.map((a) => a.slug);

export function getEnArticle(slug: string): EnArticle | undefined {
    return EN_ARTICLES.find((a) => a.slug === slug);
}
