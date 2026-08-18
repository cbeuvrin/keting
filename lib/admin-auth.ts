import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// ── Autenticación del panel /admin ───────────────────────────────────────────
// Una sola contraseña (ADMIN_PASSWORD) → cookie httpOnly con un HMAC derivado
// de ella. No hay usuarios ni sesiones en base de datos: el panel es de Carlos
// y punto. Cambiar la contraseña invalida todas las cookies al instante,
// porque el HMAC ya no coincide.

export const ADMIN_COOKIE = "keting_admin";

function secret(): string {
    // CRON_SECRET como sal de firma: ya existe en Vercel y no viaja al cliente.
    return `${process.env.ADMIN_PASSWORD ?? ""}::${process.env.CRON_SECRET ?? ""}`;
}

export function adminToken(): string {
    return createHmac("sha256", secret()).update("keting-admin-v1").digest("hex");
}

export function isValidAdminToken(token: string | undefined): boolean {
    if (!token || !process.env.ADMIN_PASSWORD) return false;
    const expected = Buffer.from(adminToken());
    const got = Buffer.from(token);
    return got.length === expected.length && timingSafeEqual(got, expected);
}

/** Para páginas y APIs del panel (lado servidor). */
export async function isAdminRequest(): Promise<boolean> {
    const jar = await cookies();
    return isValidAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

// ── Auth por header para los endpoints de administración del blog ────────────
// (isAuthorizedAdmin ya existía antes del CRM: la usan /api/blog/enrich y
// /api/blog/manual-generate con ADMIN_SECRET por header. Se conserva intacta.)

function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

/** Devuelve true si la petición trae el ADMIN_SECRET por header (fail-closed). */
export function isAuthorizedAdmin(request: Request): boolean {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) return false;
    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const headerSecret = request.headers.get("x-admin-secret") || bearer || "";
    return safeEqual(headerSecret, secret);
}
