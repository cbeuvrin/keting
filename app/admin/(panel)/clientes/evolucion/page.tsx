import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../ui";
import { Evolucion } from "./Evolucion";

export const dynamic = "force-dynamic";

export default async function EvolucionPage() {
    const data = await loadClientesData();
    if (data.error) return <MissingSchema error={data.error} />;
    return <Evolucion data={data} />;
}
