import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";
import { PROTOTIPO_SETTINGS_KEY, NETWORKING_SETTINGS_KEY, personalKey, PERSONAL_DEFAULT_COPY, type PersonalCopy, type NetworkingCopy } from "@/lib/crm-settings";
import { LEAD_SERVICES, type LeadService } from "@/lib/crm";
import { PROTOTIPO_DEFAULT_COPY, type PrototipoCopy } from "@/lib/email-templates/prototipo-web";

export const runtime = "nodejs";

/** Guarda los textos editados de una plantilla (solo campos conocidos). */
export async function POST(request: Request) {
    if (!(await isAdminRequest())) return NextResponse.json({ error: "no" }, { status: 401 });

    const body = await request.json().catch(() => ({}));

    // Networking: el mismo correo personal más el texto de WhatsApp.
    if (body?.template === "networking") {
        const limpio: Partial<NetworkingCopy> = {};
        for (const key of ["subject", "saludo", "body", "firma", "whatsapp"] as const) {
            if (typeof body[key] === "string" && body[key].trim()) {
                limpio[key] = body[key].trim().slice(0, 5000);
            }
        }
        if (typeof body.conLogo === "boolean") limpio.conLogo = body.conLogo;
        if (typeof body.conFoto === "boolean") limpio.conFoto = body.conFoto;

        const { error } = await crmAdmin()
            .from("crm_settings")
            .upsert({ key: NETWORKING_SETTINGS_KEY, value: limpio, updated_at: new Date().toISOString() });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
    }

    // Correo personal: cuerpo, saludo, firma, asunto y si lleva logo.
    if (body?.template === "personal") {
        const limpio: Partial<PersonalCopy> = {};
        for (const key of ["subject", "saludo", "body", "firma"] as const) {
            if (typeof body[key] === "string" && body[key].trim()) {
                limpio[key] = body[key].trim().slice(0, 5000);
            }
        }
        if (typeof body.conLogo === "boolean") limpio.conLogo = body.conLogo;

        const svc = LEAD_SERVICES.includes(body?.service as LeadService)
            ? (body.service as LeadService)
            : null;
        const { error } = await crmAdmin()
            .from("crm_settings")
            .upsert({ key: personalKey(svc), value: limpio, updated_at: new Date().toISOString() });
        if (error) {
            return NextResponse.json(
                { error: `${error.message} — ¿ya pegaste scripts/crm-schema-3.sql en Supabase?` },
                { status: 500 }
            );
        }
        return NextResponse.json({ ok: true });
    }

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
