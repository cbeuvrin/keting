import { bad, conflict, db, fail, guard, ok, readBody } from "@/lib/clientes-api";
import { frequencyKey, readBillingDays, readFrequency } from "@/lib/retainer-frequency";
export const runtime = "nodejs";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const body = await readBody(request);
    const frequency = readFrequency(body.frequency);
    if (!frequency) return bad("Frecuencia no válida");
    const billing_days = readBillingDays(body.billing_days, frequency);
    if (!billing_days) return bad("Elige días del 1 al 31: uno mensual o dos quincenales que no coincidan, incluso en febrero.");
    const client = db();
    const { error: ownerError } = await client.from("cli_retainers").select("id").eq("id", id).single();
    if (ownerError) return fail(ownerError);
    const { count, error } = await client.from("cli_payments").select("id", { count: "exact", head: true }).eq("retainer_id", id);
    if (error) return fail(error);
    const { data: config, error: configError } = await client.from("crm_settings").select("value").eq("key", frequencyKey(id)).maybeSingle();
    if (configError) return fail(configError);
    if (count && frequency !== (config?.value?.frequency ?? "mensual")) return conflict("Este servicio ya tiene pagos. Para cambiar la frecuencia, termina este servicio y crea otro desde la fecha del cambio.");
    const { error: saveError } = await client.from("crm_settings").upsert({ key: frequencyKey(id), value: { frequency, billing_days }, updated_at: new Date().toISOString() });
    if (saveError) return fail(saveError);
    return ok();
}
