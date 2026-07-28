import type { EnArticle } from "./types";

// Blog EN — subconjunto curado de 8 artículos (plan GEO 4.5), vive en el repo
// (no en Supabase), un archivo por artículo. Los primeros 4 ya están escritos
// y publicados aquí abajo; los otros 4 existen como archivos con TODO (ver
// lib/blog-en/*.ts) pero NO se importan todavía — así `EN_ARTICLES` solo
// expone los que de verdad tienen contenido.
import customSoftwareDevelopmentMexicoCityCosts from "./custom-software-development-mexico-city-costs";
import howMuchDoesACustomWebOrAppCostInMexico from "./how-much-does-a-custom-web-or-app-cost-in-mexico";
import nextjsVsWordpressForBusiness from "./nextjs-vs-wordpress-for-business";
import customOnlineStoreVsShopify from "./custom-online-store-vs-shopify";

// --- Pendientes (existen como archivo con TODO, NO importados aún) ---
// import canIBuildMyAppOrWebsiteWithAiAloneVibeCoding from "./can-i-build-my-app-or-website-with-ai-alone-vibe-coding";
// import lovableWhatItIsWhatItCostsAndWhereItFallsShort from "./lovable-what-it-is-what-it-costs-and-where-it-falls-short";
// import whatIsToogoAndWhatIsItFor from "./what-is-toogo-and-what-is-it-for";
// import flutterVsReactNativeForCrossPlatformApps from "./flutter-vs-react-native-for-cross-platform-apps";

export const EN_ARTICLES: EnArticle[] = [
    customSoftwareDevelopmentMexicoCityCosts,
    howMuchDoesACustomWebOrAppCostInMexico,
    nextjsVsWordpressForBusiness,
    customOnlineStoreVsShopify,
];

export const EN_ARTICLE_SLUGS: string[] = EN_ARTICLES.map((a) => a.slug);

export function getEnArticle(slug: string): EnArticle | undefined {
    return EN_ARTICLES.find((a) => a.slug === slug);
}
