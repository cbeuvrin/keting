"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Table2, Send, FileText, ScanLine, ExternalLink } from "lucide-react";

// Barra lateral fija del panel. En móvil se reparte en cinco columnas iguales
// con el icono sobre la etiqueta: en fila los cinco enlaces medían 544 px en
// una pantalla de 390 y arrastraban toda la página de lado.

const NAV = [
    { href: "/admin", label: "Inicio", short: "Inicio", icon: LayoutDashboard },
    { href: "/admin/contactos", label: "Contactos", short: "Contactos", icon: Table2 },
    { href: "/admin/networking", label: "Networking", short: "Evento", icon: ScanLine },
    { href: "/admin/campana", label: "Campaña", short: "Campaña", icon: Send },
    { href: "/admin/plantilla", label: "Plantilla", short: "Plantilla", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname() ?? "";

    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    return (
        <aside className="md:w-[220px] md:shrink-0 md:min-h-screen sticky top-0 z-30 md:z-auto bg-white border-b md:border-b-0 md:border-r border-[#1d1d1f]/10">
            <div className="hidden md:block px-6 pt-7 pb-8">
                <Link href="/admin" className="flex items-baseline gap-2">
                    <span className="font-bold tracking-tight text-lg">CRM</span>
                    <span className="text-[#1d1d1f]/25">·</span>
                    <span className="font-[family-name:var(--font-playfair)] italic text-[#1d1d1f]/70">
                        Keting
                    </span>
                </Link>
            </div>

            <nav className="grid grid-cols-5 md:flex md:flex-col gap-0.5 md:gap-1 px-1.5 md:px-3 py-1.5 md:py-0">
                {NAV.map(({ href, label, short, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2.5 px-1 md:px-3 py-2 md:py-2.5 rounded-md text-[11px] md:text-sm transition-colors ${
                                active
                                    ? "bg-[#111111] text-white"
                                    : "text-[#1d1d1f]/70 hover:bg-[#1d1d1f]/[0.05] hover:text-[#1d1d1f]"
                            }`}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                            <span className="max-w-full truncate leading-none md:leading-normal">{short}</span>
                            <span className="sr-only">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="hidden md:block absolute bottom-0 w-[220px] p-3">
                <a
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-[#1d1d1f]/45 hover:text-[#1d1d1f] hover:bg-[#1d1d1f]/[0.05] transition-colors"
                >
                    <ExternalLink className="w-[18px] h-[18px]" strokeWidth={1.75} />
                    Ver sitio
                </a>
            </div>
        </aside>
    );
}
