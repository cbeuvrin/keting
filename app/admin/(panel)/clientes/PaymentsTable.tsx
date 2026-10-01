"use client";
import styles from "./sheet/sheet.module.css";

import Link from "next/link";
import type { ClientesData } from "@/lib/clientes-rows";
import { FileCell, formatDate, Money, paymentTarget, RECEIPT_ACCEPT, thCls, useMutate } from "./ui";

// Tabla de pagos editable. La usan la ficha del cliente (sus pagos) y la
// pestaña Pagos (todos, con la columna de cliente).

export function PaymentsTable({ payments, data, showClient = false, emptyMessage = "Todavía no hay pagos registrados." }: { payments: ClientesData["payments"]; data: ClientesData; showClient?: boolean; emptyMessage?: string }) {
    const { run, busy } = useMutate();

    const save = (id: string, field: string, value: string, prev: unknown) => {
        if (value.trim() === String(prev ?? "")) return;
        run(`payments/${id}`, "PATCH", { [field]: value });
    };
    const total = payments.reduce((s, p) => s + p.amount, 0);
    const withReceipt = new Set(data.receipts);

    return (
        <div className={`${styles.viewport} ${showClient ? "" : styles.embedded}`}>
            <table className={styles.table} style={{ minWidth: showClient ? 1100 : 920 }} aria-label="Pagos registrados"><colgroup>{[140, ...(showClient ? [180] : []), 240, 115, 220, 160, 45].map((width, i) => <col key={i} style={{ width }} />)}</colgroup>
                <thead>
                    <tr>
                        <th className={thCls}>Fecha</th>
                        {showClient && <th className={thCls}>Cliente</th>}
                        <th className={thCls}>Proyecto o servicio</th>
                        <th className={`${thCls} text-right`}>Importe</th>
                        <th className={thCls}>Nota</th>
                        <th className={thCls}>Comprobante</th>
                        <th className={thCls} />
                    </tr>
                </thead>
                <tbody>
                    {payments.map((p) => {
                        const client = data.clients.find((c) => c.id === p.client_id);
                        return (
                            <tr key={p.id} className="border-t border-[#1d1d1f]/[0.06]">
                                <td className="px-1 py-1 w-[150px]">
                                    <input aria-label={`Fecha del pago ${p.id}`} key={p.paid_on} type="date" defaultValue={p.paid_on} onBlur={(ev) => save(p.id, "paid_on", ev.target.value, p.paid_on)} className={styles.cell} title={formatDate(p.paid_on)} />
                                </td>
                                {showClient && (
                                    <td className="px-3 py-1">
                                        <Link href={`/admin/clientes/lista/${p.client_id}`} className="hover:underline underline-offset-2">
                                            {client?.company || client?.name || "—"}
                                        </Link>
                                    </td>
                                )}
                                <td className="px-3 py-1 text-[#1d1d1f]/70">{paymentTarget(p, data.projects, data.retainers)}</td>
                                <td className="px-1 py-1 w-[130px]">
                                    <input aria-label={`Importe del pago ${p.id}`} key={p.amount} defaultValue={p.amount} inputMode="decimal" onBlur={(ev) => save(p.id, "amount", ev.target.value, p.amount)} className={`${styles.cell} text-right tabular-nums font-medium`} />
                                </td>
                                <td className="px-1 py-1">
                                    <input aria-label={`Nota del pago ${p.id}`} key={p.note ?? ""} defaultValue={p.note ?? ""} onBlur={(ev) => save(p.id, "note", ev.target.value, p.note)} className={styles.cell} />
                                </td>
                                <td className="px-3 py-1 whitespace-nowrap">
                                    <FileCell apiPath={`payments/${p.id}/receipt`} has={withReceipt.has(p.id)} accept={RECEIPT_ACCEPT} label="el comprobante de este pago" />
                                </td>
                                <td className="px-1 py-1 text-right">
                                    <button
                                        title="Borrar pago"
                                        disabled={busy}
                                        onClick={() => window.confirm("¿Borrar este pago?") && run(`payments/${p.id}`, "DELETE")}
                                        className="text-[#1d1d1f]/30 hover:text-[#b4472f] px-2 text-lg leading-none"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {payments.length === 0 && <tr><td colSpan={showClient ? 7 : 6} className={styles.empty}>{emptyMessage}</td></tr>}
                </tbody>
                <tfoot>
                    <tr className="border-t border-[#1d1d1f]/10">
                        <td colSpan={showClient ? 3 : 2} className="px-3 py-2.5 text-right text-xs uppercase tracking-[0.12em] text-[#1d1d1f]/45">
                            Total
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold">
                            <Money value={total} />
                        </td>
                        <td colSpan={3} />
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

