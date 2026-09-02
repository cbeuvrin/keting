"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { CookieConsent } from "@/components/ui/cookie-consent";

// El botón de WhatsApp y el aviso de cookies son para las visitas del sitio.
// En /admin estorban —el aviso tapa el botón de guardar en el móvil— y no
// tienen sentido: es el panel privado de una sola persona.
export function SiteWidgets() {
    const pathname = usePathname() ?? "";
    if (pathname.startsWith("/admin")) return null;

    return (
        <>
            <WhatsAppButton />
            <CookieConsent />
        </>
    );
}
