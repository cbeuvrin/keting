import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Importación de contactos desde CSV (el parseo se hace en el navegador; aquí
 * llegan filas ya estructuradas). Dedupe por correo: los que ya existen no se
 * duplican — solo se les asigna la lista si no tenían una.
 */
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const { list_name, rows } = await request.json().catch(() => ({}));
    if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: "Sin filas que importar" }, { status: 400 });
    }
    if (rows.length > 2000) {
        return NextResponse.json({ error: "Máximo 2000 filas por importación" }, { status: 400 });
    }
    const list = typeof list_name === "string" && list_name.trim() ? list_name.trim() : null;

    // Filas válidas y sin repetidos dentro del propio archivo
    const seen = new Set<string>();
    const clean: { name: string; email: string; phone: string | null; company: string | null }[] = [];
    let invalid = 0;
    for (const row of rows) {
        const email = String(row?.email ?? "").trim().toLowerCase();
        if (!EMAIL_RE.test(email) || seen.has(email)) {
            invalid++;
            continue;
        }
        seen.add(email);
        clean.push({
            name: String(row?.name ?? "").trim() || email.split("@")[0],
            email,
            phone: String(row?.phone ?? "").trim() || null,
            company: String(row?.company ?? "").trim() || null,
        });
    }
    if (clean.length === 0) {
        return NextResponse.json({ error: "Ninguna fila tiene un correo válido" }, { status: 400 });
    }

    const db = crmAdmin();
    const { data: existingRows, error: exErr } = await db
        .from("crm_leads")
        .select("email, list_name")
        .in("email", clean.map((r) => r.email));
    if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 });

    const existing = new Map((existingRows ?? []).map((r) => [r.email as string, r]));
    const toInsert = clean.filter((r) => !existing.has(r.email));

    if (toInsert.length > 0) {
        const { error } = await db.from("crm_leads").insert(
            toInsert.map((r) => ({ ...r, source: "csv", list_name: list }))
        );
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // A los ya existentes sin lista, se les pone la de esta importación.
    if (list) {
        const orphans = (existingRows ?? []).filter((r) => !r.list_name).map((r) => r.email as string);
        if (orphans.length > 0) {
            await db.from("crm_leads").update({ list_name: list }).in("email", orphans);
        }
    }

    return NextResponse.json({
        inserted: toInsert.length,
        existing: existing.size,
        invalid,
    });
}
