import { createClient } from "@supabase/supabase-js";

// ── CRM: acceso a datos (solo servidor) ──────────────────────────────────────
// Este módulo usa la SERVICE ROLE KEY, que salta el RLS: no debe importarse
// jamás desde un componente cliente. Las tablas viven en scripts/crm-schema.sql.

export type LeadStage = "nuevo" | "contactado" | "propuesta" | "ganado" | "perdido";
export type LeadSource = "manual" | "contacto" | "testimonio" | "csv" | "networking";

export const LEAD_SOURCES: readonly LeadSource[] = ["networking", "contacto", "testimonio", "csv", "manual"];

/** Cómo entró cada contacto, dicho para quien lo lee en la tabla. */
export const SOURCE_LABELS: Record<LeadSource, string> = {
    networking: "Capturados en eventos",
    contacto: "Formulario de la web",
    testimonio: "Dejaron testimonio",
    csv: "Importados",
    manual: "Añadidos a mano",
};

/** Qué servicio le interesa al contacto. Eje independiente de la lista de
 *  origen y de la etapa del trato: agrupa para poder escribirle a cada uno lo
 *  que le corresponde. */
export type LeadService = "web" | "apps" | "eventos" | "personalizado";

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
    service: LeadService | null;
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

export const LEAD_SERVICES: readonly LeadService[] = ["web", "apps", "eventos", "personalizado"];

export const SERVICE_LABELS: Record<LeadService, string> = {
    web: "Sitio web",
    apps: "Apps",
    eventos: "Software para eventos",
    personalizado: "Personalizado",
};

/** Etiqueta corta, para las columnas estrechas de la tabla. */
export const SERVICE_SHORT: Record<LeadService, string> = {
    web: "Web",
    apps: "Apps",
    eventos: "Eventos",
    personalizado: "A medida",
};

export const STAGE_LABELS: Record<LeadStage, string> = {
    nuevo: "Nuevo",
    contactado: "Contactado",
    propuesta: "Propuesta",
    ganado: "Ganado",
    perdido: "Perdido",
};

/**
 * True si el error de Supabase es "esa columna no existe". Pasa cuando el
 * código ya trae un campo nuevo pero todavía no se corrió su migración: en vez
 * de romper la operación, quien llama reintenta sin ese campo.
 */
export function isMissingColumn(error: { message?: string } | null, column: string): boolean {
    const msg = error?.message ?? "";
    return msg.includes(column) && /column|schema cache/i.test(msg);
}

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
