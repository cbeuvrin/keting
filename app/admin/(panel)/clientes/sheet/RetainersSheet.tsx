"use client";
import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { currencyOf, retainerBalance } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";
import { clientName, Money } from "../ui";
import { Cell } from "./Cell";
import { Details, parseAmount } from "./Details";
import type { Sheet } from "./useSheet";
import styles from "./sheet.module.css";

export function RetainersSheet({ data, sheet, query }: { data: ClientesData; sheet: Sheet; query: string }) {
    const [expanded, setExpanded] = useState<string | null>(null);
    const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const rows = data.retainers.filter((r) => normalize(`${r.concept} ${clientName(data.clients, r.client_id)}`).includes(normalize(query.trim())));
    return <div className={styles.viewport}><table className={styles.table} style={{ minWidth: 1050 }} aria-label="Mensualidades editables">
        <colgroup>{[140, 210, 110, 120, 120, 110, 110, 110].map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
        <thead><tr>{["Cliente", "Concepto", "Importe mensual", "Mes de inicio", "Último mes", "Cobrado", "Pendiente", "Estado"].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead>
        <tbody>{rows.map((r, index) => {
            const balance = retainerBalance(r, data.payments, data.today); const currency = currencyOf(data.clients, r.client_id);
            const save = async (field: string, value: string) => {
                let next: string | number | null = value.trim() || null;
                if (field === "concept" && !next) { sheet.setError("El concepto necesita un nombre."); return false; }
                if (field === "monthly_amount") { next = parseAmount(value); if (next === null || next <= 0) { sheet.setError("El importe debe ser mayor que cero."); return false; } }
                if (field === "start_month" || field === "end_month") {
                    if (field === "start_month" && !value) { sheet.setError("Indica el mes de inicio."); return false; }
                    if (value && !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) { sheet.setError("El mes no es válido."); return false; }
                    next = value ? `${value}-01` : null;
                }
                return sheet.save([{ path: `retainers/${r.id}`, before: { [field]: r[field as keyof typeof r] }, after: { [field]: next }, label: field === "monthly_amount" ? "Importe mensual" : "Mensualidad" }]);
            };
            return <Fragment key={r.id}><tr>
                <td><Link className={styles.client} href={`/admin/clientes/lista/${r.client_id}`}>{clientName(data.clients, r.client_id)}{currency === "USD" ? " · USD" : ""}</Link></td>
                <td><div className={styles.project}><button type="button" className={styles.icon} onClick={() => setExpanded(expanded === r.id ? null : r.id)} aria-expanded={expanded === r.id} aria-label={`Ver abonos de ${r.concept}`}>{expanded === r.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button><Cell value={r.concept} label={`Concepto: ${r.concept}`} row={index} column="concept" onSave={(v) => save("concept", v)} /></div></td>
                <td className={styles.money}><Cell value={r.monthly_amount} type="money" label={`Corregir importe mensual: ${r.concept}`} row={index} column="monthly_amount" onSave={(v) => save("monthly_amount", v)} /></td>
                <td><Cell value={r.start_month.slice(0, 7)} type="month" label={`Mes de inicio: ${r.concept}`} row={index} column="start_month" onSave={(v) => save("start_month", v)} /></td>
                <td><Cell value={r.end_month?.slice(0, 7) ?? ""} type="month" label={`Último mes: ${r.concept}`} row={index} column="end_month" onSave={(v) => save("end_month", v)} /></td>
                <td className={styles.money}><Money value={balance.paid} currency={currency} /></td><td className={styles.money}><Money value={balance.debt} currency={currency} />{balance.credit > 0 && <div className={styles.small}>A favor <Money value={balance.credit} currency={currency} /></div>}</td>
                <td><span className={balance.debt > 0 ? styles.orange : styles.green}>{balance.debt > 0 ? "Por cobrar" : "Al corriente"}</span><div className={styles.small}>{balance.active ? "Activa" : r.start_month > data.today ? "Aún no inicia" : "Terminada"}</div></td>
            </tr>{expanded === r.id && <tr><td colSpan={8} className={styles.details}><Details retainer={r} data={data} sheet={sheet} showPlan={false} onTogglePlan={() => {}} /></td></tr>}</Fragment>;
        })}{rows.length === 0 && <tr><td colSpan={8} className={styles.empty}>No hay mensualidades en esta vista.</td></tr>}</tbody>
        <tfoot><tr><td colSpan={8} className="text-left text-[10px]">{rows.length} mensualidades · Corregir el importe recalcula todo el periodo. Para cambiar la tarifa desde otro mes, usa la ficha del cliente.</td></tr></tfoot>
    </table></div>;
}
