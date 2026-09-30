import { bad, date, db, fail, guard, INVALID, money, ok, readBody, status, text } from "@/lib/clientes-api";

export const runtime = "nodejs";

/** Crea un proyecto para un cliente. Arranca en "Esperando" si no se indica otro estado. */
export async function POST(request: Request) {
    const denied = await guard();
    if (denied) return denied;
    const body = await readBody(request);

    const client_id = text(body.client_id);
    const name = text(body.name);
    const total = money(body.total);
    const st = status(body.status);
    const delivery_date = date(body.delivery_date);
    if (!client_id) return bad("Falta el cliente");
    if (!name) return bad("El proyecto necesita un nombre");
    if (total === INVALID) return bad("El total no es un monto válido");
    if (st === INVALID) return bad("Estado inválido");
    if (delivery_date === INVALID) return bad("La fecha de entrega no es válida");

    const { data, error } = await db()
        .from("cli_projects")
        .insert({
            client_id,
            name,
            total: total ?? 0,
            status: st ?? "esperando",
            delivery_date: delivery_date ?? null,
            notes: text(body.notes) ?? null,
        })
        .select("id")
        .single();
    if (error) return fail(error);
    return ok({ id: data.id });
}
