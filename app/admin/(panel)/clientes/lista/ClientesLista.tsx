"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OWED_STATUSES, summarizeClient } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { buttonCls, cardCls, inputCls, Money, PageHeader, thCls } from "../ui";

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
        <main className="px-6 md:px-8 py-8 max-w-[1400px]">
            <PageHeader title="Clientes." accent={`${rows.length} ${rows.length === 1 ? "cliente" : "clientes"}`} />

            <form onSubmit={create} className={`${cardCls} p-5 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] items-end`}>
                <h2 className="sm:col-span-2 lg:col-span-5 font-bold tracking-tight">Nuevo cliente</h2>
                <input required value={draft.name} onChange={(ev) => setDraft({ ...draft, name: ev.target.value })} placeholder="Nombre *" className={inputCls} />
                <input value={draft.company} onChange={(ev) => setDraft({ ...draft, company: ev.target.value })} placeholder="Empresa" className={inputCls} />
                <input value={draft.email} onChange={(ev) => setDraft({ ...draft, email: ev.target.value })} placeholder="Correo" type="email" className={inputCls} />
                <input value={draft.phone} onChange={(ev) => setDraft({ ...draft, phone: ev.target.value })} placeholder="Teléfono" className={inputCls} />
                <button type="submit" disabled={saving} className={buttonCls}>
                    Agregar
                </button>
            </form>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <Link href="/admin/clientes/recurrentes" className={buttonCls}>Ver fijos mensuales y quincenales ({retainers.length})</Link>
                <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Buscar cliente…" className={`${inputCls} w-full sm:w-72`} />
                {archivedCount > 0 && (
                    <label className="flex items-center gap-2 text-sm text-[#1d1d1f]/60">
                        <input type="checkbox" checked={showArchived} onChange={(ev) => setShowArchived(ev.target.checked)} />
                        Ver archivados ({archivedCount})
                    </label>
                )}
            </div>

            <div className={`${cardCls} overflow-x-auto`}>
                <table className="w-full text-sm">
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
                                        <Link href={`/admin/clientes/lista/${s.client.id}`} className="font-medium hover:underline underline-offset-2">
                                            {s.client.company || s.client.name}
                                        </Link>
                                        {s.client.company && <div className="text-xs text-[#1d1d1f]/50">{s.client.name}</div>}
                                        {s.client.archived && <div className="text-xs text-[#1d1d1f]/40">archivado</div>}
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded ${s.isFixed ? "bg-[#111111] text-white" : "bg-[#1d1d1f]/[0.06] text-[#1d1d1f]/70"}`}>
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
        </main>
    );
}

