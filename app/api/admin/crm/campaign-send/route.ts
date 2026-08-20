import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";
import { buildEmailHtml, unsubscribeHeaders } from "@/lib/email-html";
import { prototipoWebEmail } from "@/lib/email-templates/prototipo-web";
import { loadPrototipoCopy } from "@/lib/crm-settings";
import { personalEmail } from "@/lib/email-templates/personal";

export const runtime = "nodejs";

// Envío de campaña: UN destinatario por petición — el panel recorre la lista
// en fila con pausa entre envíos, así que aquí nunca hay bucles largos que
// choquen con el límite de tiempo de Vercel.
//
// Transporte: Resend con la cuenta de KETING (variables RESEND_KETING_*,
// deliberadamente distintas de RESEND_API_KEY, que es de Toogo y no debe
// tocarse). El uno-a-uno de la ficha va por Banahost; esto es solo campañas.
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const apiKey = process.env.RESEND_KETING_API_KEY;
    const from = process.env.RESEND_KETING_FROM;
    if (!apiKey || !from) {
        return NextResponse.json(
            { error: "Falta conectar el Resend de Keting (RESEND_KETING_API_KEY / RESEND_KETING_FROM)" },
            { status: 500 }
        );
    }

    const { lead_id, subject, body, template, firma, conLogo } = await request.json().catch(() => ({}));
    // Con la plantilla de diseño el cuerpo lo pone ella; en personal y en texto
    // simple lo escribe Carlos, así que es obligatorio.
    const usesTemplate = template === "prototipo-web";
    const esPersonal = template === "personal";
    if (
        typeof lead_id !== "string" ||
        typeof subject !== "string" ||
        !subject.trim() ||
        (!usesTemplate && (typeof body !== "string" || !body.trim()))
    ) {
        return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    const bodyText = usesTemplate ? "[plantilla: prototipo-web]" : (body as string).trim();

    const db = crmAdmin();
    const { data: lead } = await db
        .from("crm_leads")
        .select("id, email, name, company, unsubscribed")
        .eq("id", lead_id)
        .maybeSingle();
    if (!lead?.email) return NextResponse.json({ error: "Sin correo" }, { status: 400 });
    if (lead.unsubscribed) return NextResponse.json({ error: "Dado de baja" }, { status: 409 });

    // La fila del correo se crea ANTES de enviar para tener su id, que viaja
    // dentro del HTML como pixel de apertura.
    const { data: emailRow, error: insErr } = await db
        .from("crm_emails")
        .insert({ lead_id, to_email: lead.email, subject: subject.trim(), body: bodyText })
        .select("id")
        .single();
    if (insErr || !emailRow) return NextResponse.json({ error: insErr?.message ?? "DB" }, { status: 500 });

    // El correo personal manda también versión de texto: es lo que lo hace
    // parecer escrito a mano en los clientes que prefieren texto plano.
    const personal = esPersonal
        ? personalEmail({
              lead: { name: lead.name, company: lead.company ?? null, email: lead.email },
              body: bodyText,
              firma: typeof firma === "string" && firma.trim() ? firma.trim() : "Carlos Beuvrin",
              emailId: emailRow.id,
              leadId: lead.id,
              conLogo: conLogo !== false,
          })
        : null;

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            from: `Keting Media <${from}>`,
            to: [lead.email],
            reply_to: "info@ketingmedia.com",
            subject: subject.trim(),
            html: personal
                ? personal.html
                : usesTemplate
                  ? prototipoWebEmail({ name: lead.name, emailId: emailRow.id, leadId: lead.id, copy: await loadPrototipoCopy() })
                  : buildEmailHtml({ bodyText: bodyText, emailId: emailRow.id, leadId: lead.id }),
            ...(personal ? { text: personal.text } : {}),
            headers: unsubscribeHeaders(lead.id),
        }),
    });

    if (!res.ok) {
        // Si Resend rechazó, la fila no debe quedar como "enviado".
        await db.from("crm_emails").delete().eq("id", emailRow.id);
        const detail = await res.text().catch(() => "");
        return NextResponse.json({ error: `Resend ${res.status}: ${detail.slice(0, 200)}` }, { status: 502 });
    }
    const sent = (await res.json()) as { id?: string };
    await db.from("crm_emails").update({ resend_id: sent.id ?? null }).eq("id", emailRow.id);
    await db.from("crm_leads").update({ updated_at: new Date().toISOString() }).eq("id", lead_id);

    return NextResponse.json({ ok: true });
}
