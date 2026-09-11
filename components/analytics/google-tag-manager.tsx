"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Google Tag Manager, con /admin fuera.
//
// Por qué es un componente de cliente y no dos etiquetas en el layout: el
// layout raíz es el único con <html> en todo el proyecto, así que lo que se
// ponga ahí carga TAMBIÉN en el panel de /admin. Carlos entra al CRM varias
// veces al día y cada visita suya se contaba como tráfico del sitio: los
// informes dejaban de describir a los visitantes reales y pasaban a describir
// su propia jornada de trabajo. `usePathname` es la única forma de saber la
// ruta aquí arriba, y solo existe en el cliente.
//
// No se desmonta nada al navegar: si alguien llega a /admin desde una página
// pública sin recargar, GTM ya venía cargado y seguirá vivo. Para ese caso hay
// que añadir además una excepción de disparador dentro de GTM. Lo que esto sí
// garantiza es que entrar directo al panel —que es como se entra— no carga GTM
// en absoluto.
const GTM_ID = "GTM-P2NXTS5D";

export function GoogleTagManager() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;

    return (
        <>
            {/* GTM pide este <noscript> como primer elemento del <body>. */}
            <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                />
            </noscript>
            <Script id="google-tag-manager" strategy="afterInteractive">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
        </>
    );
}
