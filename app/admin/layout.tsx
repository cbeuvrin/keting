import type { Metadata } from "next";

// Raíz de todo /admin (incluido el login): fuera de buscadores y sin plantilla
// pública — ni header ni footer del sitio.
export const metadata: Metadata = {
    title: { absolute: "CRM · Keting" },
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-[#FAFAFA] text-[#1d1d1f]">{children}</div>;
}
