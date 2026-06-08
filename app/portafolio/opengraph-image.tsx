import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Portafolio · Keting Media · Casos seleccionados de marcas que cambian su industria";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "Trabajo Selecto · 8 Casos",
        lineSans: "Marcas que cambian",
        lineSerif: "su industria.",
        url: "ketingmedia.com/portafolio",
        right: "10+ Marcas · 2020—2026",
        theme: "dark",
    });
}
