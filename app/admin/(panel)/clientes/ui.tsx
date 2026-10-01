"use client";

import { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { currencyOf, formatMoney, inMxn, STATUS_LABELS, type Client, type Currency, type Payment, type Project, type ProjectStatus, type Retainer } from "@/lib/clientes";
import type { ClientesData } from "@/lib/clientes-rows";

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

/**
 * Moneda de lo que se está mostrando. La ficha de un cliente en dólares y cada
 * fila de un cliente en dólares la ponen en USD; los totales que mezclan
 * clientes van en pesos (ya convertidos con `mxn`).
 */
export const CurrencyContext = createContext<Currency>("MXN");

export function Money({ value, muted = false, currency }: { value: number; muted?: boolean; currency?: Currency }) {
    const fromContext = useContext(CurrencyContext);
    return <span className={`tabular-nums whitespace-nowrap ${muted ? "text-[#1d1d1f]/45" : ""}`}>{formatMoney(value, currency ?? fromContext)}</span>;
}

/** Los datos con los dólares pasados a pesos, para sumar entre clientes. Sin tipo de cambio, los dólares no suman. */
export function mxn(data: ClientesData): ClientesData {
    return inMxn(data, data.usdRate?.rate ?? 0);
}

/** "US$1 = $18.17 · tipo de cambio del 1 oct 2026", solo si hay clientes en dólares. */
export function FxNote({ data, className = "" }: { data: ClientesData; className?: string }) {
    if (!data.clients.some((c) => c.currency === "USD")) return null;
    const fx = data.usdRate;
    return (
        <p className={`text-xs text-[#1d1d1f]/45 ${className}`}>
            {fx
                ? `Dólares sumados en pesos a US$1 = ${formatMoney(fx.rate)} · tipo de cambio del ${formatDate(fx.date)}${fx.stale ? " (último disponible)" : ""}`
                : "Sin tipo de cambio por ahora: los montos en dólares no se están sumando a los totales en pesos."}
        </p>
    );
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

export const RECEIPT_ACCEPT = "image/*,application/pdf";
export const QUOTE_ACCEPT = "application/pdf,image/*,.doc,.docx,.xls,.xlsx";

/**
 * Sube (o reemplaza) un archivo: `apiPath` es la ruta del archivo, p. ej.
 * "payments/<id>/receipt". Pide al servidor una URL firmada y manda el archivo
 * directo a Supabase. Devuelve el error o null.
 */
export async function uploadFile(apiPath: string, file: File, maxMb = 15): Promise<string | null> {
    if (file.size > maxMb * 1024 * 1024) return `El archivo pesa más de ${maxMb} MB`;
    const res = await fetch(`/api/admin/clientes/${apiPath}`, { method: "POST" });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !data.url) return data.error ?? "No se pudo preparar la subida";
    const up = await fetch(data.url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "true" },
        body: file,
    });
    if (up.ok) return null;
    const err = (await up.json().catch(() => ({}))) as { message?: string; error?: string };
    return `No se subió el archivo: ${err.message ?? err.error ?? up.status}`;
}

/** Celda de archivo de un registro: ver, descargar, cambiar o quitar; o subirlo si no hay. */
export function FileCell({ apiPath, has, accept, maxMb = 15, label }: { apiPath: string; has: boolean; accept: string; maxMb?: number; label: string }) {
    const router = useRouter();
    const { run, busy } = useMutate();
    const [uploading, setUploading] = useState(false);

    const pick = async (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        ev.target.value = "";
        if (!file) return;
        setUploading(true);
        const error = await uploadFile(apiPath, file, maxMb);
        setUploading(false);
        if (error) return window.alert(error);
        router.refresh();
    };

    const linkCls = "text-xs underline underline-offset-2 text-[#1d1d1f]/70 hover:text-[#1d1d1f] cursor-pointer";
    if (uploading) return <span className="text-xs text-[#1d1d1f]/45">Subiendo…</span>;
    const url = `/api/admin/clientes/${apiPath}`;

    return (
        <span className="inline-flex items-center gap-3 whitespace-nowrap">
            {has && (
                <>
                    <a href={url} target="_blank" rel="noopener" className={`${linkCls} font-medium text-[#1d1d1f]`}>
                        Ver
                    </a>
                    <a href={`${url}?descargar=1`} className={linkCls}>
                        Descargar
                    </a>
                </>
            )}
            <label className={linkCls}>
                {has ? "Cambiar" : "+ Subir"}
                <input type="file" accept={accept} onChange={pick} className="sr-only" />
            </label>
            {has && (
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => window.confirm(`¿Quitar ${label}?`) && run(apiPath, "DELETE")}
                    className="text-xs text-[#1d1d1f]/35 hover:text-[#b4472f]"
                >
                    Quitar
                </button>
            )}
        </span>
    );
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
    initialTarget = "",
    suggestedAmount,
    stacked = false,
    onBusyChange,
}: {
    clients: Client[];
    projects: Project[];
    retainers: Retainer[];
    today: string;
    clientId?: string;
    onDone?: (warning: string | null) => void;
    initialTarget?: string;
    suggestedAmount?: number;
    stacked?: boolean;
    onBusyChange?: (busy: boolean) => void;
}) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [client, setClient] = useState(clientId ?? "");
    const [target, setTarget] = useState(initialTarget);
    const submitting = useRef(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [amount, setAmount] = useState("");
    const [paidOn, setPaidOn] = useState(today);
    const [note, setNote] = useState("");
    const [file, setFile] = useState<File | null>(null);
    // Cambiar la key vacía el input de archivo después de registrar.
    const [fileKey, setFileKey] = useState(0);

    const cur = currencyOf(clients, client);
    const clientProjects = projects.filter((p) => p.client_id === client && p.status !== "cancelado");
    const clientRetainers = retainers.filter((r) => r.client_id === client);

    const submit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (submitting.current) return;
        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            setError("Introduce un monto mayor a cero.");
            return;
        }
        const [kind, id] = target.split(":");
        submitting.current = true;
        setSaving(true);
        onBusyChange?.(true);
        setError("");
        setNotice("");
        try {
            const res = await fetch("/api/admin/clientes/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_id: kind === "p" ? id : undefined,
                    retainer_id: kind === "r" ? id : undefined,
                    amount,
                    paid_on: paidOn,
                    note,
                }),
            });
            const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
            if (!res.ok || !data.id) {
                setError(data.error ?? `No se pudo registrar el pago (error ${res.status}).`);
                return;
            }
            // Un fallo al subir el archivo nunca vuelve a enviar el pago ya registrado.
            let receiptError: string | null = null;
            if (file) {
                try {
                    receiptError = await uploadFile(`payments/${data.id}/receipt`, file);
                } catch {
                    receiptError = "Se perdió la conexión al subir el comprobante.";
                }
            }
            const warning = receiptError ? `El pago se registró. El comprobante no se pudo subir: ${receiptError} Puedes adjuntarlo en Pagos.` : null;
            setAmount("");
            setNote("");
            setTarget(initialTarget);
            setFile(null);
            setFileKey((k) => k + 1);
            setNotice(warning ?? "Pago registrado.");
            router.refresh();
            onDone?.(warning);
        } catch {
            setError("Se perdió la conexión. Revisa el historial de Pagos antes de volver a enviarlo para evitar duplicados.");
        } finally {
            submitting.current = false;
            setSaving(false);
            onBusyChange?.(false);
        }
    };

    return (
        <form onSubmit={submit} aria-busy={saving}>
            {error && <p role="alert" className="mb-4 rounded-md bg-[#b4472f]/10 p-3 text-sm text-[#923822]">{error}</p>}
            {notice && <p role="status" className="mb-4 rounded-md bg-[#1d1d1f]/5 p-3 text-sm">{notice}</p>}
            <fieldset disabled={saving} className={`grid min-w-0 gap-4 items-end ${stacked ? "grid-cols-1" : `sm:grid-cols-2 ${clientId ? "lg:grid-cols-[1.5fr_1fr_1fr_1.3fr_1.3fr_auto]" : "lg:grid-cols-[1.2fr_1.5fr_0.9fr_1fr_1.1fr_1.2fr_auto]"}`}`}>

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
            {!(stacked && initialTarget) && <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
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
                                    {r.concept} · {formatMoney(r.monthly_amount, cur)}/mes
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </label>}
            <div className="grid gap-1 text-xs text-[#1d1d1f]/60">
            <label className="grid gap-1">
                {cur === "USD" ? "Monto (US$)" : "Monto"}
                <input required type="number" min="0.01" step="0.01" inputMode="decimal" placeholder={cur === "USD" ? "US$0" : "$0"} value={amount} onChange={(ev) => setAmount(ev.target.value)} className={`${inputCls} w-full min-w-0`} />
            </label>
                {suggestedAmount !== undefined && target === initialTarget && (
                    <button type="button" onClick={() => setAmount(String(suggestedAmount))} className="justify-self-start py-1 text-xs underline underline-offset-4 hover:text-[#1d1d1f]">Usar saldo completo: {formatMoney(suggestedAmount, cur)}</button>
                )}
            </div>
            <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
                Fecha
                <input required type="date" value={paidOn} onChange={(ev) => setPaidOn(ev.target.value)} className={`${inputCls} w-full min-w-0`} />
            </label>
            <label className="grid gap-1 text-xs text-[#1d1d1f]/60">
                Nota (opcional)
                <input placeholder="Transferencia, anticipo…" value={note} onChange={(ev) => setNote(ev.target.value)} className={`${inputCls} w-full min-w-0`} />
            </label>
            <div className="grid gap-1 text-xs text-[#1d1d1f]/60">
                Comprobante (opcional)
                <label className={`${inputCls} w-full min-w-0 cursor-pointer truncate focus-within:ring-2 focus-within:ring-[#1d1d1f] ${file ? "text-[#1d1d1f]" : "text-[#1d1d1f]/45"}`} title={file?.name}>
                    {file ? file.name : "Adjuntar foto o PDF"}
                    <input key={fileKey} type="file" accept={RECEIPT_ACCEPT} onChange={(ev) => setFile(ev.target.files?.[0] ?? null)} className="sr-only" />
                </label>
            </div>
            <button type="submit" disabled={saving} className={buttonCls}>
                {saving ? "Guardando…" : "Registrar pago"}
            </button>
            </fieldset>
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
