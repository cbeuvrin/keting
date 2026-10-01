import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../ui";
import { FinancialBoard } from "../sheet/FinancialBoard";
export const dynamic = "force-dynamic";
export default async function CobrosPage({ searchParams }: { searchParams: Promise<{ tipo?: string; q?: string }> }) {
    const [data, params] = await Promise.all([loadClientesData(), searchParams]);
    if (data.error) return <MissingSchema error={data.error} />;
    return <FinancialBoard key={`${params.tipo}:${params.q}`} data={data} initialView={params.tipo === "mensualidad" ? "mensualidades" : "por-cobrar"} initialQuery={params.q ?? ""} />;
}
