import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza HTML de artículos (generado por IA / guardado en la base de datos)
 * antes de renderizarlo con dangerouslySetInnerHTML.
 *
 * DOMPurify elimina <script>, manejadores on* (onerror, onclick…), URLs
 * javascript:, y otros vectores de XSS, conservando el HTML editorial legítimo.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
    if (!dirty) return "";
    return DOMPurify.sanitize(dirty, {
        USE_PROFILES: { html: true },
        // No permitir iframes/objetos embebidos dentro del contenido del artículo
        // (el video de YouTube se renderiza aparte, fuera del HTML del cuerpo).
        FORBID_TAGS: ["iframe", "object", "embed", "form", "input", "style"],
        FORBID_ATTR: ["style"],
    });
}
