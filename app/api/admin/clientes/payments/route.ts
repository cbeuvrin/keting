import { todayMx } from "@/lib/clientes";
import { bad, date, db, fail, guard, INVALID, money, ok, readBody, text } from "@/lib/clientes-api";

export const runtime = "nodejs";

/**
 * Registra un pago a un proyecto o a una mensualidad. El cliente se toma de
 * ese proyecto o mensualidad, no de lo que mande el navegador: así un pago no
 * puede quedar cruzado con otro cliente.
 */
export async function POST(request: Request) {
    const denied = await guard();
    if (denied) return denied;
    const body = await readBody(request);

    const project_id = text(body.project_id) ?? null;
    const retainer_id = text(body.retainer_id) ?? null;
    const amount = money(body.amount);
    const paid_on = date(body.paid_on);
    if (Boolean(project_id) === Boolean(retainer_id)) return bad("Elige a qué va el pago: un proyecto o una mensualidad");
    if (amount === INVALID || !amount) return bad("El monto debe ser mayor a cero");
    if (paid_on === INVALID) return bad("La fecha no es válida");

    const client = db();
    const { data: owner, error: ownerErr } = await client
        .from(project_id ? "cli_projects" : "cli_retainers")
        .select("client_id")
        .eq("id", (project_id ?? retainer_id) as string)
        .single();
    if (ownerErr) return fail(ownerErr);

    const { data, error } = await client
        .from("cli_payments")
        .insert({
            client_id: owner.client_id,
            project_id,
            retainer_id,
            amount,
            paid_on: paid_on ?? todayMx(),
            note: text(body.note) ?? null,
        })
        .select("id")
        .single();
    if (error) return fail(error);
    return ok({ id: data.id });
}
