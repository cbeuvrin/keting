"use client";
import styles from "../sheet/sheet.module.css";
import { SheetHeader } from "../sheet/SheetHeader";

import { useMemo, useState } from "react";
import { monthLabel, monthOf } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { PaymentsTable } from "../PaymentsTable";
import { Money, PaymentForm } from "../ui";

// Todos los pagos, del más reciente al más viejo. Arriba se registra uno nuevo
// eligiendo cliente y a qué va; abajo se filtra por mes o por cliente.

export function Pagos({ data, initialMonth }: { data: ClientesData; initialMonth: string }) {
    const { clients, projects, retainers, payments, today } = data;
    const [month, setMonth] = useState(initialMonth);
    const [clientId, setClientId] = useState("");
    const [creating, setCreating] = useState(false);
    const [paymentBusy, setPaymentBusy] = useState(false);
    const [notice, setNotice] = useState("");

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
        <main className={styles.board}>
            <SheetHeader title="Pagos"><button type="button" disabled={paymentBusy} className={`${styles.button} ${styles.primary}`} aria-expanded={creating} onClick={() => setCreating(!creating)}>Registrar pago</button></SheetHeader>
            <div className={styles.strip}><span>Pagos en esta vista<strong>{rows.length}</strong></span><span>Cobrado<strong><Money value={total} /></strong></span><span>{month ? monthLabel(month) : "Todos los meses"}</span><span className="ml-auto text-[10px]">Totales MXN</span></div>
            {creating && <section className={styles.capturePanel}>
                <div className={styles.detailTitle}><h2>Nuevo pago</h2><button type="button" disabled={paymentBusy} className={styles.button} onClick={() => setCreating(false)}>Cancelar</button></div>
                {clients.some((c) => !c.archived) ? (
                    <PaymentForm clients={clients} projects={projects} retainers={retainers} today={today} onBusyChange={setPaymentBusy} onDone={(warning) => { setCreating(false); setNotice(warning ?? "Pago registrado"); }} />
                ) : (
                    <p className="text-sm text-[#1d1d1f]/60">Primero da de alta un cliente.</p>
                )}
            </section>}

            <div className={styles.toolbar}>
                <select aria-label="Filtrar por mes" value={month} onChange={(ev) => setMonth(ev.target.value)} className={styles.button}>
                    <option value="">Todos los meses</option>
                    {months.map((m) => (
                        <option key={m} value={m}>
                            {monthLabel(m)}
                        </option>
                    ))}
                </select>
                {payers.length > 1 && (
                    <select aria-label="Filtrar por cliente" value={clientId} onChange={(ev) => setClientId(ev.target.value)} className={styles.button}>
                        <option value="">Todos los clientes</option>
                        {payers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.company || c.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <PaymentsTable payments={rows} data={data} showClient emptyMessage={payments.length ? "Ningún pago coincide con estos filtros." : "Todavía no hay pagos registrados."} />
            <footer className={styles.footer}><span role="status">{notice || "Edita fecha, importe o nota directamente en la tabla."}</span><span>Los abonos actualizan los saldos de proyectos y fijos.</span></footer>
        </main>
    );
}
