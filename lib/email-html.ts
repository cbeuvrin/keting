// Arma el HTML de los correos del CRM: cuerpo en texto plano convertido a
// párrafos + pie de baja + pixel de apertura. Compartido por el envío uno a
// uno (Banahost) y las campañas (Resend), para que aperturas y bajas se midan
// igual por los dos caminos.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ketingmedia.com";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function buildEmailHtml(opts: {
    bodyText: string;
    /** id de la fila en crm_emails — alimenta el pixel de apertura */
    emailId: string;
    /** id del lead — alimenta el enlace de baja */
    leadId: string;
}): string {
    const paragraphs = escapeHtml(opts.bodyText)
        .split(/\n{2,}/)
        .map((p) => `<p style="margin:0 0 16px 0;">${p.replace(/\n/g, "<br/>")}</p>`)
        .join("");

    const unsubUrl = `${SITE_URL}/api/t/u/${opts.leadId}`;
    const pixelUrl = `${SITE_URL}/api/t/o/${opts.emailId}`;

    return `<!doctype html>
<html lang="es"><body style="margin:0;padding:0;background:#fafafa;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1d1d1f;">
${paragraphs}
<p style="margin:28px 0 0 0;">—<br/>Keting Media · <a href="${SITE_URL}" style="color:#1d1d1f;">ketingmedia.com</a></p>
<p style="margin:24px 0 0 0;font-size:12px;color:#8e8e93;">
Si prefieres no recibir más correos nuestros, <a href="${unsubUrl}" style="color:#8e8e93;">date de baja aquí</a>.
</p>
</div>
<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;border:0;"/>
</body></html>`;
}

export function unsubscribeHeaders(leadId: string): Record<string, string> {
    return {
        "List-Unsubscribe": `<${SITE_URL}/api/t/u/${leadId}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    };
}
