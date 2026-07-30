// Redirecciones heredadas del WordPress anterior, en un único sitio.
//
// Vive aquí (y en .js, no .ts) porque lo consumen DOS módulos que no comparten
// sistema de módulos:
//   - next.config.js  -> require(); genera el bloque redirects() (308 normales)
//   - proxy.ts   -> import(); colapsa el doble salto cuando la URL trae
//                        barra final, que es como WordPress las publicaba
//
// Si duplicas una entrada en solo uno de los dos, la URL vieja vuelve a hacer
// dos saltos sin que nada falle de forma visible. Por eso: una sola tabla.

/** Hub de precios: la guía sustituyó a la vieja página /precioweb. */
const PRICING_HUB = '/blog/cuanto-cuesta-una-web-o-app-a-medida-en-mexico-2026';

/** Artículo canónico donde se consolidaron los duplicados que generó el cron. */
const AI_AGENTS_CANONICAL =
    '/blog/mas-alla-del-chatbot-la-revolucion-de-los-agentes-de-ia-autonomos-en-el-servicio-al-cliente';

/**
 * Coincidencia exacta: ruta vieja -> ruta nueva.
 * NO incluye patrones de archivo de WordPress (fechas, /category/, /feed/):
 * esos devuelven 410 en proxy.ts, no redirigen.
 */
const LEGACY_EXACT_REDIRECTS = {
    // Artículos de IA duplicados (cron con dedup roto, borrados 2026-07-02)
    '/blog/redefiniendo-el-contacto-la-estrategia-definitiva-de-agentes-de-ia-autonoma-para-una-experiencia-cliente-superior':
        AI_AGENTS_CANONICAL,
    '/blog/la-nueva-frontera-del-servicio-agentes-de-ia-autonomos-para-la-excelencia-operativa-y-la-conexion-hiper-personalizada':
        AI_AGENTS_CANONICAL,
    '/blog/la-arquitectura-invisible-desplegando-agentes-de-ia-autonomos-para-una-experiencia-de-cliente-transformadora':
        AI_AGENTS_CANONICAL,
    '/blog/la-arquitectura-invisible-desplegando-agentes-autonomos-de-ia-para-redefinir-la-experiencia-del-cliente-premium':
        AI_AGENTS_CANONICAL,
    '/blog/la-vanguardia-del-servicio-como-los-agentes-autonomos-de-ia-redefinen-la-experiencia-del-cliente-en-la-era-digital':
        AI_AGENTS_CANONICAL,
    '/blog/desbloqueando-la-excelencia-agentes-de-ia-autonomos-como-motor-de-transformacion-en-el-servicio-al-cliente':
        AI_AGENTS_CANONICAL,

    // Slugs renombrados (keyword + corrección de typo)
    '/webdesing': '/desarrollo-web',
    '/soluciones-digitales': '/desarrollo-de-software',

    // Páginas de servicios antiguas (apuntan directo al slug nuevo, sin encadenar)
    '/web': '/desarrollo-web',
    '/diseno-web-2': '/desarrollo-web',
    '/web-informativa-landing-page': '/desarrollo-web',
    '/portafolio-web': '/portafolio',
    '/plataforma-de-cursos': '/desarrollo-de-software',
    '/google-ads': '/desarrollo-de-software',
    '/meta-ads': '/desarrollo-de-software',
    '/soluciones-de-marketing': '/desarrollo-de-software',
    '/marketing': '/desarrollo-de-software',
    '/marketing-digital': '/desarrollo-de-software',

    // Rutas de precios/contacto que se enlazaban desde fuera (auditoría GEO 2026-07)
    '/cotizar': PRICING_HUB,
    '/asesorias': PRICING_HUB,
    '/precioweb': PRICING_HUB,
    '/precio': PRICING_HUB,
    '/precios': PRICING_HUB,
    '/contacto': '/',

    // /landing3d se retira: experimento de landing 3D que estaba indexado y en
    // el sitemap, pero sin enlaces internos y sin servicio real detrás.
    '/landing3d': '/desarrollo-web',

    // Basura varia del WordPress anterior
    '/inicio-3': '/',
    '/community-manager-2-minimal': '/',
    '/blog-2': '/blog',
    '/blogger': '/blog',

    // WordPress inglés antiguo: reglas ESPECÍFICAS, nunca catch-all, para no
    // atrapar las rutas espejo reales (/en/desarrollo-web, /en/blog/...).
    '/en/web': '/en/desarrollo-web',
    '/en/portafolio-web': '/en/portafolio',
    '/en/google-ads': '/en/desarrollo-de-software',
    '/en/meta-ads': '/en/desarrollo-de-software',
    '/en/blogger': '/blog',
    '/en/nosotros': '/en',
    '/en/web-informativa-landing-page': '/en/desarrollo-web',
    '/en/plataforma-de-cursos': '/en/desarrollo-de-software',
    '/en/precio': PRICING_HUB,
    '/en/precios': PRICING_HUB,
    '/en/contacto': '/en',

    // El checklist se reescribió para 2026 (FID -> INP, referencias de año) y con
    // ello cambió de slug. El viejo llevaba tiempo indexado: sin esta entrada
    // pasaría a 404 y se perdería lo poco que había acumulado.
    '/blog/checklist-lanzar-sitio-web-2025': '/blog/checklist-lanzar-sitio-web-2026',
};

/**
 * Coincidencia por prefijo de segmento: `/prefix` y `/prefix/loquesea`.
 * `preservePath: true` arrastra el resto de la ruta al destino.
 *
 * OJO con el orden respecto a LEGACY_EXACT_REDIRECTS: `/soluciones-digitales`
 * a secas está en la tabla exacta para resolverse en UN solo 308. Si solo
 * existiera la regla de prefijo, el destino saldría con barra final y
 * encadenaría un segundo salto al normalizarla.
 */
const LEGACY_PREFIX_REDIRECTS = [
    // preservePath: false a propósito. Antes era true, y arrastraba la subruta
    // al destino: /soluciones-digitales/crm/ -> /desarrollo-de-software/crm,
    // que es un 404 porque /desarrollo-de-software no tiene subrutas. Un 301
    // que aterriza en 404 es lo peor de ambos mundos — Google gasta el rastreo
    // en el salto y encima no encuentra nada. Todas las subrutas van a la
    // página de servicio, que sí existe.
    { prefix: '/soluciones-digitales', destination: '/desarrollo-de-software', preservePath: false },
    { prefix: '/en/product', destination: '/en/desarrollo-web', preservePath: false },
    // Paginación antigua del índice del blog (/blog/page/2). El prefijo lleva
    // el segmento completo `/blog/page`, así que no toca /blog/[slug].
    { prefix: '/blog/page', destination: '/blog', preservePath: false },
];

/**
 * Resuelve una ruta YA normalizada (sin barra final) contra las tablas.
 * Devuelve el destino final, o null si no es una URL heredada.
 *
 * Lo usa proxy.ts para responder con un único 308 cuando la petición
 * original traía barra final.
 */
function resolveLegacyRedirect(pathname) {
    const exact = LEGACY_EXACT_REDIRECTS[pathname];
    if (exact) return exact;

    for (const rule of LEGACY_PREFIX_REDIRECTS) {
        if (pathname !== rule.prefix && !pathname.startsWith(rule.prefix + '/')) continue;
        if (!rule.preservePath) return rule.destination;
        const rest = pathname.slice(rule.prefix.length);
        return rule.destination + rest;
    }

    return null;
}

module.exports = {
    PRICING_HUB,
    LEGACY_EXACT_REDIRECTS,
    LEGACY_PREFIX_REDIRECTS,
    resolveLegacyRedirect,
};
