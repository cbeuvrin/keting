"use client";

import Link from "next/link";
import { cents, type Currency, type Retainer, type RetainerBalance } from "@/lib/clientes";
import { formatDate, Money } from "../ui";

export function RecurringSchedule({ retainer, balance, currency }: { retainer: Retainer; balance: RetainerBalance; currency?: Currency }) {
    const pending = balance.pendingDates;
    const visible = pending.slice(0, 8);
    return <div className="my-3 text-xs text-[#6d7470]">
        <p>{retainer.frequency === "quincenal" ? "Quincenal · día 15 y último día del mes" : "Mensual · día 1"} · <Money value={retainer.monthly_amount} currency={currency} /> por cobro{balance.nextDueOn && <> · Próximo: {formatDate(balance.nextDueOn)}</>}</p>
        {pending.length > 0 ? <div className="mt-2 flex flex-wrap gap-2" aria-label="Periodos pendientes">{visible.map((day, i) => <span className="rounded border border-[#d7ded8] bg-white px-2 py-1" key={day}>{formatDate(day)} · <Money value={i === 0 ? cents(balance.debt - (pending.length - 1) * retainer.monthly_amount) : retainer.monthly_amount} currency={currency} /> pendiente</span>)}{pending.length > visible.length && <span>y {pending.length - visible.length} periodos más</span>}</div> : <p className="mt-1">Sin cobros pendientes{balance.credit > 0 && <> · A favor <Money value={balance.credit} currency={currency} /></>}</p>}
        <p className="mt-1">Los abonos cubren primero la fecha pendiente más antigua.</p>
    </div>;
}

export function QuincenalSummary({ retainer, balance }: { retainer: Retainer; balance: RetainerBalance }) {
    return <div className="border border-[#1d1d1f]/10 rounded-md p-4">
        <div className="flex flex-wrap justify-between gap-2"><b>{retainer.concept} · Quincenal</b><Link href="/admin/clientes/cobros?tipo=mensualidad" className="text-xs underline">Editar en Recurrentes</Link></div>
        <p className="text-xs mt-1">Desde {formatDate(retainer.start_month)}{retainer.end_month && <> hasta {formatDate(retainer.end_month)}</>} · Cobrado <Money value={balance.paid} /> · Pendiente <Money value={balance.debt} /></p>
        <RecurringSchedule retainer={retainer} balance={balance} />
    </div>;
}
