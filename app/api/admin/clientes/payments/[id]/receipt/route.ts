import { NextResponse } from "next/server";
import { RECEIPTS_BUCKET } from "@/lib/clientes-rows";
import { db, fail, guard, ok } from "@/lib/clientes-api";

export const runtime = "nodejs";

// Comprobante de un pago: un archivo por pago en el bucket privado, nombrado
// con el id del pago. El navegador sube directo a Supabase con una URL firmada
// (las fotos del celular pasan del límite de 4.5 MB de Vercel) y solo se ve a
// través de esta ruta, que exige la sesión del panel.

/** Da una URL firmada para subir (o reemplazar) el comprobante. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const { data, error } = await db().storage.from(RECEIPTS_BUCKET).createSignedUploadUrl(id, { upsert: true });
    if (error) return fail(error);
    return ok({ url: data.signedUrl });
}

/** Abre el comprobante (redirige a una URL firmada que dura dos minutos). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const { data, error } = await db().storage.from(RECEIPTS_BUCKET).createSignedUrl(id, 120);
    if (error) return NextResponse.json({ error: "Este pago no tiene comprobante" }, { status: 404 });
    return NextResponse.redirect(data.signedUrl);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const { error } = await db().storage.from(RECEIPTS_BUCKET).remove([id]);
    if (error) return fail(error);
    return ok();
}
