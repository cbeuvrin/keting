import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";

export const runtime = "nodejs";

/** Alta manual de un lead desde el tablero. */
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const { name, email, phone, company } = await request.json().catch(() => ({}));
    if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
    }

    const { data, error } = await crmAdmin()
        .from("crm_leads")
        .insert({
            name: name.trim(),
            email: typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null,
            phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
            company: typeof company === "string" && company.trim() ? company.trim() : null,
            source: "manual",
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lead: data });
}
