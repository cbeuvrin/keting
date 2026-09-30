"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney, STATUS_LABELS, type Client, type Payment, type Project, type ProjectStatus, type Retainer } from "@/lib/clientes";

// Piezas compartidas de las pestañas de CLIENTES. Mismo lenguaje visual que el
// CRM: tarjetas blancas con borde fino, tinta #1d1d1f y acento en Playfair.

export const inputCls = "border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f] bg-white";
export const buttonCls = "bg-[#111111] text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-black transition-colors disabled:opacity-40";
export const ghostButtonCls = "px-3 py-1.5 text-xs rounded-md border border-[#1d1d1f]/15 text-[#1d1d1f]/70 hover:border-[#1d1d1f]/40 hover:text-[#1d1d1f] transition-colors";
export const cardCls = "bg-white border border-[#1d1d1f]/10 rounded-lg";
/** Celda editable: parece texto hasta que se pasa el mouse o se enfoca. */
export const cellInputCls =
    "w-full min-w-0 bg-transparent px-2 py-1.5 rounded border border-transparent hover:border-[#1d1d1f]/15 focus:border-[#1d1d1f] focus:bg-white outline-none";
export const thCls = "px-3 py-2.5 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-[#1d1d1f]/45 whitespace-nowrap";

export function Money({ value, muted = false }: { value: number; muted?: boolean }) {
    return <span className={`tabular-nums whitespace-nowrap ${muted ? "text-[#1d1d1f]/45" : ""}`}>{formatMoney(value)}</span>;
}

const STATUS_STYLE: Record<ProjectStatus, string> = {
    esperando: "bg-[#1d1d1f]/[0.06] text-[#1d1d1f]/70",
    aprobado: "bg-[#111111] text-white",
    entregado: "bg-[#1d1d1f]/[0.14] text-[#1d1d1f]",
    en_pausa: "bg-white text-[#1d1d1f]/70 border border-dashed border-[#1d1d1f]/30",
    cancelado: "bg-white text-[#b4472f] border border-[#b4472f]/30 line-through decoration-[#b4472f]/40",
};

/**
 * Lo que falta de un proyecto. Un proyecto en cotización todavía no se debe:
 * su monto va en gris para no confundirlo con una deuda.
 */
export function Remaining({ status, remaining }: { status: ProjectStatus; remaining: number }) {
    if (status === "cancelado") return <span className="text-[#1d1d1f]/30">—</span>;
    if (remaining < 0) return <span className="text-xs text-[#1d1d1f]/60">a favor <Money value={-remaining} /></span>;
    if (remaining === 0) return <span className="text-xs text-[#1d1d1f]/60">pagado ✓</span>;
    if (status === "esperando")
        return (
            <span title="En cotización: todavía no se debe" className="font-normal">
                <Money value={remaining} muted />
            </span>
        );
    return <Money value={remaining} />;
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
    return <span className={`inline-block px-2 py-0.5 rounded text-xs whitespace-nowrap ${STATUS_STYLE[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function PageHeader({ title, accent, children }: { title: string; accent?: string; children?: React.ReactNode }) {
    return (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {title} {accent && <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]/50">{accent}</span>}
            </h1>
            {children}
        </header>
    );
}

export function MissingSchema({ error }: { error: string }) {
    return (
        <main className="max-w-3xl px-6 md:px-8 py-16">
            <h1 className="text-2xl font-bold mb-4">Falta preparar la base de datos</h1>
            <p className="text-[#1d1d1f]/70 leading-relaxed mb-6">
                Abre Supabase → SQL Editor, pega el contenido de{" "}
                <code className="bg-black/5 px-1.5 py-0.5 rounded">scripts/clientes-schema.sql</code> y ejecútalo. Después recarga.
            </p>
            <p className="text-xs font-mono text-[#1d1d1f]/40 break-all">{error}</p>
        </main>
    );
}

/** Llama a /api/admin/clientes/*. Devuelve el mensaje de error, o null si salió bien. */
export async function api(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<string | null> {
    const res = await fetch(`/api/admin/clientes/${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return (data as { error?: string }).error ?? `Error ${res.status}`;
}

/** Ejecuta un cambio y refresca la página; si falla, lo avisa. */
export function useMutate() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const run = async (path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<boolean> => {
        setBusy(true);
        const error = await api(path, method, body);
        setBusy(false);
        if (error) {
            window.alert(error);
            return false;
        }
        router.refresh();
        return true;
    };
    return { run, busy };
}

/** "YYYY-MM-DD" → "14 sep 2026" */
export function formatDate(date: string | null): string {
    if (!date) return "—";
    const [y, m, d] = date.split("-").map(Number);
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return `${d} ${months[m - 1]} ${y}`;
}

/**
 * Formulario para registrar un pago. Si se le pasa `clientId` fijo (desde la
 * ficha) solo pregunta a qué va; si no (pestaña Pagos), primero pide el cliente.
 */
export function PaymentForm({
    clients,
    projects,
    retainers,
    today,
    clientId,
    onDone,
}: {
    clients: Client[];
    projects: Project[];
    retainers: Retainer[];
    today: string;
    clientId?: string;
    onDone?: () => void;
}) {
    const { run, busy } = useMutate();
    const [client, setClient] = useState(clientId ?? "");
    const [target, setTarget] = useState("");
    const [amount, setAmount] = useState("");
    const [paidOn, setPaidOn] = useState(today);
    const [note, setNote] = useState("");

    const clientProjects = projects.filter((p) => p.client_id === client && p.status !== "cancelado");
    const clientRetainers = retainers.filter((r) => r.client_id === client);

    const submit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const [kind, id] = target.split(":");
        const done = await run("payments", "POST", {
            project_id: kind === "p" ? id : undefined,
            retainer_id: kind === "r" ? id : undefined,
            amount,
            paid_on: paidOn,
            note,
        });
        if (done) {
            setAmount("");
            setNote("");
            setTarget("");
            onDone?.();
        }
    };

    return (
        <form
            onSubmit={submit}
            className={`grid gap-3 sm:grid-cols-2 items-end ${clientId ? "lg:grid-cols-[1.6fr_1fr_1fr_1.4fr_auto]" : "lg:grid-cols-[1.3fr_1.6fr_1fr_1fr_1.2fr_auto]"}`}
        >
            {!clientId && (
                <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
                    Cliente
                    <select
                        required
                        value={client}
                        onChange={(ev) => {
                            setClient(ev.target.value);
                            setTarget("");
                        }}
                        className={`${inputCls} w-full min-w-0`}
                    >
                        <option value="">Elige…</option>
                        {clients
                            .filter((c) => !c.archived)
                            .map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.company ? `${c.name} · ${c.company}` : c.name}
                                </option>
                            ))}
                    </select>
                </label>
            )}
            <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
                A qué va
                <select required value={target} onChange={(ev) => setTarget(ev.target.value)} className={`${inputCls} w-full min-w-0`} disabled={!client}>
                    <option value="">{client ? "Elige…" : "Primero el cliente"}</option>
                    {clientProjects.length > 0 && (
                        <optgroup label="Proyectos">
                            {clientProjects.map((p) => (
                                <option key={p.id} value={`p:${p.id}`}>
                                    {p.name}
                                </option>
                            ))}
                        </optgroup>
                    )}
                    {clientRetainers.length > 0 && (
                        <optgroup label="Mensualidades">
                            {clientRetainers.map((r) => (
                                <option key={r.id} value={`r:${r.id}`}>
                                    {r.concept} · {formatMoney(r.monthly_amount)}/mes
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </label>
            <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
                Monto
                <input required inputMode="decimal" placeholder="$0" value={amount} onChange={(ev) => setAmount(ev.target.value)} className={`${inputCls} w-full min-w-0`} />
            </label>
            <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
                Fecha
                <input required type="date" value={paidOn} onChange={(ev) => setPaidOn(ev.target.value)} className={`${inputCls} w-full min-w-0`} />
            </label>
            <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
                Nota
                <input placeholder="Transferencia, anticipo…" value={note} onChange={(ev) => setNote(ev.target.value)} className={`${inputCls} w-full min-w-0`} />
            </label>
            <button type="submit" disabled={busy} className={buttonCls}>
                Registrar pago
            </button>
        </form>
    );
}

/** Nombre visible del cliente: "Carlos · Keting" o solo el nombre. */
export function clientName(clients: Client[], id: string): string {
    const c = clients.find((x) => x.id === id);
    if (!c) return "—";
    return c.company ? `${c.company}` : c.name;
}

/** A qué fue un pago: nombre del proyecto o concepto de la mensualidad. */
export function paymentTarget(payment: Payment, projects: Project[], retainers: Retainer[]): string {
    if (payment.project_id) return projects.find((p) => p.id === payment.project_id)?.name ?? "Proyecto";
    const r = retainers.find((x) => x.id === payment.retainer_id);
    return r ? `Mensualidad · ${r.concept}` : "Mensualidad";
}
