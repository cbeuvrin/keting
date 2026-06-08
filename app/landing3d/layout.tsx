import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Landing 3D · Experiencias web inmersivas",
    description:
        "Experimentos en landing pages 3D y scrollytelling para marcas que necesitan diferenciarse. WebGL, animaciones físicas y storytelling visual.",
    keywords: [
        "landing page 3d",
        "scrollytelling",
        "webgl agencia méxico",
        "web inmersiva",
        "experiencia interactiva",
    ],
    alternates: { canonical: "/landing3d" },
    openGraph: {
        title: "Landing 3D · Keting Media",
        description: "Experiencias web inmersivas con WebGL y scrollytelling.",
        url: "/landing3d",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Landing 3D · Keting Media",
        description: "Experiencias web inmersivas para marcas diferentes.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
