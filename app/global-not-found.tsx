import type { Metadata } from "next";
import Link from "next/link";
import { RootDocument } from "@/components/layout/root-document";
import { SITE_URL } from "@/lib/seo/site";

// 404 de las URLs que no caen en ninguna ruta. Con varios layouts raíz (ver
// lib/seo/site.ts) Next no tiene uno con el que envolver ese 404 y servía una
// página desnuda: sin estilos, sin `lang` y con la imagen de compartir
// resuelta contra localhost. Va en los dos idiomas porque aquí no se sabe de
// cuál venía el visitante.
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "404 · Keting Media",
    robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
    return (
        <RootDocument lang="es">
            <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#1d1d1f]/40 font-mono mb-6">404</p>
                <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[#1d1d1f] mb-4">Esta página no existe.</h1>
                <p lang="en-US" className="text-base md:text-lg font-light text-[#1d1d1f]/60 mb-10">
                    This page doesn&apos;t exist.
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-[#1d1d1f]">
                    <Link href="/" className="underline underline-offset-4">Ir al inicio</Link>
                    <Link href="/en" lang="en-US" className="underline underline-offset-4">Go to the English site</Link>
                </div>
            </main>
        </RootDocument>
    );
}
