// Correo "personal": el que parece escrito a mano aunque salga a cincuenta.
//
// Por qué existe: la plantilla con diseño (prototipo-web.ts) aterriza en la
// pestaña Promociones de Gmail —hero, botón, pie de campaña son las señales que
// la clasifican ahí— y compite con la publicidad, donde nadie lee. Este otro
// es texto corrido con una firma chica: cae en Principal, parece de una persona
// y por eso se responde, que es lo único que perseguimos.
//
// El logo va como firma (90px), no como cabecera: una firma con logo es lo que
// tiene cualquier correo de empresa, y de paso permite medir aperturas sin
// añadir nada raro, porque ya hay una imagen en el mensaje.
//
// Módulo puro (sin imports de servidor): la vista previa del panel lo usa
// desde el navegador.

import { SITE_URL } from "@/lib/email-html";
import { greetingLine } from "@/lib/email-templates/greeting";

/** Datos del destinatario disponibles como variables del texto. */
export type PersonalVars = {
    nombre: string;
    empresa: string;
    correo: string;
};

export const PERSONAL_VARIABLES = ["nombre", "empresa", "correo"] as const;

export const PERSONAL_DEFAULT_BODY = `Soy Carlos, de Keting Media. Estuve viendo el sitio de {{empresa}} y me quedé con un par de ideas de cómo podría trabajar mejor: cómo se ve, qué tan rápido carga y cómo convierte las visitas en clientes.

Si te interesa, te armo un prototipo de la nueva versión sin costo y sin compromiso — sobre tu marca y tu contenido, no una maqueta genérica. Lo ves funcionando en tu navegador y decides.

¿Te lo mando?`;

/**
 * Sustituye {{variables}} en el texto. Devuelve también cuáles quedaron sin
 * valor, para poder avisar ANTES de enviar en vez de mandar frases cojas
 * ("vi el sitio de " sin empresa).
 */
export function fillVars(
    text: string,
    vars: PersonalVars
): { text: string; missing: string[] } {
    const missing: string[] = [];
    const out = text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key: string) => {
        const value = (vars as Record<string, string>)[key];
        if (!value) {
            if (!missing.includes(key)) missing.push(key);
            return "";
        }
        return value;
    });
    return { text: out.replace(/[ \t]+/g, " ").replace(/ ([,.;:])/g, "$1"), missing };
}

function esc(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Variables de un lead, listas para fillVars. */
export function varsFor(lead: { name: string; company: string | null; email: string | null }): PersonalVars {
    const saludo = greetingLine(lead.name);
    return {
        // greetingLine ya decidió si el nombre es presentable; aquí solo se
        // extrae, sin el "Hola" ni la coma.
        nombre: saludo === "Hola," ? "" : saludo.slice(5, -1),
        empresa: lead.company ?? "",
        correo: lead.email ?? "",
    };
}

export function personalEmail(opts: {
    lead: { name: string; company: string | null; email: string | null };
    /** Cuerpo con {{variables}}, tal como lo escribió Carlos */
    body: string;
    firma: string;
    emailId: string;
    leadId: string;
    /** Sin logo, el correo es texto puro y no se pueden medir aperturas. */
    conLogo: boolean;
}): { html: string; text: string } {
    const vars = varsFor(opts.lead);
    const saludo = greetingLine(opts.lead.name);
    const cuerpo = fillVars(opts.body, vars).text.trim();
    const unsubUrl = `${SITE_URL}/api/t/u/${opts.leadId}`;
    const pixelUrl = `${SITE_URL}/api/t/o/${opts.emailId}`;

    // Fuente del sistema: la que usa el propio cliente de correo para redactar.
    // Nada de tipografías de marca aquí — delatan la plantilla.
    const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    const parrafos = esc(cuerpo)
        .split(/\n{2,}/)
        .map((p) => `<p style="margin:0 0 16px 0;">${p.replace(/\n/g, "<br/>")}</p>`)
        .join("\n");

    const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;">
<div style="font-family:${font};font-size:15px;line-height:1.6;color:#222222;max-width:620px;padding:8px;">
<p style="margin:0 0 16px 0;">${esc(saludo)}</p>
${parrafos}
<p style="margin:22px 0 0 0;">${esc(opts.firma)}</p>
${
    opts.conLogo
        ? `<p style="margin:14px 0 0 0;"><a href="${SITE_URL}"><img src="${SITE_URL}/keting-logo-black.png" width="90" alt="Keting Media" style="border:0;width:90px;height:auto;"/></a></p>`
        : ""
}
<p style="margin:8px 0 0 0;font-size:13px;color:#777777;">
<a href="${SITE_URL}" style="color:#777777;">ketingmedia.com</a> &middot; +52 55 4383 0150
</p>
<p style="margin:20px 0 0 0;font-size:12px;color:#9a9a9a;">
Si prefieres que no te vuelva a escribir, <a href="${unsubUrl}" style="color:#9a9a9a;">dímelo aquí</a> y no insisto.
</p>
</div>
${opts.conLogo ? `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;border:0;"/>` : ""}
</body></html>`;

    const text = `${saludo}

${cuerpo}

${opts.firma}
ketingmedia.com · +52 55 4383 0150

Si prefieres que no te vuelva a escribir, dímelo y no insisto: ${unsubUrl}`;

    return { html, text };
}
