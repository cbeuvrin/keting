// CSS compartido por el contenido HTML de un artículo (.blog-content) — usado
// tanto en /blog/[slug] (ES) como en /en/blog/[slug] (EN). Vivía duplicado
// inline en cada página; se extrajo aquí para que ambas evolucionen juntas
// (p.ej. las reglas de tablas/h3/ol/em/blockquote añadidas después).
//
// Los comentarios explicativos van AQUÍ arriba (comentario de JS/TSX), no
// dentro del string de `__html`: ese string se imprime tal cual dentro de un
// <style> en el HTML final, así que un comentario CSS en español ahí dentro
// se filtraría como texto en español en las páginas EN (verificación "cero
// español" del plan GEO 4.5).
//
// - `.table-wrap`: scroll horizontal propio en móvil para que la página nunca
//   se desborde.
// - El `min-width` de `table` baja a propósito: una tabla de 2 columnas debe
//   caber entera en móvil. Con un ancho grande forzado, la columna de datos
//   queda fuera de pantalla tras el scroll y el lector solo ve las etiquetas
//   — justo lo contrario de lo que la tabla comunica. El contenedor con
//   scroll sigue ahí para tablas realmente anchas.
export function BlogContentStyles() {
    return (
        <style
            dangerouslySetInnerHTML={{
                __html: `
                    .blog-content h2 { font-size: 2.5rem; font-weight: 700; margin-top: 4rem; margin-bottom: 2rem; letter-spacing: -0.05em; border-left: 4px solid #000; padding-left: 1.5rem; line-height: 1; }
                    .blog-content { overflow-wrap: break-word; }
                    .blog-content p { font-size: 1.25rem; line-height: 2; color: #374151; margin-bottom: 2.5rem; font-weight: 300; }
                    .blog-content img { width: 100%; border-radius: 2.5rem; margin: 4rem 0; box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.15); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                    .blog-content img:hover { transform: scale(1.02); }
                    .blog-content strong { color: #000; font-weight: 700; }
                    .blog-content a { color: #000; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; transition: opacity 0.2s ease; }
                    .blog-content a:hover { opacity: 0.6; }
                    .blog-content ul { margin-bottom: 3rem; space-y: 4; }
                    .blog-content li { font-size: 1.125rem; margin-bottom: 1rem; color: #4B5563; position: relative; padding-left: 1.5rem; }
                    .blog-content li::before { content: "—"; position: absolute; left: 0; color: #9CA3AF; font-weight: bold; }
                    .blog-content h3 { font-size: 1.6rem; font-weight: 700; margin-top: 3rem; margin-bottom: 1.25rem; letter-spacing: -0.03em; line-height: 1.15; }
                    .blog-content ol { margin-bottom: 3rem; padding-left: 0; counter-reset: item; list-style: none; }
                    .blog-content ol > li { counter-increment: item; }
                    .blog-content ol > li::before { content: counter(item) "."; color: #9CA3AF; font-weight: 700; }
                    .blog-content em { font-family: var(--font-playfair), Georgia, serif; font-style: italic; }
                    .blog-content blockquote { margin: 3rem 0; padding: 0.25rem 0 0.25rem 1.75rem; border-left: 3px solid #000; font-family: var(--font-playfair), Georgia, serif; font-style: italic; font-size: 1.35rem; line-height: 1.7; color: #1a1a1a; }
                    .blog-content blockquote p { font-size: inherit; font-style: inherit; margin-bottom: 0; }
                    .blog-content .table-wrap { overflow-x: auto; margin: 3rem 0; -webkit-overflow-scrolling: touch; }
                    /* Bloques de código: para los artículos técnicos. Fondo oscuro
                       editorial, scroll horizontal propio (una línea larga NO debe
                       desbordar la página) y tamaño legible en móvil. */
                    .blog-content pre { background: #0f0f0f; color: #e8e8e8; border-radius: 1rem; padding: 1.25rem 1.35rem; margin: 2.5rem 0; overflow-x: auto; -webkit-overflow-scrolling: touch; font-size: 0.83rem; line-height: 1.75; }
                    .blog-content pre code { background: none; color: inherit; padding: 0; font-size: inherit; white-space: pre; }
                    .blog-content code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background: #F0F0EE; color: #1a1a1a; padding: 0.12em 0.4em; border-radius: 0.35rem; font-size: 0.88em; }
                    @media (min-width: 768px) {
                        .blog-content pre { font-size: 0.92rem; padding: 1.5rem 1.75rem; }
                    }
                    .blog-content table { width: 100%; border-collapse: collapse; font-size: 0.95rem; min-width: 17rem; }
                    .blog-content th { text-align: left; font-weight: 700; color: #000; border-bottom: 2px solid #000; padding: 0.7rem 0.5rem; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; }
                    .blog-content td { padding: 0.7rem 0.5rem; border-bottom: 1px solid #E5E7EB; color: #374151; font-weight: 300; }
                    .blog-content th:last-child, .blog-content td:last-child { text-align: right; white-space: nowrap; }
                    @media (min-width: 768px) {
                        .blog-content table { font-size: 1rem; }
                        .blog-content th, .blog-content td { padding: 0.85rem 1rem; }
                    }
                    .blog-content tbody tr:last-child td { border-bottom: none; }
                    .blog-content td strong { font-weight: 700; }
                    .blog-hero-img { transition: transform 0.8s ease; }
                    .blog-hero-img:hover { transform: scale(1.05); }
                `,
            }}
        />
    );
}
