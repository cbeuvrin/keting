import { loadCrmData } from "@/lib/crm-rows";
import { ContactsTable } from "./ContactsTable";

export const dynamic = "force-dynamic";

export default async function ContactosPage({
    searchParams,
}: {
    searchParams: Promise<{ correo?: string; etapa?: string; servicio?: string }>;
}) {
    const [{ rows, error }, params] = await Promise.all([loadCrmData(), searchParams]);

    if (error) {
        return (
            <main className="max-w-3xl px-6 md:px-8 py-16">
                <h1 className="text-2xl font-bold mb-4">Falta preparar la base de datos</h1>
                <p className="text-xs font-mono text-[#1d1d1f]/40 break-all">{error}</p>
            </main>
        );
    }

    return (
        <ContactsTable
            rows={rows}
            initialCorreo={params.correo ?? ""}
            initialEtapa={params.etapa ?? ""}
            initialServicio={params.servicio ?? ""}
        />
    );
}
