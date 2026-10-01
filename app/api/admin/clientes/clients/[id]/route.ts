import { bad, conflict, db, fail, guard, ok, readBody, text } from "@/lib/clientes-api";
import { QUOTES_BUCKET, removeFiles } from "@/lib/clientes-files";

export const runtime = "nodejs";

/** Edita los datos del cliente o lo archiva / desarchiva. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const body = await readBody(request);

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const field of ["name", "company", "email", "phone", "notes"] as const) {
        const value = text(body[field]);
        if (value === undefined) continue;
        if (field === "name" && !value) return bad("El nombre no puede quedar vacío");
        patch[field] = value;
    }
    if (typeof body.archived === "boolean") patch.archived = body.archived;

    const { error } = await db().from("cli_clients").update(patch).eq("id", id);
    if (error) return fail(error);
    return ok();
}

/**
 * Borra un cliente con sus proyectos y mensualidades, pero solo si nunca ha
 * pagado nada: un cliente con pagos se archiva, para no perder el historial.
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const client = db();

    const { count, error: countErr } = await client.from("cli_payments").select("id", { count: "exact", head: true }).eq("client_id", id);
    if (countErr) return fail(countErr);
    if ((count ?? 0) > 0) return conflict("Este cliente tiene pagos registrados: archívalo en lugar de borrarlo.");

    // Las cotizaciones de sus proyectos se van con ellos.
    const { data: projects } = await client.from("cli_projects").select("id").eq("client_id", id);
    for (const table of ["cli_projects", "cli_retainers", "cli_clients"] as const) {
        const { error } = await client.from(table).delete().eq(table === "cli_clients" ? "id" : "client_id", id);
        if (error) return fail(error);
    }
    await removeFiles(QUOTES_BUCKET, (projects ?? []).map((p) => p.id));
    return ok();
}
