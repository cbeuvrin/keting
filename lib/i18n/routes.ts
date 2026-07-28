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

// Ruta actual -> su equivalente en inglés (o /en si no hay gemela).
export function toEn(pathname: string): string {
    if (isCaseStudyEnPath(pathname) || isAboutEnPath(pathname)) return pathname; // ya está en inglés
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
    const es = normalizeEs(pathname);
    if (!hasMirror(es)) return "/en";
    return es === "/" ? "/en" : `/en${es}`;
}

// Ruta actual -> su equivalente en español (o / si no hay gemela).
export function toEs(pathname: string): string {
    if (isCaseStudyEsPath(pathname) || isAboutEsPath(pathname)) return pathname; // ya está en español
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
