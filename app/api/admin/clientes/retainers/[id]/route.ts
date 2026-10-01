import { frequencyKey } from "@/lib/retainer-frequency";
import { addMonths } from "@/lib/clientes";
import { bad, conflict, date, db, fail, guard, INVALID, money, month, ok, readBody, text } from "@/lib/clientes-api";

export const runtime = "nodejs";

/**
 * Edita una mensualidad: el concepto, su último mes (terminarla o reactivarla)
 * o su monto. Cambiar el monto a partir de un mes posterior al inicio cierra la
 * actual el mes anterior y abre otra con el monto nuevo: así los meses ya
 * cobrados conservan el precio de entonces.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const body = await readBody(request);
    const client = db();

    const { data: current, error: readErr } = await client.from("cli_retainers").select("*").eq("id", id).single();
    if (readErr) return fail(readErr);
    const { data: config, error: configError } = await client.from("crm_settings").select("value").eq("key", frequencyKey(id)).maybeSingle();
    if (configError) return fail(configError);
    const fortnightly = config?.value?.frequency === "quincenal";

    if (body.new_amount !== undefined) {
        if (fortnightly) return bad("Para una tarifa quincenal nueva, termina el servicio actual y crea otro desde la fecha del cambio. Puedes corregir el importe original en Recurrentes.");
        const amount = money(body.new_amount);
        const from = month(body.from_month);
        if (amount === INVALID || !amount) return bad("El monto nuevo debe ser mayor a cero");
        if (from === INVALID || !from) return bad("Indica desde qué mes aplica el monto nuevo");
        if (current.end_month && from > current.end_month) return bad("Esa mensualidad ya terminó antes de ese mes");

        if (from <= current.start_month) {
            const { error } = await client.from("cli_retainers").update({ monthly_amount: amount }).eq("id", id);
            if (error) return fail(error);
            return ok();
        }
        const lastOld = `${addMonths(from.slice(0, 7), -1)}-01`;
        const { error: closeErr } = await client.from("cli_retainers").update({ end_month: lastOld }).eq("id", id);
        if (closeErr) return fail(closeErr);
        const { data, error } = await client
            .from("cli_retainers")
            .insert({ client_id: current.client_id, concept: current.concept, monthly_amount: amount, start_month: from, end_month: current.end_month })
            .select("id")
            .single();
        if (error) return fail(error);
        return ok({ id: data.id });
    }

    const patch: Record<string, unknown> = {};
    const concept = text(body.concept);
    if (concept !== undefined) {
        if (!concept) return bad("El concepto no puede quedar vacío");
        patch.concept = concept;
    }
    const start = fortnightly ? date(body.start_month) : month(body.start_month);
    if (start === INVALID || start === null) return bad("Indica un inicio válido");
    if (start !== undefined) patch.start_month = start;
    const correctedAmount = money(body.monthly_amount);
    if (correctedAmount === INVALID || correctedAmount === 0) return bad("El importe por cobro debe ser mayor a cero");
    if (correctedAmount !== undefined) patch.monthly_amount = correctedAmount;
    const end = fortnightly ? date(body.end_month) : month(body.end_month);
    if (end === INVALID) return bad("La fecha de fin no es válida");
    if (end !== undefined) patch.end_month = end;
    const nextStart = start ?? current.start_month;
    const nextEnd = end === undefined ? current.end_month : end;
    if (nextEnd && nextEnd < nextStart) return bad("No puede terminar antes de empezar");
    if (Object.keys(patch).length === 0) return ok();

    const { error } = await client.from("cli_retainers").update(patch).eq("id", id);
    if (error) return fail(error);
    return ok();
}

/** Borra una mensualidad sin pagos (una capturada por error). Con pagos, se termina. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const client = db();

    const { count, error: countErr } = await client.from("cli_payments").select("id", { count: "exact", head: true }).eq("retainer_id", id);
    if (countErr) return fail(countErr);
    if ((count ?? 0) > 0) return conflict("Esta mensualidad tiene pagos: termínala en lugar de borrarla.");

    const { error } = await client.from("cli_retainers").delete().eq("id", id);
    if (error) return fail(error);
    await client.from("crm_settings").delete().eq("key", frequencyKey(id));
    return ok();
}
