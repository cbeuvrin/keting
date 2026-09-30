import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../ui";
import { ProyectosTable } from "./ProyectosTable";

export const dynamic = "force-dynamic";

export default async function ProyectosPage({ searchParams }: { searchParams: Promise<{ estado?: string; vista?: string }> }) {
    const [data, params] = await Promise.all([loadClientesData(), searchParams]);
    if (data.error) return <MissingSchema error={data.error} />;
    return <ProyectosTable data={data} initialEstado={params.estado ?? ""} initialVista={params.vista ?? ""} />;
}
