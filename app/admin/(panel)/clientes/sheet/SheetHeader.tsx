"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sheet.module.css";

const SECTIONS = [
    ["/admin/clientes", "Finanzas"],
    ["/admin/clientes/lista", "Clientes"],
    ["/admin/clientes/proyectos", "Proyectos"],
    ["/admin/clientes/recurrentes", "Fijos"],
    ["/admin/clientes/pagos", "Pagos"],
];
export function SheetHeader({ title, children }: { title: string; children?: ReactNode }) {
    const pathname = usePathname();
    return <header className={styles.header}>
        <h1>{title}</h1>
        <div className={styles.actions}>
            <nav aria-label="Secciones financieras" className={styles.actions}>{SECTIONS.map(([href, label]) => <Link key={href} href={href} className={styles.button} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>
            {children}
        </div>
    </header>;
}
