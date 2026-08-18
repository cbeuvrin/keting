import { crmAdmin, type Lead } from "@/lib/crm";
import { Board } from "./Board";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
    let leads: Lead[] = [];
    let dbError: string | null = null;
    try {
        const { data, error } = await crmAdmin()
            .from("crm_leads")
            .select("*")
            .order("updated_at", { ascending: false });
        if (error) throw error;
        leads = (data as Lead[]) ?? [];
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

    return <Board initialLeads={leads} />;
}
