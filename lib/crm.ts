import { createClient } from "@supabase/supabase-js";

// ── CRM: acceso a datos (solo servidor) ──────────────────────────────────────
// Este módulo usa la SERVICE ROLE KEY, que salta el RLS: no debe importarse
// jamás desde un componente cliente. Las tablas viven en scripts/crm-schema.sql.

export type LeadStage = "nuevo" | "contactado" | "propuesta" | "ganado" | "perdido";
export type LeadSource = "manual" | "contacto" | "testimonio";

export type Lead = {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    source: LeadSource;
    stage: LeadStage;
    message: string | null;
    interests: string | null;
    list_name: string | null;
    unsubscribed: boolean;
};

export type LeadNote = {
    id: string;
    lead_id: string;
    created_at: string;
    body: string;
};

export type LeadEmail = {
    id: string;
    lead_id: string;
    created_at: string;
    to_email: string;
    subject: string;
    body: string;
    resend_id: string | null;
    opened_at: string | null;
};

export const LEAD_STAGES: readonly LeadStage[] = ["nuevo", "contactado", "propuesta", "ganado", "perdido"];

export const STAGE_LABELS: Record<LeadStage, string> = {
    nuevo: "Nuevo",
    contactado: "Contactado",
    propuesta: "Propuesta",
    ganado: "Ganado",
    perdido: "Perdido",
};

export function crmAdmin() {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Captura un lead que llega de un formulario público.
 * Si ya existe un lead con ese correo, NO duplica: le añade una nota con el
 * mensaje nuevo (la conversación continúa en la misma ficha). Nunca lanza:
 * la captura es secundaria y jamás debe romper el envío del formulario.
 */
export async function captureLead(input: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source: LeadSource;
    message?: string;
    interests?: string;
}): Promise<void> {
    try {
        const db = crmAdmin();
        const email = input.email?.trim().toLowerCase() || null;

        if (email) {
            const { data: existing } = await db
                .from("crm_leads")
                .select("id")
                .eq("email", email)
                .limit(1)
                .maybeSingle();
            if (existing) {
                await db.from("crm_notes").insert({
                    lead_id: existing.id,
                    body: `Nuevo mensaje desde el formulario (${input.source}):\n${input.message ?? "(sin mensaje)"}`,
                });
                await db
                    .from("crm_leads")
                    .update({ updated_at: new Date().toISOString() })
                    .eq("id", existing.id);
                return;
            }
        }

        await db.from("crm_leads").insert({
            name: input.name,
            email,
            phone: input.phone || null,
            company: input.company || null,
            source: input.source,
            message: input.message || null,
            interests: input.interests || null,
        });
    } catch (err) {
        console.error("[crm] captura de lead fallida (no bloqueante):", err);
    }
}
