import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

// Versión inglesa de la imagen para compartir. Sin este archivo, todas las rutas
// /en/* heredaban la del layout raíz, cuyo `alt` y cuyos textos están en
// español: al compartir una página inglesa en LinkedIn o X, la tarjeta de vista
// previa salía en español.
export const runtime = "nodejs";
export const alt = "Keting Media · Custom software, web and app development in Mexico, powered by AI";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "Software · Web · Apps · Mexico",
        lineSans: "Web design and ideas",
        lineSerif: "that scale businesses.",
        url: "ketingmedia.com/en",
        right: "info@ketingmedia.com · +52 55 4383 0150",
        theme: "dark",
    });
}
