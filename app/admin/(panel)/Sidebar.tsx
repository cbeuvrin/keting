"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Table2, Send, FileText, ScanLine, ExternalLink, BarChart3, Users, FolderKanban, Wallet, CircleDollarSign, CalendarDays, PanelLeftClose, PanelLeftOpen } from "lucide-react";

// Barra lateral fija del panel ADM, con dos grupos: CRM (prospección) y
// CLIENTES (cobranza). En escritorio se ven los dos grupos apilados. En móvil
// arriba va un selector CRM | CLIENTES y debajo solo las pestañas del grupo
// actual, repartidas en columnas iguales con el icono sobre la etiqueta: en
// fila los enlaces medían 544 px en una pantalla de 390 y arrastraban toda la
// página de lado.

const GROUPS = [
    {
        key: "crm",
        title: "CRM",
        home: "/admin",
        items: [
            { href: "/admin", label: "Inicio", short: "Inicio", icon: LayoutDashboard },
            { href: "/admin/contactos", label: "Contactos", short: "Contactos", icon: Table2 },
            { href: "/admin/networking", label: "Networking", short: "Evento", icon: ScanLine },
            { href: "/admin/campana", label: "Campaña", short: "Campaña", icon: Send },
            { href: "/admin/plantilla", label: "Plantilla", short: "Plantilla", icon: FileText },
        ],
    },
    {
        key: "clientes",
        title: "CLIENTES",
        home: "/admin/clientes",
        items: [
            { href: "/admin/clientes", label: "Finanzas", short: "Finanzas", icon: BarChart3 },
            { href: "/admin/clientes/recurrentes", label: "Fijos mensuales y quincenales", short: "Fijos", icon: CalendarDays },
            { href: "/admin/clientes/cobros", label: "Cobros", short: "Cobros", icon: CircleDollarSign },
            { href: "/admin/clientes/lista", label: "Clientes", short: "Clientes", icon: Users },
            { href: "/admin/clientes/proyectos", label: "Proyectos", short: "Proyectos", icon: FolderKanban },
            { href: "/admin/clientes/pagos", label: "Pagos", short: "Pagos", icon: Wallet },
        ],
    },
];

// Las portadas de grupo solo se marcan en su ruta exacta; si no, "/admin"
// quedaría activo en todo el panel.
const EXACT = new Set(GROUPS.map((g) => g.home));

export function Sidebar() {
    const pathname = usePathname() ?? "";
    const [collapsed, setCollapsed] = useState(true);
    const compact = collapsed && pathname.startsWith("/admin/clientes");

    const isActive = (href: string) => (EXACT.has(href) ? pathname === href : pathname.startsWith(href));
    const current = pathname.startsWith("/admin/clientes") ? "clientes" : "crm";
    const currentGroup = GROUPS.find((g) => g.key === current)!;

    const linkCls = (active: boolean) =>
        `flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2.5 px-1 md:px-3 py-2 md:py-2.5 rounded-md text-[11px] md:text-sm transition-colors ${
            active ? "bg-[#111111] text-white" : "text-[#1d1d1f]/70 hover:bg-[#1d1d1f]/[0.05] hover:text-[#1d1d1f]"
        }`;

    const renderItem = ({ href, label, short, icon: Icon }: (typeof GROUPS)[number]["items"][number]) => (
        <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} title={label} className={`${linkCls(isActive(href))} ${compact ? "md:!justify-center md:!px-2" : ""}`}>
            <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
            <span className={`max-w-full truncate leading-none md:leading-normal ${compact ? "md:hidden" : ""}`}>{short}</span>
            <span className="sr-only">{label}</span>
        </Link>
    );

    return (
        <aside className={`${compact ? "md:w-14" : "md:w-[200px]"} md:shrink-0 md:h-dvh md:overflow-y-auto sticky top-0 z-30 md:z-auto bg-white border-b md:border-b-0 md:border-r border-[#1d1d1f]/10`}>
            <div className="hidden md:flex items-center justify-between px-3 py-4">
                {!compact && <Link href="/admin" className="text-sm font-semibold">Keting <span className="font-normal text-[#1d1d1f]/40">ADM</span></Link>}
                {pathname.startsWith("/admin/clientes") && <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={compact ? "Expandir menú" : "Contraer menú"} title={compact ? "Expandir menú" : "Contraer menú"} className="rounded p-1.5 hover:bg-black/5">{compact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>}
            </div>

            {/* Móvil: selector de grupo + pestañas del grupo actual. */}
            <div className="md:hidden">
                <div className="flex gap-1 px-1.5 pt-1.5">
                    {GROUPS.map((g) => (
                        <Link
                            key={g.key}
                            href={g.home}
                            className={`flex-1 text-center py-1.5 rounded-md text-[11px] font-medium tracking-[0.12em] transition-colors ${
                                g.key === current ? "bg-[#1d1d1f]/[0.07] text-[#1d1d1f]" : "text-[#1d1d1f]/45"
                            }`}
                        >
                            {g.title}
                        </Link>
                    ))}
                </div>
                <nav
                    className="grid gap-0.5 px-1.5 py-1.5"
                    style={{ gridTemplateColumns: `repeat(${currentGroup.items.length}, minmax(0, 1fr))` }}
                >
                    {currentGroup.items.map(renderItem)}
                </nav>
            </div>

            {/* Escritorio: los dos grupos apilados. */}
            <nav className={`hidden md:flex md:flex-col gap-5 ${compact ? "px-1.5" : "px-3"} pb-16`}>
                {GROUPS.map((g) => (
                    <div key={g.key} className="flex flex-col gap-1">
                        <p className={`${compact ? "text-center text-[8px]" : "px-3 text-[11px]"} pb-1 font-medium tracking-[0.1em] text-[#1d1d1f]/40`}>{compact && g.key === "clientes" ? "GESTIÓN" : g.title}</p>
                        {g.items.map(renderItem)}
                    </div>
                ))}
            </nav>

            <div className="hidden md:block p-2">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-[#1d1d1f]/45 hover:text-[#1d1d1f] hover:bg-[#1d1d1f]/[0.05] transition-colors"
                >
                    <ExternalLink className="w-[18px] h-[18px]" strokeWidth={1.75} />
                    <span className={compact ? "hidden" : ""}>Ver sitio</span>
                </Link>
            </div>
        </aside>
    );
}
