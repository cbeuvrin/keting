// Mapeo de rutas entre español (raíz) e inglés (prefijo /en).
// Fuente única de verdad para el toggle y los enlaces de los navs.

// Rutas ES con gemela EN. "" representa el home ("/").
export const EN_MIRRORED = [
    "",
    "/desarrollo-web",
    "/desarrollo-de-software",
    "/automatizacion-de-procesos",
    "/portafolio",
    "/aviso-de-privacidad",
    "/terminos-y-condiciones",
] as const;

function normalizeEs(pathname: string): string {
    // Quita el prefijo /en si viene una ruta inglesa.
    if (pathname === "/en") return "/";
    if (pathname.startsWith("/en/")) return pathname.slice(3); // "/en/x" -> "/x"
    return pathname;
}

function hasMirror(esPath: string): boolean {
    const key = esPath === "/" ? "" : esPath;
    return (EN_MIRRORED as readonly string[]).includes(key);
}

// Casos de éxito: NO siguen el patrón genérico "/en" + mismo path — la raíz
// cambia de nombre (ES "/casos" vs EN "/en/case-studies"), aunque los slugs
// son idénticos en ambos idiomas. Viven en un mapa explícito aparte para que
// el toggle ES/EN (toEn/toEs) y los CTAs de las tarjetas funcionen sin meter
// lógica de /en suelta en los componentes.
const CASE_STUDIES_ES_ROOT = "/casos";
const CASE_STUDIES_EN_ROOT = "/en/case-studies";

function isCaseStudyEsPath(pathname: string): boolean {
    return pathname === CASE_STUDIES_ES_ROOT || pathname.startsWith(`${CASE_STUDIES_ES_ROOT}/`);
}

function isCaseStudyEnPath(pathname: string): boolean {
    return pathname === CASE_STUDIES_EN_ROOT || pathname.startsWith(`${CASE_STUDIES_EN_ROOT}/`);
}

// Dado un slug de caso, la ruta correcta según idioma — para las tarjetas de
// /portafolio y cualquier CTA que enlace a un caso concreto.
export function caseStudyHref(slug: string, isEn: boolean): string {
    return isEn ? `${CASE_STUDIES_EN_ROOT}/${slug}` : `${CASE_STUDIES_ES_ROOT}/${slug}`;
}

// Nosotros/About: mismo caso que casos de éxito — la raíz cambia de nombre
// (ES "/nosotros" vs EN "/en/about"), pero el sub-slug del autor es idéntico
// ("/carlos-beuvrin") en ambos idiomas.
const ABOUT_ES_ROOT = "/nosotros";
const ABOUT_EN_ROOT = "/en/about";

function isAboutEsPath(pathname: string): boolean {
    return pathname === ABOUT_ES_ROOT || pathname.startsWith(`${ABOUT_ES_ROOT}/`);
}

function isAboutEnPath(pathname: string): boolean {
    return pathname === ABOUT_EN_ROOT || pathname.startsWith(`${ABOUT_EN_ROOT}/`);
}

// Ruta de la página "Nosotros"/"About" según idioma.
export function aboutHref(isEn: boolean): string {
    return isEn ? ABOUT_EN_ROOT : ABOUT_ES_ROOT;
}

// Ruta de la página de autor (Carlos Beuvrin) según idioma.
export function authorHref(isEn: boolean): string {
    return isEn ? `${ABOUT_EN_ROOT}/carlos-beuvrin` : `${ABOUT_ES_ROOT}/carlos-beuvrin`;
}

// Blog: el índice sigue el patrón genérico ("/blog" <-> "/en/blog"), pero los
// ARTÍCULOS no — el blog EN vive en el repo (lib/blog-en/) como subconjunto
// curado y traducido con slugs propios en inglés, distintos del slug ES en
// Supabase. No hay forma de derivar uno del otro, así que se resuelve con un
// mapa explícito esSlug <-> enSlug (uno por cada artículo ya traducido). Un
// artículo ES que todavía no tiene traducción no aparece en el mapa: el
// toggle cae al índice del blog en el idioma destino en vez de a un 404.
const BLOG_ES_ROOT = "/blog";
const BLOG_EN_ROOT = "/en/blog";

// Único mapa fuente de verdad: agrega aquí cada artículo según se traduzca.
const BLOG_SLUG_PAIRS: readonly { es: string; en: string }[] = [
    { es: "desarrollo-de-software-a-la-medida-cdmx-costos-2026", en: "custom-software-development-mexico-city-costs" },
    { es: "cuanto-cuesta-una-web-o-app-a-medida-en-mexico-2026", en: "how-much-does-a-custom-web-or-app-cost-in-mexico" },
    { es: "next-js-vs-wordpress-para-empresas", en: "nextjs-vs-wordpress-for-business" },
    { es: "tienda-en-linea-a-medida-vs-shopify", en: "custom-online-store-vs-shopify" },
];

function isBlogEsPath(pathname: string): boolean {
    return pathname === BLOG_ES_ROOT || pathname.startsWith(`${BLOG_ES_ROOT}/`);
}

function isBlogEnPath(pathname: string): boolean {
    return pathname === BLOG_EN_ROOT || pathname.startsWith(`${BLOG_EN_ROOT}/`);
}

// Dado el slug ES de un artículo, la ruta EN de su traducción si existe (o el
// índice /en/blog si aún no se ha traducido). Útil para CTAs/enlaces
// relacionados que parten de un artículo español conocido.
export function blogHref(esSlug: string, isEn: boolean): string {
    if (!isEn) return `${BLOG_ES_ROOT}/${esSlug}`;
    const pair = BLOG_SLUG_PAIRS.find((p) => p.es === esSlug);
    return pair ? `${BLOG_EN_ROOT}/${pair.en}` : BLOG_EN_ROOT;
}

// Lookups explícitos para hreflang recíproco entre artículo ES <-> EN.
// Devuelven `undefined` (no un fallback al índice) cuando el artículo aún no
// tiene traducción — así generateMetadata puede omitir el alternate en vez de
// apuntar a una página distinta al artículo real.
export function getEnBlogSlug(esSlug: string): string | undefined {
    return BLOG_SLUG_PAIRS.find((p) => p.es === esSlug)?.en;
}

export function getEsBlogSlug(enSlug: string): string | undefined {
    return BLOG_SLUG_PAIRS.find((p) => p.en === enSlug)?.es;
}

// Ruta actual -> su equivalente en inglés (o /en si no hay gemela).
export function toEn(pathname: string): string {
    if (isCaseStudyEnPath(pathname) || isAboutEnPath(pathname) || isBlogEnPath(pathname)) return pathname; // ya está en inglés
    if (isCaseStudyEsPath(pathname)) {
        return pathname === CASE_STUDIES_ES_ROOT
            ? CASE_STUDIES_EN_ROOT
            : `${CASE_STUDIES_EN_ROOT}${pathname.slice(CASE_STUDIES_ES_ROOT.length)}`;
    }
    if (isAboutEsPath(pathname)) {
        return pathname === ABOUT_ES_ROOT
            ? ABOUT_EN_ROOT
            : `${ABOUT_EN_ROOT}${pathname.slice(ABOUT_ES_ROOT.length)}`;
    }
    if (isBlogEsPath(pathname)) {
        if (pathname === BLOG_ES_ROOT) return BLOG_EN_ROOT;
        const esSlug = pathname.slice(`${BLOG_ES_ROOT}/`.length);
        return blogHref(esSlug, true);
    }
    const es = normalizeEs(pathname);
    if (!hasMirror(es)) return "/en";
    return es === "/" ? "/en" : `/en${es}`;
}

// Ruta actual -> su equivalente en español (o / si no hay gemela).
export function toEs(pathname: string): string {
    if (isCaseStudyEsPath(pathname) || isAboutEsPath(pathname) || isBlogEsPath(pathname)) return pathname; // ya está en español
    if (isCaseStudyEnPath(pathname)) {
        return pathname === CASE_STUDIES_EN_ROOT
            ? CASE_STUDIES_ES_ROOT
            : `${CASE_STUDIES_ES_ROOT}${pathname.slice(CASE_STUDIES_EN_ROOT.length)}`;
    }
    if (isAboutEnPath(pathname)) {
        return pathname === ABOUT_EN_ROOT
            ? ABOUT_ES_ROOT
            : `${ABOUT_ES_ROOT}${pathname.slice(ABOUT_EN_ROOT.length)}`;
    }
    if (isBlogEnPath(pathname)) {
        if (pathname === BLOG_EN_ROOT) return BLOG_ES_ROOT;
        const enSlug = pathname.slice(`${BLOG_EN_ROOT}/`.length);
        const pair = BLOG_SLUG_PAIRS.find((p) => p.en === enSlug);
        return pair ? `${BLOG_ES_ROOT}/${pair.es}` : BLOG_ES_ROOT;
    }
    const es = normalizeEs(pathname);
    if (!hasMirror(es)) return "/";
    return es;
}

// Para los navs: dado un href español fijo, devuelve el correcto según idioma.
export function enHref(esPath: string, isEn: boolean): string {
    if (!isEn) return esPath;
    if (esPath === "/" || esPath === "/#home") return "/en";
    return `/en${esPath}`;
}
