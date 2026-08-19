// Cómo saludar a un lead sin quedar en ridículo.
//
// El problema real: al importar un CSV sin columna de nombre, el lead se queda
// con el trozo del correo antes de la @ — "lzaragoza", "elias.gamboa",
// "presidencia". Saludar «Hola lzaragoza,» en un correo en frío es peor que no
// saludar por nombre. Aquí se decide: o sale un nombre presentable, o el
// saludo va sin nombre («Hola,»), que siempre se lee bien.

// Buzones de función, no personas: nunca se usan como nombre.
const BUZONES = new Set([
    "info", "contacto", "contact", "ventas", "sales", "admin", "administracion",
    "hola", "hello", "presidencia", "direccion", "gerencia", "gerente",
    "proveedores", "compras", "rh", "recursoshumanos", "soporte", "support",
    "atencion", "atencionaclientes", "marketing", "mkt", "prensa", "ceo",
    "facturacion", "cobranza", "no-reply", "noreply", "eventos", "reservaciones",
]);

function capitalizar(token: string): string {
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

/**
 * Devuelve el nombre a usar en el saludo, o null si no hay ninguno decente.
 *
 * - "Andrés Bustillos"  → "Andrés"   (viene de una columna de nombre real)
 * - "elias.gamboa"      → "Elias"    (patrón nombre.apellido del correo)
 * - "lzaragoza"         → null       (inicial + apellido: no es un nombre)
 * - "presidencia"       → null       (buzón de función)
 */
export function greetingName(raw: string): string | null {
    const name = (raw ?? "").trim();
    if (!name) return null;

    // Vino de una columna de nombre: tiene espacios o mayúscula inicial.
    if (/\s/.test(name)) {
        const first = name.split(/\s+/)[0];
        if (BUZONES.has(first.toLowerCase())) return null;
        return first.length >= 2 ? first : null;
    }

    // Patrón nombre.apellido — el primer trozo suele ser el nombre de pila.
    if (name.includes(".")) {
        const first = name.split(".")[0];
        if (BUZONES.has(first.toLowerCase()) || first.length < 3) return null;
        return capitalizar(first);
    }

    // Token suelto. Si ya venía capitalizado, es un nombre escrito por alguien.
    if (/^[A-ZÁÉÍÓÚÑ]/.test(name)) {
        return BUZONES.has(name.toLowerCase()) ? null : name;
    }

    // Todo en minúsculas y sin puntos: puede ser "david" (nombre) o
    // "lzaragoza" (inicial + apellido). No hay forma fiable de distinguirlos,
    // así que se prefiere el saludo neutro antes que arriesgar el ridículo.
    return null;
}

/** El saludo completo, listo para el correo: «Hola Elias,» o «Hola,». */
export function greetingLine(raw: string): string {
    const first = greetingName(raw);
    return first ? `Hola ${first},` : "Hola,";
}
