import { randomUUID } from "node:crypto";
import { frequencyKey, readBillingDays, readFrequency } from "@/lib/retainer-frequency";
import { bad, date, db, fail, guard, INVALID, money, month, ok, readBody, text } from "@/lib/clientes-api";

export const runtime = "nodejs";

/** Crea un servicio mensual o quincenal con importe por cobro. */
export async function POST(request: Request) {
    const denied = await guard();
    if (denied) return denied;
    const body = await readBody(request);

    const client_id = text(body.client_id);
    const concept = text(body.concept);
    const amount = money(body.monthly_amount);
    const frequency = readFrequency(body.frequency ?? "mensual");
    if (!frequency) return bad("Frecuencia no válida");
    const billing_days = readBillingDays(body.billing_days, frequency);
    if (!billing_days) return bad("Indica un día mensual o dos días quincenales distintos, del 1 al 31. Los dos días deben ser distintos incluso en febrero.");
    const start = frequency === "quincenal" ? date(body.start_month) : month(body.start_month);
    if (!client_id) return bad("Falta el cliente");
    if (!concept) return bad("Pon el concepto (por ejemplo, Mantenimiento)");
    if (amount === INVALID || !amount) return bad("El importe por cobro debe ser mayor a cero");
    if (start === INVALID || !start) return bad("Indica cuándo empieza");

    const client = db();
    const id = randomUUID();
    // Publicamos el calendario antes que el servicio: nunca será visible como mensual por error.
    if (frequency === "quincenal" || body.billing_days !== undefined) {
        const { error } = await client.from("crm_settings").insert({ key: frequencyKey(id), value: { frequency, billing_days } });
        if (error) return fail(error);
    }
    const { data, error } = await client
        .from("cli_retainers")
        .insert({ id, client_id, concept, monthly_amount: amount, start_month: start })
        .select("id")
        .single();
    if (error) {
        if (frequency === "quincenal" || body.billing_days !== undefined) await client.from("crm_settings").delete().eq("key", frequencyKey(id));
        return fail(error);
    }
    return ok({ id: data.id });
}
