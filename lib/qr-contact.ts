// Lectura de lo que traen los QR que la gente enseña en un evento.
//
// Hay tres formatos en la práctica y ninguno avisa cuál es:
//   · vCard   — el contacto completo de la agenda del teléfono
//   · MECARD  — el formato viejo, todavía común en Android
//   · wa.me   — el enlace de "mi WhatsApp", que solo trae el número
// Y a veces es un simple texto con un correo suelto dentro.
//
// Módulo puro: lo usa el navegador al escanear.

export type ContactoQr = {
    name: string;
    email: string;
    phone: string;
    company: string;
    /** Qué formato se reconoció, para poder decírselo a quien escanea. */
    formato: "vcard" | "mecard" | "whatsapp" | "texto" | "desconocido";
};

const VACIO: ContactoQr = { name: "", email: "", phone: "", company: "", formato: "desconocido" };

/** Deja el teléfono en dígitos, conservando el + inicial si lo traía. */
export function normalizaTelefono(raw: string): string {
    const limpio = raw.replace(/[^\d+]/g, "");
    return limpio.startsWith("+") ? "+" + limpio.slice(1).replace(/\+/g, "") : limpio;
}

function desdeVcard(texto: string): ContactoQr {
    const campo = (re: RegExp) => texto.match(re)?.[1]?.trim() ?? "";
    // FN es el nombre para mostrar; N viene por partes (apellido;nombre;…).
    let name = campo(/^FN[^:]*:(.+)$/im);
    if (!name) {
        const partes = campo(/^N[^:]*:(.+)$/im).split(";");
        name = [partes[1], partes[0]].filter(Boolean).join(" ").trim();
    }
    return {
        name,
        email: campo(/^EMAIL[^:]*:(.+)$/im).toLowerCase(),
        phone: normalizaTelefono(campo(/^TEL[^:]*:(.+)$/im)),
        company: campo(/^ORG[^:]*:(.+)$/im).split(";")[0].trim(),
        formato: "vcard",
    };
}

function desdeMecard(texto: string): ContactoQr {
    const campo = (clave: string) => {
        const m = texto.match(new RegExp(`${clave}:([^;]*);`, "i"));
        return m?.[1]?.trim() ?? "";
    };
    // En MECARD el nombre viene "Apellido,Nombre".
    const bruto = campo("N");
    const partes = bruto.split(",");
    return {
        name: partes.length > 1 ? `${partes[1]} ${partes[0]}`.trim() : bruto,
        email: campo("EMAIL").toLowerCase(),
        phone: normalizaTelefono(campo("TEL")),
        company: campo("ORG"),
        formato: "mecard",
    };
}

function desdeWhatsapp(texto: string): ContactoQr | null {
    // wa.me/521555…, api.whatsapp.com/send?phone=…, o el QR de "mi código"
    const m =
        texto.match(/wa\.me\/(\+?\d{7,15})/i) ||
        texto.match(/[?&]phone=(\+?\d{7,15})/i);
    if (!m) return null;
    return { ...VACIO, phone: normalizaTelefono(m[1]), formato: "whatsapp" };
}

/** Interpreta el contenido de un QR y devuelve lo que se pueda reconocer. */
export function parseQr(texto: string): ContactoQr {
    const t = (texto ?? "").trim();
    if (!t) return VACIO;

    if (/^BEGIN:VCARD/i.test(t)) return desdeVcard(t);
    if (/^MECARD:/i.test(t)) return desdeMecard(t);

    const wa = desdeWhatsapp(t);
    if (wa) return wa;

    // Texto suelto: se rescata lo que parezca correo o teléfono.
    const email = t.match(/[^\s<>@]+@[^\s<>@]+\.[a-z]{2,}/i)?.[0]?.toLowerCase() ?? "";
    const tel = t.match(/\+?\d[\d\s().-]{7,}/)?.[0] ?? "";
    if (email || tel) {
        return { ...VACIO, email, phone: normalizaTelefono(tel), formato: "texto" };
    }
    return VACIO;
}

/**
 * Número listo para wa.me: solo dígitos y con código de país. México se manda
 * sin el "1" después del 52 — WhatsApp lo acepta así y es como lo guardan casi
 * todos los teléfonos.
 */
export function paraWhatsapp(phone: string, ladaPorDefecto = "52"): string {
    let d = (phone ?? "").replace(/\D/g, "");
    if (!d) return "";
    if (d.startsWith("521") && d.length === 13) d = "52" + d.slice(3);
    if (d.length === 10) d = ladaPorDefecto + d; // número mexicano sin lada
    return d;
}
