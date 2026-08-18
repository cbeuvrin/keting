import { NextResponse } from "next/server";
import { crmAdmin } from "@/lib/crm";

export const runtime = "nodejs";

const PAGE = (title: string, body: string) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/><title>${title}</title></head>
<body style="margin:0;background:#fafafa;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1d1d1f;">
<div style="max-width:480px;margin:18vh auto 0;padding:0 24px;text-align:center;">
<div style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#8e8e93;margin-bottom:16px;">Keting Media</div>
<h1 style="font-size:26px;margin:0 0 12px;">${title}</h1>
<p style="color:#6e6e73;line-height:1.6;">${body}</p>
</div></body></html>`;

// Baja en un clic. GET para que funcione desde cualquier cliente de correo, y
// también responde POST (List-Unsubscribe-Post de Gmail/Yahoo).
async function unsubscribe(id: string): Promise<boolean> {
    if (!/^[0-9a-f-]{36}$/.test(id)) return false;
    try {
        const { error } = await crmAdmin().from("crm_leads").update({ unsubscribed: true }).eq("id", id);
        return !error;
    } catch {
        return false;
    }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const ok = await unsubscribe((await params).id);
    return new NextResponse(
        ok
            ? PAGE("Listo, quedaste fuera", "No volverás a recibir correos nuestros. Si fue un error, escríbenos a info@ketingmedia.com y te reactivamos.")
            : PAGE("Enlace no válido", "Este enlace de baja no corresponde a ningún contacto. Si quieres dejar de recibir correos, escríbenos a info@ketingmedia.com."),
        { status: ok ? 200 : 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
    return GET(req, ctx);
}
