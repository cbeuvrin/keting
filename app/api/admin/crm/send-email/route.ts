import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";
import { buildEmailHtml, unsubscribeHeaders } from "@/lib/email-html";

export const runtime = "nodejs";

// Envío uno a uno desde la ficha, por el SMTP de Banahost — el mismo transporte
// que el formulario de contacto. (Las campañas a listas van por otra ruta, con
// el Resend de Keting.) Lleva pixel de apertura y pie de baja, igual que las
// campañas, para que las métricas se midan parejo. Desde redes locales el
// puerto SMTP suele estar bloqueado y da timeout; en Vercel funciona.
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT) || 465;
    if (!host || !user || !pass) {
        return NextResponse.json({ error: "Falta configurar SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS)" }, { status: 500 });
    }

    const { lead_id, subject, body } = await request.json().catch(() => ({}));
    if (typeof lead_id !== "string" || typeof subject !== "string" || typeof body !== "string" || !subject.trim() || !body.trim()) {
        return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const db = crmAdmin();
    const { data: lead } = await db
        .from("crm_leads")
        .select("id, email, name, unsubscribed")
        .eq("id", lead_id)
        .maybeSingle();
    if (!lead?.email) return NextResponse.json({ error: "El lead no tiene correo" }, { status: 400 });
    if (lead.unsubscribed) {
        return NextResponse.json({ error: "Este contacto se dio de baja: el CRM no le envía correos" }, { status: 409 });
    }

    // La fila se crea antes del envío para que su id viaje como pixel.
    const { data: emailRow, error: insErr } = await db
        .from("crm_emails")
        .insert({ lead_id, to_email: lead.email, subject: subject.trim(), body: body.trim() })
        .select("id")
        .single();
    if (insErr || !emailRow) return NextResponse.json({ error: insErr?.message ?? "DB" }, { status: 500 });

    try {
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
        const info = await transporter.sendMail({
            from: `Keting Media <${user}>`,
            to: lead.email,
            replyTo: "info@ketingmedia.com",
            subject: subject.trim(),
            text: body.trim(),
            html: buildEmailHtml({ bodyText: body.trim(), emailId: emailRow.id, leadId: lead.id }),
            headers: unsubscribeHeaders(lead.id),
        });
        await db.from("crm_emails").update({ resend_id: info.messageId ?? null }).eq("id", emailRow.id);
        await db.from("crm_leads").update({ updated_at: new Date().toISOString() }).eq("id", lead_id);
        return NextResponse.json({ ok: true });
    } catch (err) {
        await db.from("crm_emails").delete().eq("id", emailRow.id);
        const detail = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: `SMTP: ${detail.slice(0, 200)}` }, { status: 502 });
    }
}
