import type { Metadata } from "next";

// Página interna/experimental (demo de título animado). No debe indexarse.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function AnimatedTitleLayout({ children }: { children: React.ReactNode }) {
    return children;
}
