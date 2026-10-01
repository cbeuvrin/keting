import { selectAll } from "@/lib/crm";
import { listFileIds, QUOTES_BUCKET, RECEIPTS_BUCKET } from "@/lib/clientes-files";
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
    /** Ids de los proyectos que tienen su cotización subida. */
    quotes: string[];
    today: string;
    error: string | null;
};

// PostgREST puede devolver `numeric` como texto; aquí se normaliza una sola vez.
const num = (v: unknown) => Number(v ?? 0);

export async function loadClientesData(): Promise<ClientesData> {
    const today = todayMx();
    try {
        const [clients, projects, retainers, payments, receipts, quotes] = await Promise.all([
            selectAll<Client>("cli_clients", "*", { campo: "name" }),
            selectAll<Project>("cli_projects", "*", { campo: "created_at", ascendente: false }),
            selectAll<Retainer>("cli_retainers", "*", { campo: "start_month" }),
            selectAll<Payment>("cli_payments", "*", { campo: "paid_on", ascendente: false }),
            listFileIds(RECEIPTS_BUCKET),
            listFileIds(QUOTES_BUCKET),
        ]);
        return {
            clients,
            projects: projects.map((p) => ({ ...p, total: num(p.total) })),
            retainers: retainers.map((r) => ({ ...r, monthly_amount: num(r.monthly_amount) })),
            payments: payments.map((p) => ({ ...p, amount: num(p.amount) })),
            receipts,
            quotes,
            today,
            error: null,
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : typeof err === "object" && err && "message" in err ? String(err.message) : String(err);
        return { clients: [], projects: [], retainers: [], payments: [], receipts: [], quotes: [], today, error: message };
    }
}
