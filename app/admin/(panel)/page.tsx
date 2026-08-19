import { crmAdmin, type Lead } from "@/lib/crm";
import { Board } from "./Board";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
    let leads: Lead[] = [];
    let emailed: Record<string, string> = {};
    let dbError: string | null = null;
    try {
        const db = crmAdmin();
        const { data, error } = await db
            .from("crm_leads")
            .select("*")
            .order("updated_at", { ascending: false });
        if (error) throw error;
        leads = (data as Lead[]) ?? [];
        // Último correo enviado por lead (ordenado desc: la primera aparición gana)
        const { data: mails } = await db
            .from("crm_emails")
            .select("lead_id, created_at")
            .order("created_at", { ascending: false });
        for (const m of mails ?? []) {
            if (!(m.lead_id in emailed)) emailed[m.lead_id] = m.created_at;
        }
    } catch (err) {
        // Caso típico: aún no se pegó scripts/crm-schema.sql en Supabase.
        dbError = err instanceof Error ? err.message : String(err);
    }

    if (dbError) {
        return (
            <main className="max-w-3xl mx-auto px-6 py-20">
                <h1 className="text-2xl font-bold mb-4">Falta preparar la base de datos</h1>
                <p className="text-[#1d1d1f]/70 leading-relaxed mb-6">
                    Las tablas del CRM todavía no existen en Supabase. Abre el proyecto en
                    Supabase → SQL Editor, pega el contenido de{" "}
                    <code className="bg-black/5 px-1.5 py-0.5 rounded">scripts/crm-schema.sql</code>{" "}
                    y pulsa Run. Después recarga esta página.
                </p>
                <p className="text-xs font-mono text-[#1d1d1f]/40 break-all">{dbError}</p>
            </main>
        );
    }

    return <Board initialLeads={leads} emailed={emailed} />;
}
