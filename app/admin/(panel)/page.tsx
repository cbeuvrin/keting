import { loadCrmData } from "@/lib/crm-rows";
import { Dashboard } from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
    const { rows, sentByDay, error } = await loadCrmData();

    if (error) {
        return (
            <main className="max-w-3xl px-6 md:px-8 py-16">
                <h1 className="text-2xl font-bold mb-4">Falta preparar la base de datos</h1>
                <p className="text-[#1d1d1f]/70 leading-relaxed mb-6">
                    Abre Supabase → SQL Editor y pega el contenido de{" "}
                    <code className="bg-black/5 px-1.5 py-0.5 rounded">scripts/crm-schema.sql</code>,{" "}
                    <code className="bg-black/5 px-1.5 py-0.5 rounded">-2.sql</code> y{" "}
                    <code className="bg-black/5 px-1.5 py-0.5 rounded">-3.sql</code>. Después recarga.
                </p>
                <p className="text-xs font-mono text-[#1d1d1f]/40 break-all">{error}</p>
            </main>
        );
    }

    return <Dashboard rows={rows} sentByDay={sentByDay} />;
}
