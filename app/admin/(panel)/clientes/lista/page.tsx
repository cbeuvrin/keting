import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../ui";
import { ClientesLista } from "./ClientesLista";

export const dynamic = "force-dynamic";

export default async function ClientesListaPage() {
    const data = await loadClientesData();
    if (data.error) return <MissingSchema error={data.error} />;
    return <ClientesLista data={data} />;
}
