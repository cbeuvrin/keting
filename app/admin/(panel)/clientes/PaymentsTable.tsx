"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ClientesData } from "@/lib/clientes-rows";
import { cellInputCls, formatDate, Money, paymentTarget, RECEIPT_ACCEPT, thCls, uploadReceipt, useMutate } from "./ui";

// Tabla de pagos editable. La usan la ficha del cliente (sus pagos) y la
// pestaña Pagos (todos, con la columna de cliente).

export function PaymentsTable({ payments, data, showClient = false }: { payments: ClientesData["payments"]; data: ClientesData; showClient?: boolean }) {
    const { run, busy } = useMutate();
    if (payments.length === 0) return <p className="text-sm text-[#1d1d1f]/45">Todavía no hay pagos registrados.</p>;

    const save = (id: string, field: string, value: string, prev: unknown) => {
        if (value.trim() === String(prev ?? "")) return;
        run(`payments/${id}`, "PATCH", { [field]: value });
    };
    const total = payments.reduce((s, p) => s + p.amount, 0);
    const withReceipt = new Set(data.receipts);

    return (
        <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[760px]">
                <thead>
                    <tr>
                        <th className={thCls}>Fecha</th>
                        {showClient && <th className={thCls}>Cliente</th>}
                        <th className={thCls}>A qué fue</th>
                        <th className={`${thCls} text-right`}>Monto</th>
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
                                    <input key={p.paid_on} type="date" defaultValue={p.paid_on} onBlur={(ev) => save(p.id, "paid_on", ev.target.value, p.paid_on)} className={cellInputCls} title={formatDate(p.paid_on)} />
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
                                    <input key={p.amount} defaultValue={p.amount} inputMode="decimal" onBlur={(ev) => save(p.id, "amount", ev.target.value, p.amount)} className={`${cellInputCls} text-right tabular-nums font-medium`} />
                                </td>
                                <td className="px-1 py-1">
                                    <input key={p.note ?? ""} defaultValue={p.note ?? ""} onBlur={(ev) => save(p.id, "note", ev.target.value, p.note)} className={cellInputCls} />
                                </td>
                                <td className="px-3 py-1 whitespace-nowrap">
                                    <ReceiptCell paymentId={p.id} has={withReceipt.has(p.id)} />
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

/** Ver, subir, cambiar o quitar el comprobante de un pago. */
function ReceiptCell({ paymentId, has }: { paymentId: string; has: boolean }) {
    const router = useRouter();
    const { run, busy } = useMutate();
    const [uploading, setUploading] = useState(false);

    const pick = async (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        ev.target.value = "";
        if (!file) return;
        setUploading(true);
        const error = await uploadReceipt(paymentId, file);
        setUploading(false);
        if (error) return window.alert(error);
        router.refresh();
    };

    const linkCls = "text-xs underline underline-offset-2 text-[#1d1d1f]/70 hover:text-[#1d1d1f] cursor-pointer";
    if (uploading) return <span className="text-xs text-[#1d1d1f]/45">Subiendo…</span>;

    return (
        <span className="inline-flex items-center gap-3">
            {has && (
                <a href={`/api/admin/clientes/payments/${paymentId}/receipt`} target="_blank" rel="noopener" className={`${linkCls} font-medium text-[#1d1d1f]`}>
                    Ver
                </a>
            )}
            <label className={linkCls}>
                {has ? "Cambiar" : "+ Subir"}
                <input type="file" accept={RECEIPT_ACCEPT} onChange={pick} className="sr-only" />
            </label>
            {has && (
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => window.confirm("¿Quitar el comprobante de este pago?") && run(`payments/${paymentId}/receipt`, "DELETE")}
                    className="text-xs text-[#1d1d1f]/35 hover:text-[#b4472f]"
                >
                    Quitar
                </button>
            )}
        </span>
    );
}
