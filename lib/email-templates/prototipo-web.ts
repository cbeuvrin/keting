// Plantilla de correo "Revisé tu web → prototipo sin costo".
//
// HTML de correo, no de web: todo va en tablas con estilos en línea porque
// Gmail/Outlook ignoran <style> y el CSS moderno (los media queries de <style>
// sí los respetan los clientes modernos; donde no, el diseño fluido aguanta).
// La identidad de Keting traducida: barra negra con el logo, Georgia itálica
// en lugar de Playfair, el asterisco como viñeta.
//
// LOS TEXTOS NO VIVEN AQUÍ: este archivo trae los textos por defecto
// (PROTOTIPO_DEFAULT_COPY), pero Carlos los edita desde /admin/plantilla y se
// guardan en Supabase (crm_settings). El envío mezcla lo guardado sobre los
// defaults, así que borrar un campo en el editor lo devuelve al de fábrica.
//
// Este módulo debe seguir siendo puro (sin imports de servidor): el editor lo
// importa desde el navegador para la vista previa en vivo.

import { SITE_URL } from "@/lib/email-html";
import { greetingLine } from "@/lib/email-templates/greeting";

export type PrototipoCopy = {
    subject: string;
    /** La línea que se ve en la bandeja junto al asunto */
    preheader: string;
    /** Párrafos de apertura; admiten **negritas** */
    intro1: string;
    intro2: string;
    ofertaTitulo: string;
    ofertaSub: string;
    /** Una viñeta por línea en el editor */
    bullets: string[];
    ctaLabel: string;
    ctaNota: string;
    firmaNombre: string;
    firmaCargo: string;
};

export const PROTOTIPO_DEFAULT_COPY: PrototipoCopy = {
    subject: "Revisé tu sitio web — te propongo algo sin costo",
    preheader: "Un prototipo de tu nueva web, funcionando, sin costo y sin compromiso. Solo responde este correo.",
    intro1: "Soy Carlos Beuvrin, de **Keting Media** — diseñamos y construimos sitios y software a medida en Ciudad de México. Estuve viendo tu sitio web y encontré varias cosas que, bien resueltas, pueden traducirse en más clientes: cómo se ve, cómo carga y cómo convierte visitas en contactos.",
    intro2: "En vez de contártelo, prefiero **mostrártelo**:",
    ofertaTitulo: "Un prototipo de tu nueva web.",
    ofertaSub: "Sin costo. Sin compromiso.",
    bullets: [
        "Lo hago sobre tu marca y tu contenido real, no una maqueta genérica.",
        "Lo ves funcionando en tu navegador, no en un PDF.",
        "Si te gusta, hablamos de construirlo. Si no, te quedas con las ideas — gratis igual.",
    ],
    ctaLabel: "RESPONDER ESTE CORREO",
    ctaNota: "Sin formularios ni llamadas: respondes, y con eso empiezo.",
    firmaNombre: "Carlos Beuvrin",
    firmaCargo: "Fundador, Keting Media",
};

// Escapa HTML y luego permite **negritas** — lo único de formato que el
// editor expone. Así un texto pegado con < o & no rompe la maqueta.
function fmt(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function prototipoWebEmail(opts: {
    /** Nombre del lead; greetingLine decide si es usable en el saludo. */
    name: string;
    /** id de la fila crm_emails → pixel de apertura */
    emailId: string;
    /** id del lead → enlace de baja */
    leadId: string;
    /** Textos guardados en el panel; lo que falte cae al default. */
    copy?: Partial<PrototipoCopy>;
}): string {
    const c: PrototipoCopy = { ...PROTOTIPO_DEFAULT_COPY, ...opts.copy };
    if (!Array.isArray(c.bullets) || c.bullets.length === 0) {
        c.bullets = PROTOTIPO_DEFAULT_COPY.bullets;
    }
    const saludo = greetingLine(opts.name);
    const pixelUrl = `${SITE_URL}/api/t/o/${opts.emailId}`;
    const unsubUrl = `${SITE_URL}/api/t/u/${opts.leadId}`;
    const sans = "Arial, Helvetica, sans-serif";
    const serif = "Georgia, 'Times New Roman', serif";

    const bulletRows = c.bullets
        .map(
            (b, i) => `                    <tr>
                        <td valign="top" style="font-family:${sans};font-size:16px;color:#1d1d1f;padding:0 10px ${i === c.bullets.length - 1 ? "0" : "10px"} 0;">*</td>
                        <td style="font-family:${sans};font-size:15px;line-height:1.6;color:#3a3a3c;${i === c.bullets.length - 1 ? "" : "padding-bottom:10px;"}">${fmt(b)}</td>
                    </tr>`
        )
        .join("\n");

    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>${fmt(c.subject)}</title>
<style>
@media only screen and (max-width:480px){
    .bar{padding:16px 20px !important;}
    .bar img{width:120px !important;}
    .px{padding-left:20px !important;padding-right:20px !important;}
    .stack{display:block !important;width:100% !important;padding:0 0 18px 0 !important;}
    .gap{display:none !important;}
    .h-offer{font-size:18px !important;}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:#EFEFEA;">
<!-- Preheader: la línea que se ve en la bandeja junto al asunto -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
${fmt(c.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFEFEA;">
<tr><td align="center" style="padding:32px 12px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

    <!-- La barra negra con el logo, marca de la casa -->
    <tr><td class="bar" style="background-color:#111111;padding:22px 32px;" align="center">
        <a href="${SITE_URL}" style="text-decoration:none;">
            <img src="${SITE_URL}/keting-logo-white.png" width="140" alt="Keting Media" style="display:block;border:0;width:140px;height:auto;"/>
        </a>
    </td></tr>

    <!-- Mensaje -->
    <tr><td class="px" style="background-color:#ffffff;padding:36px 32px 8px 32px;">
        <p style="margin:0 0 18px 0;font-family:${sans};font-size:16px;line-height:1.65;color:#1d1d1f;">
            ${fmt(saludo)}
        </p>
        <p style="margin:0 0 18px 0;font-family:${sans};font-size:16px;line-height:1.65;color:#1d1d1f;">
            ${fmt(c.intro1)}
        </p>
        <p style="margin:0 0 8px 0;font-family:${sans};font-size:16px;line-height:1.65;color:#1d1d1f;">
            ${fmt(c.intro2)}
        </p>
    </td></tr>

    <!-- La oferta -->
    <tr><td class="px" style="background-color:#ffffff;padding:8px 32px 4px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F5F0;border-left:3px solid #111111;">
            <tr><td style="padding:24px 24px 8px 24px;">
                <div class="h-offer" style="font-family:${sans};font-size:20px;font-weight:bold;color:#1d1d1f;line-height:1.3;">
                    ${fmt(c.ofertaTitulo)}
                </div>
                <div class="h-offer" style="font-family:${serif};font-style:italic;font-size:20px;color:#1d1d1f;line-height:1.4;padding-bottom:12px;">
                    ${fmt(c.ofertaSub)}
                </div>
            </td></tr>
            <tr><td style="padding:0 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
${bulletRows}
                </table>
            </td></tr>
        </table>
    </td></tr>

    <!-- CTA -->
    <tr><td class="px" style="background-color:#ffffff;padding:28px 32px 12px 32px;" align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background-color:#111111;" align="center">
                <a href="mailto:info@ketingmedia.com?subject=S%C3%AD%2C%20quiero%20el%20prototipo"
                   style="display:inline-block;padding:16px 38px;font-family:${sans};font-size:13px;letter-spacing:3px;color:#ffffff;text-decoration:none;font-weight:bold;">
                    ${fmt(c.ctaLabel)}
                </a>
            </td></tr>
        </table>
        <p style="margin:14px 0 0 0;font-family:${sans};font-size:13px;color:#8e8e93;">
            ${fmt(c.ctaNota)}
        </p>
    </td></tr>

    <!-- Trabajo reciente -->
    <tr><td class="px" style="background-color:#ffffff;padding:28px 32px 8px 32px;">
        <div style="font-family:${sans};font-size:11px;letter-spacing:3px;color:#8e8e93;padding-bottom:14px;">
            &mdash;&mdash; TRABAJO RECIENTE
        </div>
        <!-- Web a lo ancho (lo que se ofrece) + dos apps gemelas debajo -->
        <a href="${SITE_URL}/casos" style="text-decoration:none;">
            <img src="${SITE_URL}/soluciones/gobernia-imac.png" width="536" alt="Gobernia — plataforma web de agentes de IA" style="display:block;border:0;width:100%;height:auto;background-color:#F5F5F0;"/>
        </a>
        <div style="font-family:${sans};font-size:13px;color:#1d1d1f;font-weight:bold;padding-top:8px;">Gobernia</div>
        <div style="font-family:${sans};font-size:12px;color:#8e8e93;line-height:1.5;padding-bottom:18px;">Plataforma web de agentes de IA</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="stack" width="48%" valign="top" style="padding-right:8px;">
                    <a href="${SITE_URL}/casos/los-didis" style="text-decoration:none;">
                        <img src="${SITE_URL}/soluciones/ipad-didis-3.png" width="260" alt="Los DiDis — control de acceso con QR" style="display:block;border:0;width:100%;height:auto;background-color:#F5F5F0;"/>
                    </a>
                    <div style="font-family:${sans};font-size:13px;color:#1d1d1f;font-weight:bold;padding-top:8px;">Los DiDis</div>
                    <div style="font-family:${sans};font-size:12px;color:#8e8e93;line-height:1.5;">Control de acceso con QR para evento</div>
                </td>
                <td class="gap" width="4%">&nbsp;</td>
                <td class="stack" width="48%" valign="top" style="padding-left:8px;">
                    <a href="${SITE_URL}/casos/suzuki" style="text-decoration:none;">
                        <img src="${SITE_URL}/soluciones/suzuki-ipad.png" width="260" alt="Suzuki — quiz interactivo en iPad" style="display:block;border:0;width:100%;height:auto;background-color:#F5F5F0;"/>
                    </a>
                    <div style="font-family:${sans};font-size:13px;color:#1d1d1f;font-weight:bold;padding-top:8px;">Suzuki</div>
                    <div style="font-family:${sans};font-size:12px;color:#8e8e93;line-height:1.5;">Quiz interactivo en iPad, 500+ personas</div>
                </td>
            </tr>
        </table>
        <p style="margin:16px 0 0 0;font-family:${sans};font-size:13px;color:#8e8e93;">
            M&aacute;s casos en <a href="${SITE_URL}/casos" style="color:#1d1d1f;">ketingmedia.com/casos</a> &mdash; con m&eacute;tricas reales de cada proyecto.
        </p>
    </td></tr>

    <!-- Firma -->
    <tr><td class="px" style="background-color:#ffffff;padding:28px 32px 36px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E5E5E0;">
            <tr><td style="padding-top:22px;">
                <div style="font-family:${sans};font-size:15px;font-weight:bold;color:#1d1d1f;">${fmt(c.firmaNombre)}</div>
                <div style="font-family:${serif};font-style:italic;font-size:14px;color:#8e8e93;padding-top:2px;">${fmt(c.firmaCargo)}</div>
                <div style="font-family:${sans};font-size:13px;color:#8e8e93;padding-top:8px;">
                    <a href="${SITE_URL}" style="color:#1d1d1f;">ketingmedia.com</a>
                    &nbsp;&middot;&nbsp; Ciudad de M&eacute;xico
                    &nbsp;&middot;&nbsp; <a href="tel:5543830150" style="color:#1d1d1f;">+52 55 4383 0150</a>
                </div>
            </td></tr>
        </table>
    </td></tr>

    <!-- Pie legal -->
    <tr><td style="padding:20px 16px 0 16px;" align="center">
        <p style="margin:0;font-family:${sans};font-size:11px;line-height:1.6;color:#a1a1a6;">
            Recibes este correo porque tu negocio aparece p&uacute;blicamente o hemos tenido contacto.<br/>
            Si prefieres no recibir m&aacute;s correos, <a href="${unsubUrl}" style="color:#a1a1a6;">date de baja aqu&iacute;</a>.
        </p>
    </td></tr>

</table>
</td></tr>
</table>
<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;border:0;"/>
</body>
</html>`;
}
