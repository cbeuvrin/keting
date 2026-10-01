import { planError, planKey, type PaymentPlan } from "@/lib/payment-plan";
import { crmAdmin, selectAll } from "@/lib/crm";
import { listFileIds, QUOTES_BUCKET, RECEIPTS_BUCKET } from "@/lib/clientes-files";
import { usdRate, type UsdRate } from "@/lib/clientes-fx";
import { todayMx, type Client, type Payment, type Project, type Retainer } from "@/lib/clientes";

// Carga todo el módulo CLIENTES de una vez. Son decenas de filas, no miles:
// traerlo completo y calcular en memoria es más simple que armar consultas por
// pantalla, y todas las pestañas cuentan exactamente lo mismo.

export type ClientesData = {
    paymentPlans?: Record<string, PaymentPlan>;
    clients: Client[];
    projects: Project[];
    retainers: Retainer[];
    payments: Payment[];
    /** Ids de los pagos que tienen comprobante subido. */
    receipts: string[];
    /** Ids de los proyectos que tienen su cotización subida. */
    quotes: string[];
    /** USD→MXN del día; null si no hubo forma de obtenerlo. */
    usdRate: UsdRate | null;
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
            selectAll<Project>("cli_projects", "*", {
                campo: "created_at",
                ascendente: false,
            }),
            selectAll<Retainer>("cli_retainers", "*", { campo: "start_month" }),
            selectAll<Payment>("cli_payments", "*", {
                campo: "paid_on",
                ascendente: false,
            }),
            listFileIds(RECEIPTS_BUCKET),
            listFileIds(QUOTES_BUCKET),
        ]);
        const paymentPlans: Record<string, PaymentPlan> = {};
        if (projects.length) {
            const { data: settings, error: settingsError } = await crmAdmin().from("crm_settings").select("key,value").in("key", projects.map((p) => planKey(p.id)));
            if (settingsError) throw settingsError;
            for (const setting of settings ?? []) {
                const id = setting.key.slice("cli_payment_plan:".length);
                const project = projects.find((p) => p.id === id);
                if (!project || planError(setting.value, Number(project.total))) throw new Error("No se pudo leer un plan de cobro. Revisa el total y las etapas del proyecto.");
                paymentPlans[id] = setting.value as PaymentPlan;
            }
        }
        const rate = clients.some((client) => client.currency === "USD") ? await usdRate().catch(() => null) : null;
        return {
            paymentPlans,
            clients,
            projects: projects.map((p) => ({ ...p, total: num(p.total) })),
            retainers: retainers.map((r) => ({
                ...r,
                monthly_amount: num(r.monthly_amount),
            })),
            payments: payments.map((p) => ({ ...p, amount: num(p.amount) })),
            receipts,
            quotes,
            usdRate: rate,
            today,
            error: null,
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : typeof err === "object" && err && "message" in err ? String(err.message) : String(err);
        return {
            clients: [],
            projects: [],
            retainers: [],
            payments: [],
            receipts: [],
            quotes: [],
            usdRate: null,
            today,
            error: message,
        };
    }
}
