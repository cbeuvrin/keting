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

// Ruta actual -> su equivalente en inglés (o /en si no hay gemela).
export function toEn(pathname: string): string {
    const es = normalizeEs(pathname);
    if (!hasMirror(es)) return "/en";
    return es === "/" ? "/en" : `/en${es}`;
}

// Ruta actual -> su equivalente en español (o / si no hay gemela).
export function toEs(pathname: string): string {
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
