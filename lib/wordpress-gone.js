// Patrones de URL de WordPress que ya no existen y NUNCA van a existir.
//
// Devuelven 410 Gone, no un 301 a /blog. Una redirección masiva a una página
// genérica Google la interpreta como "soft 404": la trata como error, no
// consolida nada, y sigue rastreando las URLs viejas indefinidamente. El 410
// es la única señal que hace que las retire del índice y deje de gastar
// presupuesto de rastreo en ellas.
//
// Vive en .js (no .ts) para poder importarse tanto desde proxy.ts como
// desde el script de verificación sin arrastrar next/server.
//
// NOTA: /wp-admin/, /wp-includes/ y /wp-content/ NO están aquí a propósito.
// Una regla del firewall de Vercel (configurada en el dashboard, no en el
// repo) las corta en el edge con 403 antes de que llegue a ejecutarse el
// proxy, así que un 410 aquí sería código muerto.

/**
 * Archivos por fecha: /2025, /2025/05, /2025/05/16 y /2025/05/16/slug,
 * con o sin barra final, y con el prefijo opcional /en del WordPress inglés.
 *
 * El año se limita a 19xx/20xx para no capturar rutas futuras que empiecen
 * por cuatro dígitos por casualidad.
 */
const WP_DATE_ARCHIVE = /^(?:\/en)?\/(?:19|20)\d{2}(?:\/\d{1,2}){0,2}(?:\/.*)?$/;

/** Archivos de categoría: /category/... (y su espejo inglés). */
const WP_CATEGORY_ARCHIVE = /^(?:\/en)?\/category(?:\/.*)?$/;

/** Feeds RSS: cualquier ruta que termine en /feed o /feed/. */
const WP_FEED = /\/feed\/?$/;

const GONE_PATTERNS = [
    { name: 'date-archive', pattern: WP_DATE_ARCHIVE },
    { name: 'category-archive', pattern: WP_CATEGORY_ARCHIVE },
    { name: 'feed', pattern: WP_FEED },
];

/**
 * ¿Es una URL heredada de WordPress que debe devolver 410?
 * Recibe el pathname tal cual llega, con o sin barra final.
 */
function isGone(pathname) {
    return GONE_PATTERNS.some(({ pattern }) => pattern.test(pathname));
}

/** Qué patrón concreto ha coincidido (para depurar y para los tests). */
function matchedGonePattern(pathname) {
    const hit = GONE_PATTERNS.find(({ pattern }) => pattern.test(pathname));
    return hit ? hit.name : null;
}

module.exports = {
    WP_DATE_ARCHIVE,
    WP_CATEGORY_ARCHIVE,
    WP_FEED,
    GONE_PATTERNS,
    isGone,
    matchedGonePattern,
};
