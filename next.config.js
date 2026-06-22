const path = require('path');

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
  // Redirecciones 301 de URLs del sitio WordPress anterior (evitan 404 en Google
  // y conservan el SEO). Las rutas basura (/wp-*.php, /wp-content/...) se dejan en
  // 404 a propósito: son escaneos de bots, no vale la pena redirigirlas.
  async redirects() {
    return [
      // Posts antiguos con permalink por fecha (/AAAA/MM/DD/...) → blog
      { source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*', destination: '/blog', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})', destination: '/blog', permanent: true },
      // Categorías y feeds de WordPress
      { source: '/category/:path*', destination: '/blog', permanent: true },
      // Paginación antigua del blog
      { source: '/blog/page/:n*', destination: '/blog', permanent: true },
      // Páginas de servicios antiguas
      { source: '/web', destination: '/webdesing', permanent: true },
      { source: '/diseno-web-2', destination: '/webdesing', permanent: true },
      { source: '/web-informativa-landing-page', destination: '/webdesing', permanent: true },
      { source: '/portafolio-web', destination: '/portafolio', permanent: true },
      { source: '/plataforma-de-cursos', destination: '/soluciones-digitales', permanent: true },
      { source: '/google-ads', destination: '/soluciones-digitales', permanent: true },
      { source: '/meta-ads', destination: '/soluciones-digitales', permanent: true },
      { source: '/soluciones-de-marketing', destination: '/soluciones-digitales', permanent: true },
      { source: '/marketing', destination: '/soluciones-digitales', permanent: true },
      { source: '/marketing-digital', destination: '/soluciones-digitales', permanent: true },
      { source: '/cotizar', destination: '/precioweb', permanent: true },
      { source: '/asesorias', destination: '/precioweb', permanent: true },
      { source: '/nosotros', destination: '/', permanent: true },
      { source: '/inicio-3', destination: '/', permanent: true },
      { source: '/community-manager-2-minimal', destination: '/', permanent: true },
      { source: '/blog-2', destination: '/blog', permanent: true },
      { source: '/blogger', destination: '/blog', permanent: true },
      // Versión en inglés (ya no existe): específicas primero, luego catch-all
      { source: '/en/blog/:path*', destination: '/blog', permanent: true },
      { source: '/en/web', destination: '/webdesing', permanent: true },
      { source: '/en/portafolio-web', destination: '/portafolio', permanent: true },
      { source: '/en/google-ads', destination: '/soluciones-digitales', permanent: true },
      { source: '/en/meta-ads', destination: '/soluciones-digitales', permanent: true },
      { source: '/en/blogger', destination: '/blog', permanent: true },
      { source: '/en/:path*', destination: '/', permanent: true },
    ];
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
