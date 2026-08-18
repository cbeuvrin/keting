// Plantilla de correo "Revisé tu web → prototipo sin costo".
//
// HTML de correo, no de web: todo va en tablas con estilos en línea porque
// Gmail/Outlook ignoran <style> y el CSS moderno. La identidad de Keting se
// traduce así: la barra negra del hero se vuelve un bloque negro a lo ancho
// (a prueba de balas: es fondo + texto, sin imágenes), la Playfair cursiva se
// sustituye por Georgia itálica (la serif que sí existe en todos los clientes)
// y el asterisco de la marca hace de viñeta. Imágenes servidas desde el
// propio sitio. Ancho 600px, el estándar que ningún cliente rompe.

import { SITE_URL } from "@/lib/email-html";

export const PROTOTIPO_WEB_SUBJECT = "Revisé tu sitio web — te propongo algo sin costo";

export function prototipoWebEmail(opts: {
    /** Nombre del lead; se usa solo el primer nombre en el saludo. */
    name: string;
    /** id de la fila crm_emails → pixel de apertura */
    emailId: string;
    /** id del lead → enlace de baja */
    leadId: string;
}): string {
    const firstName = opts.name.trim().split(/\s+/)[0] || "hola";
    const pixelUrl = `${SITE_URL}/api/t/o/${opts.emailId}`;
    const unsubUrl = `${SITE_URL}/api/t/u/${opts.leadId}`;
    const sans = "Arial, Helvetica, sans-serif";
    const serif = "Georgia, 'Times New Roman', serif";

    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>${PROTOTIPO_WEB_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background-color:#EFEFEA;">
<!-- Preheader: la línea que se ve en la bandeja junto al asunto -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
Un prototipo de tu nueva web, funcionando, sin costo y sin compromiso. Solo responde este correo.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFEFEA;">
<tr><td align="center" style="padding:32px 12px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">

    <!-- Logo -->
    <tr><td style="padding:0 8px 20px 8px;" align="left">
        <a href="${SITE_URL}" style="text-decoration:none;">
            <img src="${SITE_URL}/keting-logo-black.png" width="110" alt="Keting Media" style="display:block;border:0;width:110px;height:auto;"/>
        </a>
    </td></tr>

    <!-- La barra negra, marca de la casa -->
    <tr><td style="background-color:#111111;padding:36px 32px;" align="center">
        <div style="font-family:${sans};font-size:30px;line-height:1.15;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">
            REVIS&Eacute; TU SITIO WEB
        </div>
        <div style="font-family:${serif};font-style:italic;font-size:30px;line-height:1.2;color:#d8d8d3;padding-top:6px;">
            y puede dar m&aacute;s.
        </div>
    </td></tr>

    <!-- Mensaje -->
    <tr><td style="background-color:#ffffff;padding:36px 32px 8px 32px;">
        <p style="margin:0 0 18px 0;font-family:${sans};font-size:16px;line-height:1.65;color:#1d1d1f;">
            Hola ${firstName},
        </p>
        <p style="margin:0 0 18px 0;font-family:${sans};font-size:16px;line-height:1.65;color:#1d1d1f;">
            Soy Carlos, de <strong>Keting Media</strong> — dise&ntilde;amos y construimos sitios y software a medida en Ciudad de M&eacute;xico. Estuve viendo tu sitio web y encontr&eacute; varias cosas que, bien resueltas, pueden traducirse en m&aacute;s clientes: c&oacute;mo se ve, c&oacute;mo carga y c&oacute;mo convierte visitas en contactos.
        </p>
        <p style="margin:0 0 8px 0;font-family:${sans};font-size:16px;line-height:1.65;color:#1d1d1f;">
            En vez de cont&aacute;rtelo, prefiero <strong>mostr&aacute;rtelo</strong>:
        </p>
    </td></tr>

    <!-- La oferta -->
    <tr><td style="background-color:#ffffff;padding:8px 32px 4px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F5F0;border-left:3px solid #111111;">
            <tr><td style="padding:24px 24px 8px 24px;">
                <div style="font-family:${sans};font-size:20px;font-weight:bold;color:#1d1d1f;line-height:1.3;">
                    Un prototipo de tu nueva web.
                </div>
                <div style="font-family:${serif};font-style:italic;font-size:20px;color:#1d1d1f;line-height:1.4;padding-bottom:12px;">
                    Sin costo. Sin compromiso.
                </div>
            </td></tr>
            <tr><td style="padding:0 24px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td valign="top" style="font-family:${sans};font-size:16px;color:#1d1d1f;padding:0 10px 10px 0;">*</td>
                        <td style="font-family:${sans};font-size:15px;line-height:1.6;color:#3a3a3c;padding-bottom:10px;">Lo hago sobre tu marca y tu contenido real, no una maqueta gen&eacute;rica.</td>
                    </tr>
                    <tr>
                        <td valign="top" style="font-family:${sans};font-size:16px;color:#1d1d1f;padding:0 10px 10px 0;">*</td>
                        <td style="font-family:${sans};font-size:15px;line-height:1.6;color:#3a3a3c;padding-bottom:10px;">Lo ves funcionando en tu navegador, no en un PDF.</td>
                    </tr>
                    <tr>
                        <td valign="top" style="font-family:${sans};font-size:16px;color:#1d1d1f;padding:0 10px 0 0;">*</td>
                        <td style="font-family:${sans};font-size:15px;line-height:1.6;color:#3a3a3c;">Si te gusta, hablamos de construirlo. Si no, te quedas con las ideas — gratis igual.</td>
                    </tr>
                </table>
            </td></tr>
        </table>
    </td></tr>

    <!-- CTA -->
    <tr><td style="background-color:#ffffff;padding:28px 32px 12px 32px;" align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background-color:#111111;" align="center">
                <a href="mailto:info@ketingmedia.com?subject=S%C3%AD%2C%20quiero%20el%20prototipo"
                   style="display:inline-block;padding:16px 38px;font-family:${sans};font-size:13px;letter-spacing:3px;color:#ffffff;text-decoration:none;font-weight:bold;">
                    RESPONDER ESTE CORREO
                </a>
            </td></tr>
        </table>
        <p style="margin:14px 0 0 0;font-family:${sans};font-size:13px;color:#8e8e93;">
            Sin formularios ni llamadas: respondes, y con eso empiezo.
        </p>
    </td></tr>

    <!-- Trabajo reciente -->
    <tr><td style="background-color:#ffffff;padding:28px 32px 8px 32px;">
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
                <td width="48%" valign="top" style="padding-right:8px;">
                    <a href="${SITE_URL}/casos/los-didis" style="text-decoration:none;">
                        <img src="${SITE_URL}/soluciones/ipad-didis-3.png" width="260" alt="Los DiDis — control de acceso con QR" style="display:block;border:0;width:100%;height:auto;background-color:#F5F5F0;"/>
                    </a>
                    <div style="font-family:${sans};font-size:13px;color:#1d1d1f;font-weight:bold;padding-top:8px;">Los DiDis</div>
                    <div style="font-family:${sans};font-size:12px;color:#8e8e93;line-height:1.5;">Control de acceso con QR para evento</div>
                </td>
                <td width="4%">&nbsp;</td>
                <td width="48%" valign="top" style="padding-left:8px;">
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
    <tr><td style="background-color:#ffffff;padding:28px 32px 36px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E5E5E0;">
            <tr><td style="padding-top:22px;">
                <div style="font-family:${sans};font-size:15px;font-weight:bold;color:#1d1d1f;">Carlos Beuvrin</div>
                <div style="font-family:${serif};font-style:italic;font-size:14px;color:#8e8e93;padding-top:2px;">Fundador, Keting Media</div>
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
