"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addMonths, formatMoney, monthLabel, monthlySeries, monthOf, summarizeClient, type Project } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { cardCls, clientName, formatDate, Money, PageHeader } from "./ui";

// Resumen de CLIENTES: cuánto te deben, cuánto entró y qué viene. La gráfica
// va en HTML/CSS como la del CRM. Las dos series (venta e ingreso) usan el par
// azul/naranja de la paleta validada de dataviz; el resto del panel se queda en
// tinta. Cada barra tiene tooltip y abajo hay vista de tabla con los números.

const SALES = "#2a78d6";
const INCOME = "#eb6834";
const MONTHS = 12;

function Tile({ label, value, hint, href }: { label: string; value: string; hint?: string; href?: string }) {
    const inner = (
        <>
            <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#1d1d1f]/45">{label}</div>
            <div className="mt-2.5 text-3xl md:text-4xl font-bold tracking-tight tabular-nums">{value}</div>
            {hint && <div className="mt-1.5 text-xs text-[#1d1d1f]/50">{hint}</div>}
        </>
    );
    const cls = `block ${cardCls} p-5` + (href ? " hover:border-[#1d1d1f]/30 transition-colors" : "");
    return href ? (
        <Link href={href} className={cls}>
            {inner}
        </Link>
    ) : (
        <div className={cls}>{inner}</div>
    );
}

/** "$120k" para las marcas del eje: la cifra exacta vive en el tooltip y la tabla. */
function short(n: number): string {
    if (n >= 1_000_000) return `$${+(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
    return `$${Math.round(n)}`;
}

export function Resumen({ data }: { data: ClientesData }) {
    const { clients, projects, retainers, payments, today } = data;
    const [hover, setHover] = useState<string | null>(null);

    const summaries = useMemo(
        () => clients.map((c) => summarizeClient(c, projects, retainers, payments, today)),
        [clients, projects, retainers, payments, today],
    );
    const serie = useMemo(() => monthlySeries(projects, payments, today, MONTHS), [projects, payments, today]);

    const thisMonth = monthOf(today);
    const owed = summaries.reduce((s, x) => s + x.owed, 0);
    const quoted = summaries.reduce((s, x) => s + x.quoted, 0);
    const incomeThisMonth = serie[serie.length - 1]?.income ?? 0;
    const retainerDebtors = summaries
        .flatMap((s) => s.retainers.filter((r) => r.balance.debt > 0).map((r) => ({ client: s.client, ...r })))
        .sort((a, b) => b.balance.debt - a.balance.debt);
    const retainerDebt = retainerDebtors.reduce((s, r) => s + r.balance.debt, 0);
    const debtors = summaries.filter((s) => s.owed > 0).sort((a, b) => b.owed - a.owed);

    // Por entregar: aprobados o en pausa con fecha en los próximos 30 días o ya vencida.
    const limit = `${addMonths(thisMonth, 1)}${today.slice(7)}`;
    const deliveries = projects
        .filter((p): p is Project & { delivery_date: string } => (p.status === "aprobado" || p.status === "en_pausa") && !!p.delivery_date && p.delivery_date <= limit)
        .sort((a, b) => a.delivery_date.localeCompare(b.delivery_date));
    const waiting = projects.filter((p) => p.status === "esperando");

    const maxValue = Math.max(1, ...serie.flatMap((p) => [p.sales, p.income]));
    const totalSales = serie.reduce((s, p) => s + p.sales, 0);
    const totalIncome = serie.reduce((s, p) => s + p.income, 0);

    return (
        <main className="px-6 md:px-8 py-8 max-w-[1400px]">
            <PageHeader title="Clientes." accent="así va el dinero" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Tile label="Por cobrar" value={formatMoney(owed)} hint={`${debtors.length} ${debtors.length === 1 ? "cliente" : "clientes"} con saldo`} href="/admin/clientes/proyectos?vista=por-cobrar" />
                <Tile label="Ingreso del mes" value={formatMoney(incomeThisMonth)} hint={monthLabel(thisMonth)} href={`/admin/clientes/pagos?mes=${thisMonth}`} />
                <Tile label="En cotización" value={formatMoney(quoted)} hint={`${waiting.length} esperando aprobación`} href="/admin/clientes/proyectos?estado=esperando" />
                <Tile label="Mensualidades atrasadas" value={formatMoney(retainerDebt)} hint={`${retainerDebtors.length} por cobrar`} />
            </div>

            <section className={`${cardCls} p-5 mb-6`}>
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-1">
                    <h2 className="font-bold tracking-tight">Venta e ingreso por mes</h2>
                    <span className="text-xs text-[#1d1d1f]/45">
                        últimos {MONTHS} meses · venta {formatMoney(totalSales)} · ingreso {formatMoney(totalIncome)}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-[#1d1d1f]/60">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: SALES }} /> venta: proyectos aprobados con su primer pago
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: INCOME }} /> ingreso: todo lo que entró
                    </span>
                </div>

                <div className="relative h-60 pl-11">
                    {/* Eje recesivo: solo el máximo y la mitad, con su guía punteada. */}
                    {[1, 0.5].map((f) => (
                        <div key={f} className="absolute left-0 right-0 flex items-center gap-2" style={{ bottom: `calc(${f * 100}% - ${f * 20}px + 20px)` }}>
                            <span className="w-9 text-right text-[10px] text-[#1d1d1f]/35 tabular-nums">{short(maxValue * f)}</span>
                            <span className="flex-1 border-t border-dashed border-[#1d1d1f]/10" />
                        </div>
                    ))}
                    <div className="relative flex items-end gap-1.5 md:gap-3 h-full">
                        {serie.map((p) => {
                            const active = hover === p.month;
                            const empty = p.sales === 0 && p.income === 0;
                            return (
                                <div
                                    key={p.month}
                                    className="flex-1 h-full flex flex-col justify-end items-center min-w-0 cursor-default"
                                    onMouseEnter={() => setHover(p.month)}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={() => setHover(active ? null : p.month)}
                                >
                                    {active && !empty && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-3 py-2 rounded z-10 min-w-[190px] shadow-lg">
                                            <div className="font-medium mb-1">{monthLabel(p.month)}</div>
                                            <div className="flex justify-between gap-4 tabular-nums">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-sm" style={{ background: SALES }} /> Venta
                                                </span>
                                                {formatMoney(p.sales)}
                                            </div>
                                            <div className="flex justify-between gap-4 tabular-nums">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-sm" style={{ background: INCOME }} /> Ingreso
                                                </span>
                                                {formatMoney(p.income)}
                                            </div>
                                            {p.soldProjects.length > 0 && (
                                                <div className="mt-1.5 pt-1.5 border-t border-white/15 text-white/70">
                                                    {p.soldProjects.slice(0, 4).map((s) => (
                                                        <div key={s.id} className="flex justify-between gap-3">
                                                            <span className="truncate">{s.name}</span>
                                                            <span className="tabular-nums">{formatMoney(s.total)}</span>
                                                        </div>
                                                    ))}
                                                    {p.soldProjects.length > 4 && <div>y {p.soldProjects.length - 4} más</div>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Par de barras con 2px de aire; extremo superior redondeado a 4px. */}
                                    <div className={`w-full flex items-end justify-center gap-0.5 h-[calc(100%-20px)] ${active ? "opacity-100" : "opacity-90"}`}>
                                        {[
                                            { v: p.sales, c: SALES },
                                            { v: p.income, c: INCOME },
                                        ].map((b, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 max-w-[22px] rounded-t-[4px]"
                                                style={{ background: b.c, height: b.v > 0 ? `max(3px, ${(b.v / maxValue) * 100}%)` : 0 }}
                                            />
                                        ))}
                                    </div>
                                    <span className={`mt-1.5 h-[14px] text-[10px] tabular-nums truncate ${p.month === thisMonth ? "text-[#1d1d1f] font-medium" : "text-[#1d1d1f]/35"}`}>
                                        {monthLabel(p.month).slice(0, 3)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <details className="mt-4 text-sm">
                    <summary className="cursor-pointer text-xs text-[#1d1d1f]/55 hover:text-[#1d1d1f]">Ver en tabla</summary>
                    <div className="overflow-x-auto mt-3">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-[#1d1d1f]/45">
                                    <th className="py-1.5 pr-4 font-medium">Mes</th>
                                    <th className="py-1.5 pr-4 font-medium text-right">Venta</th>
                                    <th className="py-1.5 font-medium text-right">Ingreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...serie].reverse().map((p) => (
                                    <tr key={p.month} className="border-t border-[#1d1d1f]/[0.06]">
                                        <td className="py-1.5 pr-4">{monthLabel(p.month)}</td>
                                        <td className="py-1.5 pr-4 text-right tabular-nums">{formatMoney(p.sales)}</td>
                                        <td className="py-1.5 text-right tabular-nums">{formatMoney(p.income)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
                <ListCard title="Quién te debe" empty="Nadie te debe nada. 🎉">
                    {debtors.map((s) => (
                        <Row key={s.client.id} href={`/admin/clientes/lista/${s.client.id}`} left={clientName(clients, s.client.id)} right={<Money value={s.owed} />} />
                    ))}
                </ListCard>

                <ListCard title="Por entregar" hint="próximos 30 días y vencidos" empty="Nada por entregar en los próximos 30 días.">
                    {deliveries.map((p) => (
                        <Row
                            key={p.id}
                            href={`/admin/clientes/lista/${p.client_id}`}
                            left={
                                <>
                                    {p.name} <span className="text-[#1d1d1f]/45">· {clientName(clients, p.client_id)}</span>
                                </>
                            }
                            right={
                                <span className={`text-xs tabular-nums ${p.delivery_date < today ? "text-[#b4472f] font-medium" : "text-[#1d1d1f]/60"}`}>
                                    {p.delivery_date < today ? "vencido · " : ""}
                                    {formatDate(p.delivery_date)}
                                </span>
                            }
                        />
                    ))}
                </ListCard>

                <ListCard title="Deben mensualidad" empty="Todas las mensualidades al corriente.">
                    {retainerDebtors.map((r) => (
                        <Row
                            key={r.retainer.id}
                            href={`/admin/clientes/lista/${r.client.id}`}
                            left={
                                <>
                                    {clientName(clients, r.client.id)}{" "}
                                    <span className="text-[#1d1d1f]/45">
                                        · {r.balance.pendingMonths.map((m) => monthLabel(m).slice(0, 3)).join(", ")}
                                    </span>
                                </>
                            }
                            right={<Money value={r.balance.debt} />}
                        />
                    ))}
                </ListCard>

                <ListCard title="Esperando aprobación" empty="No hay cotizaciones pendientes.">
                    {waiting.map((p) => (
                        <Row
                            key={p.id}
                            href={`/admin/clientes/lista/${p.client_id}`}
                            left={
                                <>
                                    {p.name} <span className="text-[#1d1d1f]/45">· {clientName(clients, p.client_id)}</span>
                                </>
                            }
                            right={<Money value={p.total} muted />}
                        />
                    ))}
                </ListCard>
            </div>
        </main>
    );
}

function ListCard({ title, hint, empty, children }: { title: string; hint?: string; empty: string; children: React.ReactNode[] }) {
    return (
        <section className={`${cardCls} p-5`}>
            <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2 className="font-bold tracking-tight">{title}</h2>
                {hint && <span className="text-xs text-[#1d1d1f]/45">{hint}</span>}
            </div>
            {children.length === 0 ? <p className="text-sm text-[#1d1d1f]/45">{empty}</p> : <div className="divide-y divide-[#1d1d1f]/[0.06]">{children}</div>}
        </section>
    );
}

function Row({ href, left, right }: { href: string; left: React.ReactNode; right: React.ReactNode }) {
    return (
        <Link href={href} className="flex items-center justify-between gap-4 py-2.5 text-sm hover:bg-[#1d1d1f]/[0.02] -mx-2 px-2 rounded">
            <span className="min-w-0 truncate">{left}</span>
            <span className="shrink-0">{right}</span>
        </Link>
    );
}
