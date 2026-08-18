import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin, LEAD_STAGES, type LeadStage } from "@/lib/crm";

export const runtime = "nodejs";

/** Actualiza un lead (por ahora: cambiar de etapa y editar datos básicos). */
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
    for (const field of ["name", "email", "phone", "company"] as const) {
        if (typeof body[field] === "string") patch[field] = body[field].trim() || null;
    }

    const { error } = await crmAdmin().from("crm_leads").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
