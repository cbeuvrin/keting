import { loadClientesData } from "@/lib/clientes-rows";
import { MissingSchema } from "../ui";
import { FinancialBoard } from "../sheet/FinancialBoard";
export const dynamic = "force-dynamic";
export default async function RecurrentesPage() {
    const data = await loadClientesData();
    if (data.error) return <MissingSchema error={data.error} />;
    return <FinancialBoard data={data} initialView="mensualidades" />;
}
