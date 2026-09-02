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

export const PERSONAL_DEFAULT_SALUDO = "Hola {{nombre}}, mucho gusto.";

/**
 * Arma el saludo. Si el contacto no tiene un nombre presentable, la variable
 * se va y la frase se recompone sola: «Hola {{nombre}}, mucho gusto.» queda en
 * «Hola, mucho gusto.» — nunca «Hola , mucho gusto.».
 */
export function buildSaludo(plantilla: string, nombre: string): string {
    return plantilla
        .replace(/\{\{\s*nombre\s*\}\}/g, nombre)
        .replace(/\s+([,.;:!?])/g, "$1")
        .replace(/\s{2,}/g, " ")
        .trim();
}

export const PERSONAL_DEFAULT_BODY = `Soy Carlos Beuvrin, de Keting Media. Somos una compañía que crea páginas web, apps y soluciones digitales hiper-personalizadas para empresas como {{empresa}}.

Estuve viendo el sitio de {{empresa}} y nos gustaría proponerles algunas ideas de cómo su página podría mejorar: cómo se ve, qué tan rápido carga y cómo convertir de forma más eficiente las visitas en clientes.

Nosotros no usamos plantillas porque programamos a la medida con React y Next.js; con esta tecnología están hechas muchas de las aplicaciones que usamos a diario.

En caso de que estén pensando en trabajar con IA, también podemos integrarla en procesos internos, desde tareas que hoy se hacen a mano hasta un asistente que atienda a sus clientes, todo con la idea de reducir tareas repetitivas y aumentar la eficiencia.

Si les interesa la propuesta para mejorar la página, les puedo presentar una muestra de la página principal (home/inicio) sin costo y sin compromiso: la ven funcionando en su navegador y así deciden si quieren trabajar con nosotros.

Quisiera mostrarles nuestra página para que puedan revisar nuestros proyectos, nuestros clientes y qué hemos hecho: ketingmedia.com

Estamos muy interesados en trabajar con ustedes. Si quieren que hablemos por teléfono, mi número está en la firma.

¡Saludos!`;

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

/**
 * Convierte en enlace lo que ya se ve como una dirección: http(s)://…, www.…
 * o un dominio suelto (ketingmedia.com). Se aplica SOBRE texto ya escapado.
 * Los enlaces heredan el color del cliente de correo — un azul de marca sería
 * otra pista de plantilla.
 */
function linkify(html: string): string {
    return html.replace(
        /\b((?:https?:\/\/|www\.)[^\s<)]+|[a-z0-9-]+\.(?:com|mx|net|org|io|co|es)(?:\.[a-z]{2})?(?:\/[^\s<)]*)?)/gi,
        (match) => {
            // No re-enlazar lo que ya va dentro de un href.
            const href = /^https?:\/\//i.test(match) ? match : `https://${match}`;
            return `<a href="${href}">${match}</a>`;
        }
    );
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
    /** Plantilla del saludo, con {{nombre}} opcional */
    saludo?: string;
    emailId: string;
    leadId: string;
    /** Sin logo, el correo es texto puro y no se pueden medir aperturas. */
    conLogo: boolean;
    /**
     * Foto de Carlos arriba del saludo. Va pequeña y redonda a propósito: se
     * lee como el avatar de una persona escribiendo, no como la cabecera de
     * una campaña. Una imagen grande arriba es justo la señal que manda un
     * correo a Promociones en Gmail.
     */
    conFoto?: boolean;
}): { html: string; text: string } {
    const vars = varsFor(opts.lead);
    const saludo = buildSaludo(opts.saludo || PERSONAL_DEFAULT_SALUDO, vars.nombre);
    const cuerpo = fillVars(opts.body, vars).text.trim();
    const unsubUrl = `${SITE_URL}/api/t/u/${opts.leadId}`;
    const pixelUrl = `${SITE_URL}/api/t/o/${opts.emailId}`;

    // SIN declarar tipografía ni tamaño: cada cliente pinta el mensaje con la
    // suya, que es exactamente cómo se ve un correo escrito a mano. Declarar
    // una fuente —aunque sea la del sistema— hace que se note distinto al
    // resto de la bandeja, y eso ya delata la plantilla.
    const parrafos = esc(cuerpo)
        .split(/\n{2,}/)
        .map((p) => `<p style="margin:0 0 16px 0;">${linkify(p.replace(/\n/g, "<br/>"))}</p>`)
        .join("\n");

    const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;">
<div style="max-width:620px;padding-top:24px;">
${
    opts.conFoto
        ? `<p style="margin:0 0 18px 0;"><img src="${SITE_URL}/carlos-beuvrin-correo.png" width="72" height="72" alt="Carlos Beuvrin" style="border:0;width:72px;height:72px;border-radius:36px;display:block;"/></p>`
        : ""
}
<p style="margin:0 0 16px 0;">${esc(saludo)}</p>
${parrafos}
<p style="margin:22px 0 0 0;">${esc(opts.firma)}</p>
${
    opts.conLogo
        ? `<p style="margin:14px 0 0 0;"><a href="${SITE_URL}"><img src="${SITE_URL}/keting-logo-black.png" width="90" alt="Keting Media" style="border:0;width:90px;height:auto;"/></a></p>`
        : ""
}
<p style="margin:8px 0 0 0;font-size:13px;color:#777777;">
Keting Media &middot; <a href="${SITE_URL}" style="color:#777777;">ketingmedia.com</a> &middot; +52 55 4383 0150
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
Keting Media · ketingmedia.com · +52 55 4383 0150

Si prefieres que no te vuelva a escribir, dímelo y no insisto: ${unsubUrl}`;

    return { html, text };
}
