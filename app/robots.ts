import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ketingmedia.com";

// Rutas cerradas a todo el mundo. Se repiten dentro de CADA grupo a propósito:
// en el protocolo robots.txt un bot que encuentra un grupo con su propio
// User-agent ignora por completo el grupo `*`. Si estos Disallow solo vivieran
// en `*`, declarar un grupo para Googlebot le abriría /admin/ y /api/ sin
// quererlo.
//
// Consecuencia práctica: un Disallow nuevo va en esta constante, nunca en un
// grupo suelto.
const DISALLOW = ["/admin/", "/api/"];

// Crawlers con grupo propio. No amplía lo que pueden rastrear (es el mismo
// permiso que `*`); sirve para dejar explícito y auditable qué buscadores e IAs
// están admitidos, y para poder ajustar uno sin tocar a los demás.
//
// Ojo a la diferencia de propósito, que importa si algún día quieres cortar
// solo el entrenamiento:
//   - OAI-SearchBot / Claude-SearchBot / PerplexityBot → búsqueda y citación
//   - GPTBot / ClaudeBot → recolección para entrenamiento. NO tienen grupo
//     propio: caen en `*`, que hoy también los permite.
const CRAWLERS = [
    // Buscadores tradicionales
    "Googlebot",
    "Bingbot",
    "Applebot",
    // Buscadores con IA (resuelven consultas y citan fuentes)
    "OAI-SearchBot",
    "Claude-SearchBot",
    "PerplexityBot",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: DISALLOW,
            },
            ...CRAWLERS.map((userAgent) => ({
                userAgent,
                allow: "/",
                disallow: DISALLOW,
            })),
        ],
        sitemap: `${SITE}/sitemap.xml`,
        host: SITE,
    };
}
