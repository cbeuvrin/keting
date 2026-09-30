"use client";

import { useMemo, useState } from "react";
import { monthLabel, monthOf } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { PaymentsTable } from "../PaymentsTable";
import { cardCls, inputCls, Money, PageHeader, PaymentForm } from "../ui";

// Todos los pagos, del más reciente al más viejo. Arriba se registra uno nuevo
// eligiendo cliente y a qué va; abajo se filtra por mes o por cliente.

export function Pagos({ data, initialMonth }: { data: ClientesData; initialMonth: string }) {
    const { clients, projects, retainers, payments, today } = data;
    const [month, setMonth] = useState(initialMonth);
    const [clientId, setClientId] = useState("");

    const months = useMemo(() => [...new Set([monthOf(today), ...payments.map((p) => monthOf(p.paid_on))])].sort().reverse(), [payments, today]);

    const rows = useMemo(
        () =>
            payments
                .filter((p) => !month || monthOf(p.paid_on) === month)
                .filter((p) => !clientId || p.client_id === clientId)
                .sort((a, b) => b.paid_on.localeCompare(a.paid_on)),
        [payments, month, clientId],
    );

    const total = rows.reduce((s, p) => s + p.amount, 0);
    const payers = clients.filter((c) => payments.some((p) => p.client_id === c.id));

    return (
        <main className="px-6 md:px-8 py-8 max-w-[1400px]">
            <PageHeader title="Pagos." accent={month ? monthLabel(month) : "todos"}>
                <p className="text-sm text-[#1d1d1f]/55">
                    {rows.length} {rows.length === 1 ? "pago" : "pagos"} · <Money value={total} />
                </p>
            </PageHeader>

            <section className={`${cardCls} p-5 mb-6`}>
                <h2 className="font-bold tracking-tight mb-4">Registrar pago</h2>
                {clients.some((c) => !c.archived) ? (
                    <PaymentForm clients={clients} projects={projects} retainers={retainers} today={today} />
                ) : (
                    <p className="text-sm text-[#1d1d1f]/60">Primero da de alta un cliente.</p>
                )}
            </section>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <select value={month} onChange={(ev) => setMonth(ev.target.value)} className={inputCls}>
                    <option value="">Todos los meses</option>
                    {months.map((m) => (
                        <option key={m} value={m}>
                            {monthLabel(m)}
                        </option>
                    ))}
                </select>
                {payers.length > 1 && (
                    <select value={clientId} onChange={(ev) => setClientId(ev.target.value)} className={inputCls}>
                        <option value="">Todos los clientes</option>
                        {payers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.company || c.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className={`${cardCls} p-5`}>
                {rows.length === 0 && payments.length > 0 ? (
                    <p className="text-sm text-[#1d1d1f]/45">Ningún pago en esta vista.</p>
                ) : (
                    <PaymentsTable payments={rows} data={data} showClient />
                )}
            </div>
        </main>
    );
}
