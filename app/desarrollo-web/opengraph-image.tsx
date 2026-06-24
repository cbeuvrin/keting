import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Diseño Web · Keting Media · Sitios editoriales y e-commerce a medida";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "01 · Diseño Web",
        lineSans: "Sitios editoriales",
        lineSerif: "que escalan negocios.",
        sub: "Sitios web y e-commerce a medida.",
        url: "ketingmedia.com/desarrollo-web",
        theme: "dark",
    });
}
