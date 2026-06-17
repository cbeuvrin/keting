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
