import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Keting Media · Diseño y desarrollo de software, web y apps a medida con IA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "Software · Web · Apps · México",
        lineSans: "Diseño web e ideas",
        lineSerif: "que escalan negocios.",
        url: "ketingmedia.com",
        right: "info@ketingmedia.com · +52 55 4383 0150",
        theme: "dark",
    });
}
