import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Blog · Keting Media · Ideas que inspiran sobre diseño web, IA y crecimiento";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "Blog & Recursos",
        lineSans: "Ideas que",
        lineSerif: "inspiran.",
        url: "ketingmedia.com/blog",
        right: "Diseño · IA · Estrategia",
        theme: "light",
    });
}
