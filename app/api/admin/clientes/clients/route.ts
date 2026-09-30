import { bad, db, fail, guard, ok, readBody, text } from "@/lib/clientes-api";

export const runtime = "nodejs";

/** Da de alta un cliente. Solo el nombre es obligatorio. */
export async function POST(request: Request) {
    const denied = await guard();
    if (denied) return denied;
    const body = await readBody(request);

    const name = text(body.name);
    if (!name) return bad("El nombre es obligatorio");

    const { data, error } = await db()
        .from("cli_clients")
        .insert({
            name,
            company: text(body.company) ?? null,
            email: text(body.email) ?? null,
            phone: text(body.phone) ?? null,
            notes: text(body.notes) ?? null,
        })
        .select("id")
        .single();
    if (error) return fail(error);
    return ok({ id: data.id });
}
