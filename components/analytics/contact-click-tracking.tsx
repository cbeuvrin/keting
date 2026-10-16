"use client";

import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

// Clics en los enlaces de contacto directo (WhatsApp, correo, teléfono),
// anunciados al dataLayer para que GTM los mande a GA4. Van por dataLayer y no
// por gtag() porque en este sitio no hay gtag.js: GA4 vive dentro de GTM, igual
// que el `generate_lead` del formulario.
//
// Un solo listener en el documento y no un onClick por enlace: estos enlaces
// están repartidos por el menú flotante, el footer, las páginas de servicio y
// el HTML de los artículos del blog, que viene de Supabase y no admite
// handlers de React.
function contactEvent(href: string): string | null {
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) return "contact_whatsapp";
    if (/^mailto:/i.test(href)) return "contact_email";
    if (/^tel:/i.test(href)) return "contact_phone";
    return null;
}

export function ContactClickTracking() {
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const link = (e.target as Element | null)?.closest?.("a[href]");
            if (!link) return;
            const event = contactEvent(link.getAttribute("href") ?? "");
            if (!event) return;
            // Los botones del menú flotante son solo ícono: no tienen texto
            // visible y su nombre está en aria-label.
            const text =
                (link.textContent ?? "").replace(/\s+/g, " ").trim() ||
                link.getAttribute("aria-label") ||
                "";
            sendGTMEvent({
                event,
                page_path: window.location.pathname,
                // GA4 corta los valores de parámetro a 100 caracteres.
                link_text: text.slice(0, 100),
            });
        }
        // En fase de captura, para que cuente aunque algún componente detenga
        // la propagación del clic.
        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, []);

    return null;
}
