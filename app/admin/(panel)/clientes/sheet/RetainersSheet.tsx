"use client";
import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { billingDays, currencyOf, retainerBalance } from "@/lib/clientes";
import { readBillingDays } from "@/lib/retainer-frequency";
import { validDay } from "@/lib/payment-plan";
import type { ClientesData } from "@/lib/clientes-rows";
import { clientName, formatDate, Money } from "../ui";
import { Cell } from "./Cell";
import { Details, parseAmount } from "./Details";
import type { Sheet } from "./useSheet";
import styles from "./sheet.module.css";

export function RetainersSheet({ data, sheet, query }: { data: ClientesData; sheet: Sheet; query: string }) {
    const [expanded, setExpanded] = useState<string | null>(null);
    const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const rows = data.retainers.filter((r) => normalize(`${r.concept} ${clientName(data.clients, r.client_id)} ${r.frequency ?? "mensual"}`).includes(normalize(query.trim())));
    return <div className={styles.viewport}><table className={styles.table} style={{ minWidth: 1280 }} aria-label="Servicios recurrentes editables">
        <colgroup>{[130, 180, 105, 85, 100, 115, 115, 110, 105, 105, 110].map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
        <thead><tr>{["Cliente", "Concepto", "Frecuencia", "Días", "Por cobro", "Inicio", "Fin (opcional)", "Próximo cobro", "Cobrado", "Pendiente", "Estado"].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead>
        <tbody>{rows.map((r, index) => {
            const balance = retainerBalance(r, data.payments, data.today); const currency = currencyOf(data.clients, r.client_id);
            const fortnightly = r.frequency === "quincenal";
            const hasPayments = data.payments.some((p) => p.retainer_id === r.id);
            const save = async (field: string, value: string) => {
                let next: string | number | null = value.trim() || null;
                if (field === "concept" && !next) { sheet.setError("El concepto necesita un nombre."); return false; }
                if (field === "monthly_amount") { next = parseAmount(value); if (next === null || next <= 0) { sheet.setError("El importe debe ser mayor que cero."); return false; } }
                if (field === "start_month" || field === "end_month") {
                    if (field === "start_month" && !value) { sheet.setError("Indica cuándo empieza."); return false; }
                    if (value && (fortnightly ? !validDay(value) : !/^\d{4}-(0[1-9]|1[0-2])$/.test(value))) { sheet.setError("La fecha no es válida."); return false; }
                    next = value ? (fortnightly ? value : `${value}-01`) : null;
                }
                return sheet.save([{ path: `retainers/${r.id}`, before: { [field]: r[field as keyof typeof r] }, after: { [field]: next }, label: field === "monthly_amount" ? "Importe por cobro" : "Servicio recurrente" }]);
            };
            return <Fragment key={r.id}><tr>
                <td><Link className={styles.client} href={`/admin/clientes/lista/${r.client_id}`}>{clientName(data.clients, r.client_id)}{currency === "USD" ? " · USD" : ""}</Link></td>
                <td><div className={styles.project}><button type="button" className={styles.icon} onClick={() => setExpanded(expanded === r.id ? null : r.id)} aria-expanded={expanded === r.id} aria-label={`Ver abonos de ${r.concept}`}>{expanded === r.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button><Cell value={r.concept} label={`Concepto: ${r.concept}`} row={index} column="concept" onSave={(v) => save("concept", v)} /></div></td>
                <td>{hasPayments ? <span className="px-2" title="Con pagos registrados, termina este servicio y crea otro para cambiar la frecuencia.">{fortnightly ? "Quincenal" : "Mensual"}</span> : <Cell value={r.frequency ?? "mensual"} label={`Frecuencia: ${r.concept}`} row={index} column="frequency" options={[{ value: "mensual", label: "Mensual" }, { value: "quincenal", label: "Quincenal" }]} onSave={(frequency) => sheet.save([{ path: `retainers/${r.id}/frequency`, before: { frequency: r.frequency ?? "mensual", billing_days: billingDays(r) }, after: { frequency, billing_days: frequency === "quincenal" ? [15, 31] : [1] }, label: "Frecuencia de cobro" }])} />}</td>
                <td><Cell value={billingDays(r).join(", ")} label={`Días de cobro: ${r.concept}`} row={index} column="billing_days" onSave={async (value) => {
                    const days = readBillingDays(value.split(/[,;\s]+/).filter(Boolean).map(Number), r.frequency ?? "mensual");
                    if (!days) { sheet.setError("Escribe un día mensual (10) o dos días quincenales (10, 25), del 1 al 31. Deben ser distintos incluso en febrero."); return false; }
                    return sheet.save([{ path: `retainers/${r.id}/frequency`, before: { frequency: r.frequency ?? "mensual", billing_days: billingDays(r) }, after: { frequency: r.frequency ?? "mensual", billing_days: days }, label: "Días de cobro" }]);
                }} /></td>
                <td className={styles.money}><Cell value={r.monthly_amount} type="money" label={`Importe por cobro: ${r.concept}`} row={index} column="monthly_amount" onSave={(v) => save("monthly_amount", v)} /></td>
                <td><Cell value={fortnightly ? r.start_month : r.start_month.slice(0, 7)} type={fortnightly ? "date" : "month"} label={`Inicio: ${r.concept}`} row={index} column="start_month" onSave={(v) => save("start_month", v)} /></td>
                <td><Cell value={(fortnightly ? r.end_month : r.end_month?.slice(0, 7)) ?? ""} type={fortnightly ? "date" : "month"} label={`Fin: ${r.concept}`} row={index} column="end_month" onSave={(v) => save("end_month", v)} /></td>
                <td className={styles.muted}>{balance.nextDueOn ? formatDate(balance.nextDueOn) : "—"}</td>
                <td className={styles.money}><Money value={balance.paid} currency={currency} /></td><td className={styles.money}><Money value={balance.debt} currency={currency} />{balance.credit > 0 && <div className={styles.small}>A favor <Money value={balance.credit} currency={currency} /></div>}</td>
                <td><span className={balance.debt > 0 ? styles.orange : styles.green}>{balance.debt > 0 ? "Por cobrar" : "Al corriente"}</span><div className={styles.small}>{balance.active ? "Activo" : r.start_month > data.today ? "Aún no inicia" : "Terminado"}</div></td>
            </tr>{expanded === r.id && <tr><td colSpan={11} className={styles.details}><Details retainer={r} data={data} sheet={sheet} showPlan={false} onTogglePlan={() => {}} /></td></tr>}</Fragment>;
        })}{rows.length === 0 && <tr><td colSpan={11} className={styles.empty}>Agrega un servicio mensual o quincenal para empezar.</td></tr>}</tbody>
        <tfoot><tr><td colSpan={11} className="text-left text-[10px]">{rows.length} servicios · Días: mensual «10» · quincenal «10, 25». El 31 se ajusta a fin de mes. El importe es por cobro. Corregir fechas o importes recalcula el periodo completo.</td></tr></tfoot>
    </table></div>;
}
