import { bad, db, fail, guard, INVALID, money, month, ok, readBody, text } from "@/lib/clientes-api";

export const runtime = "nodejs";

/** Crea una mensualidad: se debe cada mes desde `start_month` hasta que se termine. */
export async function POST(request: Request) {
    const denied = await guard();
    if (denied) return denied;
    const body = await readBody(request);

    const client_id = text(body.client_id);
    const concept = text(body.concept);
    const amount = money(body.monthly_amount);
    const start = month(body.start_month);
    if (!client_id) return bad("Falta el cliente");
    if (!concept) return bad("Pon el concepto (por ejemplo, Mantenimiento)");
    if (amount === INVALID || !amount) return bad("El monto mensual debe ser mayor a cero");
    if (start === INVALID || !start) return bad("Indica el mes en que empieza");

    const { data, error } = await db()
        .from("cli_retainers")
        .insert({ client_id, concept, monthly_amount: amount, start_month: start })
        .select("id")
        .single();
    if (error) return fail(error);
    return ok({ id: data.id });
}
