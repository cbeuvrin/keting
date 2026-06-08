import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Soluciones Digitales · Keting Media · Apps hiper-personalizadas con IA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "02 · Soluciones Digitales",
        lineSans: "Apps con",
        lineSerif: "inteligencia.",
        sub: "Plataformas con IA para empresas que escalan.",
        url: "ketingmedia.com/soluciones-digitales",
        theme: "light",
    });
}
