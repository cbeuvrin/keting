"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import type { ClipboardEvent, PointerEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ChartNoAxesCombined, Check, ChevronDown, ChevronRight, Columns3, Download, Plus, RotateCcw, X } from "lucide-react";
import { currencyOf, formatMoney, monthOf, OWED_STATUSES, PROJECT_STATUSES, projectBalance, retainerBalance, STATUS_LABELS, type Project } from "@/lib/clientes";
import { defaultPaymentPlan, planError, singleStagePayment, stageBalances, validDay, type PaymentPlan, type StageBalance } from "@/lib/payment-plan";
import type { ClientesData } from "@/lib/clientes-rows";
import { clientName, FileCell, FxNote, Money, QUOTE_ACCEPT } from "../ui";
import { Cell } from "./Cell";
import { Details, parseAmount } from "./Details";
import { useSheet, type SheetChange } from "./useSheet";
import { usePreferences } from "./preferences";
import { RetainersSheet } from "./RetainersSheet";
import styles from "./sheet.module.css";

const VIEWS = [{ id: "todos", label: "Todos los proyectos" }, { id: "anticipo", label: "Falta anticipo" }, { id: "finiquito", label: "Falta finiquito" }, { id: "entregados", label: "Entregados sin liquidar" }, { id: "por-cobrar", label: "Por cobrar" }, { id: "mensualidades", label: "Recurrentes" }];
const COLUMNS = [
    { id: "client", label: "Cliente", width: 132, fixed: true },
    { id: "name", label: "Proyecto", width: 185, fixed: true },
    { id: "status", label: "Estado", width: 105 },
    { id: "total", label: "Total", width: 92 },
    { id: "deposit", label: "Anticipo", width: 115 },
    { id: "depositDate", label: "Fecha anticipo", width: 112 },
    { id: "final", label: "Finiquito", width: 115 },
    { id: "finalDate", label: "Fecha finiquito", width: 112 },
    { id: "paid", label: "Cobrado", width: 100 },
    { id: "remaining", label: "Saldo", width: 94 },
    { id: "delivery_date", label: "Entrega", width: 112 },
    { id: "notes", label: "Notas", width: 210 },
    { id: "quote", label: "Cotización", width: 150 },
];
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
type ProjectRow = { project: Project; plan: PaymentPlan; stages: StageBalance[]; paid: number; remaining: number };

export function FinancialBoard({ data: source, initialView = "todos", initialQuery = "", initialStatus = "" }: { data: ClientesData; initialView?: string; initialQuery?: string; initialStatus?: string }) {
    const sheet = useSheet();
    const { preferences, update } = usePreferences();
    const [view, setView] = useState(initialView);
    const [query, setQuery] = useState(initialQuery);
    const [status, setStatus] = useState(initialStatus);
    const [group, setGroup] = useState("none");
    const [sort, setSort] = useState({ column: "delivery_date", ascending: true });
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [planEditor, setPlanEditor] = useState<string | null>(null);
    const [columnsOpen, setColumnsOpen] = useState(false);
    const [saveViewOpen, setSaveViewOpen] = useState(false);
    const [viewName, setViewName] = useState("");
    const [creating, setCreating] = useState(false);
    const [widthPreview, setWidthPreview] = useState<Record<string, number>>({});
    const tableRef = useRef<HTMLTableElement>(null);
    const monthly = view === "mensualidades";
    const data = useMemo<ClientesData>(() => ({ ...source,
        projects: source.projects.map((p) => ({ ...p, ...sheet.overrides[`projects/${p.id}`] })),
        payments: source.payments.map((p) => ({ ...p, ...sheet.overrides[`payments/${p.id}`] })),
        retainers: source.retainers.map((r) => ({ ...r, ...sheet.overrides[`retainers/${r.id}`], ...sheet.overrides[`retainers/${r.id}/frequency`] })),
    }), [source, sheet.overrides]);
    const rows = useMemo<ProjectRow[]>(() => data.projects.map((project) => {
        const plan = (sheet.overrides[`projects/${project.id}/plan`] as PaymentPlan | undefined) ?? data.paymentPlans?.[project.id] ?? defaultPaymentPlan();
        return { project, plan, stages: stageBalances(project, data.payments, plan), ...projectBalance(project, data.payments) };
    }), [data, sheet.overrides]);
    const matchesView = (r: ProjectRow, v: string) => {
        const owed = OWED_STATUSES.includes(r.project.status) && r.remaining > 0;
        if (v === "anticipo") return owed && r.stages[0].remaining > 0;
        if (v === "finiquito") return owed && r.stages.slice(0, -1).every((s) => s.remaining <= 0) && r.stages[r.stages.length - 1].remaining > 0;
        if (v === "entregados") return owed && r.project.status === "entregado";
        if (v === "por-cobrar") return owed;
        return true;
    };
    const comparable = (r: ProjectRow, key: string): number | string => {
        if (key === "client") return clientName(data.clients, r.project.client_id);
        if (key === "paid" || key === "remaining") return r[key];
        if (key === "deposit" || key === "final") return r.stages[key === "deposit" ? 0 : r.stages.length - 1].expected;
        if (key === "depositDate" || key === "finalDate") { const stage = r.stages[key === "depositDate" ? 0 : r.stages.length - 1]; return singleStagePayment(stage, r.stages)?.paid_on ?? stage.dueOn ?? "9999"; }
        return String(r.project[key as keyof Project] ?? "9999");
    };
    const groupName = (r: ProjectRow) => group === "status" ? STATUS_LABELS[r.project.status] : group === "client" ? clientName(data.clients, r.project.client_id) : "";
    const visible = rows.filter((r) => matchesView(r, view) && (!status || r.project.status === status) && (!query.trim() || normalize(`${clientName(data.clients, r.project.client_id)} ${r.project.name} ${r.project.notes ?? ""}`).includes(normalize(query.trim())))).sort((a, b) => {
        const grouping = groupName(a).localeCompare(groupName(b), "es");
        if (grouping) return grouping;
        const av = sort.column === "total" ? a.project.total : comparable(a, sort.column);
        const bv = sort.column === "total" ? b.project.total : comparable(b, sort.column);
        const order = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), "es", { numeric: true });
        return (sort.ascending ? 1 : -1) * order || a.project.id.localeCompare(b.project.id);
    });
    const cols = COLUMNS.filter((c) => c.fixed || !preferences.hidden.includes(c.id));
    const width = (id: string) => Math.min(500, Math.max(70, widthPreview[id] ?? preferences.widths[id] ?? COLUMNS.find((c) => c.id === id)!.width));
    const toMxn = (amount: number, clientId: string) => amount * (currencyOf(data.clients, clientId) === "USD" ? data.usdRate?.rate ?? 0 : 1);
    const collected = data.payments.filter((p) => monthOf(p.paid_on) === monthOf(data.today)).reduce((n, p) => n + toMxn(p.amount, p.client_id), 0);
    const pending = rows.filter((r) => OWED_STATUSES.includes(r.project.status)).reduce((n, r) => n + toMxn(Math.max(0, r.remaining), r.project.client_id), 0);
    const recurring = data.retainers.reduce((n, r) => n + toMxn(retainerBalance(r, data.payments, data.today).debt, r.client_id), 0);
    const totals = visible.reduce((n, r) => ({ total: n.total + (r.project.status === "cancelado" ? 0 : toMxn(r.project.total, r.project.client_id)), paid: n.paid + toMxn(r.paid, r.project.client_id), remaining: n.remaining + (OWED_STATUSES.includes(r.project.status) ? toMxn(Math.max(0, r.remaining), r.project.client_id) : 0) }), { total: 0, paid: 0, remaining: 0 });
    const expand = (id: string, plan = false) => { setExpanded((old) => new Set(old).add(id)); if (plan) setPlanEditor(id); };
    const toggle = (id: string) => setExpanded((old) => { const next = new Set(old); if (next.has(id)) next.delete(id); else next.add(id); return next; });

    const changeFor = (r: ProjectRow, column: string, raw: string): SheetChange => {
        const p = r.project;
        if (["name", "notes", "delivery_date", "total", "status"].includes(column)) {
            let value: string | number | null = raw.trim() || null;
            if (column === "name" && !value) throw new Error("El proyecto necesita un nombre.");
            if (column === "total") { value = parseAmount(raw); if (value === null) throw new Error("Introduce un total válido."); const invalid = planError(r.plan, value); if (invalid) throw new Error(invalid); }
            if (column === "delivery_date" && value && !validDay(String(value))) throw new Error("Usa una fecha válida: AAAA-MM-DD.");
            if (column === "status") { value = PROJECT_STATUSES.find((st) => normalize(st) === normalize(raw) || normalize(STATUS_LABELS[st]) === normalize(raw)) ?? null; if (!value) throw new Error("Estado de proyecto desconocido."); }
            return { path: `projects/${p.id}`, before: { [column]: p[column as keyof Project] }, after: { [column]: value }, label: COLUMNS.find((c) => c.id === column)!.label };
        }
        if (column === "depositDate" || column === "finalDate") {
            const stage = r.stages[column === "depositDate" ? 0 : r.stages.length - 1];
            const payment = singleStagePayment(stage, r.stages);
            if (raw && !validDay(raw)) throw new Error("La fecha no es válida.");
            if (payment) { if (!raw) throw new Error("Un pago registrado necesita una fecha."); return { path: `payments/${payment.id}`, before: { paid_on: payment.paid_on }, after: { paid_on: raw }, label: "Fecha cobrada" }; }
            if (stage.contributions.length) throw new Error("Despliega los abonos para corregir sus fechas por separado.");
            return { path: `projects/${p.id}/plan`, before: { stages: r.plan.stages }, after: { stages: r.plan.stages.map((s) => s.id === stage.id ? { ...s, dueOn: raw || null } : s) }, label: "Fecha prevista" };
        }
        throw new Error(`La columna ${COLUMNS.find((c) => c.id === column)?.label ?? column} se calcula o se edita desde el detalle.`);
    };
    const saveCell = async (r: ProjectRow, column: string, value: string) => {
        try { return await sheet.save([changeFor(r, column, value)]); } catch (err) { sheet.setError((err as Error).message); return false; }
    };
    const paste = (event: ClipboardEvent<HTMLInputElement>, startRow: number, startColumn: string) => {
        const raw = event.clipboardData.getData("text/plain");
        if (!/[\t\r\n]/.test(raw)) return;
        event.preventDefault();
        try {
            const matrix = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n$/, "").split("\n").map((line) => line.split("\t"));
            if (matrix.reduce((n, row) => n + row.length, 0) > 500) throw new Error("Pega un máximo de 500 celdas cada vez.");
            const start = cols.findIndex((c) => c.id === startColumn);
            const changes: SheetChange[] = [];
            for (let ri = 0; ri < matrix.length; ri++) for (let ci = 0; ci < matrix[ri].length; ci++) {
                const r = visible[startRow + ri]; const column = cols[start + ci];
                if (!r || !column) throw new Error("El rango pegado supera las filas o columnas visibles.");
                if (column.id === "depositDate" || column.id === "finalDate") throw new Error("Corrige las fechas de cobro de una en una para distinguir pagos recibidos y fechas previstas.");
                let value = matrix[ri][ci];
                if (column.id === "delivery_date" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) { const [d, m, y] = value.split("/"); value = `${y}-${m}-${d}`; }
                changes.push(changeFor(r, column.id, value));
            }
            void sheet.save(changes);
        } catch (err) { sheet.setError((err as Error).message); }
    };
    const resize = (event: PointerEvent<HTMLSpanElement>, id: string) => {
        event.preventDefault();
        const start = event.clientX; const before = width(id); let final = before;
        const move = (ev: globalThis.PointerEvent) => { final = Math.min(500, Math.max(70, before + ev.clientX - start)); setWidthPreview((old) => ({ ...old, [id]: final })); };
        const finish = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", finish); window.removeEventListener("pointercancel", finish); update({ widths: { ...preferences.widths, [id]: final } }); setWidthPreview({}); };
        window.addEventListener("pointermove", move); window.addEventListener("pointerup", finish); window.addEventListener("pointercancel", finish);
    };
    const exportCsv = () => {
        const safe = (v: unknown) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
        const csv = [["Cliente", "Proyecto", "Moneda", "Estado", "Total", "Anticipo pactado", "Finiquito pactado", "Cobrado", "Saldo", "Entrega", "Notas"], ...visible.map((r) => [clientName(data.clients, r.project.client_id), r.project.name, currencyOf(data.clients, r.project.client_id), STATUS_LABELS[r.project.status], r.project.total, r.stages[0].expected, r.stages[r.stages.length - 1].expected, r.paid, r.remaining, r.project.delivery_date, r.project.notes])].map((row) => row.map(safe).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })); const a = document.createElement("a"); a.href = url; a.download = `keting-proyectos-${data.today}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    const renderCell = (r: ProjectRow, id: string, index: number) => {
        const p = r.project; const currency = currencyOf(data.clients, p.client_id);
        const input = (column: string, type: "text" | "money" | "date" = "text") => <Cell value={p[column as keyof Project]} label={`${COLUMNS.find((c) => c.id === column)!.label}: ${p.name}`} type={type} row={index} column={column} onPaste={(ev) => paste(ev, index, column)} onSave={(value) => saveCell(r, column, value)} />;
        if (id === "client") return <Link href={`/admin/clientes/lista/${p.client_id}`} title={clientName(data.clients, p.client_id)} className={styles.client}>{clientName(data.clients, p.client_id)}{currency === "USD" && <small className="ml-1 font-normal text-[#6d7470]">USD</small>}</Link>;
        if (id === "name") return <div className={styles.project}><button type="button" className={styles.icon} onClick={() => toggle(p.id)} aria-expanded={expanded.has(p.id)} aria-label={`Ver abonos de ${p.name}`}>{expanded.has(p.id) ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button>{input("name")}{r.stages.length > 2 && <button type="button" className={styles.small} onClick={() => expand(p.id, true)} title="Ver todas las etapas">+{r.stages.length - 2}</button>}</div>;
        if (id === "status") return <Cell value={p.status} label={`Estado: ${p.name}`} row={index} column={id} options={PROJECT_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))} onSave={(value) => saveCell(r, id, value)} />;
        if (id === "total") return input("total", "money");
        if (id === "notes") return input("notes");
        if (id === "delivery_date") return input("delivery_date", "date");
        if (id === "paid") return <Money value={r.paid} currency={currency} />;
        if (id === "remaining") return p.status === "cancelado" ? <span className={styles.muted}>Cancelado</span> : <div><Money value={Math.abs(r.remaining)} currency={currency} /><div className={styles.small}>{r.remaining < 0 ? "a favor" : p.status === "esperando" ? "en cotización" : r.remaining === 0 ? "liquidado" : "por cobrar"}</div></div>;
        if (id === "quote") return <FileCell apiPath={`projects/${p.id}/quote`} has={data.quotes.includes(p.id)} accept={QUOTE_ACCEPT} maxMb={25} label="la cotización" />;
        const stage = r.stages[id === "deposit" || id === "depositDate" ? 0 : r.stages.length - 1];
        if (id === "deposit" || id === "final") return <button type="button" onClick={() => expand(p.id, true)} className={styles.stage} aria-label={`Editar ${stage.label} de ${p.name}`}><span>{formatMoney(stage.expected, currency)}</span><span className={`${styles.small} ${stage.remaining === 0 ? styles.green : ""}`}>{stage.expected === 0 ? "Sin importe" : stage.remaining === 0 ? "✓ Cubierto" : stage.paid > 0 ? `Abonado ${formatMoney(stage.paid, currency)}` : stage.kind === "percent" ? `${stage.value}% pactado` : "Pendiente"}</span></button>;
        const payment = singleStagePayment(stage, r.stages);
        if (stage.contributions.length && !payment) return <button type="button" className="w-full py-2 text-xs text-[#326b54] underline underline-offset-2" onClick={() => expand(p.id)}>{stage.contributions.length > 1 ? `${stage.contributions.length} abonos` : "Abono compartido"}</button>;
        return <div className={styles.dateCell}><Cell value={payment?.paid_on ?? stage.dueOn} type="date" row={index} column={id} label={`${payment ? "Fecha cobrada" : "Fecha prevista"} ${stage.label}: ${p.name}`} onSave={(value) => saveCell(r, id, value)} /><small>{payment ? "Cobrada" : "Prevista"}</small></div>;
    };

    return <main className={styles.board}>
        <header className={styles.header}><div className="flex items-baseline"><h1>Finanzas</h1><small>Tu mesa de trabajo</small></div><div className={styles.actions}><Link href="/admin/clientes/evolucion" className={styles.button}><ChartNoAxesCombined size={14} /> Evolución</Link><button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => setCreating(!creating)}><Plus size={14} /> {monthly ? "Servicio recurrente" : "Proyecto"}</button></div></header>
        <div className={styles.strip}><span>Cobrado este mes<strong>{formatMoney(collected)}</strong></span><span>Proyectos por cobrar<strong>{formatMoney(pending)}</strong></span><span>Recurrentes por cobrar<strong>{formatMoney(recurring)}</strong></span><span className="ml-auto text-[10px]">Totales MXN</span></div>
        <div className={styles.tabs} role="group" aria-label="Vistas financieras">{VIEWS.map((v) => <button key={v.id} type="button" className={styles.tab} aria-pressed={view === v.id} onClick={() => { setView(v.id); setCreating(false); }}>{v.label}<span className="ml-1.5 opacity-55">{v.id === "mensualidades" ? data.retainers.length : rows.filter((r) => matchesView(r, v.id)).length}</span></button>)}</div>
        <div className={styles.toolbar}>
            <div className={styles.actions}><input type="search" aria-label="Buscar cliente o proyecto" placeholder="Buscar cliente o proyecto…" className={styles.search} value={query} onChange={(ev) => setQuery(ev.target.value)} />
                {!monthly && <><select className={styles.button} aria-label="Filtrar estado" value={status} onChange={(ev) => setStatus(ev.target.value)}><option value="">Todos los estados</option>{PROJECT_STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}</select><select className={styles.button} aria-label="Agrupar" value={group} onChange={(ev) => setGroup(ev.target.value)}><option value="none">Sin agrupar</option><option value="status">Por estado</option><option value="client">Por cliente</option></select></>}
            </div>
            <div className={styles.actions}>
                {preferences.views.length > 0 && <select className={styles.button} aria-label="Vistas guardadas" value="" onChange={(ev) => { const saved = preferences.views[Number(ev.target.value)]; if (!saved) return; setView(saved.view); setQuery(saved.query); setStatus(saved.status); setGroup(saved.group); update({ hidden: saved.hidden }); }}><option value="">Mis vistas</option>{preferences.views.map((v, i) => <option key={i} value={i}>{v.name}</option>)}</select>}
                <button type="button" className={styles.button} disabled={!sheet.canUndo} onClick={() => void sheet.undo()} title="Deshacer la última edición"><RotateCcw size={13} /> Deshacer</button>
                {!monthly && <div className={styles.popover}><button type="button" className={styles.button} aria-expanded={columnsOpen} onClick={() => setColumnsOpen(!columnsOpen)}><Columns3 size={13} /> Columnas</button>{columnsOpen && <div className={styles.menu}><div className="mb-1 flex justify-between"><strong className="text-xs">Columnas visibles</strong><button type="button" className={styles.icon} aria-label="Cerrar columnas" onClick={() => setColumnsOpen(false)}><X size={13} /></button></div>{COLUMNS.filter((c) => !c.fixed).map((c) => <label key={c.id}><input type="checkbox" checked={!preferences.hidden.includes(c.id)} onChange={(ev) => update({ hidden: ev.target.checked ? preferences.hidden.filter((id) => id !== c.id) : [...preferences.hidden, c.id] })} />{c.label}</label>)}<button type="button" className={`${styles.button} mt-2 w-full`} onClick={() => update({ widths: {}, hidden: ["paid", "notes", "quote"] })}>Restablecer columnas</button></div>}</div>}
                <button type="button" className={styles.button} onClick={() => setSaveViewOpen(!saveViewOpen)}>Guardar vista</button>
                {!monthly && <button type="button" className={styles.button} onClick={exportCsv} aria-label="Exportar proyectos a CSV" title="Exportar a Excel (CSV)"><Download size={14} /></button>}
            </div>
        </div>
        {saveViewOpen && <form className={`${styles.actions} mb-2`} onSubmit={(ev) => { ev.preventDefault(); if (!viewName.trim()) return; update({ views: [...preferences.views.filter((v) => v.name !== viewName.trim()), { name: viewName.trim(), view, query, status, group, hidden: preferences.hidden }].slice(-20) }); setSaveViewOpen(false); setViewName(""); sheet.setMessage("Vista guardada en este navegador"); }}><input className={styles.search} required maxLength={60} aria-label="Nombre de la vista" placeholder="Nombre de la vista" value={viewName} onChange={(ev) => setViewName(ev.target.value)} /><button className={styles.button} type="submit">Guardar</button><button className={styles.button} type="button" onClick={() => setSaveViewOpen(false)}>Cancelar</button></form>}
        {creating && <CreateRow data={data} monthly={monthly} onDone={() => { setCreating(false); sheet.setMessage(monthly ? "Servicio recurrente creado" : "Proyecto creado"); }} onError={sheet.setError} onCancel={() => setCreating(false)} />}
        {sheet.error && <div role="alert" className={`${styles.notice} ${styles.error}`}><span>{sheet.error}</span><button type="button" className="ml-3 underline" onClick={() => sheet.setError("")}>Cerrar</button></div>}
        {monthly ? <RetainersSheet data={data} sheet={sheet} query={query} /> : <div className={styles.viewport}>
            <table ref={tableRef} className={styles.table} style={{ minWidth: cols.reduce((n, c) => n + width(c.id), 0) }} aria-label="Proyectos y plan de cobro">
                <colgroup>{cols.map((c) => <col key={c.id} style={{ width: width(c.id) }} />)}</colgroup>
                <thead><tr>{cols.map((c) => <th scope="col" key={c.id} className={c.fixed ? styles.fixed : ""} style={c.fixed ? { left: c.id === "client" ? 0 : width("client") } : undefined} aria-sort={sort.column === c.id ? sort.ascending ? "ascending" : "descending" : "none"}><button type="button" onClick={() => setSort({ column: c.id, ascending: sort.column === c.id ? !sort.ascending : true })} className="flex w-full items-center gap-1 overflow-hidden text-ellipsis text-left">{c.label}{sort.column === c.id && (sort.ascending ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}</button><span role="separator" aria-label={`Ancho de ${c.label}`} aria-orientation="vertical" tabIndex={0} onKeyDown={(ev) => { if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") { ev.preventDefault(); update({ widths: { ...preferences.widths, [c.id]: Math.max(70, width(c.id) + (ev.key === "ArrowRight" ? 10 : -10)) } }); } }} className={styles.resize} onPointerDown={(ev) => resize(ev, c.id)} /></th>)}</tr></thead>
                <tbody>{visible.map((r, index) => <Fragment key={r.project.id}>
                    {group !== "none" && (index === 0 || groupName(visible[index - 1]) !== groupName(r)) && <tr className={styles.group}><td colSpan={cols.length}>{groupName(r)} · {visible.filter((x) => groupName(x) === groupName(r)).length}</td></tr>}
                    <tr>{cols.map((c) => <td key={c.id} className={`${c.fixed ? styles.fixed : ""} ${c.id === "name" ? styles.fixedLast : ""} ${["total", "paid", "remaining"].includes(c.id) ? styles.money : ""}`} style={c.fixed ? { left: c.id === "client" ? 0 : width("client") } : undefined}>{renderCell(r, c.id, index)}</td>)}</tr>
                    {expanded.has(r.project.id) && <tr><td className={styles.details} colSpan={cols.length}><Details project={r.project} plan={r.plan} data={data} sheet={sheet} showPlan={planEditor === r.project.id} onTogglePlan={() => setPlanEditor(planEditor === r.project.id ? null : r.project.id)} /></td></tr>}
                </Fragment>)}
                {!visible.length && <tr><td colSpan={cols.length} className={styles.empty}>{rows.length ? <><p>No hay proyectos con estos filtros.</p><button type="button" className={`${styles.button} mt-3`} onClick={() => { setQuery(""); setStatus(""); setView("todos"); }}>Limpiar filtros</button></> : <><p>Añade tu primer proyecto para empezar.</p><p className="mt-2 text-xs">El plan inicial es 50% de anticipo y 50% de finiquito; puedes ajustarlo por proyecto.</p></>}</td></tr>}
                </tbody>
                <tfoot><tr>{cols.map((c, index) => <td key={c.id} className={styles.money}>{index === 0 ? <span className="block text-left text-[10px]">{visible.length} proyectos · MXN</span> : c.id === "total" ? formatMoney(totals.total) : c.id === "paid" ? formatMoney(totals.paid) : c.id === "remaining" ? formatMoney(totals.remaining) : ""}</td>)}</tr></tfoot>
            </table>
        </div>}
        <footer className={styles.footer}><span role="status" className="flex items-center gap-1">{sheet.pending ? "Guardando…" : <><Check size={11} />{sheet.message || "Edición directa · Los cambios se guardan al salir de la celda"}</>}</span><span>Tab: siguiente celda · Enter: siguiente fila · Escape: cancelar · Arrastra los bordes para ajustar columnas</span></footer>
        <FxNote data={data} className="mt-1 !text-[10px]" />
    </main>;
}

function CreateRow({ data, monthly, onDone, onError, onCancel }: { data: ClientesData; monthly: boolean; onDone: () => void; onError: (message: string) => void; onCancel: () => void }) {
    const [busy, setBusy] = useState(false);
    const [client, setClient] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("mensual");
    const [date, setDate] = useState(monthly ? data.today.slice(0, 7) : "");
    // router.refresh trae el registro nuevo sin salir de la tabla.
    const router = useRouter();
    return <form className={`${styles.actions} mb-3 rounded border border-[#d7ded8] bg-white p-3`} onSubmit={async (ev) => {
        ev.preventDefault(); if (busy) return; const total = parseAmount(amount); if (total === null || (monthly && total === 0)) { onError("Introduce un importe válido."); return; }
        setBusy(true); onError("");
        try {
            const response = await fetch(`/api/admin/clientes/${monthly ? "retainers" : "projects"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(monthly ? { client_id: client, concept: name, monthly_amount: total, start_month: date, frequency } : { client_id: client, name, total, delivery_date: date || null, status: "aprobado" }) });
            const body = await response.json().catch(() => ({})); if (!response.ok) { onError(body.error ?? "No se pudo crear."); return; }
            router.refresh(); onDone();
        } catch { onError("Se perdió la conexión. Revisa si se creó el registro antes de volver a enviarlo."); } finally { setBusy(false); }
    }}>
        <select disabled={busy} className={styles.button} aria-label="Cliente del nuevo registro" required value={client} onChange={(ev) => setClient(ev.target.value)}><option value="">Seleccionar cliente…</option>{data.clients.filter((c) => !c.archived).map((c) => <option key={c.id} value={c.id}>{c.company || c.name}</option>)}</select>
        <input disabled={busy} className={styles.search} aria-label="Nombre del nuevo registro" required placeholder={monthly ? "Concepto del servicio" : "Nombre del proyecto"} value={name} onChange={(ev) => setName(ev.target.value)} />
        <input disabled={busy} className={`${styles.search} !w-28`} aria-label="Importe del nuevo registro" inputMode="decimal" required placeholder={`${monthly ? "Por cobro" : "Total"} ${currencyOf(data.clients, client)}`} value={amount} onChange={(ev) => setAmount(ev.target.value)} />
        {monthly && <select disabled={busy} className={styles.button} aria-label="Frecuencia del nuevo servicio" value={frequency} onChange={(ev) => { const next = ev.target.value; setFrequency(next); setDate(next === "quincenal" ? data.today : data.today.slice(0, 7)); }}><option value="mensual">Mensual</option><option value="quincenal">Quincenal · 15 y fin de mes</option></select>}
        <label className="flex items-center gap-2 text-xs">{monthly ? "Inicio" : "Entrega"}<input disabled={busy} className={styles.button} type={monthly && frequency === "mensual" ? "month" : "date"} required={monthly} value={date} onChange={(ev) => setDate(ev.target.value)} /></label>
        <button disabled={busy} type="submit" className={`${styles.button} ${styles.primary}`}>{busy ? "Guardando…" : "Crear"}</button><button disabled={busy} type="button" className={styles.button} onClick={onCancel}>Cancelar</button>
        {monthly && <p className="w-full text-xs text-[#6d7470]">{frequency === "quincenal" ? "Importe por quincena. Se cobra el día 15 y el último día del mes, a partir de la fecha de inicio." : "Importe por mes. Cada mensualidad se genera desde el día 1."}</p>}
        {!data.clients.some((c) => !c.archived) && <Link className="text-xs underline" href="/admin/clientes/lista">Primero da de alta un cliente</Link>}
    </form>;
}
