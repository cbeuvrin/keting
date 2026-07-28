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

// Ruta actual -> su equivalente en inglés (o /en si no hay gemela).
export function toEn(pathname: string): string {
    if (isCaseStudyEnPath(pathname)) return pathname; // ya está en inglés
    if (isCaseStudyEsPath(pathname)) {
        return pathname === CASE_STUDIES_ES_ROOT
            ? CASE_STUDIES_EN_ROOT
            : `${CASE_STUDIES_EN_ROOT}${pathname.slice(CASE_STUDIES_ES_ROOT.length)}`;
    }
    const es = normalizeEs(pathname);
    if (!hasMirror(es)) return "/en";
    return es === "/" ? "/en" : `/en${es}`;
}

// Ruta actual -> su equivalente en español (o / si no hay gemela).
export function toEs(pathname: string): string {
    if (isCaseStudyEsPath(pathname)) return pathname; // ya está en español
    if (isCaseStudyEnPath(pathname)) {
        return pathname === CASE_STUDIES_EN_ROOT
            ? CASE_STUDIES_ES_ROOT
            : `${CASE_STUDIES_ES_ROOT}${pathname.slice(CASE_STUDIES_EN_ROOT.length)}`;
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
