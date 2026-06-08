/**
 * Limpia texto de caracteres mal escapados, entidades HTML y mojibake UTF-8.
 * Soluciona problemas comunes en contenido generado por IA en español.
 */
export function sanitizeText(text: string | null | undefined): string {
    if (!text) return "";
    return text
        // Decodifica escapes Unicode literales (ñ → ñ)
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        // Entidades HTML comunes en español
        .replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é").replace(/&iacute;/gi, "í")
        .replace(/&oacute;/gi, "ó").replace(/&uacute;/gi, "ú")
        .replace(/&ntilde;/gi, "ñ").replace(/&Ntilde;/g, "Ñ")
        .replace(/&iexcl;/gi, "¡").replace(/&iquest;/gi, "¿")
        .replace(/&aring;/gi, "å").replace(/&AElig;/g, "Æ")
        .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
        .replace(/&laquo;/g, "«").replace(/&raquo;/g, "»")
        .replace(/&hellip;/g, "…").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
        .replace(/&lsquo;/g, "‘").replace(/&rsquo;/g, "’")
        // Backslashes huérfanos antes de letras
        .replace(/\\(?![nrtvbf"\\/])/g, "")
        // Caracteres de control invisibles
        .replace(/ /g, "")
        // Mojibake UTF-8 leído como Latin-1
        .replace(/Ã±/g, "ñ").replace(/Ã‘/g, "Ñ")
        .replace(/Ã¡/g, "á").replace(/Ã©/g, "é").replace(/Ã­/g, "í")
        .replace(/Ã³/g, "ó").replace(/Ãº/g, "ú")
        .replace(/Ã/g, "Á").replace(/Ã‰/g, "É").replace(/Ã/g, "Í")
        .replace(/Ã“/g, "Ó").replace(/Ãš/g, "Ú")
        .replace(/Â¡/g, "¡").replace(/Â¿/g, "¿").replace(/Â°/g, "°")
        .replace(/â€œ/g, '"').replace(/â€/g, '"')
        .replace(/â€˜/g, "'").replace(/â€™/g, "'")
        .replace(/â€"/g, "—").replace(/â€"/g, "–")
        .replace(/â€¦/g, "…")
        .trim();
}
