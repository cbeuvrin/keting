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
