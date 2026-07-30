const path = require('path');
const {
  LEGACY_EXACT_REDIRECTS,
  LEGACY_PREFIX_REDIRECTS,
} = require('./lib/legacy-redirects');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'image.pollinations.ai' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Inlina el CSS en el HTML para eliminar la petición de CSS que bloquea el
    // render (mejora FCP/LCP, sobre todo en móvil).
    inlineCss: true,
  },
  // Cabeceras de seguridad aplicadas a todas las rutas. (No se incluye una CSP
  // estricta aquí para no romper estilos inline / fuentes / embeds; se puede
  // añadir por separado y probar con calma.)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Evita que el sitio sea embebido en un <iframe> (clickjacking).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Evita MIME-sniffing.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Limita la información de Referer enviada a terceros.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restringe APIs sensibles del navegador.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Fuerza HTTPS durante 2 años (incluye subdominios).
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  // Desactiva la normalización automática de barra final para que la haga
  // proxy.ts. No es cosmético: esa normalización se aplica ANTES del
  // proxy, así que /category/algo/ hacía 308 a /category/algo y solo
  // entonces recibía el 410 — dos respuestas para decir "esto no existe".
  // Igual con /webdesing/: 308 de normalización + 308 de redirect.
  //
  // Con esto en true el proxy ve la URL tal cual llega, resuelve 410 y
  // redirecciones heredadas en UN salto, y reproduce él mismo la normalización
  // para todo lo demás (ver el paso 3 de proxy.ts). Si algún día quitas
  // esta línea, hay que quitar también ese paso 3 o las barras finales dejan
  // de normalizarse.
  skipTrailingSlashRedirect: true,
  // Redirecciones 308 de URLs del sitio WordPress anterior (evitan 404 en Google
  // y conservan el SEO). Las rutas basura (/wp-admin/, /wp-includes/,
  // /wp-content/, /wp-*.php) las corta el firewall de Vercel con 403 en el edge.
  //
  // La tabla vive en lib/legacy-redirects.js porque proxy.ts la necesita
  // también, para resolver en UN solo salto las URLs que llegan con barra final
  // (WordPress las publicaba así, y la normalización de Next añadía un 308
  // extra antes de llegar a estas reglas).
  //
  // Los archivos de WordPress (fechas /AAAA/MM/DD/, /category/, /feed/) YA NO
  // están aquí: devuelven 410 Gone en proxy.ts. Redirigirlos en masa a
  // /blog hacía que Google los leyese como soft 404 y siguiera rastreándolos.
  // Si vuelves a añadirlos aquí ganarán por precedencia y se romperá el 410.
  async redirects() {
    const exact = Object.entries(LEGACY_EXACT_REDIRECTS).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));

    // Las reglas de prefijo van DESPUÉS de las exactas: '/soluciones-digitales'
    // a secas debe resolverse con la entrada exacta, porque con solo :path* el
    // destino salía con barra final y encadenaba un segundo salto.
    const prefixed = LEGACY_PREFIX_REDIRECTS.map(({ prefix, destination, preservePath }) => ({
      source: `${prefix}/:path*`,
      destination: preservePath ? `${destination}/:path*` : destination,
      permanent: true,
    }));

    return [...exact, ...prefixed];
  },
  // Ancla el file-tracing a este proyecto (evita arrastrar node_modules vecinos).
  outputFileTracingRoot: path.join(__dirname),
  // Excluye del bundle de cada función serverless paquetes que no se usan en
  // runtime de servidor: optimizador de imágenes (sharp), herramientas de build
  // (typescript/swc), libs solo-cliente y basura de puppeteer. Soluciona el error
  // "Vercel Function exceeds the maximum size limit of 300mb".
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@img/**',
      'node_modules/sharp/**',
      'node_modules/typescript/**',
      'node_modules/@swc/**',
      'node_modules/@esbuild/**',
      'node_modules/esbuild/**',
      'node_modules/lucide-react/**',
      'node_modules/framer-motion/**',
      'node_modules/matter-js/**',
      'node_modules/@types/**',
      // Basura de un experimento previo con puppeteer (no la usa ningún código).
      'node_modules/puppeteer-core/**',
      'node_modules/@puppeteer/**',
      'node_modules/chromium-bidi/**',
      'node_modules/devtools-protocol/**',
      'node_modules/webdriver-bidi-protocol/**',
    ],
  },
};

module.exports = nextConfig;
