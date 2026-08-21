import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin, isMissingColumn, LEAD_STAGES, LEAD_SERVICES, type LeadStage, type LeadService } from "@/lib/crm";

export const runtime = "nodejs";

const UUID = /^[0-9a-f-]{36}$/;

/**
 * Cambios en lote sobre varios contactos: etapa, servicio, lista, baja — o
 * borrarlos. Solo acepta los campos que tienen sentido cambiar a muchos a la
 * vez: nombre, correo y teléfono son de cada persona y se editan uno a uno.
 */
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const { ids, action, stage, service, list_name, unsubscribed } = await request
        .json()
        .catch(() => ({}));

    if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: "Sin contactos seleccionados" }, { status: 400 });
    }
    const limpios = ids.filter((id) => typeof id === "string" && UUID.test(id)).slice(0, 2000);
    if (limpios.length === 0) {
        return NextResponse.json({ error: "Selección inválida" }, { status: 400 });
    }

    const db = crmAdmin();

    if (action === "delete") {
        const { error } = await db.from("crm_leads").delete().in("id", limpios);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true, afectados: limpios.length });
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (stage !== undefined) {
        if (!LEAD_STAGES.includes(stage as LeadStage)) {
            return NextResponse.json({ error: "Etapa inválida" }, { status: 400 });
        }
        patch.stage = stage;
    }
    if (service !== undefined) {
        // "" limpia el servicio del grupo.
        patch.service = LEAD_SERVICES.includes(service as LeadService) ? service : null;
    }
    if (typeof list_name === "string") patch.list_name = list_name.trim() || null;
    if (typeof unsubscribed === "boolean") patch.unsubscribed = unsubscribed;

    if (Object.keys(patch).length === 1) {
        return NextResponse.json({ error: "Nada que cambiar" }, { status: 400 });
    }

    let { error } = await db.from("crm_leads").update(patch).in("id", limpios);
    if (isMissingColumn(error, "service")) {
        const { service: _omit, ...resto } = patch;
        ({ error } = await db.from("crm_leads").update(resto).in("id", limpios));
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, afectados: limpios.length });
}
