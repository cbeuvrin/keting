"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Plus } from "lucide-react";
import { currencyOf, formatMoney, monthLabel, monthOf, pendingCollections, projectBalance } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { CobrosList } from "./CobrosList";
import { buttonCls, clientName, formatDate, FxNote, Money, mxn } from "./ui";

export function Resumen({ data }: { data: ClientesData }) {
    const { clients, projects, payments, today } = data;
    const pesos = mxn(data);
    const pending = pendingCollections(pesos.projects, pesos.retainers, pesos.payments, today);
    const thisMonth = monthOf(today);
    const income = pesos.payments.filter((p) => monthOf(p.paid_on) === thisMonth).reduce((sum, p) => sum + p.amount, 0);
    const projectsOwed = pending.filter((r) => r.kind === "proyecto").reduce((sum, r) => sum + r.remaining, 0);
    const retainersOwed = pending.filter((r) => r.kind === "mensualidad").reduce((sum, r) => sum + r.remaining, 0);
    const limit = new Date(`${today}T12:00:00Z`);
    limit.setUTCDate(limit.getUTCDate() + 30);
    const deliveries = projects.filter((p) => (p.status === "aprobado" || p.status === "en_pausa") && p.delivery_date && p.delivery_date <= limit.toISOString().slice(0, 10)).sort((a, b) => a.delivery_date!.localeCompare(b.delivery_date!));
    const waiting = projects.filter((p) => p.status === "esperando");
    const quoted = pesos.projects.filter((p) => p.status === "esperando").reduce((sum, p) => sum + p.total, 0);
    const recent = [...payments].sort((a, b) => b.paid_on.localeCompare(a.paid_on) || b.created_at.localeCompare(a.created_at)).slice(0, 3);

    return (
        <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-10 lg:px-10">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="mb-2 text-xs text-[#1d1d1f]/55">Keting · {formatDate(today)}</p>
                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Mi negocio<span className="text-[#1d1d1f]/30">.</span></h1>
                    <p className="mt-2 text-sm text-[#1d1d1f]/60">Lo que entró, lo que falta y lo que sigue.</p>
                </div>
                <Link href="/admin/clientes/pagos" className={`${buttonCls} inline-flex min-h-11 items-center gap-2`}><Plus className="h-4 w-4" /> Registrar pago</Link>
            </header>

            <div className="mb-3 mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1d1d1f]/10 bg-[#1d1d1f]/10 sm:grid-cols-3">
                <Metric label="Cobrado este mes" value={income} hint={monthLabel(thisMonth)} href={`/admin/clientes/pagos?mes=${thisMonth}`} income />
                <Metric label="Pendiente de proyectos" value={projectsOwed} hint="Aprobados, en pausa o entregados" href="/admin/clientes/cobros?tipo=proyecto" />
                <Metric label="Mensualidades pendientes" value={retainersOwed} hint="Acumulado hasta este mes" href="/admin/clientes/cobros?tipo=mensualidad" />
            </div>
            <p className="text-[11px] text-[#1d1d1f]/50">Totales en MXN · Cada cobro conserva la moneda del cliente.</p>
            <FxNote data={data} className="mt-1" />

            <div className="mt-10 grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
                <CobrosList data={data} compact />
                <aside className="min-w-0 space-y-8 xl:border-l xl:border-[#1d1d1f]/10 xl:pl-7">
                    <section aria-labelledby="deliveries-heading">
                        <div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4 text-[#1d1d1f]/55" /><h2 id="deliveries-heading" className="text-base font-semibold tracking-tight">Próximas entregas</h2></div>
                        <p className="mt-1 text-xs text-[#1d1d1f]/55">Próximos 30 días y entregas atrasadas</p>
                        <div className="mt-4 divide-y divide-[#1d1d1f]/10">
                            {deliveries.slice(0, 4).map((p) => {
                                const balance = projectBalance(p, payments);
                                const late = p.delivery_date! < today;
                                return <Link key={p.id} href={`/admin/clientes/lista/${p.client_id}`} className="block py-3 first:pt-0 group">
                                    <p className={`text-xs ${late ? "font-medium text-[#a24730]" : "text-[#1d1d1f]/60"}`}>{late ? "Entrega atrasada · " : ""}{formatDate(p.delivery_date)}</p>
                                    <p className="mt-1 text-sm font-medium group-hover:underline underline-offset-4">{p.name}</p>
                                    <p className="mt-1 text-xs text-[#1d1d1f]/60">{clientName(clients, p.client_id)}</p>
                                    <p className="mt-2 text-xs text-[#1d1d1f]/70">{balance.remaining > 0 ? <><Money value={balance.remaining} currency={currencyOf(clients, p.client_id)} /> por cobrar</> : "Pagado"}</p>
                                </Link>;
                            })}
                            {deliveries.length === 0 && <p className="py-2 text-sm leading-relaxed text-[#1d1d1f]/55">Sin entregas pendientes en los próximos 30 días.</p>}
                        </div>
                        <Link href="/admin/clientes/proyectos" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium underline-offset-4 hover:underline">Ver proyectos {deliveries.length > 4 ? `(${deliveries.length} por entregar)` : ""}<ArrowRight className="h-3.5 w-3.5" /></Link>
                    </section>
                    <section className="border-t border-[#1d1d1f]/10 pt-6">
                        <h2 className="text-base font-semibold tracking-tight">En cotización</h2>
                        <p className="mt-3 text-2xl font-semibold tracking-tight">{formatMoney(quoted)} <span className="text-xs font-normal text-[#1d1d1f]/50">MXN</span></p>
                        <p className="mt-1 text-xs text-[#1d1d1f]/55">{waiting.length} {waiting.length === 1 ? "proyecto esperando" : "proyectos esperando"} aprobación</p>
                        <Link href="/admin/clientes/proyectos?estado=esperando" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium hover:underline underline-offset-4">Revisar cotizaciones <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </section>
                </aside>
            </div>

            <section className="mt-10 border-t border-[#1d1d1f]/10 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">Últimos pagos</h2>
                    <Link href="/admin/clientes/pagos" className="text-xs font-medium hover:underline underline-offset-4">Ver historial →</Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {recent.map((p) => <Link key={p.id} href={`/admin/clientes/lista/${p.client_id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#1d1d1f]/[0.035] p-4 hover:bg-[#1d1d1f]/[0.06] transition-colors"><div className="min-w-0"><p className="text-sm font-medium">{clientName(clients, p.client_id)}</p><p className="mt-1 text-xs text-[#1d1d1f]/55">{formatDate(p.paid_on)}</p></div><span className="text-sm font-semibold"><Money value={p.amount} currency={currencyOf(clients, p.client_id)} /></span></Link>)}
                    {recent.length === 0 && <p className="text-sm text-[#1d1d1f]/55 sm:col-span-3">Todavía no hay pagos registrados.</p>}
                </div>
            </section>
            <Link href="/admin/clientes/evolucion" className="mt-8 flex items-center justify-between gap-4 border-t border-[#1d1d1f]/10 py-5 group"><div><p className="text-sm font-semibold group-hover:underline underline-offset-4">Evolución del negocio</p><p className="mt-1 text-xs text-[#1d1d1f]/60">Compara ventas e ingresos de los últimos meses.</p></div><ArrowUpRight className="h-5 w-5 shrink-0" /></Link>
        </main>
    );
}

function Metric({ label, value, hint, href, income = false }: { label: string; value: number; hint: string; href: string; income?: boolean }) {
    return <Link href={href} className={`group min-w-0 bg-white p-4 transition-colors hover:bg-[#f8f8f6] md:p-6 ${income ? "col-span-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 sm:col-span-1 sm:block" : ""}`}>
        <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-[#1d1d1f]/65">{label}</p><ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#1d1d1f]/30 group-hover:text-[#1d1d1f]" /></div>
        <p className={`break-words text-xl font-semibold tracking-tight tabular-nums sm:text-2xl lg:text-3xl ${income ? "row-span-2 text-[#26654b] sm:mt-3" : "mt-3"}`}>{formatMoney(value)}</p>
        <p className={`mt-2 text-xs text-[#1d1d1f]/50 ${income ? "col-start-1 row-start-2" : ""}`}>{hint}</p>
    </Link>;
}
