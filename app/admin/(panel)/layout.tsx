import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminRequest } from "@/lib/admin-auth";

// Guard del panel: todo lo que cuelga de este grupo exige la cookie válida.
// El login vive FUERA del grupo, así que nunca entra en bucle de redirección.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    if (!(await isAdminRequest())) redirect("/admin/login");

    return (
        <>
            <header className="border-b border-[#1d1d1f]/10 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3">
                        <span className="font-bold tracking-tight">CRM</span>
                        <span className="text-[#1d1d1f]/30">·</span>
                        <span className="font-[family-name:var(--font-playfair)] italic">Keting</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link href="/admin" className="hover:underline underline-offset-4">Tablero</Link>
                        <Link href="/admin/campana" className="hover:underline underline-offset-4">Campaña</Link>
                        <Link href="/" className="text-[#1d1d1f]/50 hover:text-[#1d1d1f]">Ver sitio</Link>
                    </nav>
                </div>
            </header>
            {children}
        </>
    );
}
