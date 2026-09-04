import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET!;

// Rutas que leen artículos de Supabase y por tanto se quedan viejas tras editar
// uno. Todas tienen `revalidate = 3600`, así que sin esto un cambio en la DB
// tarda hasta una hora en verse en el listado — mientras que la página del
// artículo, que también revalida, se regenera antes por recibir más visitas.
// El resultado es peor que un simple retraso: el título del listado y el del
// artículo se contradicen durante un rato, que fue justo lo que se vio al añadir
// una agencia al listicle (la tarjeta decía 12 y el artículo 13).
//
// El carrusel del home NO va aquí: es un componente de cliente que consulta
// Supabase al cargar, así que nunca está desfasado.
//
// /sitemap.xml tampoco: estaba en esta lista y no servía de nada —el endpoint
// respondía que lo había revalidado y el archivo seguía igual—. Ahora se
// genera en cada petición, así que no hay nada que invalidar.
const RUTAS_BASE = ["/blog", "/en/blog"];

/**
 * Invalida la caché de las rutas del blog.
 *
 *   curl -X POST "https://ketingmedia.com/api/admin/revalidate?secret=XXX"
 *   curl -X POST "https://ketingmedia.com/api/admin/revalidate?secret=XXX&slug=mi-articulo"
 *
 * Con `slug` añade también /blog/<slug>. Sin él, solo los índices.
 */
export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const auth = req.headers.get("authorization");
    const secret = url.searchParams.get("secret");

    if (!CRON_SECRET || (auth !== `Bearer ${CRON_SECRET}` && secret !== CRON_SECRET)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = url.searchParams.get("slug");
    // Sanea el slug: solo lo que puede ser un slug real. Sin esto, un valor con
    // ".." o "/" pediría revalidar rutas arbitrarias del sitio.
    const slugLimpio = slug && /^[a-z0-9-]{1,120}$/.test(slug) ? slug : null;

    const rutas = [...RUTAS_BASE];
    if (slugLimpio) rutas.push(`/blog/${slugLimpio}`);

    for (const ruta of rutas) revalidatePath(ruta);

    return NextResponse.json({
        revalidated: rutas,
        ...(slug && !slugLimpio ? { aviso: "slug ignorado por formato inválido" } : {}),
    });
}
