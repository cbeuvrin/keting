/**
 * Auth para endpoints de administración (generación de contenido con IA).
 * Protege contra abuso de costos y escrituras no autorizadas a la base de datos.
 *
 * Requiere la variable de entorno ADMIN_SECRET. Si no está configurada, se
 * deniega el acceso (fail-closed): el endpoint nunca queda abierto.
 *
 * El cliente debe enviar el secreto en el header `Authorization: Bearer <secreto>`
 * o `x-admin-secret: <secreto>`.
 */

// Comparación en tiempo (cuasi) constante para no filtrar el secreto por timing.
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

/** Devuelve true si la petición está autorizada como admin. */
export function isAuthorizedAdmin(request: Request): boolean {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) return false; // fail-closed

    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const headerSecret = request.headers.get("x-admin-secret") || bearer || "";
    return safeEqual(headerSecret, secret);
}
