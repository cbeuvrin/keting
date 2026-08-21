import { NextResponse } from "next/server";
import { crmAdmin } from "@/lib/crm";
import { loadPersonalCopy, type PersonalCopy } from "@/lib/crm-settings";
import type { LeadService } from "@/lib/crm";
import { personalEmail } from "@/lib/email-templates/personal";
import { unsubscribeHeaders } from "@/lib/email-html";

// ── Envío diario automático ──────────────────────────────────────────────────
// De lunes a viernes a las 11:00 de CDMX (17:00 UTC — México no cambia de
// horario desde 2022) sale una tanda a quienes nunca han recibido un correo.
// Los fines de semana no se envía: lo decide el propio cron en vercel.json.
// Si hay menos de la tanda, van los que haya; si no hay ninguno, no se hace
// nada y no se avisa —el silencio significa "no había a quién escribir"—,
// salvo que algo falle.
//
// CADA CONTACTO RECIBE EL TEXTO DE SU SERVICIO: a quien busca una app no se le
// puede escribir sobre mejorar su web. Se agrupa por servicio y cada grupo usa
// su propio texto guardado; los que no tienen uno propio heredan el general.

export const maxDuration = 300;

const TANDA = 25;
const PAUSA_MS = 700;
// Margen para no chocar con el límite de la función: si se acaba el tiempo,
// se corta y se reporta lo enviado en vez de morir a media tanda.
const LIMITE_MS = 240_000;

const REPORTE_A = process.env.CRON_REPORT_TO || "djbeuvrin@gmail.com";

type Enviado = { name: string; email: string; ok: boolean; detalle?: string; asunto: string };

async function resend(apiKey: string, payload: Record<string, unknown>) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return { ok: res.ok, detalle: res.ok ? "" : (await res.text().catch(() => "")).slice(0, 160) };
}

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const apiKey = process.env.RESEND_KETING_API_KEY;
    const from = process.env.RESEND_KETING_FROM;
    if (!apiKey || !from) {
        return NextResponse.json({ error: "Falta configurar Resend de Keting" }, { status: 500 });
    }

    const arranque = Date.now();
    const db = crmAdmin();

    // A quién ya se le escribió alguna vez.
    const { data: previos } = await db.from("crm_emails").select("lead_id");
    const yaEscritos = new Set((previos ?? []).map((m) => m.lead_id as string));

    const { data: todos, error } = await db
        .from("crm_leads")
        .select("id, name, email, company, service, unsubscribed")
        .not("email", "is", null)
        .eq("unsubscribed", false)
        .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const pendientes = (todos ?? []).filter((l) => !yaEscritos.has(l.id));
    if (pendientes.length === 0) {
        // Nadie a quien escribir: se termina en silencio, sin correo de aviso.
        return NextResponse.json({ ok: true, enviados: 0, motivo: "sin contactos pendientes" });
    }

    const tanda = pendientes.slice(0, TANDA);

    // Un texto por servicio, cargado una sola vez por grupo presente en la tanda.
    const servicios = [...new Set(tanda.map((l) => (l.service ?? null) as LeadService | null))];
    const textos = new Map<string, PersonalCopy>();
    for (const sv of servicios) {
        textos.set(sv ?? "", await loadPersonalCopy(sv));
    }

    const resultados: Enviado[] = [];

    for (const lead of tanda) {
        if (Date.now() - arranque > LIMITE_MS) break;
        const copy = textos.get((lead.service ?? "") as string) ?? textos.get("")!;

        // La fila se crea antes de enviar para que su id viaje como pixel.
        const { data: fila } = await db
            .from("crm_emails")
            .insert({
                lead_id: lead.id,
                to_email: lead.email as string,
                subject: copy.subject,
                body: copy.body,
            })
            .select("id")
            .single();
        if (!fila) continue;

        const correo = personalEmail({
            lead: { name: lead.name, company: lead.company ?? null, email: lead.email },
            body: copy.body,
            firma: copy.firma,
            saludo: copy.saludo,
            emailId: fila.id,
            leadId: lead.id,
            conLogo: copy.conLogo,
        });

        const { ok, detalle } = await resend(apiKey, {
            from: `Carlos Beuvrin <${from}>`,
            to: [lead.email],
            reply_to: "info@ketingmedia.com",
            subject: copy.subject,
            html: correo.html,
            text: correo.text,
            headers: unsubscribeHeaders(lead.id),
        });

        if (ok) {
            await db.from("crm_leads").update({ updated_at: new Date().toISOString() }).eq("id", lead.id);
        } else {
            // Si Resend lo rechazó, la fila no debe contar como enviada: así
            // mañana vuelve a entrar en la tanda en vez de perderse.
            await db.from("crm_emails").delete().eq("id", fila.id);
        }
        resultados.push({ name: lead.name, email: lead.email as string, ok, detalle, asunto: copy.subject });

        await new Promise((r) => setTimeout(r, PAUSA_MS));
    }

    const enviados = resultados.filter((r) => r.ok);
    const fallidos = resultados.filter((r) => !r.ok);
    const restan = pendientes.length - enviados.length;

    // Reporte a Carlos: qué salió hoy y cuánto queda.
    const lineas = resultados
        .map((r) => `${r.ok ? "✓" : "✕"} ${r.name} · ${r.email}${r.detalle ? ` — ${r.detalle}` : ""}`)
        .join("\n");
    const asuntos = [...new Set(resultados.map((r) => r.asunto))];
    const cuerpo = `Envío automático de hoy.

Enviados: ${enviados.length}${fallidos.length ? ` · Con error: ${fallidos.length}` : ""}
Quedan pendientes: ${restan}

Asunto${asuntos.length > 1 ? "s" : ""} usado${asuntos.length > 1 ? "s" : ""}: ${asuntos.join(" · ")}

${lineas}

—
Panel: https://ketingmedia.com/admin/contactos`;

    await resend(apiKey, {
        from: `CRM Keting <${from}>`,
        to: [REPORTE_A],
        subject: `CRM: ${enviados.length} correos enviados hoy${fallidos.length ? `, ${fallidos.length} con error` : ""}`,
        text: cuerpo,
    });

    return NextResponse.json({
        ok: true,
        enviados: enviados.length,
        fallidos: fallidos.length,
        restan,
    });
}
