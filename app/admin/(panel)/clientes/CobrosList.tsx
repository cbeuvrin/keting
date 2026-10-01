"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Search, X } from "lucide-react";
import { currencyOf, monthLabel, pendingCollections, STATUS_LABELS, type PendingCollection } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { buttonCls, clientName, inputCls, Money, PaymentForm } from "./ui";

export type CollectionFilter = "todos" | "proyecto" | "mensualidad";
const FILTERS: { value: CollectionFilter; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "proyecto", label: "Proyectos" },
    { value: "mensualidad", label: "Mensualidades" },
];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function CobrosList({ data, compact = false, initialFilter = "todos", initialQuery = "" }: { data: ClientesData; compact?: boolean; initialFilter?: CollectionFilter; initialQuery?: string }) {
    const [filter, setFilter] = useState<CollectionFilter>(initialFilter);
    const [query, setQuery] = useState(initialQuery);
    const [selected, setSelected] = useState<PendingCollection | null>(null);
    const [notice, setNotice] = useState("");
    const heading = useRef<HTMLHeadingElement>(null);
    const rows = useMemo(() => pendingCollections(data.projects, data.retainers, data.payments, data.today), [data]);
    const visible = useMemo(() => {
        const q = normalize(query.trim());
        return rows.filter((row) => (filter === "todos" || row.kind === filter) && (!q || normalize(`${clientName(data.clients, row.clientId)} ${data.clients.find((c) => c.id === row.clientId)?.name ?? ""} ${row.name}`).includes(q)))
            .sort((a, b) => {
                // Mensualidades con meses anteriores, luego proyectos entregados, luego el resto.
                const rank = (row: PendingCollection) => row.pendingMonths.some((m) => m < data.today.slice(0, 7)) ? 0 : row.status === "entregado" ? 1 : 2;
                return rank(a) - rank(b) || clientName(data.clients, a.clientId).localeCompare(clientName(data.clients, b.clientId), "es") || a.name.localeCompare(b.name, "es");
            });
    }, [rows, filter, query, data]);
    const shown = compact ? visible.slice(0, 6) : visible;

    return (
        <section aria-labelledby="cobros-heading" className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="cobros-heading" ref={heading} tabIndex={-1} className="text-lg font-semibold tracking-tight">{compact ? "Cobros pendientes" : "Pendientes de cobro"}</h2>
                <span className="text-xs text-[#1d1d1f]/55">{visible.length} conceptos · {new Set(visible.map((r) => r.clientId)).size} clientes</span>
            </div>
            <p className="mt-1 text-sm text-[#1d1d1f]/60">Registra un abono o liquida el saldo desde aquí.</p>
            {notice && <div role="status" className="mt-4 flex items-start gap-2 rounded-lg border border-[#26654b]/20 bg-[#edf4ee] p-3 text-sm text-[#245a43]"><Check className="mt-0.5 h-4 w-4 shrink-0" /><div>{notice} <Link href="/admin/clientes/pagos" className="underline underline-offset-4">Ver pagos</Link></div></div>}
            {rows.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div role="group" aria-label="Tipo de cobro" className="flex max-w-full gap-1 rounded-lg bg-[#1d1d1f]/[0.045] p-1">
                        {FILTERS.map(({ value, label }) => (
                            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${filter === value ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#1d1d1f]/60 hover:text-[#1d1d1f]"}`}>{label}</button>
                        ))}
                    </div>
                    <label className="relative w-full sm:w-60">
                        <span className="sr-only">Buscar cliente o concepto</span>
                        <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-[#1d1d1f]/40" />
                        <input type="search" value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Cliente o concepto…" className={`${inputCls} w-full pl-9`} />
                    </label>
                </div>
            )}
            <div className="mt-4 divide-y divide-[#1d1d1f]/10 border-y border-[#1d1d1f]/10">
                {shown.map((row) => (
                    <article key={row.target} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                        <div className="min-w-0">
                            <Link href={`/admin/clientes/lista/${row.clientId}`} className="text-sm font-semibold underline-offset-4 hover:underline">{clientName(data.clients, row.clientId)}</Link>
                            <p className="mt-1 break-words text-sm text-[#1d1d1f]/70">{row.name}</p>
                            <p className="mt-1.5 text-xs leading-relaxed text-[#1d1d1f]/55">
                                {row.kind === "proyecto" ? `Proyecto · ${STATUS_LABELS[row.status!]}` : `Mensualidad · ${row.pendingMonths.length === 1 ? monthLabel(row.pendingMonths[0]) : `${monthLabel(row.pendingMonths[0])} a ${monthLabel(row.pendingMonths[row.pendingMonths.length - 1])}`}`}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-base font-semibold tracking-tight"><Money value={row.remaining} currency={currencyOf(data.clients, row.clientId)} /></div>
                            <div className="mt-1 text-[11px] text-[#1d1d1f]/50">{currencyOf(data.clients, row.clientId)} pendiente</div>
                        </div>
                        <button type="button" onClick={() => { setSelected(row); setNotice(""); }} className="col-span-2 flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#1d1d1f]/20 px-3 py-2 text-xs font-medium transition-colors hover:border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-white sm:col-span-1" aria-label={`Registrar pago de ${row.name}, ${clientName(data.clients, row.clientId)}`}>Registrar pago <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></button>
                    </article>
                ))}
                {shown.length === 0 && (
                    <div className="py-10 text-center">
                        <p className="font-medium">{rows.length === 0 ? "Todo al corriente" : "No hay cobros con estos filtros"}</p>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#1d1d1f]/60">{rows.length === 0 ? "Los saldos pendientes de proyectos y mensualidades aparecerán aquí." : "Prueba con otro cliente, concepto o tipo de cobro."}</p>
                        {rows.length === 0 ? <Link href="/admin/clientes/proyectos" className="mt-4 inline-block text-sm underline underline-offset-4">Ver proyectos</Link> : <button type="button" onClick={() => { setQuery(""); setFilter("todos"); }} className="mt-4 text-sm underline underline-offset-4">Limpiar filtros</button>}
                    </div>
                )}
            </div>
            {compact && <Link href={`/admin/clientes/cobros?tipo=${filter}&q=${encodeURIComponent(query)}`} className="mt-4 inline-flex items-center gap-2 py-1 text-sm font-medium hover:underline underline-offset-4">{visible.length > shown.length ? `Ver los ${visible.length} cobros` : "Abrir vista de cobros"}<ArrowRight className="h-4 w-4" /></Link>}
            {selected && <PaymentDrawer key={selected.target} row={selected} data={data} onClose={() => setSelected(null)} onDone={(warning) => {
                setSelected(null);
                setNotice(warning ?? `Pago registrado para ${clientName(data.clients, selected.clientId)}.`);
                // El registro liquidado puede desaparecer al refrescar: dejamos un foco estable.
                heading.current?.focus();
            }} />}
        </section>
    );
}

function PaymentDrawer({ row, data, onClose, onDone }: { row: PendingCollection; data: ClientesData; onClose: () => void; onDone: (warning: string | null) => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        const element = dialog.current!;
        const overflow = document.body.style.overflow;
        element.showModal();
        document.body.style.overflow = "hidden";
        return () => { element.close(); document.body.style.overflow = overflow; };
    }, []);

    return (
        <dialog ref={dialog} aria-labelledby="payment-heading" onCancel={(ev) => { ev.preventDefault(); if (!busy) onClose(); }} className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-md overflow-y-auto border-0 bg-[#fafaf8] p-0 text-[#1d1d1f] shadow-xl backdrop:bg-[#1d1d1f]/35">
            <div className="flex items-center justify-between border-b border-[#1d1d1f]/10 px-6 py-5">
                <h2 id="payment-heading" className="text-lg font-semibold">Registrar pago</h2>
                <button type="button" autoFocus disabled={busy} onClick={onClose} aria-label="Cerrar registro de pago" className="rounded-md p-2 hover:bg-black/5 disabled:opacity-40"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
                <p className="text-sm font-semibold">{clientName(data.clients, row.clientId)}</p>
                <p className="mt-1 text-sm text-[#1d1d1f]/65">{row.name}</p>
                <div className="my-6 border-y border-[#1d1d1f]/10 py-4">
                    <p className="text-xs text-[#1d1d1f]/60">Saldo pendiente · {currencyOf(data.clients, row.clientId)}</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight"><Money value={row.remaining} currency={currencyOf(data.clients, row.clientId)} /></p>
                    <p className="mt-2 text-xs text-[#1d1d1f]/55">Puedes registrar un pago parcial o el saldo completo.</p>
                </div>
                <PaymentForm clients={data.clients} projects={data.projects} retainers={data.retainers} today={data.today} clientId={row.clientId} initialTarget={row.target} suggestedAmount={row.remaining} stacked onBusyChange={setBusy} onDone={(warning) => { dialog.current?.close(); onDone(warning); }} />
                <button type="button" disabled={busy} onClick={onClose} className={`${buttonCls} mt-3 w-full !bg-transparent !text-[#1d1d1f]/65 hover:!bg-black/5`}>Cancelar</button>
            </div>
        </dialog>
    );
}
