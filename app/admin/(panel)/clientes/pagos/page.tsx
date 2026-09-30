import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../ui";
import { Pagos } from "./Pagos";

export const dynamic = "force-dynamic";

export default async function PagosPage({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
    const [data, params] = await Promise.all([loadClientesData(), searchParams]);
    if (data.error) return <MissingSchema error={data.error} />;
    return <Pagos data={data} initialMonth={params.mes ?? ""} />;
}
