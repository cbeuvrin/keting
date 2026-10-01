"use client";

import { useState } from "react";
import Link from "next/link";
import { formatMoney, monthLabel, monthlySeries } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { FxNote, Money, mxn, PageHeader } from "../ui";

export function Evolucion({ data }: { data: ClientesData }) {
    const [months, setMonths] = useState(6);
    const [selected, setSelected] = useState<string | null>(null);
    const pesos = mxn(data);
    const series = monthlySeries(pesos.projects, pesos.payments, data.today, months);
    const max = Math.max(1, ...series.flatMap((p) => [p.sales, p.income]));
    const active = series.find((p) => p.month === selected);
    const totals = series.reduce((sum, p) => ({ sales: sum.sales + p.sales, income: sum.income + p.income }), { sales: 0, income: 0 });

    return <main className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-10">
        <Link href="/admin/clientes" className="mb-5 inline-block text-xs text-[#1d1d1f]/60 hover:underline underline-offset-4">← Mi negocio</Link>
        <PageHeader title="Evolución." accent="venta e ingreso">
            <label className="flex items-center gap-2 text-sm">Periodo<select value={months} onChange={(ev) => { setMonths(Number(ev.target.value)); setSelected(null); }} className="rounded-md border border-[#1d1d1f]/15 bg-white px-3 py-2"><option value={3}>Últimos 3 meses</option><option value={6}>Últimos 6 meses</option><option value={12}>Últimos 12 meses</option></select></label>
        </PageHeader>
        <div className="mb-6 flex flex-wrap gap-x-12 gap-y-4">
            <div><p className="text-xs text-[#1d1d1f]/60">Venta del periodo · MXN</p><p className="mt-2 text-3xl font-semibold tracking-tight"><Money value={totals.sales} /></p></div>
            <div><p className="text-xs text-[#1d1d1f]/60">Ingreso del periodo · MXN</p><p className="mt-2 text-3xl font-semibold tracking-tight text-[#26654b]"><Money value={totals.income} /></p></div>
        </div>
        <FxNote data={data} className="mb-6" />
        <section className="rounded-xl border border-[#1d1d1f]/10 bg-white p-4 sm:p-6" aria-label="Venta e ingreso por mes">
            <div className="mb-6 flex flex-wrap gap-4 text-xs text-[#1d1d1f]/65">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#1d1d1f]/35" />Venta</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#26654b]" />Ingreso</span>
                <span className="sm:ml-auto">Selecciona un mes para ver el detalle</span>
            </div>
            <p className="mb-2 text-right text-[10px] tabular-nums text-[#1d1d1f]/45">Máximo: {formatMoney(max === 1 && totals.sales === 0 && totals.income === 0 ? 0 : max)} MXN</p>
            <div className="flex h-60 gap-1 border-b border-[#1d1d1f]/10 sm:gap-3">
                {series.map((p) => <button key={p.month} type="button" aria-pressed={selected === p.month} aria-label={`${monthLabel(p.month)}: venta ${formatMoney(p.sales)}, ingreso ${formatMoney(p.income)} MXN`} onClick={() => setSelected(p.month)} className={`flex h-full min-w-0 flex-1 flex-col justify-end rounded-t-md px-1 pt-2 transition-colors hover:bg-[#1d1d1f]/5 ${selected === p.month ? "bg-[#1d1d1f]/5 ring-1 ring-inset ring-[#1d1d1f]/15" : ""}`}>
                    <span className="flex h-full w-full items-end justify-center gap-0.5 sm:gap-1">
                        <span className="w-full max-w-7 rounded-t-sm bg-[#1d1d1f]/35" style={{ height: p.sales > 0 ? `max(3px, ${(p.sales / max) * 100}%)` : "0%" }} />
                        <span className="w-full max-w-7 rounded-t-sm bg-[#26654b]" style={{ height: p.income > 0 ? `max(3px, ${(p.income / max) * 100}%)` : "0%" }} />
                    </span>
                    <span className="mt-2 flex h-9 shrink-0 flex-col justify-center text-[10px] leading-tight text-[#1d1d1f]/60"><span>{monthLabel(p.month).slice(0, 3)}</span><span className="hidden sm:inline">{p.month.slice(0, 4)}</span></span>
                </button>)}
            </div>
            <div aria-live="polite" className="mt-4 text-sm">
                {active ? <div className="rounded-lg bg-[#1d1d1f]/[0.035] p-4">
                    <p className="font-medium">{monthLabel(active.month)} · Venta {formatMoney(active.sales)} · Ingreso {formatMoney(active.income)}</p>
                    {active.soldProjects.length > 0 && <ul className="mt-3 space-y-2 text-xs text-[#1d1d1f]/65">{active.soldProjects.map((p) => <li key={p.id} className="flex justify-between gap-4"><span>{p.name}</span><Money value={p.total} /></li>)}</ul>}
                    <Link href={`/admin/clientes/pagos?mes=${active.month}`} className="mt-3 inline-block text-xs underline underline-offset-4">Ver pagos de este mes →</Link>
                </div> : <p className="text-xs text-[#1d1d1f]/55">{totals.sales === 0 && totals.income === 0 ? "No hay ventas ni ingresos en este periodo." : "Los importes exactos también están en la tabla de abajo."}</p>}
            </div>
        </section>
        <p className="mt-4 text-xs leading-relaxed text-[#1d1d1f]/60">Venta: total de proyectos aprobados, entregados o en pausa, contado en el mes de su primer pago. Ingreso: pagos recibidos de proyectos y mensualidades.</p>
        <table className="mt-8 w-full text-sm">
            <caption className="pb-4 text-left font-semibold">Detalle mensual · MXN</caption>
            <thead><tr className="border-b border-[#1d1d1f]/15 text-xs text-[#1d1d1f]/55"><th scope="col" className="py-3 text-left font-medium">Mes</th><th scope="col" className="py-3 text-right font-medium">Venta</th><th scope="col" className="py-3 text-right font-medium">Ingreso</th></tr></thead>
            <tbody>{[...series].reverse().map((p) => <tr key={p.month} className="border-b border-[#1d1d1f]/10"><th scope="row" className="py-3 text-left font-normal"><Link href={`/admin/clientes/pagos?mes=${p.month}`} className="underline-offset-4 hover:underline">{monthLabel(p.month)}</Link></th><td className="py-3 text-right"><Money value={p.sales} /></td><td className="py-3 text-right"><Money value={p.income} /></td></tr>)}</tbody>
        </table>
    </main>;
}
