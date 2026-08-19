"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Table2, Send, FileText, ExternalLink } from "lucide-react";

// Barra lateral fija del panel. En móvil se convierte en una tira horizontal
// arriba (mismo orden, solo iconos + etiqueta corta) para no comerse la
// pantalla.

const NAV = [
    { href: "/admin", label: "Inicio", short: "Inicio", icon: LayoutDashboard },
    { href: "/admin/contactos", label: "Contactos", short: "Contactos", icon: Table2 },
    { href: "/admin/campana", label: "Campaña", short: "Campaña", icon: Send },
    { href: "/admin/plantilla", label: "Plantilla", short: "Plantilla", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname() ?? "";

    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    return (
        <aside className="md:w-[220px] md:shrink-0 md:min-h-screen md:sticky md:top-0 bg-white border-b md:border-b-0 md:border-r border-[#1d1d1f]/10">
            <div className="hidden md:block px-6 pt-7 pb-8">
                <Link href="/admin" className="flex items-baseline gap-2">
                    <span className="font-bold tracking-tight text-lg">CRM</span>
                    <span className="text-[#1d1d1f]/25">·</span>
                    <span className="font-[family-name:var(--font-playfair)] italic text-[#1d1d1f]/70">
                        Keting
                    </span>
                </Link>
            </div>

            <nav className="flex md:flex-col gap-1 px-3 md:px-3 py-2 md:py-0 overflow-x-auto">
                {NAV.map(({ href, label, short, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                                active
                                    ? "bg-[#111111] text-white"
                                    : "text-[#1d1d1f]/70 hover:bg-[#1d1d1f]/[0.05] hover:text-[#1d1d1f]"
                            }`}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                            <span className="md:inline">{short}</span>
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
