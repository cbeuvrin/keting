import { createClient } from "@supabase/supabase-js";
import { articles as staticArticles } from "@/lib/blog-data";
import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

// Imagen social de cada artículo del blog. Sin esto, compartir un post en
// LinkedIn o WhatsApp no mostraba vista previa —ninguna— y el enlace se veía
// como un texto suelto, que es la peor tarjeta posible para algo que se
// escribió para leerse.
//
// Se genera con el título real del artículo, partido en dos líneas: la primera
// en el sans de la casa y la segunda en cursiva, igual que los titulares del
// sitio. Si el artículo no se encuentra, sale una tarjeta genérica del blog en
// lugar de fallar: una imagen aproximada es mejor que ninguna.

export const runtime = "nodejs";
export const alt = "Artículo del blog de Keting Media";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

async function getTitle(slug: string): Promise<{ title: string; category: string } | null> {
    const estatico = staticArticles.find((a) => a.slug === slug);
    if (estatico) return { title: estatico.title, category: estatico.category ?? "Blog" };
    try {
        const db = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await db
            .from("articles")
            .select("title, category")
            .eq("slug", slug)
            .maybeSingle();
        return data ? { title: data.title as string, category: (data.category as string) ?? "Blog" } : null;
    } catch {
        return null;
    }
}

/**
 * Parte el título en dos: la primera mitad va en sans y la segunda en cursiva.
 * Se corta por palabras cerca de la mitad para que las dos líneas pesen
 * parecido, en vez de dejar una línea larguísima y otra de dos palabras.
 */
function partir(titulo: string): [string, string] {
    const palabras = titulo.split(/\s+/);
    if (palabras.length < 4) return [titulo, ""];
    const objetivo = Math.round(titulo.length / 2);
    let corte = 0;
    let largo = 0;
    for (let i = 0; i < palabras.length - 1; i++) {
        largo += palabras[i].length + 1;
        corte = i + 1;
        if (largo >= objetivo) break;
    }
    return [palabras.slice(0, corte).join(" "), palabras.slice(corte).join(" ")];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const art = await getTitle(slug);

    if (!art) {
        return ketingOgImage({
            eyebrow: "Blog",
            lineSans: "Diseño, software",
            lineSerif: "y estrategia digital.",
            url: "ketingmedia.com/blog",
            theme: "dark",
        });
    }

    const [sans, serif] = partir(art.title);
    // Títulos largos con letra más chica: si no, se salen de la tarjeta.
    const headingSize = art.title.length > 78 ? 54 : art.title.length > 55 ? 62 : 72;

    return ketingOgImage({
        eyebrow: art.category.split(",")[0].trim(),
        lineSans: sans,
        lineSerif: serif,
        // Solo la sección, no el slug: los slugs largos partían la línea en
        // dos y se encimaban con la firma de la derecha.
        url: "ketingmedia.com/blog",
        theme: "dark",
        headingSize,
    });
}
