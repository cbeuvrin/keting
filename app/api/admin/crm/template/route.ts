import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";
import { PROTOTIPO_SETTINGS_KEY } from "@/lib/crm-settings";
import { PROTOTIPO_DEFAULT_COPY, type PrototipoCopy } from "@/lib/email-templates/prototipo-web";

export const runtime = "nodejs";

/** Guarda los textos editados de la plantilla (solo campos conocidos). */
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const clean: Partial<PrototipoCopy> = {};
    for (const key of Object.keys(PROTOTIPO_DEFAULT_COPY) as (keyof PrototipoCopy)[]) {
        const v = body?.[key];
        if (key === "bullets") {
            if (Array.isArray(v)) {
                const bullets = v.map((b) => String(b).trim()).filter(Boolean).slice(0, 8);
                if (bullets.length) clean.bullets = bullets;
            }
        } else if (typeof v === "string" && v.trim()) {
            clean[key] = v.trim().slice(0, 2000) as never;
        }
    }

    const { error } = await crmAdmin()
        .from("crm_settings")
        .upsert({ key: PROTOTIPO_SETTINGS_KEY, value: clean, updated_at: new Date().toISOString() });
    if (error) {
        // Caso típico: falta correr scripts/crm-schema-3.sql
        return NextResponse.json(
            { error: `${error.message} — ¿ya pegaste scripts/crm-schema-3.sql en Supabase?` },
            { status: 500 }
        );
    }
    return NextResponse.json({ ok: true });
}
