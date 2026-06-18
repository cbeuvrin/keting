import sanitize from "sanitize-html";

/**
 * Sanitiza HTML de artículos (generado por IA / guardado en la base de datos)
 * antes de renderizarlo con dangerouslySetInnerHTML.
 *
 * Usa `sanitize-html` (JavaScript puro, sin jsdom) → seguro en el runtime
 * serverless de Vercel. Elimina <script>, <iframe>, manejadores on* y URLs
 * javascript:, conservando el HTML editorial legítimo.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
    if (!dirty) return "";
    return sanitize(dirty, {
        allowedTags: [
            "h1", "h2", "h3", "h4", "h5", "h6",
            "p", "a", "ul", "ol", "li", "blockquote",
            "strong", "em", "b", "i", "u", "s", "br", "hr", "span", "div",
            "figure", "figcaption", "img",
            "code", "pre",
            "table", "thead", "tbody", "tr", "th", "td",
        ],
        allowedAttributes: {
            a: ["href", "name", "target", "rel"],
            img: ["src", "alt", "title", "width", "height", "loading"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        // Fuerza rel seguro en enlaces que abren en nueva pestaña.
        transformTags: {
            a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }),
        },
    });
}
