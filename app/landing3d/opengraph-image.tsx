import { ketingOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Landing 3D · Keting Media · Experiencias web inmersivas";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return ketingOgImage({
        eyebrow: "Experiencia · 3D · WebGL",
        lineSans: "Landing 3D",
        lineSerif: "inmersiva.",
        sub: "Scrollytelling inmersivo para diferenciarte.",
        url: "ketingmedia.com/landing3d",
        theme: "dark",
    });
}
