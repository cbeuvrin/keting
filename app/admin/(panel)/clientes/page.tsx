import { loadClientesData } from "@/lib/clientes-rows";
import { Resumen } from "./Resumen";
import { MissingSchema } from "./ui";

export const dynamic = "force-dynamic";

export default async function ClientesResumenPage() {
    const data = await loadClientesData();
    if (data.error) return <MissingSchema error={data.error} />;
    return <Resumen data={data} />;
}
