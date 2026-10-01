import Link from "next/link";
import { loadClientesData } from "@/lib/clientes-rows";
import { CobrosList, type CollectionFilter } from "../CobrosList";
import { FxNote, MissingSchema, PageHeader } from "../ui";

export const dynamic = "force-dynamic";

export default async function CobrosPage({ searchParams }: { searchParams: Promise<{ tipo?: string; q?: string }> }) {
    const [data, params] = await Promise.all([loadClientesData(), searchParams]);
    if (data.error) return <MissingSchema error={data.error} />;
    const filter: CollectionFilter = params.tipo === "proyecto" || params.tipo === "mensualidad" ? params.tipo : "todos";
    return <main className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-10">
        <Link href="/admin/clientes" className="mb-5 inline-block text-xs text-[#1d1d1f]/60 hover:underline underline-offset-4">← Mi negocio</Link>
        <PageHeader title="Cobros." accent="cada pendiente, en un lugar" />
        <CobrosList key={`${filter}:${params.q ?? ""}`} data={data} initialFilter={filter} initialQuery={params.q ?? ""} />
        <FxNote data={data} className="mt-5" />
    </main>;
}
