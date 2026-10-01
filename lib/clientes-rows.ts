import { crmAdmin, selectAll } from "@/lib/crm";
import { todayMx, type Client, type Payment, type Project, type Retainer } from "@/lib/clientes";

// Carga todo el módulo CLIENTES de una vez. Son decenas de filas, no miles:
// traerlo completo y calcular en memoria es más simple que armar consultas por
// pantalla, y todas las pestañas cuentan exactamente lo mismo.

export type ClientesData = {
    clients: Client[];
    projects: Project[];
    retainers: Retainer[];
    payments: Payment[];
    /** Ids de los pagos que tienen comprobante subido. */
    receipts: string[];
    today: string;
    error: string | null;
};

/** Bucket privado de Supabase con los comprobantes; cada archivo se llama como el id de su pago. */
export const RECEIPTS_BUCKET = "cli-receipts";

// Si el bucket falla, el módulo sigue funcionando: solo no se ven los comprobantes.
async function listReceipts(): Promise<string[]> {
    const ids: string[] = [];
    for (let offset = 0; ; offset += 1000) {
        const { data, error } = await crmAdmin().storage.from(RECEIPTS_BUCKET).list("", { limit: 1000, offset });
        if (error || !data) return ids;
        ids.push(...data.map((f) => f.name));
        if (data.length < 1000) return ids;
    }
}

// PostgREST puede devolver `numeric` como texto; aquí se normaliza una sola vez.
const num = (v: unknown) => Number(v ?? 0);

export async function loadClientesData(): Promise<ClientesData> {
    const today = todayMx();
    try {
        const [clients, projects, retainers, payments, receipts] = await Promise.all([
            selectAll<Client>("cli_clients", "*", { campo: "name" }),
            selectAll<Project>("cli_projects", "*", { campo: "created_at", ascendente: false }),
            selectAll<Retainer>("cli_retainers", "*", { campo: "start_month" }),
            selectAll<Payment>("cli_payments", "*", { campo: "paid_on", ascendente: false }),
            listReceipts(),
        ]);
        return {
            clients,
            projects: projects.map((p) => ({ ...p, total: num(p.total) })),
            retainers: retainers.map((r) => ({ ...r, monthly_amount: num(r.monthly_amount) })),
            payments: payments.map((p) => ({ ...p, amount: num(p.amount) })),
            receipts,
            today,
            error: null,
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : typeof err === "object" && err && "message" in err ? String(err.message) : String(err);
        return { clients: [], projects: [], retainers: [], payments: [], receipts: [], today, error: message };
    }
}
