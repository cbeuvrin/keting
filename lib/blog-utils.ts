
export function getHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function getCategoryImage(article: { image?: string; slug?: string; category?: string | string[] }): string {
    // Accept any full external URL (pollinations, supabase, etc.) or a local path that is not "default"
    const img = article.image || "";
    const isValid = (img.startsWith("https://") || img.startsWith("http://")) ||
                    (img.startsWith("/") && !img.includes("default") && !img.includes("placeholder"));
    
    if (isValid && img.length > 0) {
        return img;
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
