import { db } from "@/lib/clientes-api";
import { fileRoutes, RECEIPTS_BUCKET } from "@/lib/clientes-files";

export const runtime = "nodejs";

// Comprobante de un pago. Al descargarlo se llama "Comprobante - Cliente - 2026-09-30".
export const { POST, GET, DELETE } = fileRoutes(RECEIPTS_BUCKET, "Este pago no tiene comprobante", async (id) => {
    const { data } = await db().from("cli_payments").select("paid_on, cli_clients(name, company)").eq("id", id).maybeSingle();
    const client = data?.cli_clients as unknown as { name: string; company: string | null } | null;
    return ["Comprobante", client?.company || client?.name, data?.paid_on].filter(Boolean).join(" - ");
});
