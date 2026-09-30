import { bad, conflict, date, db, fail, guard, INVALID, money, ok, readBody, status, text } from "@/lib/clientes-api";

export const runtime = "nodejs";

/** Edita un proyecto: nombre, estado, total, entrega o notas. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const body = await readBody(request);

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

    const name = text(body.name);
    if (name !== undefined) {
        if (!name) return bad("El proyecto necesita un nombre");
        patch.name = name;
    }
    const total = money(body.total);
    if (total === INVALID) return bad("El total no es un monto válido");
    if (total !== undefined) patch.total = total;
    const st = status(body.status);
    if (st === INVALID) return bad("Estado inválido");
    if (st !== undefined) patch.status = st;
    const delivery = date(body.delivery_date);
    if (delivery === INVALID) return bad("La fecha de entrega no es válida");
    if (delivery !== undefined) patch.delivery_date = delivery;
    const notes = text(body.notes);
    if (notes !== undefined) patch.notes = notes;

    const { error } = await db().from("cli_projects").update(patch).eq("id", id);
    if (error) return fail(error);
    return ok();
}

/** Borra un proyecto sin pagos. Con pagos, lo que corresponde es cancelarlo. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const client = db();

    const { count, error: countErr } = await client.from("cli_payments").select("id", { count: "exact", head: true }).eq("project_id", id);
    if (countErr) return fail(countErr);
    if ((count ?? 0) > 0) return conflict("Este proyecto tiene pagos: márcalo como Cancelado o borra primero sus pagos.");

    const { error } = await client.from("cli_projects").delete().eq("id", id);
    if (error) return fail(error);
    return ok();
}
