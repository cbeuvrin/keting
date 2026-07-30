import { NextResponse, type NextRequest } from 'next/server';
import { isGone } from './lib/wordpress-gone';
import { resolveLegacyRedirect } from './lib/legacy-redirects';

// Antes middleware.ts. En Next 16 esa convención está deprecada y el archivo se
// llama proxy.ts; el export DEBE llamarse `proxy` (o ser default), porque el
// runtime resuelve `mod.proxy` y no `mod.middleware`. Si se renombra el archivo
// pero no la función, Next lanza "must export a function named `proxy`".
// Tener a la vez middleware.ts y proxy.ts es error de build, no aviso.
//
// Dos únicas responsabilidades, ambas de presupuesto de rastreo:
//
//  1. 410 Gone en los archivos de WordPress que no tienen equivalente
//     (fechas, /category/, /feed/). Antes redirigían 301 a /blog, que Google
//     lee como soft 404 y le hace seguir rastreando las URLs viejas.
//
//  2. Colapsar el doble salto de las URLs heredadas. WordPress publicaba todo
//     con barra final, así que /webdesing/ hacía DOS 308: primero la
//     normalización de barra de Next, después la regla de redirects().
//
// Para lo segundo hace falta `skipTrailingSlashRedirect: true` en
// next.config.js. Sin eso la normalización de Next se aplica ANTES de este
// archivo y nunca llega a ver la barra final: el código de abajo sería
// inalcanzable y /category/algo/ seguiría respondiendo 308 y luego 410.
// Como contrapartida, la normalización pasa a ser responsabilidad nuestra
// (paso 3): sin ella /blog/ y /blog servirían ambos un 200 y tendríamos
// contenido duplicado, que es peor que el problema original.
//
// Todo lo demás sale por NextResponse.next() sin tocarse.

/**
 * Rutas que no debe inspeccionar nunca. El matcher de abajo ya excluye la
 * mayoría; esto es la segunda barrera, para que un cambio en el regex no
 * convierta /api en algo que se redirige.
 */
const BYPASS_PREFIXES = ['/api', '/admin', '/_next', '/_vercel'];

/** Cuerpo mínimo del 410. Incluye noindex por si algún crawler lo renderiza. */
const GONE_BODY = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<title>410 — Contenido eliminado permanentemente</title>
</head><body>
<h1>410 Gone</h1>
<p>Esta URL pertenecía al sitio anterior y se ha eliminado de forma permanente.</p>
<p><a href="/blog">Ir al blog</a></p>
</body></html>`;

function gone(): NextResponse {
    return new NextResponse(GONE_BODY, {
        status: 410,
        headers: {
            'content-type': 'text/html; charset=utf-8',
            // Que no se quede pegado en la CDN mientras se estabiliza.
            'cache-control': 'public, max-age=0, s-maxage=3600',
            'x-robots-tag': 'noindex, nofollow',
        },
    });
}

// OJO: se construye sobre `new URL(request.url)`, NO sobre
// `request.nextUrl.clone()`. NextURL conserva la barra final de la petición
// original y la vuelve a añadir al asignar `pathname`, así que /blog/ generaba
// un Location de /blog/ — un bucle de redirección infinito. Con una URL
// estándar el setter se comporta como uno espera.
function redirect308(request: NextRequest, pathname: string, search: string): NextResponse {
    const url = new URL(request.url);
    url.pathname = pathname;
    url.search = search;
    return NextResponse.redirect(url, 308);
}

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    if (BYPASS_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
        return NextResponse.next();
    }

    // 1. Archivos de WordPress sin equivalente -> 410, con o sin barra final.
    if (isGone(pathname)) {
        return gone();
    }

    // La raíz queda fuera por el `length > 1`: '/' termina en barra por
    // definición, y normalizarla daría pathname vacío.
    if (pathname.length > 1 && pathname.endsWith('/')) {
        // El `|| '/'` cubre casos degenerados tipo '//' o '///', que si no
        // producirían pathname vacío y un URL inválido.
        const normalized = pathname.replace(/\/+$/, '') || '/';

        // 2. URL heredada con barra final -> un único 308 al destino final,
        //    saltándose el paso intermedio de quitar la barra.
        //    Sin barra final no hace falta: redirects() ya resuelve en un salto.
        const destination = resolveLegacyRedirect(normalized);
        if (destination) {
            return redirect308(request, destination, search);
        }

        // 3. Resto de URLs con barra final -> normalización que ya no hace Next
        //    (ver skipTrailingSlashRedirect en next.config.js).
        return redirect308(request, normalized, search);
    }

    return NextResponse.next();
}

export const config = {
    // Excluye, por este orden:
    //   - /api/... y /_next/... (cualquier subruta, no solo static e image)
    //   - cualquier ruta cuyo último segmento tenga extensión de archivo, que
    //     cubre favicon.ico, robots.txt, sitemap.xml, icon.png, imágenes,
    //     vídeos y fuentes de /public sin tener que listarlos
    //
    // Importa que los assets no pasen por aquí: el paso 3 redirige TODO lo que
    // acaba en barra, así que un asset servido con barra final acabaría en un
    // 308 en vez de en el archivo.
    matcher: ['/((?!api/|_next/|.*\\.[a-zA-Z0-9]+$).*)'],
};
