import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin, isMissingColumn, LEAD_SERVICES, type LeadService } from "@/lib/crm";

export const runtime = "nodejs";

/** Alta manual de un lead desde el tablero. */
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const { name, email, phone, company, service } = await request.json().catch(() => ({}));
    if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
    }

    const db = crmAdmin();
    const base = {
        name: name.trim(),
        email: typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null,
        phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
        company: typeof company === "string" && company.trim() ? company.trim() : null,
        source: "manual",
    };
    const svc = LEAD_SERVICES.includes(service as LeadService) ? service : null;

    let { data, error } = await db.from("crm_leads").insert({ ...base, service: svc }).select().single();
    // Sin la migración de `service` todavía aplicada, se guarda sin ese campo.
    if (isMissingColumn(error, "service")) {
        ({ data, error } = await db.from("crm_leads").insert(base).select().single());
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lead: data });
}
