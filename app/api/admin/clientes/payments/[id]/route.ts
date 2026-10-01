import { bad, date, db, fail, guard, INVALID, money, ok, readBody, text } from "@/lib/clientes-api";
import { RECEIPTS_BUCKET } from "@/lib/clientes-rows";

export const runtime = "nodejs";

/** Corrige un pago: monto, fecha o nota. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const body = await readBody(request);

    const patch: Record<string, unknown> = {};
    const amount = money(body.amount);
    if (amount === INVALID || amount === 0) return bad("El monto debe ser mayor a cero");
    if (amount !== undefined) patch.amount = amount;
    const paid_on = date(body.paid_on);
    if (paid_on === INVALID || paid_on === null) return bad("La fecha no es válida");
    if (paid_on !== undefined) patch.paid_on = paid_on;
    const note = text(body.note);
    if (note !== undefined) patch.note = note;
    if (Object.keys(patch).length === 0) return ok();

    const { error } = await db().from("cli_payments").update(patch).eq("id", id);
    if (error) return fail(error);
    return ok();
}

/** Borra un pago capturado por error. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const { error } = await db().from("cli_payments").delete().eq("id", id);
    if (error) return fail(error);
    // Su comprobante se va con él (si no tenía, no pasa nada).
    await db().storage.from(RECEIPTS_BUCKET).remove([id]);
    return ok();
}
