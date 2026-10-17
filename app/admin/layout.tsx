import type { Metadata } from "next";
import { RootDocument } from "@/components/layout/root-document";
import { SITE_URL } from "@/lib/seo/site";

// Raíz de todo /admin (incluido el login): fuera de buscadores y sin plantilla
// pública — ni header ni footer del sitio. Es uno de los layouts raíz del
// sitio (ver lib/seo/site.ts); GTM y los widgets ya se apagan solos en /admin.
export const metadata: Metadata = {
    // La URL base y la plantilla las heredaba del layout raíz único que había
    // antes; sin la base, Next resuelve la imagen de compartir contra localhost.
    metadataBase: new URL(SITE_URL),
    title: { absolute: "CRM · Keting", template: "%s · Keting Media" },
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootDocument lang="es">
            <div className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">{children}</div>
        </RootDocument>
    );
}
