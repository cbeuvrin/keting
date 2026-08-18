import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";

export const runtime = "nodejs";

export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const { lead_id, body } = await request.json().catch(() => ({}));
    if (typeof lead_id !== "string" || typeof body !== "string" || !body.trim()) {
        return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const db = crmAdmin();
    const { error } = await db.from("crm_notes").insert({ lead_id, body: body.trim() });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await db.from("crm_leads").update({ updated_at: new Date().toISOString() }).eq("id", lead_id);
    return NextResponse.json({ ok: true });
}
