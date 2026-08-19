import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin, LEAD_STAGES, type LeadStage } from "@/lib/crm";

export const runtime = "nodejs";

/** Actualiza un lead: etapa, datos básicos o su estado de baja. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });
    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.stage !== undefined) {
        if (!LEAD_STAGES.includes(body.stage as LeadStage)) {
            return NextResponse.json({ error: "Etapa inválida" }, { status: 400 });
        }
        patch.stage = body.stage;
    }
    if (typeof body.unsubscribed === "boolean") patch.unsubscribed = body.unsubscribed;

    for (const field of ["name", "email", "phone", "company", "list_name"] as const) {
        if (typeof body[field] === "string") {
            const value = body[field].trim();
            // El nombre es obligatorio; el resto puede vaciarse a null.
            if (field === "name" && !value) {
                return NextResponse.json({ error: "El nombre no puede quedar vacío" }, { status: 400 });
            }
            if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
            }
            patch[field] = value || null;
        }
    }

    const { error } = await crmAdmin().from("crm_leads").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}

/** Borra un lead con sus notas y correos (cascade en el esquema). */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });
    const { id } = await params;
    const { error } = await crmAdmin().from("crm_leads").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
