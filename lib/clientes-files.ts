import { NextResponse } from "next/server";
import { crmAdmin } from "@/lib/crm";
import { fail, guard, ok } from "@/lib/clientes-api";

// Archivos del módulo CLIENTES: el comprobante de cada pago y la cotización
// aprobada de cada proyecto. Uno por registro, en un bucket privado, y el
// archivo se llama como el id del registro (así no hace falta columna en la
// tabla). El navegador sube directo a Supabase con una URL firmada —las fotos
// del celular pasan del límite de 4.5 MB de Vercel— y solo se abre a través
// de las rutas del panel, que exigen la sesión.

export const RECEIPTS_BUCKET = "cli-receipts";
export const QUOTES_BUCKET = "cli-quotes";

/** Ids que tienen archivo en el bucket. Si el bucket falla, lista vacía: el módulo sigue funcionando. */
export async function listFileIds(bucket: string): Promise<string[]> {
    const ids: string[] = [];
    for (let offset = 0; ; offset += 1000) {
        const { data, error } = await crmAdmin().storage.from(bucket).list("", { limit: 1000, offset });
        if (error || !data) return ids;
        ids.push(...data.map((f) => f.name));
        if (data.length < 1000) return ids;
    }
}

/** Borra los archivos de esos registros; si no tenían, no pasa nada. */
export async function removeFiles(bucket: string, ids: string[]) {
    if (ids.length) await crmAdmin().storage.from(bucket).remove(ids);
}

const EXTENSIONS: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

/** Quita lo que no sirve en un nombre de archivo. */
const safeName = (s: string) => s.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);

type Ctx = { params: Promise<{ id: string }> };

/**
 * Las tres rutas de un archivo: POST da la URL firmada para subir o
 * reemplazar, GET lo abre (con ?descargar=1 lo baja con un nombre legible) y
 * DELETE lo quita. `downloadName` arma ese nombre sin extensión.
 */
export function fileRoutes(bucket: string, notFound: string, downloadName: (id: string) => Promise<string>) {
    const POST = async (_request: Request, { params }: Ctx) => {
        const denied = await guard();
        if (denied) return denied;
        const { id } = await params;
        const { data, error } = await crmAdmin().storage.from(bucket).createSignedUploadUrl(id, { upsert: true });
        if (error) return fail(error);
        return ok({ url: data.signedUrl });
    };

    const GET = async (request: Request, { params }: Ctx) => {
        const denied = await guard();
        if (denied) return denied;
        const { id } = await params;
        const storage = crmAdmin().storage.from(bucket);
        let download: string | undefined;
        if (new URL(request.url).searchParams.has("descargar")) {
            const { data: found } = await storage.list("", { search: id, limit: 1 });
            const ext = EXTENSIONS[String(found?.[0]?.metadata?.mimetype ?? "")];
            download = safeName(await downloadName(id)) + (ext ? `.${ext}` : "");
        }
        const { data, error } = await storage.createSignedUrl(id, 120, download ? { download } : undefined);
        if (error) return NextResponse.json({ error: notFound }, { status: 404 });
        return NextResponse.redirect(data.signedUrl);
    };

    const DELETE = async (_request: Request, { params }: Ctx) => {
        const denied = await guard();
        if (denied) return denied;
        const { id } = await params;
        const { error } = await crmAdmin().storage.from(bucket).remove([id]);
        if (error) return fail(error);
        return ok();
    };

    return { POST, GET, DELETE };
}
