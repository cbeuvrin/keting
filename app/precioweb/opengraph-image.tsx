import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Precio Web · Keting Media · Tarifas claras para diseño web profesional";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "Inversión · Transparente",
        lineSans: "Precio",
        lineSerif: "sin sorpresas.",
        sub: "Alcance y tiempos claros, sin letra chica.",
        url: "ketingmedia.com/precioweb",
        theme: "dark",
    });
}
