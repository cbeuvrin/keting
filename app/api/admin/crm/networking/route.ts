import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin, isMissingColumn, LEAD_SERVICES, type LeadService } from "@/lib/crm";
import { loadNetworkingCopy } from "@/lib/crm-settings";
import { personalEmail, fillVars, varsFor } from "@/lib/email-templates/personal";
import { unsubscribeHeaders } from "@/lib/email-html";

export const runtime = "nodejs";

// Captura en un evento: guarda el contacto y le manda el correo AL INSTANTE,
// sin esperar a la tanda de las 11. La gracia está en que le llegue mientras
// todavía te tiene delante.
//
// El WhatsApp no se manda desde aquí a propósito: hacerlo automático desde un
// número personal obliga a registrarlo en la API oficial —que lo inhabilita
// para la app— o a una librería no oficial que arriesga el baneo. En vez de
// eso se devuelve el enlace con el mensaje ya escrito, y sale del número real
// de un toque.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const evento = typeof body.evento === "string" ? body.evento.trim() : "";
    const service = LEAD_SERVICES.includes(body.service as LeadService) ? body.service : null;

    if (!name && !email && !phone) {
        return NextResponse.json({ error: "Hace falta al menos un nombre, correo o teléfono" }, { status: 400 });
    }
    if (email && !EMAIL_RE.test(email)) {
        return NextResponse.json({ error: "Ese correo no parece válido" }, { status: 400 });
    }

    const db = crmAdmin();

    // Si ya existe por correo, se reutiliza en vez de duplicar: en un evento es
    // fácil volver a escanear a alguien que ya tienes.
    let lead: { id: string; name: string; company: string | null; email: string | null } | null = null;
    if (email) {
        const { data } = await db.from("crm_leads").select("id, name, company, email").eq("email", email).maybeSingle();
        if (data) {
            lead = data;
            await db
                .from("crm_leads")
                .update({ phone: phone || undefined, company: company || undefined, updated_at: new Date().toISOString() })
                .eq("id", data.id);
        }
    }

    if (!lead) {
        const base = {
            name: name || email || phone,
            email: email || null,
            phone: phone || null,
            company: company || null,
            source: "networking",
            list_name: evento || null,
        };
        let { data, error } = await db.from("crm_leads").insert({ ...base, service }).select("id, name, company, email").single();
        if (isMissingColumn(error, "service")) {
            ({ data, error } = await db.from("crm_leads").insert(base).select("id, name, company, email").single());
        }
        if (error || !data) return NextResponse.json({ error: error?.message ?? "No se pudo guardar" }, { status: 500 });
        lead = data;
    }

    const copy = await loadNetworkingCopy();
    const vars = varsFor({ name: lead.name, company: lead.company, email: lead.email });
    const mensajeWa = fillVars(copy.whatsapp, vars).text.trim();

    // A quien ya se le escribió alguna vez no se le vuelve a escribir solo:
    // ni por un doble escaneo del mismo QR, ni por reencontrarlo en otro
    // evento meses después. Un segundo correo solo sale si Carlos lo manda a
    // mano desde Campaña, que es su autorización explícita.
    let yaTenia = false;
    if (lead.email) {
        const { data: previo } = await db
            .from("crm_emails")
            .select("id")
            .eq("lead_id", lead.id)
            .limit(1);
        yaTenia = Boolean(previo?.length);
    }

    // Correo inmediato, si dio correo.
    let correoEnviado = false;
    let correoError = "";
    const apiKey = process.env.RESEND_KETING_API_KEY;
    const from = process.env.RESEND_KETING_FROM;

    if (lead.email && !yaTenia && apiKey && from) {
        const { data: fila } = await db
            .from("crm_emails")
            .insert({ lead_id: lead.id, to_email: lead.email, subject: copy.subject, body: copy.body })
            .select("id")
            .single();
        if (fila) {
            const correo = personalEmail({
                lead: { name: lead.name, company: lead.company, email: lead.email },
                body: copy.body,
                firma: copy.firma,
                saludo: copy.saludo,
                emailId: fila.id,
                leadId: lead.id,
                conLogo: copy.conLogo,
                conFoto: copy.conFoto,
            });
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: `Carlos Beuvrin <${from}>`,
                    to: [lead.email],
                    reply_to: "info@ketingmedia.com",
                    subject: copy.subject,
                    html: correo.html,
                    text: correo.text,
                    headers: unsubscribeHeaders(lead.id),
                }),
            });
            if (res.ok) correoEnviado = true;
            else {
                // Sin borrar la fila no cuadraría el historial: el correo no salió.
                await db.from("crm_emails").delete().eq("id", fila.id);
                correoError = (await res.text().catch(() => "")).slice(0, 140);
            }
        }
    } else if (lead.email && !yaTenia) {
        correoError = "Falta configurar Resend";
    }

    return NextResponse.json({
        ok: true,
        leadId: lead.id,
        nombre: lead.name,
        correoEnviado,
        correoError,
        yaTenia,
        mensajeWa,
    });
}
