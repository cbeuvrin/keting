import { notFound } from "next/navigation";
import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../../ui";
import { Ficha } from "./Ficha";

export const dynamic = "force-dynamic";

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
    const [{ id }, data] = await Promise.all([params, loadClientesData()]);
    if (data.error) return <MissingSchema error={data.error} />;
    const client = data.clients.find((c) => c.id === id);
    if (!client) notFound();
    return <Ficha client={client} data={data} />;
}
