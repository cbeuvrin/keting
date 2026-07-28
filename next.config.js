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
      // Artículos IA duplicados (generados por el cron con dedup roto, borrados
      // 2026-07-02) → consolidados en el artículo canónico del tema
      { source: '/blog/redefiniendo-el-contacto-la-estrategia-definitiva-de-agentes-de-ia-autonoma-para-una-experiencia-cliente-superior', destination: '/blog/mas-alla-del-chatbot-la-revolucion-de-los-agentes-de-ia-autonomos-en-el-servicio-al-cliente', permanent: true },
      { source: '/blog/la-nueva-frontera-del-servicio-agentes-de-ia-autonomos-para-la-excelencia-operativa-y-la-conexion-hiper-personalizada', destination: '/blog/mas-alla-del-chatbot-la-revolucion-de-los-agentes-de-ia-autonomos-en-el-servicio-al-cliente', permanent: true },
      { source: '/blog/la-arquitectura-invisible-desplegando-agentes-de-ia-autonomos-para-una-experiencia-de-cliente-transformadora', destination: '/blog/mas-alla-del-chatbot-la-revolucion-de-los-agentes-de-ia-autonomos-en-el-servicio-al-cliente', permanent: true },
      { source: '/blog/la-arquitectura-invisible-desplegando-agentes-autonomos-de-ia-para-redefinir-la-experiencia-del-cliente-premium', destination: '/blog/mas-alla-del-chatbot-la-revolucion-de-los-agentes-de-ia-autonomos-en-el-servicio-al-cliente', permanent: true },
      { source: '/blog/la-vanguardia-del-servicio-como-los-agentes-autonomos-de-ia-redefinen-la-experiencia-del-cliente-en-la-era-digital', destination: '/blog/mas-alla-del-chatbot-la-revolucion-de-los-agentes-de-ia-autonomos-en-el-servicio-al-cliente', permanent: true },
      { source: '/blog/desbloqueando-la-excelencia-agentes-de-ia-autonomos-como-motor-de-transformacion-en-el-servicio-al-cliente', destination: '/blog/mas-alla-del-chatbot-la-revolucion-de-los-agentes-de-ia-autonomos-en-el-servicio-al-cliente', permanent: true },
      // Slug renombrado: /webdesing → /desarrollo-web (keyword + corrige typo)
      { source: '/webdesing', destination: '/desarrollo-web', permanent: true },
      // Slug renombrado: /soluciones-digitales → /desarrollo-de-software (keyword money).
      // La regla exacta va PRIMERO: con solo :path*, la ruta sin subruta generaba
      // "/desarrollo-de-software/" (barra final) y encadenaba un segundo salto al
      // normalizarla. Así se resuelve en un único 301.
      { source: '/soluciones-digitales', destination: '/desarrollo-de-software', permanent: true },
      { source: '/soluciones-digitales/:path*', destination: '/desarrollo-de-software/:path*', permanent: true },
      // Páginas de servicios antiguas (apuntan directo al slug nuevo, sin encadenar)
      { source: '/web', destination: '/desarrollo-web', permanent: true },
      { source: '/diseno-web-2', destination: '/desarrollo-web', permanent: true },
      { source: '/web-informativa-landing-page', destination: '/desarrollo-web', permanent: true },
      { source: '/portafolio-web', destination: '/portafolio', permanent: true },
      { source: '/plataforma-de-cursos', destination: '/desarrollo-de-software', permanent: true },
      { source: '/google-ads', destination: '/desarrollo-de-software', permanent: true },
      { source: '/meta-ads', destination: '/desarrollo-de-software', permanent: true },
      { source: '/soluciones-de-marketing', destination: '/desarrollo-de-software', permanent: true },
      { source: '/marketing', destination: '/desarrollo-de-software', permanent: true },
      { source: '/marketing-digital', destination: '/desarrollo-de-software', permanent: true },
      { source: '/cotizar', destination: '/precioweb', permanent: true },
      { source: '/asesorias', destination: '/precioweb', permanent: true },
      // Rutas que se enlazaban desde fuera y daban 404 (auditoría GEO 2026-07).
      { source: '/precio', destination: '/precioweb', permanent: true },
      { source: '/precios', destination: '/precioweb', permanent: true },
      { source: '/contacto', destination: '/', permanent: true },
      // '/nosotros' ya NO redirige: ahora es una página real (plan GEO 4.2) con
      // la historia de la empresa y enlace al perfil del fundador.
      { source: '/inicio-3', destination: '/', permanent: true },
      { source: '/community-manager-2-minimal', destination: '/', permanent: true },
      { source: '/blog-2', destination: '/blog', permanent: true },
      { source: '/blogger', destination: '/blog', permanent: true },
      // Versión en inglés antigua de WordPress: redirects ESPECÍFICOS (no
      // catch-all, para no atrapar las rutas espejo reales /en/desarrollo-web…).
      { source: '/en/blog/:path*', destination: '/blog', permanent: true },
      { source: '/en/blog', destination: '/blog', permanent: true },
      { source: '/en/web', destination: '/en/desarrollo-web', permanent: true },
      { source: '/en/portafolio-web', destination: '/en/portafolio', permanent: true },
      { source: '/en/google-ads', destination: '/en/desarrollo-de-software', permanent: true },
      { source: '/en/meta-ads', destination: '/en/desarrollo-de-software', permanent: true },
      { source: '/en/blogger', destination: '/blog', permanent: true },
      { source: '/en/nosotros', destination: '/en', permanent: true },
      // Huérfanas del WordPress inglés detectadas en la auditoría GEO (2026-07).
      // Los crawlers de IA siguen enlaces viejos con mucha más avidez que Googlebot
      // (~34% de 404 frente a ~8%), así que estos 404 sí cuestan citaciones.
      { source: '/en/web-informativa-landing-page', destination: '/en/desarrollo-web', permanent: true },
      { source: '/en/plataforma-de-cursos', destination: '/en/desarrollo-de-software', permanent: true },
      { source: '/en/product/:path*', destination: '/en/desarrollo-web', permanent: true },
      { source: '/en/precio', destination: '/precioweb', permanent: true },
      { source: '/en/precios', destination: '/precioweb', permanent: true },
      { source: '/en/contacto', destination: '/en', permanent: true },
      // Posts con permalink por fecha del WordPress inglés (el blog es solo ES).
      { source: '/en/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*', destination: '/blog', permanent: true },
      { source: '/en/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})', destination: '/blog', permanent: true },
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
