
export function getHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// Español e inglés en el mismo mapa: el blog ES guarda "jun 2026" y el blog EN
// (lib/blog-en/) guarda "Jun 2026". Coinciden en casi todos los meses, pero NO en
// ene/jan, abr/apr, ago/aug ni dic/dec — con solo los españoles, cuatro meses de
// los artículos ingleses se quedaban sin fecha.
const MESES: Record<string, string> = {
    ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06",
    jul: "07", ago: "08", sep: "09", oct: "10", nov: "11", dic: "12",
    jan: "01", apr: "04", aug: "08", dec: "12",
};

/**
 * Pasa la fecha legible de un artículo ("jun 2026", "Jul 2026") a ISO 8601.
 *
 * Los artículos guardan la fecha en formato humano porque es lo que se pinta en
 * la página, pero schema.org exige ISO en `datePublished`/`dateModified`. Se
 * emitía el texto tal cual, así que Google descartaba la fecha de los 28
 * artículos y ninguno tenía señal de antigüedad ni de actualización.
 *
 * Devuelve `undefined` si no reconoce el formato: mejor un artículo sin fecha
 * que uno con una fecha que el validador rechaza. Nunca inventa un valor.
 */
export function toIsoDate(raw?: string | null): string | undefined {
    if (!raw) return undefined;
    const s = String(raw).trim();

    // Ya es ISO (p. ej. el created_at de Supabase): nos quedamos con el día.
    const yaIso = s.match(/^(\d{4}-\d{2}-\d{2})/);
    if (yaIso) return yaIso[1];

    // "jun 2026", "Jul 2026", "Sep. 2024" -> primer día de ese mes. El día exacto
    // no está guardado en ninguna parte, y schema.org acepta la fecha sola.
    const mesAno = s.match(/^([a-záéíóú]{3})[a-záéíóú]*\.?\s+(\d{4})$/i);
    if (mesAno) {
        const mes = MESES[mesAno[1].toLowerCase()];
        if (mes) return `${mesAno[2]}-${mes}-01`;
    }

    return undefined;
}

/**
 * Optimiza imágenes de Supabase Storage usando su endpoint de transformación
 * (redimensiona + comprime al vuelo, sin re-subir). Reduce ~87% el peso.
 * Las imágenes locales (ya redimensionadas) se devuelven sin cambios.
 */
export function optimizeImageUrl(url: string, width = 1000, quality = 72): string {
    if (url.includes("supabase.co/storage/v1/object/")) {
        const transformed = url.replace("/storage/v1/object/", "/storage/v1/render/image/");
        const sep = transformed.includes("?") ? "&" : "?";
        return `${transformed}${sep}width=${width}&quality=${quality}`;
    }
    return url;
}

export function getCategoryImage(article: { image?: string; slug?: string; category?: string | string[] }, width = 1000): string {
    // Accept any full external URL (pollinations, supabase, etc.) or a local path that is not "default"
    const img = article.image || "";
    const isValid = (img.startsWith("https://") || img.startsWith("http://")) ||
                    (img.startsWith("/") && !img.includes("default") && !img.includes("placeholder"));

    if (isValid && img.length > 0) {
        return optimizeImageUrl(img, width);
    }

    const fallbacks = [
        '/images/blog/minimalism.png',
        '/images/blog/typography.png',
        '/images/blog/landing.png',
        '/images/blog/animations.png',
        '/images/blog/identity-ai.png',
        '/images/blog/react-nextjs.png',
        '/images/blog/checklist.png',
        '/images/blog/app-sales.png',
        '/images/blog/geo-optimization.png',
    ];

    const slugHash = getHash(article.slug || "");

    // Category-specific pools for varied but relevant images
    const pools: Record<string, number[]> = {
        'Desarrollo Web':       [0, 1, 5], // minimalism, typography, react-nextjs
        'Software':             [5, 7, 3], // react-nextjs, app-sales, animations
        'Diseño Web':           [0, 1, 3], // minimalism, typography, animations
        'Marketing':            [4, 2, 7], // identity-ai, landing, app-sales
        'Estrategia Digital':   [2, 5, 8], // landing, react-nextjs, geo-optimization
        'Inteligencia Artificial': [3, 4, 5], // animations, identity-ai, react-nextjs
        'Aplicaciones':         [5, 7, 3], // react-nextjs, app-sales, animations
        'Posicionamiento':      [6, 8, 2], // checklist, geo-optimization, landing
        'Ventas':               [7, 2, 4], // app-sales, landing, identity-ai
        'E-commerce':           [7, 0, 2], // app-sales, minimalism, landing
        'SEO':                  [8, 6, 5], // geo-optimization, checklist, react-nextjs
    };

    const cats = Array.isArray(article.category) ? article.category : (article.category || "").split(',').map(c => c.trim());
    for (const cat of cats) {
        const pool = Object.entries(pools).find(([name]) => cat?.toLowerCase().includes(name.toLowerCase()))?.[1];
        if (pool) {
            return fallbacks[pool[slugHash % pool.length]];
        }
    }

    // High-variety fallback if no pool match
    return fallbacks[slugHash % fallbacks.length];
}
