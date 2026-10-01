"use client";
import { QuincenalSummary } from "../../sheet/RecurringSchedule";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { monthLabel, monthOf, PROJECT_STATUSES, STATUS_LABELS, summarizeClient, type Client, type ProjectStatus } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import {
    api,
    buttonCls,
    cardCls,
    cellInputCls,
    FileCell,
    ghostButtonCls,
    inputCls,
    Money,
    PaymentForm,
    QUOTE_ACCEPT,
    Remaining,
    thCls,
    useMutate,
} from "../../ui";
import { PaymentsTable } from "../../PaymentsTable";

// Ficha de un cliente: sus datos, sus proyectos, sus mensualidades y sus pagos
// en una sola pantalla. Las celdas se guardan al salir del campo, como en la
// tabla de contactos del CRM; lo pagado, lo que falta y lo que se debe se
// recalculan solos.

export function Ficha({ client, data }: { client: Client; data: ClientesData }) {
    const { clients, projects, retainers, payments, today } = data;
    const router = useRouter();
    const { run, busy } = useMutate();
    const s = summarizeClient(client, projects, retainers, payments, today);
    const clientPayments = payments.filter((p) => p.client_id === client.id);

    const saveClient = (field: string, value: string) => {
        const prev = (client as Record<string, unknown>)[field] ?? "";
        if (value.trim() === String(prev)) return;
        run(`clients/${client.id}`, "PATCH", { [field]: value });
    };

    const removeClient = async () => {
        if (!window.confirm(`¿Borrar a ${client.company || client.name} con sus proyectos y mensualidades? No se puede deshacer.`)) return;
        const error = await api(`clients/${client.id}`, "DELETE");
        if (error) return window.alert(error);
        router.push("/admin/clientes/lista");
        router.refresh();
    };

    return (
        <main className="px-6 md:px-8 py-8 max-w-[1400px]">
            <Link href="/admin/clientes/lista" className="inline-flex items-center gap-1 text-sm text-[#1d1d1f]/55 hover:text-[#1d1d1f] mb-4">
                <ChevronLeft className="w-4 h-4" /> Clientes
            </Link>

            <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {client.company || client.name}{" "}
                        {s.isFixed && <span className="align-middle text-xs font-medium px-2 py-0.5 rounded bg-[#111111] text-white">Fijo</span>}
                        {client.archived && <span className="align-middle ml-2 text-xs font-normal text-[#1d1d1f]/45">archivado</span>}
                    </h1>
                    <p className="mt-1 text-sm text-[#1d1d1f]/55">
                        Ha pagado <Money value={s.paidTotal} /> · debe{" "}
                        <span className={s.owed > 0 ? "font-medium text-[#1d1d1f]" : ""}>
                            <Money value={s.owed} />
                        </span>
                        {s.quoted > 0 && (
                            <>
                                {" "}
                                · en cotización <Money value={s.quoted} />
                            </>
                        )}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className={ghostButtonCls} disabled={busy} onClick={() => run(`clients/${client.id}`, "PATCH", { archived: !client.archived })}>
                        {client.archived ? "Desarchivar" : "Archivar"}
                    </button>
                    {clientPayments.length === 0 && (
                        <button className={`${ghostButtonCls} hover:!text-[#b4472f] hover:!border-[#b4472f]/40`} onClick={removeClient}>
                            Borrar
                        </button>
                    )}
                </div>
            </header>

            {/* Datos */}
            <section className={`${cardCls} p-5 mb-6`}>
                <h2 className="font-bold tracking-tight mb-3">Datos</h2>
                <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
                    {(
                        [
                            ["name", "Nombre"],
                            ["company", "Empresa"],
                            ["email", "Correo"],
                            ["phone", "Teléfono"],
                        ] as const
                    ).map(([field, label]) => (
                        <label key={field} className="grid gap-0.5 text-xs text-[#1d1d1f]/50">
                            {label}
                            <input
                                key={`${field}-${client[field] ?? ""}`}
                                defaultValue={client[field] ?? ""}
                                onBlur={(ev) => saveClient(field, ev.target.value)}
                                className={`${cellInputCls} text-sm text-[#1d1d1f] -mx-2`}
                            />
                        </label>
                    ))}
                    <label className="grid gap-0.5 text-xs text-[#1d1d1f]/50 sm:col-span-2 lg:col-span-4">
                        Notas
                        <textarea
                            key={`notes-${client.notes ?? ""}`}
                            defaultValue={client.notes ?? ""}
                            onBlur={(ev) => saveClient("notes", ev.target.value)}
                            rows={2}
                            className={`${cellInputCls} text-sm text-[#1d1d1f] -mx-2 resize-y`}
                        />
                    </label>
                </div>
            </section>

            <ProjectsSection clientId={client.id} summary={s} quotes={data.quotes} />
            <RetainersSection clientId={client.id} summary={s} today={today} />

            {/* Pagos */}
            <section className={`${cardCls} p-5`}>
                <h2 className="font-bold tracking-tight mb-4">Pagos</h2>
                {s.projects.length + s.retainers.length > 0 ? (
                    <div className="mb-5">
                        <PaymentForm clients={clients} projects={projects} retainers={retainers} today={today} clientId={client.id} />
                    </div>
                ) : (
                    <p className="text-sm text-[#1d1d1f]/45 mb-5">Para registrar un pago, primero agrega un proyecto o una mensualidad.</p>
                )}
                <PaymentsTable payments={clientPayments} data={data} />
            </section>
        </main>
    );
}

function ProjectsSection({ clientId, summary, quotes }: { clientId: string; summary: ReturnType<typeof summarizeClient>; quotes: string[] }) {
    const withQuote = new Set(quotes);
    const { run, busy } = useMutate();
    const [draft, setDraft] = useState({ name: "", total: "", status: "aprobado" as ProjectStatus, delivery_date: "" });

    const save = (id: string, field: string, value: string, prev: unknown) => {
        if (value.trim() === String(prev ?? "")) return;
        run(`projects/${id}`, "PATCH", { [field]: value });
    };

    const create = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (await run("projects", "POST", { ...draft, client_id: clientId })) setDraft({ name: "", total: "", status: "aprobado", delivery_date: "" });
    };

    return (
        <section className={`${cardCls} p-5 mb-6`}>
            <h2 className="font-bold tracking-tight mb-4">Proyectos</h2>
            {summary.projects.length > 0 && (
                <div className="overflow-x-auto mb-5 -mx-2">
                    <table className="w-full text-sm min-w-[1060px]">
                        <thead>
                            <tr>
                                <th className={`${thCls} min-w-[200px]`}>Proyecto</th>
                                <th className={`${thCls} min-w-[140px]`}>Estado</th>
                                <th className={`${thCls} text-right`}>Total</th>
                                <th className={`${thCls} text-right`}>Pagado</th>
                                <th className={`${thCls} text-right`}>Falta</th>
                                <th className={thCls}>Entrega</th>
                                <th className={`${thCls} min-w-[160px]`}>Notas</th>
                                <th className={thCls}>Cotización</th>
                                <th className={thCls} />
                            </tr>
                        </thead>
                        <tbody>
                            {summary.projects.map(({ project: p, balance: b }) => (
                                <tr key={p.id} className="border-t border-[#1d1d1f]/[0.06]">
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
                                        <input
                                            key={p.total}
                                            defaultValue={p.total}
                                            inputMode="decimal"
                                            onBlur={(ev) => save(p.id, "total", ev.target.value, p.total)}
                                            className={`${cellInputCls} text-right tabular-nums`}
                                        />
                                    </td>
                                    <td className="px-3 py-1 text-right">
                                        <Money value={b.paid} muted />
                                    </td>
                                    <td className="px-3 py-1 text-right font-medium">
                                        <Remaining status={p.status} remaining={b.remaining} />
                                    </td>
                                    <td className="px-1 py-1 w-[150px]">
                                        <input
                                            key={p.delivery_date ?? ""}
                                            type="date"
                                            defaultValue={p.delivery_date ?? ""}
                                            onBlur={(ev) => save(p.id, "delivery_date", ev.target.value, p.delivery_date)}
                                            className={cellInputCls}
                                        />
                                    </td>
                                    <td className="px-1 py-1">
                                        <input key={p.notes ?? ""} defaultValue={p.notes ?? ""} onBlur={(ev) => save(p.id, "notes", ev.target.value, p.notes)} className={cellInputCls} />
                                    </td>
                                    <td className="px-3 py-1">
                                        <FileCell apiPath={`projects/${p.id}/quote`} has={withQuote.has(p.id)} accept={QUOTE_ACCEPT} maxMb={25} label="la cotización de este proyecto" />
                                    </td>
                                    <td className="px-1 py-1 text-right">
                                        {b.paid === 0 && (
                                            <button
                                                title="Borrar proyecto"
                                                disabled={busy}
                                                onClick={() => window.confirm(`¿Borrar "${p.name}"?`) && run(`projects/${p.id}`, "DELETE")}
                                                className="text-[#1d1d1f]/30 hover:text-[#b4472f] px-2 text-lg leading-none"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <form onSubmit={create} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] items-end">
                <input required value={draft.name} onChange={(ev) => setDraft({ ...draft, name: ev.target.value })} placeholder="Nuevo proyecto (ej. Sitio web)" className={inputCls} />
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
        </section>
    );
}

function RetainersSection({ clientId, summary, today }: { clientId: string; summary: ReturnType<typeof summarizeClient>; today: string }) {
    const { run, busy } = useMutate();
    const current = monthOf(today);
    const [draft, setDraft] = useState({ concept: "Mantenimiento", monthly_amount: "", start_month: current });

    const create = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (await run("retainers", "POST", { ...draft, client_id: clientId })) setDraft({ concept: "Mantenimiento", monthly_amount: "", start_month: current });
    };

    const changeAmount = (id: string) => {
        const amount = window.prompt("Monto nuevo por mes:");
        if (!amount) return;
        const from = window.prompt("¿Desde qué mes? (AAAA-MM)", current);
        if (!from) return;
        run(`retainers/${id}`, "PATCH", { new_amount: amount, from_month: from });
    };

    return (
        <section className={`${cardCls} p-5 mb-6`}>
            <h2 className="font-bold tracking-tight mb-4">Servicios recurrentes</h2>
            {summary.retainers.length > 0 && (
                <div className="grid gap-3 mb-5">
                    {summary.retainers.map(({ retainer: r, balance: b }) => r.frequency === "quincenal" ? <QuincenalSummary key={r.id} retainer={r} balance={b} /> : (
                        <div key={r.id} className="border border-[#1d1d1f]/10 rounded-md p-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="font-medium">
                                    {r.concept} · <Money value={r.monthly_amount} />
                                    <span className="text-[#1d1d1f]/45 font-normal">/mes</span>
                                    {!b.active && <span className="ml-2 text-xs text-[#1d1d1f]/45">{r.start_month > today ? "empieza después" : "terminada"}</span>}
                                </div>
                                <div className="text-xs text-[#1d1d1f]/55 mt-0.5">
                                    desde {monthLabel(monthOf(r.start_month))}
                                    {r.end_month ? ` hasta ${monthLabel(monthOf(r.end_month))}` : ""} · {b.dueMonths.length}{" "}
                                    {b.dueMonths.length === 1 ? "mes cobrado" : "meses cobrados"} · pagado <Money value={b.paid} />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {b.debt > 0 ? (
                                    <span className="text-sm">
                                        debe <b className="tabular-nums">{b.pendingMonths.length}</b> {b.pendingMonths.length === 1 ? "mes" : "meses"} ({b.pendingMonths.map((m) => monthLabel(m).slice(0, 3)).join(", ")}):{" "}
                                        <b>
                                            <Money value={b.debt} />
                                        </b>
                                    </span>
                                ) : (
                                    <span className="text-sm text-[#1d1d1f]/60">
                                        al corriente{b.credit > 0 && <> · a favor <Money value={b.credit} /></>}
                                    </span>
                                )}
                                <button className={ghostButtonCls} disabled={busy} onClick={() => changeAmount(r.id)}>
                                    Cambiar monto
                                </button>
                                {r.end_month ? (
                                    <button className={ghostButtonCls} disabled={busy} onClick={() => run(`retainers/${r.id}`, "PATCH", { end_month: null })}>
                                        Reactivar
                                    </button>
                                ) : (
                                    <button
                                        className={ghostButtonCls}
                                        disabled={busy}
                                        onClick={() => window.confirm(`¿Terminar "${r.concept}"? ${monthLabel(current)} será el último mes que se cobra.`) && run(`retainers/${r.id}`, "PATCH", { end_month: current })}
                                    >
                                        Terminar
                                    </button>
                                )}
                                {b.paid === 0 && (
                                    <button
                                        title="Borrar mensualidad"
                                        disabled={busy}
                                        onClick={() => window.confirm(`¿Borrar "${r.concept}"?`) && run(`retainers/${r.id}`, "DELETE")}
                                        className="text-[#1d1d1f]/30 hover:text-[#b4472f] px-1 text-lg leading-none"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Link href="/admin/clientes/cobros?tipo=mensualidad" className="text-sm underline block mb-4">Agregar o editar cobros quincenales</Link>
            <form onSubmit={create} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] items-end">
                <input required value={draft.concept} onChange={(ev) => setDraft({ ...draft, concept: ev.target.value })} placeholder="Concepto" className={inputCls} />
                <input required inputMode="decimal" value={draft.monthly_amount} onChange={(ev) => setDraft({ ...draft, monthly_amount: ev.target.value })} placeholder="Monto por mes $" className={inputCls} />
                <input required type="month" value={draft.start_month} onChange={(ev) => setDraft({ ...draft, start_month: ev.target.value })} title="Primer mes que se cobra" className={inputCls} />
                <button type="submit" disabled={busy} className={buttonCls}>
                    Agregar mensualidad
                </button>
            </form>
        </section>
    );
}
