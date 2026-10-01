import { db } from "@/lib/clientes-api";
import { fileRoutes, QUOTES_BUCKET } from "@/lib/clientes-files";

export const runtime = "nodejs";

// Cotización aprobada de un proyecto. Al descargarla se llama "Cotización - Cliente - Proyecto".
export const { POST, GET, DELETE } = fileRoutes(QUOTES_BUCKET, "Este proyecto no tiene cotización", async (id) => {
    const { data } = await db().from("cli_projects").select("name, cli_clients(name, company)").eq("id", id).maybeSingle();
    const client = data?.cli_clients as unknown as { name: string; company: string | null } | null;
    return ["Cotización", client?.company || client?.name, data?.name].filter(Boolean).join(" - ");
});
