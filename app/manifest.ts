import type { MetadataRoute } from "next";

// PWA del CRM. `start_url` apunta a /admin/networking porque es la pantalla
// para la que existe la app instalada: se abre en un evento, se captura un
// contacto y se cierra. El sitio público no necesita instalarse.
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "CRM Keting",
        short_name: "CRM",
        description: "Captura contactos y envía la presentación al instante.",
        start_url: "/admin/networking",
        scope: "/admin",
        display: "standalone",
        orientation: "portrait",
        background_color: "#F7F7F4",
        theme_color: "#111111",
        icons: [
            { src: "/crm-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/crm-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            // La maskable lleva margen propio: Android recorta el icono a la
            // forma del sistema y sin ese aire se comería los bordes de la K.
            { src: "/crm-icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    };
}
