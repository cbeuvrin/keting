import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../ui";
import { FinancialBoard } from "../sheet/FinancialBoard";

export const dynamic = "force-dynamic";

export default async function ProyectosPage({ searchParams }: { searchParams: Promise<{ estado?: string; vista?: string }> }) {
    const [data, params] = await Promise.all([loadClientesData(), searchParams]);
    if (data.error) return <MissingSchema error={data.error} />;
    return <FinancialBoard key={`${params.estado}:${params.vista}`} data={data} initialStatus={params.estado ?? ""} initialView={params.vista === "por-cobrar" ? "por-cobrar" : "todos"} />;
}
