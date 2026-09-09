/**
 * Saca el esquema FAQPage del HTML del artículo.
 *
 * Google puede mostrar estas preguntas directamente en resultados, y los
 * modelos que citan fuentes las prefieren porque son pares pregunta-respuesta
 * ya delimitados. El artículo no lleva marcado especial: basta con que tenga
 * un <h2>Preguntas frecuentes</h2> y debajo párrafos que empiecen con la
 * pregunta en <strong>, que es como ya estaban escritos.
 *
 * Devuelve null si el artículo no tiene esa sección: no se inventa nada.
 */
export function faqSchema(html: string | null | undefined): object | null {
    if (!html) return null;

    const inicio = html.search(/<h2[^>]*>\s*preguntas frecuentes\s*<\/h2>/i);
    if (inicio === -1) return null;

    // La sección termina en el siguiente h2, o al final del artículo.
    const resto = html.slice(inicio + 1);
    const fin = resto.search(/<h2[^>]*>/i);
    const bloque = fin === -1 ? resto : resto.slice(0, fin);

    const preguntas: { name: string; text: string }[] = [];
    const re = /<p>\s*<strong>(.*?)<\/strong>\s*(?:<br\s*\/?>)?\s*([\s\S]*?)<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(bloque)) !== null) {
        const name = limpia(m[1]);
        const text = limpia(m[2]);
        // Sin respuesta no hay pregunta: Google rechaza el esquema incompleto.
        if (name.length > 8 && text.length > 20) preguntas.push({ name, text });
    }
    if (preguntas.length < 2) return null;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: preguntas.map((q) => ({
            "@type": "Question",
            name: q.name,
            acceptedAnswer: { "@type": "Answer", text: q.text },
        })),
    };
}

function limpia(s: string): string {
    return s
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();
}
