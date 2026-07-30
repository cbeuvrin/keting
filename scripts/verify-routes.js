// Verificación de las reglas de rastreo contra las rutas reales del sitio.
//
//   node scripts/verify-routes.js     (sale con código 1 si algo falla)
//
// El proyecto no tiene framework de tests, así que esto es un script suelto sin
// dependencias. Ejecuta la MISMA lógica que proxy.ts importando los módulos
// compartidos (lib/wordpress-gone.js y lib/legacy-redirects.js), en vez de
// reimplementarla, para que no se desincronicen.
//
// OJO: valida la lógica de decisión, NO el comportamiento del edge de Vercel.
// `skipTrailingSlashRedirect` solo se puede validar de verdad contra un deploy.
const path = require('path');
const REPO = path.join(__dirname, '..');
const { isGone, matchedGonePattern } = require(path.join(REPO, 'lib/wordpress-gone.js'));
const { resolveLegacyRedirect, LEGACY_EXACT_REDIRECTS } = require(path.join(REPO, 'lib/legacy-redirects.js'));

let fail = 0;
const ok = (c, msg) => { if (!c) { fail++; console.log('  ✗ FALLO: ' + msg); } };

// Réplica de la cadena de decisión del middleware.
function middlewareVerdict(pathname) {
    if (['/api', '/admin', '/_next', '/_vercel'].some((p) => pathname === p || pathname.startsWith(p + '/'))) {
        return { action: 'bypass' };
    }
    if (isGone(pathname)) return { action: '410', pattern: matchedGonePattern(pathname) };
    if (pathname.length > 1 && pathname.endsWith('/')) {
        const normalized = pathname.replace(/\/+$/, '') || '/';
        const dest = resolveLegacyRedirect(normalized);
        if (dest) return { action: '308', to: dest };
        // Normalización de barra final, que ahora hace el middleware.
        return { action: '308-normalize', to: normalized };
    }
    return { action: 'passthrough' };
}

// ---------------------------------------------------------------------------
console.log('\n[1] Rutas REALES: no deben devolver 410 ni ser capturadas\n');

const REAL = [
    '/', '/blog', '/portafolio', '/casos', '/desarrollo-web', '/desarrollo-de-software',
    '/automatizacion-de-procesos', '/nosotros', '/nosotros/carlos-beuvrin', '/testimonio',
    '/aviso-de-privacidad', '/terminos-y-condiciones',
    '/en', '/en/blog', '/en/about', '/en/about/carlos-beuvrin', '/en/portafolio',
    '/en/case-studies', '/en/desarrollo-web', '/en/desarrollo-de-software',
    '/en/automatizacion-de-procesos', '/en/aviso-de-privacidad', '/en/terminos-y-condiciones',
    // Slugs reales de contenido
    '/blog/desarrollo-de-software-a-la-medida-cdmx-costos-2026',
    '/blog/cuanto-cuesta-una-web-o-app-a-medida-en-mexico-2026',
    '/blog/ya-no-es-seo-ahora-es-geo-futuro-digital',
    '/blog/next-js-vs-wordpress-para-empresas',
    '/casos/barmored', '/casos/gobernia', '/casos/suzuki',
    '/en/case-studies/barmored', '/en/blog/custom-online-store-vs-shopify',
    // Trampas deliberadas: parecidos a los patrones pero reales
    '/blog/page-speed-y-core-web-vitals',
    '/blog/como-crear-un-feed-de-productos',
    '/blog/categoria-de-producto-guia',
];

for (const r of REAL) {
    const v = middlewareVerdict(r);
    ok(v.action === 'passthrough', `${r} -> esperado passthrough, obtenido ${v.action}${v.pattern ? ' (' + v.pattern + ')' : ''}${v.to ? ' -> ' + v.to : ''}`);
    ok(!isGone(r), `${r} NO debe casar con ningún patrón 410 (casó: ${matchedGonePattern(r)})`);
    ok(resolveLegacyRedirect(r) === null, `${r} NO debe casar con ninguna redirección heredada (-> ${resolveLegacyRedirect(r)})`);
}
console.log(`  ${REAL.length} rutas reales comprobadas (y su variante con barra final)`);

// Las mismas con barra final: un 308 de normalización a SÍ MISMAS sin la barra.
// Nunca a otra ruta, y nunca a sí mismas CON la barra (sería bucle infinito).
for (const r of REAL) {
    if (r === '/') continue;
    const v = middlewareVerdict(r + '/');
    ok(v.action === '308-normalize', `${r}/ -> esperado 308-normalize, obtenido ${v.action}`);
    ok(v.to === r, `${r}/ -> debe normalizar a ${r}, obtenido ${v.to}`);
    ok(v.to !== r + '/', `${r}/ -> normaliza a sí misma con barra: BUCLE INFINITO`);
}

// ---------------------------------------------------------------------------
console.log('\n[2] Restos de WordPress: deben devolver 410\n');

const GONE = [
    ['/2025/05/16/', 'date-archive'], ['/2025/05/16', 'date-archive'],
    ['/2025/05/', 'date-archive'], ['/2025/', 'date-archive'], ['/2025', 'date-archive'],
    ['/2025/05/16/mi-post-viejo/', 'date-archive'], ['/1998/12/31/algo', 'date-archive'],
    ['/en/2025/05/16/', 'date-archive'], ['/en/2024/01', 'date-archive'],
    ['/category/marketing-ditigal/', 'category-archive'],
    ['/category/marketing-ditigal', 'category-archive'],
    ['/category/', 'category-archive'], ['/category', 'category-archive'],
    ['/en/category/seo/', 'category-archive'],
    ['/feed/', 'feed'], ['/feed', 'feed'],
    ['/blog/feed/', 'feed'], ['/blog/feed', 'feed'],
    // Cae en dos patrones a la vez (categoría + feed); gana categoría por orden.
    // Da igual cuál: ambos son 410.
    ['/category/marketing-ditigal/feed/', 'category-archive'],
    ['/comments/feed/', 'feed'],
];

for (const [p, expected] of GONE) {
    const v = middlewareVerdict(p);
    ok(v.action === '410', `${p} -> esperado 410, obtenido ${v.action}`);
    ok(matchedGonePattern(p) === expected, `${p} -> patrón esperado ${expected}, obtenido ${matchedGonePattern(p)}`);
}
console.log(`  ${GONE.length} patrones de WordPress comprobados`);

// ---------------------------------------------------------------------------
console.log('\n[3] Doble salto colapsado: URL heredada con barra final -> 1 solo 308\n');

const COLLAPSE = [
    ['/webdesing/', '/desarrollo-web'],
    ['/soluciones-digitales/', '/desarrollo-de-software'],
    // Sin preservePath: la subruta NO se arrastra, porque el destino con
    // subruta era un 404.
    ['/soluciones-digitales/crm/', '/desarrollo-de-software'],
    ['/soluciones-digitales/crm/algo-mas/', '/desarrollo-de-software'],
    ['/precioweb/', '/blog/cuanto-cuesta-una-web-o-app-a-medida-en-mexico-2026'],
    ['/landing3d/', '/desarrollo-web'],
    ['/marketing-digital/', '/desarrollo-de-software'],
    ['/blog/page/2/', '/blog'],
    ['/en/product/algo/', '/en/desarrollo-web'],
    ['/en/nosotros/', '/en'],
    ['/contacto/', '/'],
];

for (const [from, to] of COLLAPSE) {
    const v = middlewareVerdict(from);
    ok(v.action === '308' && v.to === to, `${from} -> esperado 308 a ${to}, obtenido ${v.action}${v.to ? ' a ' + v.to : ''}`);
}
console.log(`  ${COLLAPSE.length} colapsos de doble salto comprobados`);

// ---------------------------------------------------------------------------
console.log('\n[4] La raíz y /en/ — el paso 3 no debe dejar pathname vacío\n');

// '/' termina en barra por definición. Si el guard `length > 1` fallara,
// normalizaría a '' y produciría un URL inválido o un bucle.
{
    const v = middlewareVerdict('/');
    ok(v.action === 'passthrough', `/ -> esperado passthrough (200, sin redirigir), obtenido ${v.action}${v.to ? ' a ' + v.to : ''}`);
    ok(!isGone('/'), '/ NO debe casar con ningún patrón 410');
    ok(resolveLegacyRedirect('/') === null, '/ NO debe casar con ninguna redirección heredada');
}
// Casos degenerados: nunca deben producir pathname vacío.
for (const p of ['//', '///']) {
    const v = middlewareVerdict(p);
    ok(v.to === '/', `${p} -> debe normalizar a '/', obtenido '${v.to}'`);
    ok(v.to !== '', `${p} -> pathname vacío: URL inválido`);
}
// /en/ -> /en, que existe como ruta real (app/en/page.tsx), así que no es un 404.
{
    const v = middlewareVerdict('/en/');
    ok(v.action === '308-normalize', `/en/ -> esperado 308-normalize, obtenido ${v.action}`);
    ok(v.to === '/en', `/en/ -> debe normalizar a /en, obtenido ${v.to}`);
    ok(resolveLegacyRedirect('/en') === null, '/en NO debe redirigir (es una ruta real)');
    ok(!isGone('/en'), '/en NO debe devolver 410');
}
console.log('  /, //, ///, /en/ comprobados');

// ---------------------------------------------------------------------------
console.log('\n[5] Coherencia interna\n');

// Ninguna clave heredada puede coincidir con una ruta real del sitio.
const REAL_SET = new Set(REAL);
for (const key of Object.keys(LEGACY_EXACT_REDIRECTS)) {
    ok(!REAL_SET.has(key), `la redirección heredada ${key} colisiona con una ruta real del sitio`);
}
// Ningún destino puede ser a su vez origen (encadenaría saltos).
for (const [src, dest] of Object.entries(LEGACY_EXACT_REDIRECTS)) {
    ok(!(dest in LEGACY_EXACT_REDIRECTS), `${src} -> ${dest}, pero ${dest} es a su vez un origen: cadena de saltos`);
}
// Ningún destino puede devolver 410.
for (const [src, dest] of Object.entries(LEGACY_EXACT_REDIRECTS)) {
    ok(!isGone(dest), `${src} redirige a ${dest}, que devuelve 410`);
}
// /wp-* NO debe tocarlo el middleware (lo corta el WAF).
for (const p of ['/wp-admin/admin-ajax.php', '/wp-includes/js/x.js', '/wp-content/uploads/a.jpg']) {
    const v = middlewareVerdict(p);
    ok(v.action === 'passthrough', `${p} -> el middleware no debe intervenir (WAF), obtenido ${v.action}`);
}
console.log('  colisiones, cadenas y ámbito del WAF comprobados');

// ---------------------------------------------------------------------------
console.log('\n[6] Matcher de proxy.ts: assets y rutas internas EXCLUIDOS\n');

// Se lee el matcher del propio proxy.ts para que el test no se desincronice.
const proxySrc = require('fs').readFileSync(path.join(REPO, 'proxy.ts'), 'utf8');
const m = proxySrc.match(/matcher:\s*\['([^']+)'\]/);
ok(!!m, 'no se pudo extraer el matcher de proxy.ts');
const matcherRe = new RegExp('^' + m[1].replace(/\\\\/g, '\\') + '$');
console.log('  matcher:', m[1]);

// Deben quedar FUERA del proxy (si entran, el paso 3 puede romperlos).
const EXCLUDED = [
    '/_next/static/chunks/main.js', '/_next/image', '/_next/static/css/a.css',
    '/api/contacto', '/api/admin/x',
    '/favicon.ico', '/robots.txt', '/sitemap.xml', '/icon.png',
    '/images/landing3d/frames/ezgif-frame-001.jpg',
    '/video.mp4', '/fuente.woff2', '/doc.pdf',
];
for (const p of EXCLUDED) {
    ok(!matcherRe.test(p), `${p} DEBE quedar excluido del matcher y no lo está`);
}

// Deben ENTRAR al proxy (si no, no hay 410 ni normalización).
const INCLUDED = [
    '/', '/blog', '/blog/', '/portafolio/', '/2025/05/16/', '/category/x/',
    '/feed/', '/webdesing/', '/desarrollo-web', '/casos/barmored/', '/en/blog/',
];
for (const p of INCLUDED) {
    ok(matcherRe.test(p), `${p} DEBE entrar al matcher y no entra`);
}
console.log(`  ${EXCLUDED.length} excluidos + ${INCLUDED.length} incluidos comprobados`);

console.log(fail === 0 ? '\n✅ TODO CORRECTO — 0 fallos\n' : `\n❌ ${fail} FALLOS\n`);
process.exit(fail === 0 ? 0 : 1);
