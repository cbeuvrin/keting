"use client";
import styles from "../sheet/sheet.module.css";
import { SheetHeader } from "../sheet/SheetHeader";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OWED_STATUSES, summarizeClient } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { Money, thCls } from "../ui";

// Lista de clientes. Alta rápida arriba (la primera captura es a mano) y una
// fila por cliente con lo que importa: si es fijo, cuánto ha pagado y cuánto
// debe. Al abrir uno se ve su ficha completa.

export function ClientesLista({ data }: { data: ClientesData }) {
    const { clients, projects, retainers, payments, today } = data;
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [draft, setDraft] = useState({ name: "", company: "", email: "", phone: "" });
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        return clients
            .filter((c) => showArchived || !c.archived)
            .filter((c) => !q || [c.name, c.company, c.email, c.phone].some((v) => v?.toLowerCase().includes(q)))
            .map((c) => summarizeClient(c, projects, retainers, payments, today));
    }, [clients, projects, retainers, payments, today, query, showArchived]);

    const create = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setSaving(true);
        const res = await fetch("/api/admin/clientes/clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
        });
        const json = await res.json().catch(() => ({}));
        setSaving(false);
        if (!res.ok) return window.alert(json.error ?? "No se pudo crear");
        router.push(`/admin/clientes/lista/${json.id}`);
    };

    const archivedCount = clients.filter((c) => c.archived).length;
    const totalOwed = rows.reduce((s, r) => s + r.owed, 0);

    return (
        <main className={styles.board}>
            <SheetHeader title="Clientes"><button type="button" disabled={saving} className={`${styles.button} ${styles.primary}`} onClick={() => setCreating(!creating)} aria-expanded={creating}>Nuevo cliente</button></SheetHeader>
            <div className={styles.strip}><span>Clientes<strong>{rows.length}</strong></span><span>Por cobrar<strong><Money value={totalOwed} /></strong></span><Link href="/admin/clientes/recurrentes">Fijos y recurrentes<strong>{retainers.length}</strong></Link><span className="ml-auto text-[10px]">Totales MXN</span></div>

            {creating && <form onSubmit={create} className={styles.capture}>

                <input required value={draft.name} onChange={(ev) => setDraft({ ...draft, name: ev.target.value })} placeholder="Nombre *" className={styles.search} />
                <input value={draft.company} onChange={(ev) => setDraft({ ...draft, company: ev.target.value })} placeholder="Empresa" className={styles.search} />
                <input value={draft.email} onChange={(ev) => setDraft({ ...draft, email: ev.target.value })} placeholder="Correo" type="email" className={styles.search} />
                <input value={draft.phone} onChange={(ev) => setDraft({ ...draft, phone: ev.target.value })} placeholder="Teléfono" className={styles.search} />
                <button type="submit" disabled={saving} className={styles.button}>
                    Agregar
                </button>
                <button type="button" disabled={saving} className={styles.button} onClick={() => setCreating(false)}>Cancelar</button>
            </form>}

            <div className={styles.toolbar}>
                <Link href="/admin/clientes/recurrentes" className={`${styles.button} order-2`}>Ver fijos mensuales y quincenales ({retainers.length})</Link>
                <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Buscar cliente…" className={styles.search} aria-label="Buscar cliente" type="search" />
                {archivedCount > 0 && (
                    <label className="flex items-center gap-2 text-sm text-[#1d1d1f]/60">
                        <input type="checkbox" checked={showArchived} onChange={(ev) => setShowArchived(ev.target.checked)} />
                        Ver archivados ({archivedCount})
                    </label>
                )}
            </div>

            <div className={styles.viewport}>
                <table className={styles.table} style={{ minWidth: 900 }} aria-label="Clientes y saldos"><colgroup>{[240, 115, 125, 160, 125, 135].map((width, i) => <col key={i} style={{ width }} />)}</colgroup>
                    <thead className="border-b border-[#1d1d1f]/10">
                        <tr>
                            <th className={thCls}>Cliente</th>
                            <th className={thCls}>Tipo</th>
                            <th className={`${thCls} text-right`}>Proyectos activos</th>
                            <th className={`${thCls} text-right`}>Tarifa recurrente / mes</th>
                            <th className={`${thCls} text-right`}>Pagado</th>
                            <th className={`${thCls} text-right`}>Debe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((s) => {
                            const active = s.projects.filter((p) => OWED_STATUSES.includes(p.project.status) || p.project.status === "esperando").length;
                            const monthly = s.retainers.filter((r) => r.balance.active).reduce((sum, r) => sum + r.retainer.monthly_amount * (r.retainer.frequency === "quincenal" ? 2 : 1), 0);
                            return (
                                <tr key={s.client.id} className="border-b border-[#1d1d1f]/[0.06] last:border-0 hover:bg-[#1d1d1f]/[0.02]">
                                    <td className="px-3 py-3">
                                        <Link href={`/admin/clientes/lista/${s.client.id}`} className={styles.client}>
                                            {s.client.company || s.client.name}
                                        </Link>
                                        {s.client.company && <div className={`${styles.small} px-1 pb-1`}>{s.client.name}</div>}
                                        {s.client.archived && <div className="text-xs text-[#1d1d1f]/40">archivado</div>}
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded ${s.isFixed ? "bg-[#edf3ee] text-[#326b54]" : "bg-[#1d1d1f]/[0.06] text-[#1d1d1f]/70"}`}>
                                            {s.isFixed ? "Fijo" : "Proyectos"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-right tabular-nums">{active}</td>
                                    <td className="px-3 py-3 text-right">{monthly > 0 ? <Money value={monthly} /> : <span className="text-[#1d1d1f]/30">—</span>}</td>
                                    <td className="px-3 py-3 text-right">
                                        <Money value={s.paidTotal} muted />
                                    </td>
                                    <td className="px-3 py-3 text-right font-medium">{s.owed > 0 ? <Money value={s.owed} /> : <span className="text-[#1d1d1f]/30">—</span>}</td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-3 py-10 text-center text-[#1d1d1f]/45">
                                    {clients.length === 0 ? "Todavía no hay clientes. Da de alta el primero arriba." : "Ningún cliente coincide con la búsqueda."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {rows.length > 1 && (
                        <tfoot className="border-t border-[#1d1d1f]/10">
                            <tr>
                                <td colSpan={5} className="px-3 py-3 text-right text-xs uppercase tracking-[0.12em] text-[#1d1d1f]/45">
                                    Total por cobrar
                                </td>
                                <td className="px-3 py-3 text-right font-bold">
                                    <Money value={totalOwed} />
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            <footer className={styles.footer}><span>{rows.length} clientes · Abre un cliente para editar sus datos y servicios.</span><span>Los saldos incluyen proyectos y cobros recurrentes.</span></footer>
        </main>
    );
}

