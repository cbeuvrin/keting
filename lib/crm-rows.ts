import { crmAdmin, type Lead } from "@/lib/crm";

// Una fila = un contacto con su estado de correo resuelto. Lo usan tanto la
// tabla como el dashboard, para que ambos cuenten exactamente lo mismo.

export type LeadRow = Lead & {
    /** Fecha del último correo enviado, o null si nunca se le ha escrito */
    sentAt: string | null;
    /** Fecha de la primera apertura registrada, o null */
    openedAt: string | null;
    /** Cuántos correos se le han enviado */
    sentCount: number;
};

export type CrmData = {
    rows: LeadRow[];
    /** Envíos por día (clave YYYY-MM-DD), para la gráfica */
    sentByDay: Record<string, number>;
    error: string | null;
};

export async function loadCrmData(): Promise<CrmData> {
    try {
        const db = crmAdmin();
        const [{ data: leads, error }, { data: mails }] = await Promise.all([
            db.from("crm_leads").select("*").order("updated_at", { ascending: false }),
            db.from("crm_emails").select("lead_id, created_at, opened_at").order("created_at", { ascending: false }),
        ]);
        if (error) throw error;

        const sent = new Map<string, { last: string; opened: string | null; count: number }>();
        const sentByDay: Record<string, number> = {};
        for (const m of mails ?? []) {
            const prev = sent.get(m.lead_id);
            if (!prev) {
                sent.set(m.lead_id, { last: m.created_at, opened: m.opened_at ?? null, count: 1 });
            } else {
                prev.count += 1;
                // Los correos vienen del más nuevo al más viejo, así que `last`
                // ya es el último; la apertura vale la primera que aparezca.
                if (!prev.opened && m.opened_at) prev.opened = m.opened_at;
            }
            const day = m.created_at.slice(0, 10);
            sentByDay[day] = (sentByDay[day] ?? 0) + 1;
        }

        const rows: LeadRow[] = ((leads as Lead[]) ?? []).map((l) => {
            const s = sent.get(l.id);
            return {
                ...l,
                sentAt: s?.last ?? null,
                openedAt: s?.opened ?? null,
                sentCount: s?.count ?? 0,
            };
        });

        return { rows, sentByDay, error: null };
    } catch (err) {
        return { rows: [], sentByDay: {}, error: err instanceof Error ? err.message : String(err) };
    }
}
