import { NextResponse } from "next/server";
import { crmAdmin } from "@/lib/crm";

export const runtime = "nodejs";

// Pixel de apertura: GIF de 1×1 que los clientes de correo cargan al mostrar
// el mensaje. Ruta pública SIN auth — el "secreto" es el propio id (uuid
// inadivinable) y lo único que puede hacer es marcar una apertura.
// Honestidad del dato: Apple Mail y Gmail pre-cargan imágenes, así que esto
// mide "probablemente abierto", no una certeza.
const GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (/^[0-9a-f-]{36}$/.test(id)) {
        try {
            await crmAdmin()
                .from("crm_emails")
                .update({ opened_at: new Date().toISOString() })
                .eq("id", id)
                .is("opened_at", null);
        } catch {
            // El pixel jamás falla hacia fuera: siempre devuelve la imagen.
        }
    }
    return new NextResponse(GIF, {
        headers: {
            "Content-Type": "image/gif",
            "Cache-Control": "no-store, max-age=0",
        },
    });
}
