"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { currencyOf, formatMoney, type Project, type Retainer } from "@/lib/clientes";
import { defaultPaymentPlan, planError, stageBalances, validDay, type PaymentPlan } from "@/lib/payment-plan";
import type { ClientesData } from "@/lib/clientes-rows";
import { FileCell, PaymentForm, QUOTE_ACCEPT, RECEIPT_ACCEPT } from "../ui";
import { Cell } from "./Cell";
import type { Sheet } from "./useSheet";
import styles from "./sheet.module.css";

export function parseAmount(raw: string): number | null {
    if (!raw.trim()) return null;
    const n = Number(raw.replace(/[$,\s]/g, ""));
    return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
}

export function Details({ project, retainer, plan = defaultPaymentPlan(), data, sheet, showPlan, onTogglePlan }: { project?: Project; retainer?: Retainer; plan?: PaymentPlan; data: ClientesData; sheet: Sheet; showPlan: boolean; onTogglePlan: () => void }) {
    const [adding, setAdding] = useState(false);
    const clientId = (project ?? retainer)!.client_id;
    const currency = currencyOf(data.clients, clientId);
    const own = data.payments.filter((p) => project ? p.project_id === project.id : p.retainer_id === retainer!.id).sort((a, b) => a.paid_on.localeCompare(b.paid_on) || a.created_at.localeCompare(b.created_at));
    const stages = project ? stageBalances(project, data.payments, plan) : [];
    return <div className={styles.detailContent}>
        <div className={styles.detailTitle}>
            <span>{project?.name ?? retainer?.concept} <span className={styles.muted}>· {own.length} abonos · {currency}</span></span>
            <div className={styles.actions}>
                {project && <button type="button" className={styles.button} onClick={onTogglePlan}>{showPlan ? "Cerrar plan" : "Editar plan de cobro"}</button>}
                <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => setAdding(!adding)}><Plus size={13} /> Registrar abono</button>
            </div>
        </div>
        {showPlan && project && <PlanEditor key={JSON.stringify(plan)} project={project} plan={plan} currency={currency} sheet={sheet} onDone={onTogglePlan} />}
        {own.length > 0 ? <div className="overflow-x-auto"><table className={styles.subtable} aria-label={`Abonos de ${project?.name ?? retainer?.concept}`} style={{ minWidth: 580 }}>
            <thead><tr><th scope="col" style={{ width: 150 }}>Fecha cobrada · editable</th><th scope="col" style={{ width: 115 }}>Importe · {currency}</th><th scope="col" style={{ width: 150 }}>Etapa cubierta</th><th scope="col">Nota</th><th scope="col" style={{ width: 150 }}>Comprobante</th></tr></thead>
            <tbody>{own.map((p, index) => <tr key={p.id}>
                <td><Cell value={p.paid_on} type="date" label={`Fecha del abono ${index + 1}`} row={index} column="paid_on" onSave={async (value) => {
                    if (!validDay(value)) { sheet.setError("La fecha del pago no es válida."); return false; }
                    return sheet.save([{ path: `payments/${p.id}`, before: { paid_on: p.paid_on }, after: { paid_on: value }, label: "Fecha del abono" }]);
                }} /></td>
                <td className={styles.money}><Cell value={p.amount} type="money" label={`Importe del abono ${index + 1}`} row={index} column="amount" onSave={async (value) => {
                    const amount = parseAmount(value);
                    if (amount === null || amount <= 0) { sheet.setError("El importe debe ser mayor que cero."); return false; }
                    return sheet.save([{ path: `payments/${p.id}`, before: { amount: p.amount }, after: { amount }, label: "Importe del abono" }]);
                }} /></td>
                <td className={styles.muted}>{project ? stages.filter((s) => s.contributions.some((c) => c.payment.id === p.id)).map((s) => s.label).join(" + ") || "Saldo a favor" : "Mensualidad"}</td>
                <td><Cell value={p.note} label={`Nota del abono ${index + 1}`} row={index} column="note" onSave={(note) => sheet.save([{ path: `payments/${p.id}`, before: { note: p.note }, after: { note: note.trim() || null }, label: "Nota del abono" }])} /></td>
                <td><FileCell apiPath={`payments/${p.id}/receipt`} has={data.receipts.includes(p.id)} accept={RECEIPT_ACCEPT} label="el comprobante" /></td>
            </tr>)}</tbody>
        </table></div> : <p className="py-3 text-xs text-[#6d7470]">Sin abonos registrados. El plan de cobro indica lo pactado; registra aquí el dinero recibido.</p>}
        {adding && <div className="my-3 rounded border border-[#d7ded8] bg-white p-3"><div className={styles.detailTitle}><span>Nuevo abono</span><button type="button" onClick={() => setAdding(false)} className={styles.icon} aria-label="Cerrar nuevo abono"><X size={14} /></button></div><PaymentForm clients={data.clients} projects={data.projects} retainers={data.retainers} today={data.today} clientId={clientId} initialTarget={project ? `p:${project.id}` : `r:${retainer!.id}`} onDone={(warning) => { setAdding(false); sheet.setMessage(warning ?? "Abono registrado"); }} /></div>}
        <div className={styles.actions}>
            {project && <><span className={styles.small}>Cotización:</span><FileCell apiPath={`projects/${project.id}/quote`} has={data.quotes.includes(project.id)} accept={QUOTE_ACCEPT} maxMb={25} label="la cotización" /></>}
            <Link href={`/admin/clientes/lista/${clientId}`} className="ml-auto text-xs underline underline-offset-4">Ficha del cliente</Link>
        </div>
    </div>;
}

function PlanEditor({ project, plan, currency, sheet, onDone }: { project: Project; plan: PaymentPlan; currency: "USD" | "MXN"; sheet: Sheet; onDone: () => void }) {
    const [draft, setDraft] = useState<PaymentPlan>(() => structuredClone(plan));
    const [error, setError] = useState("");
    const update = (index: number, patch: Partial<PaymentPlan["stages"][number]>) => setDraft((old) => ({ stages: old.stages.map((s, i) => i === index ? { ...s, ...patch } : s) }));
    const balance = stageBalances(project, [], draft);
    return <form className={styles.plan} onSubmit={async (ev) => {
        ev.preventDefault();
        const validation = planError(draft, project.total);
        if (validation) { setError(validation); return; }
        if (await sheet.save([{ path: `projects/${project.id}/plan`, before: { stages: plan.stages }, after: { stages: draft.stages }, label: "Plan de cobro" }])) onDone();
    }}>
        <div className={styles.detailTitle}><span>Acuerdo de pago · {formatMoney(project.total, currency)}</span><button type="button" className={styles.button} onClick={() => { setDraft(defaultPaymentPlan()); setError(""); }}>Restablecer 50 / 50</button></div>
        <p className={styles.small}>Los abonos cubren las etapas en orden de fecha. Editar este acuerdo no modifica los pagos registrados.</p>
        {draft.stages.map((s, index) => <div className={styles.planRow} key={s.id}>
            <input aria-label={`Nombre etapa ${index + 1}`} required maxLength={80} value={s.label} onChange={(ev) => update(index, { label: ev.target.value })} />
            {s.kind === "remainder" ? <span className={styles.muted}>Resto del total</span> : <select aria-label={`Tipo etapa ${index + 1}`} value={s.kind} onChange={(ev) => update(index, { kind: ev.target.value as "percent" | "amount" })}><option value="percent">Porcentaje</option><option value="amount">Importe</option></select>}
            {s.kind === "remainder" ? <span className={styles.money}>{formatMoney(balance[index].expected, currency)}</span> : <label className="flex items-center gap-1"><input aria-label={`Valor etapa ${index + 1}`} type="number" min="0" max={s.kind === "percent" ? 100 : undefined} step="0.01" required value={s.value} onChange={(ev) => update(index, { value: Number(ev.target.value) })} />{s.kind === "percent" ? "%" : currency}</label>}
            <input type="date" aria-label={`Fecha prevista etapa ${index + 1}`} value={s.dueOn ?? ""} onChange={(ev) => update(index, { dueOn: ev.target.value || null })} />
            {index > 0 && s.kind !== "remainder" && <button type="button" className={styles.icon} aria-label={`Quitar etapa ${index + 1}`} onClick={() => setDraft({ stages: draft.stages.filter((_, i) => i !== index) })}><X size={13} /></button>}
        </div>)}
        {error && <p role="alert" className={`${styles.notice} ${styles.error}`}>{error}</p>}
        <div className={`${styles.actions} mt-3`}>
            <button type="button" disabled={draft.stages.length >= 12} className={styles.button} onClick={() => setDraft({ stages: [...draft.stages.slice(0, -1), { id: crypto.randomUUID(), label: `Etapa ${draft.stages.length}`, kind: "amount", value: 0, dueOn: null }, draft.stages[draft.stages.length - 1]] })}><Plus size={12} /> Añadir etapa</button>
            <span className={`${styles.small} mr-auto`}>La fecha prevista es opcional.</span>
            <button type="button" className={styles.button} onClick={onDone}>Cancelar</button>
            <button type="submit" disabled={sheet.pending > 0} className={`${styles.button} ${styles.primary}`}>Guardar plan</button>
        </div>
    </form>;
}
