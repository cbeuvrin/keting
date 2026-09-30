"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OWED_STATUSES, PROJECT_STATUSES, projectBalance, STATUS_LABELS, type ProjectStatus } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { buttonCls, cardCls, cellInputCls, inputCls, Money, PageHeader, Remaining, thCls, useMutate } from "../ui";

// Todos los proyectos de todos los clientes, como hoja de cálculo: nombre,
// estado, total, entrega y notas se editan en la celda; pagado y falta salen
// de los pagos. "Por cobrar" deja solo lo que ya se debe y todavía no se paga.

export function ProyectosTable({ data, initialEstado, initialVista }: { data: ClientesData; initialEstado: string; initialVista: string }) {
    const { clients, projects, payments } = data;
    const { run, busy } = useMutate();
    const [estado, setEstado] = useState(initialEstado);
    const [porCobrar, setPorCobrar] = useState(initialVista === "por-cobrar");
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState({ client_id: "", name: "", total: "", status: "aprobado" as ProjectStatus, delivery_date: "" });

    const clientLabel = (id: string) => {
        const c = clients.find((x) => x.id === id);
        return c ? c.company || c.name : "—";
    };

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        return projects
            .map((project) => ({ project, balance: projectBalance(project, payments) }))
            .filter(({ project }) => !estado || project.status === estado)
            .filter(({ project, balance }) => !porCobrar || (OWED_STATUSES.includes(project.status) && balance.remaining > 0))
            .filter(({ project }) => !q || project.name.toLowerCase().includes(q) || clientLabel(project.client_id).toLowerCase().includes(q))
            .sort((a, b) => (a.project.delivery_date ?? "9999").localeCompare(b.project.delivery_date ?? "9999"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects, payments, estado, porCobrar, query, clients]);

    const totals = rows.reduce(
        (t, { project, balance }) => ({
            total: t.total + (project.status === "cancelado" ? 0 : project.total),
            paid: t.paid + balance.paid,
            // "Por cobrar" solo cuenta lo aprobado, entregado o en pausa: lo cotizado aún no se debe.
            remaining: t.remaining + (OWED_STATUSES.includes(project.status) ? Math.max(0, balance.remaining) : 0),
        }),
        { total: 0, paid: 0, remaining: 0 },
    );

    const save = (id: string, field: string, value: string, prev: unknown) => {
        if (value.trim() === String(prev ?? "")) return;
        run(`projects/${id}`, "PATCH", { [field]: value });
    };

    const create = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (await run("projects", "POST", draft)) setDraft({ client_id: draft.client_id, name: "", total: "", status: "aprobado", delivery_date: "" });
    };

    const activeClients = clients.filter((c) => !c.archived);

    return (
        <main className="px-6 md:px-8 py-8 max-w-[1400px]">
            <PageHeader title="Proyectos." accent={`${rows.length} en la vista`} />

            {activeClients.length > 0 ? (
                <form onSubmit={create} className={`${cardCls} p-5 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.6fr_1fr_1fr_1fr_auto] items-end`}>
                    <h2 className="sm:col-span-2 lg:col-span-6 font-bold tracking-tight">Nuevo proyecto</h2>
                    <select required value={draft.client_id} onChange={(ev) => setDraft({ ...draft, client_id: ev.target.value })} className={inputCls}>
                        <option value="">Cliente…</option>
                        {activeClients.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.company || c.name}
                            </option>
                        ))}
                    </select>
                    <input required value={draft.name} onChange={(ev) => setDraft({ ...draft, name: ev.target.value })} placeholder="Proyecto" className={inputCls} />
                    <input required inputMode="decimal" value={draft.total} onChange={(ev) => setDraft({ ...draft, total: ev.target.value })} placeholder="Total $" className={inputCls} />
                    <select value={draft.status} onChange={(ev) => setDraft({ ...draft, status: ev.target.value as ProjectStatus })} className={inputCls}>
                        {PROJECT_STATUSES.filter((st) => st !== "cancelado").map((st) => (
                            <option key={st} value={st}>
                                {STATUS_LABELS[st]}
                            </option>
                        ))}
                    </select>
                    <input type="date" value={draft.delivery_date} onChange={(ev) => setDraft({ ...draft, delivery_date: ev.target.value })} title="Fecha de entrega" className={inputCls} />
                    <button type="submit" disabled={busy} className={buttonCls}>
                        Agregar
                    </button>
                </form>
            ) : (
                <p className={`${cardCls} p-5 mb-6 text-sm text-[#1d1d1f]/60`}>
                    Primero da de alta un cliente en{" "}
                    <Link href="/admin/clientes/lista" className="underline underline-offset-2">
                        Clientes
                    </Link>
                    .
                </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Buscar proyecto o cliente…" className={`${inputCls} w-full sm:w-72`} />
                <select value={estado} onChange={(ev) => setEstado(ev.target.value)} className={inputCls}>
                    <option value="">Todos los estados</option>
                    {PROJECT_STATUSES.map((st) => (
                        <option key={st} value={st}>
                            {STATUS_LABELS[st]}
                        </option>
                    ))}
                </select>
                <label className="flex items-center gap-2 text-sm text-[#1d1d1f]/60">
                    <input type="checkbox" checked={porCobrar} onChange={(ev) => setPorCobrar(ev.target.checked)} />
                    Solo por cobrar
                </label>
            </div>

            <div className={`${cardCls} overflow-x-auto`}>
                <table className="w-full text-sm min-w-[980px]">
                    <thead className="border-b border-[#1d1d1f]/10">
                        <tr>
                            <th className={thCls}>Cliente</th>
                            <th className={`${thCls} min-w-[200px]`}>Proyecto</th>
                            <th className={`${thCls} min-w-[140px]`}>Estado</th>
                            <th className={`${thCls} text-right`}>Total</th>
                            <th className={`${thCls} text-right`}>Pagado</th>
                            <th className={`${thCls} text-right`}>Falta</th>
                            <th className={thCls}>Entrega</th>
                            <th className={thCls}>Notas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ project: p, balance: b }) => (
                            <tr key={p.id} className="border-b border-[#1d1d1f]/[0.06] last:border-0">
                                <td className="px-3 py-1 whitespace-nowrap">
                                    <Link href={`/admin/clientes/lista/${p.client_id}`} className="hover:underline underline-offset-2">
                                        {clientLabel(p.client_id)}
                                    </Link>
                                </td>
                                <td className="px-1 py-1">
                                    <input key={p.name} defaultValue={p.name} onBlur={(ev) => save(p.id, "name", ev.target.value, p.name)} className={cellInputCls} />
                                </td>
                                <td className="px-1 py-1">
                                    <select value={p.status} onChange={(ev) => run(`projects/${p.id}`, "PATCH", { status: ev.target.value })} className={`${cellInputCls} pr-6`}>
                                        {PROJECT_STATUSES.map((st) => (
                                            <option key={st} value={st}>
                                                {STATUS_LABELS[st]}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-1 py-1 w-[130px]">
                                    <input key={p.total} defaultValue={p.total} inputMode="decimal" onBlur={(ev) => save(p.id, "total", ev.target.value, p.total)} className={`${cellInputCls} text-right tabular-nums`} />
                                </td>
                                <td className="px-3 py-1 text-right">
                                    <Money value={b.paid} muted />
                                </td>
                                <td className="px-3 py-1 text-right font-medium">
                                    <Remaining status={p.status} remaining={b.remaining} />
                                </td>
                                <td className="px-1 py-1 w-[150px]">
                                    <input key={p.delivery_date ?? ""} type="date" defaultValue={p.delivery_date ?? ""} onBlur={(ev) => save(p.id, "delivery_date", ev.target.value, p.delivery_date)} className={cellInputCls} />
                                </td>
                                <td className="px-1 py-1">
                                    <input key={p.notes ?? ""} defaultValue={p.notes ?? ""} onBlur={(ev) => save(p.id, "notes", ev.target.value, p.notes)} className={cellInputCls} />
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-3 py-10 text-center text-[#1d1d1f]/45">
                                    {projects.length === 0 ? "Todavía no hay proyectos." : "Ningún proyecto en esta vista."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {rows.length > 0 && (
                        <tfoot className="border-t border-[#1d1d1f]/10">
                            <tr className="font-bold">
                                <td colSpan={3} className="px-3 py-3 text-right text-xs font-medium uppercase tracking-[0.12em] text-[#1d1d1f]/45">
                                    Totales (sin cancelados)
                                </td>
                                <td className="px-3 py-3 text-right">
                                    <Money value={totals.total} />
                                </td>
                                <td className="px-3 py-3 text-right">
                                    <Money value={totals.paid} />
                                </td>
                                <td className="px-3 py-3 text-right">
                                    <Money value={totals.remaining} />
                                    <div className="text-[10px] font-normal uppercase tracking-[0.12em] text-[#1d1d1f]/45">por cobrar</div>
                                </td>
                                <td colSpan={2} />
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </main>
    );
}
