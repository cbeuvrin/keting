import { NextResponse } from "next/server";
import { esCorreoEnviable, selectAll, crmAdmin, SERVICE_LABELS } from "@/lib/crm";
import { loadPersonalCopy, loadSeguimientoCopy, type PersonalCopy } from "@/lib/crm-settings";
import type { Lead, LeadService } from "@/lib/crm";
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
//
// SEGUIMIENTO: después de la tanda de correos iniciales, una segunda pasada
// manda un recordatorio corto a quien abrió el inicial hace unos días y no ha
// recibido ya un seguimiento. Uno por lead, nunca dos: en cuanto sale, ese
// lead queda fuera para siempre de esta segunda pasada (ver `kind` en
// crm_emails). No se basa en si respondió —eso el cron no lo sabe— sino en si
// alguien más avanzado (ganado/perdido) ya cerró el trato a mano en el panel.

export const maxDuration = 300;

// Cuántos correos como máximo salen hoy de cada grupo, en este orden.
//
// Antes esto era un simple orden de prioridad con un tope único: el primer
// grupo se comía la tanda entera y el segundo no veía un correo hasta que el
// primero se vaciaba. Con cupos se trabajan dos listas a la vez y cada una
// avanza a un ritmo conocido — 20 al día son 4 días hábiles por cada 80
// contactos, y eso se puede prometer.
//
// Solo sale quien está en esta lista. Un contacto sin servicio asignado NO
// recibe nada: heredaría el texto general —el de "podemos mejorar tu web"— y
// mandarle eso a una cámara de comercio es peor que no escribirle. Para que
// un grupo empiece a salir hay que clasificarlo y darle su cupo aquí.
const CUPOS: { service: LeadService; cupo: number }[] = [
    { service: "asociaciones", cupo: 20 },
    { service: "eventos", cupo: 20 },
];
const TANDA = CUPOS.reduce((n, c) => n + c.cupo, 0);
const PAUSA_MS = 700;
// Margen para no chocar con el límite de la función: si se acaba el tiempo,
// se corta y se reporta lo enviado en vez de morir a media tanda.
const LIMITE_MS = 240_000;

// Cuántos seguimientos como máximo salen hoy, y a partir de cuántos días de
// abierto un inicial ya es candidato. 4 días hábiles da margen a que
// conteste antes de recordárselo — antes de eso es apurar, no dar seguimiento.
const SEGUIMIENTO_CUPO = 20;
const SEGUIMIENTO_DIAS = 4;
// Etapas donde el trato ya se cerró a mano en el panel: insistir ahí no suma.
const SEGUIMIENTO_ETAPAS_EXCLUIDAS = new Set(["ganado", "perdido"]);

const REPORTE_A = process.env.CRON_REPORT_TO || "djbeuvrin@gmail.com";

type Enviado = {
    id: string;
    service: LeadService | null;
    name: string;
    email: string;
    ok: boolean;
    detalle?: string;
    asunto: string;
    kind: "inicial" | "seguimiento";
};

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

    // A quién ya se le escribió alguna vez, y con qué historial de aperturas y
    // seguimientos. Va paginado a propósito: con el límite de 1.000 de
    // Supabase, en cuanto el historial pase de mil correos un `.select` corto
    // dejaría fuera a los primeros y se les volvería a escribir.
    const previos = await selectAll<{ lead_id: string; kind: string | null; opened_at: string | null }>(
        "crm_emails", "lead_id, kind, opened_at"
    );
    const yaEscritos = new Set(previos.map((m) => m.lead_id));
    // Primera apertura conocida de un correo INICIAL (no cuenta la del
    // seguimiento) y quién ya recibió su seguimiento — nunca sale un segundo.
    const inicialAbierto = new Map<string, string>();
    const yaSeguimiento = new Set<string>();
    for (const m of previos) {
        if (m.kind === "seguimiento") yaSeguimiento.add(m.lead_id);
        else if (m.opened_at && !inicialAbierto.has(m.lead_id)) inicialAbierto.set(m.lead_id, m.opened_at);
    }

    let todos: Lead[];
    try {
        todos = (await selectAll<Lead>(
            "crm_leads",
            "id, name, email, company, service, stage, unsubscribed",
            { campo: "created_at", ascendente: true }
        )).filter((l) => l.email && !l.unsubscribed);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }

    // Fuera los que rebotarían: direcciones rotas o con el dominio mal
    // tecleado en el CSV de origen. Quedan en el CRM para arreglarlos a mano.
    const pendientes = todos.filter((l) => !yaEscritos.has(l.id) && esCorreoEnviable(l.email));

    // Quién sale hoy: el cupo de cada grupo, en el orden de CUPOS.
    //
    // `pendientes` ya viene por created_at ascendente, así que dentro de cada
    // grupo salen siempre los más viejos primero.
    const tanda: Lead[] = [];
    for (const { service, cupo } of CUPOS) {
        tanda.push(...pendientes.filter((l) => l.service === service).slice(0, cupo));
    }

    // Candidatos a seguimiento: abrieron su inicial hace SEGUIMIENTO_DIAS o
    // más, nunca recibieron ya uno, y el trato no está cerrado a mano en el
    // panel. Ordenados por apertura más vieja primero — quien lleva más
    // tiempo esperando pasa antes.
    const corteSeguimiento = arranque - SEGUIMIENTO_DIAS * 24 * 60 * 60 * 1000;
    const tandaSeguimiento: Lead[] = todos
        .filter((l) => {
            if (yaSeguimiento.has(l.id) || SEGUIMIENTO_ETAPAS_EXCLUIDAS.has(l.stage)) return false;
            if (!esCorreoEnviable(l.email)) return false;
            const abierto = inicialAbierto.get(l.id);
            return Boolean(abierto) && new Date(abierto!).getTime() <= corteSeguimiento;
        })
        .sort((a, b) => inicialAbierto.get(a.id)!.localeCompare(inicialAbierto.get(b.id)!))
        .slice(0, SEGUIMIENTO_CUPO);

    // Nada que hacer hoy en ninguna de las dos pasadas: se termina en
    // silencio, sin correo de aviso — el silencio significa "no tocaba".
    if (tanda.length === 0 && tandaSeguimiento.length === 0) {
        return NextResponse.json({ ok: true, enviados: 0, motivo: "nada pendiente hoy" });
    }

    // Un texto por servicio, cargado una sola vez por grupo presente en cada tanda.
    const serviciosIniciales = [...new Set(tanda.map((l) => (l.service ?? null) as LeadService | null))];
    const textos = new Map<string, PersonalCopy>();
    for (const sv of serviciosIniciales) {
        textos.set(sv ?? "", await loadPersonalCopy(sv));
    }
    const serviciosSeguimiento = [...new Set(tandaSeguimiento.map((l) => (l.service ?? null) as LeadService | null))];
    const textosSeguimiento = new Map<string, PersonalCopy>();
    for (const sv of serviciosSeguimiento) {
        textosSeguimiento.set(sv ?? "", await loadSeguimientoCopy(sv));
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
        resultados.push({
            id: lead.id,
            service: (lead.service ?? null) as LeadService | null,
            name: lead.name,
            email: lead.email as string,
            ok,
            detalle,
            asunto: copy.subject,
            kind: "inicial",
        });

        await new Promise((r) => setTimeout(r, PAUSA_MS));
    }

    // Segunda pasada: el recordatorio corto a quien abrió y no ha recibido ya
    // uno. Mismo mecanismo de envío, pero con `kind: "seguimiento"` en la fila
    // para que nunca vuelva a entrar aquí.
    for (const lead of tandaSeguimiento) {
        if (Date.now() - arranque > LIMITE_MS) break;
        const copy = textosSeguimiento.get((lead.service ?? "") as string) ?? textosSeguimiento.get("")!;

        const { data: fila } = await db
            .from("crm_emails")
            .insert({
                lead_id: lead.id,
                to_email: lead.email as string,
                subject: copy.subject,
                body: copy.body,
                kind: "seguimiento",
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
            await db.from("crm_emails").delete().eq("id", fila.id);
        }
        resultados.push({
            id: lead.id,
            service: (lead.service ?? null) as LeadService | null,
            name: lead.name,
            email: lead.email as string,
            ok,
            detalle,
            asunto: copy.subject,
            kind: "seguimiento",
        });

        await new Promise((r) => setTimeout(r, PAUSA_MS));
    }

    const iniciales = resultados.filter((r) => r.kind === "inicial");
    const seguimientos = resultados.filter((r) => r.kind === "seguimiento");
    const enviados = resultados.filter((r) => r.ok);
    const fallidos = resultados.filter((r) => !r.ok);
    // Lo que queda, contado solo sobre los grupos que SÍ salen: un total que
    // incluyera a los contactos sin clasificar sería un número que nunca baja.
    const yaSalieron = new Set(iniciales.filter((r) => r.ok).map((r) => r.id));
    const conCupo = pendientes.filter(
        (l) => CUPOS.some((c) => c.service === l.service) && !yaSalieron.has(l.id)
    );
    const restan = conCupo.length;
    const restanPorGrupo = CUPOS.map(({ service }) => {
        const n = conCupo.filter((l) => l.service === service).length;
        return n > 0 ? `${SERVICE_LABELS[service]}: ${n}` : "";
    }).filter(Boolean);
    // Los que están en el CRM pero no saldrán nunca mientras no se clasifiquen.
    const sinClasificar = pendientes.filter((l) => !CUPOS.some((c) => c.service === l.service)).length;

    // Reporte a Carlos: qué salió hoy y cuánto queda, inicial y seguimiento
    // por separado — son dos conversaciones distintas.
    const listar = (rs: Enviado[]) =>
        rs.map((r) => `${r.ok ? "✓" : "✕"} ${r.name} · ${r.email}${r.detalle ? ` — ${r.detalle}` : ""}`).join("\n");
    const asuntos = [...new Set(iniciales.map((r) => r.asunto))];
    const cuerpo = `Envío automático de hoy.

Enviados: ${enviados.length}${fallidos.length ? ` · Con error: ${fallidos.length}` : ""} (${iniciales.length} iniciales, ${seguimientos.length} seguimientos)
Quedan pendientes: ${restan}${restanPorGrupo.length ? `\n${restanPorGrupo.join("\n")}` : ""}${sinClasificar > 0 ? `\n\nSin clasificar (no reciben nada): ${sinClasificar}` : ""}

${asuntos.length ? `Asunto${asuntos.length > 1 ? "s" : ""} inicial${asuntos.length > 1 ? "es" : ""}: ${asuntos.join(" · ")}\n\n` : ""}${iniciales.length ? `Iniciales:\n${listar(iniciales)}` : ""}${iniciales.length && seguimientos.length ? "\n\n" : ""}${seguimientos.length ? `Seguimientos:\n${listar(seguimientos)}` : ""}

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
        iniciales: iniciales.length,
        seguimientos: seguimientos.length,
        fallidos: fallidos.length,
        restan,
    });
}
