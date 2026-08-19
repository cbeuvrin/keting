"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Download, Plus } from "lucide-react";
import { LEAD_STAGES, STAGE_LABELS, type LeadStage } from "@/lib/crm";
import type { LeadRow } from "@/lib/crm-rows";
import { ImportCsv } from "../ImportCsv";

// Tabla de contactos: filas y columnas, ordenable por cualquier columna, con
// filtros arriba y exportación a CSV. Sustituye a las tarjetas del tablero
// anterior — con decenas de contactos, una tabla se recorre y se compara; unas
// tarjetas, no.

type SortKey = "name" | "email" | "company" | "list_name" | "stage" | "sentAt" | "openedAt" | "created_at";

const FECHA = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short" });
const FECHA_LARGA = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" });

function fecha(iso: string | null): string {
    return iso ? FECHA.format(new Date(iso)) : "—";
}

const STAGE_STYLE: Record<LeadStage, string> = {
    nuevo: "bg-[#1d1d1f]/[0.06] text-[#1d1d1f]/70",
    contactado: "bg-[#1d1d1f]/10 text-[#1d1d1f]",
    propuesta: "bg-[#1d1d1f] text-white",
    ganado: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    perdido: "bg-[#b4472f]/10 text-[#b4472f]",
};

export function ContactsTable({
    rows,
    initialCorreo,
    initialEtapa,
}: {
    rows: LeadRow[];
    initialCorreo: string;
    initialEtapa: string;
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [lista, setLista] = useState("");
    const [etapa, setEtapa] = useState(initialEtapa);
    // "" todos · "con" con correo · "sin" sin correo · "abierto" abrieron ·
    // "noabierto" recibieron y no abrieron · "baja" dados de baja
    const [correo, setCorreo] = useState(initialCorreo);
    const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
        key: "created_at",
        dir: "desc",
    });
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState({ name: "", email: "", phone: "", company: "" });
    const [saving, setSaving] = useState(false);

    async function addLead(ev: React.FormEvent) {
        ev.preventDefault();
        if (!draft.name.trim()) return;
        setSaving(true);
        const res = await fetch("/api/admin/crm/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
        });
        if (res.ok) {
            setDraft({ name: "", email: "", phone: "", company: "" });
            setAdding(false);
            router.refresh();
        }
        setSaving(false);
    }

    const listas = useMemo(() => {
        const set = new Set<string>();
        for (const r of rows) if (r.list_name) set.add(r.list_name);
        return [...set].sort();
    }, [rows]);

    const filtradas = useMemo(() => {
        const q = query.trim().toLowerCase();
        const out = rows.filter((r) => {
            if (lista && r.list_name !== lista) return false;
            if (etapa && r.stage !== etapa) return false;
            if (correo === "con" && !r.sentAt) return false;
            if (correo === "sin" && r.sentAt) return false;
            if (correo === "abierto" && !r.openedAt) return false;
            if (correo === "noabierto" && (!r.sentAt || r.openedAt)) return false;
            if (correo === "baja" && !r.unsubscribed) return false;
            if (!q) return true;
            return [r.name, r.email, r.company, r.phone, r.list_name].some((v) =>
                v?.toLowerCase().includes(q)
            );
        });

        const dir = sort.dir === "asc" ? 1 : -1;
        return [...out].sort((a, b) => {
            const av = a[sort.key] ?? "";
            const bv = b[sort.key] ?? "";
            // Los vacíos siempre al final, mande la dirección que mande.
            if (!av && bv) return 1;
            if (av && !bv) return -1;
            return String(av).localeCompare(String(bv), "es") * dir;
        });
    }, [rows, query, lista, etapa, correo, sort]);

    function toggleSort(key: SortKey) {
        setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
    }

    async function cambiarEtapa(id: string, stage: LeadStage) {
        await fetch(`/api/admin/crm/leads/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stage }),
        });
        router.refresh();
    }

    function exportar() {
        const cols = ["Nombre", "Correo", "Empresa", "Teléfono", "Lista", "Etapa", "Enviado", "Abierto", "Baja"];
        const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const csv = [
            cols.join(","),
            ...filtradas.map((r) =>
                [
                    r.name, r.email, r.company, r.phone, r.list_name,
                    STAGE_LABELS[r.stage],
                    r.sentAt ? new Date(r.sentAt).toISOString() : "",
                    r.openedAt ? new Date(r.openedAt).toISOString() : "",
                    r.unsubscribed ? "sí" : "",
                ].map(esc).join(",")
            ),
        ].join("\n");
        // BOM para que Excel abra los acentos bien.
        const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `contactos-keting-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const Th = ({ k, children, className = "" }: { k: SortKey; children: React.ReactNode; className?: string }) => (
        <th className={`text-left font-medium px-3 py-2.5 whitespace-nowrap ${className}`}>
            <button
                onClick={() => toggleSort(k)}
                className={`inline-flex items-center gap-1.5 group ${sort.key === k ? "text-[#1d1d1f]" : "text-[#1d1d1f]/55 hover:text-[#1d1d1f]"}`}
            >
                {children}
                <ArrowUpDown className={`w-3 h-3 ${sort.key === k ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
            </button>
        </th>
    );

    const selectCls =
        "border border-[#1d1d1f]/15 bg-white px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]";

    return (
        <main className="px-6 md:px-8 py-8 max-w-[1600px]">
            <header className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Contactos{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]/40 text-2xl">
                        {filtradas.length}
                        {filtradas.length !== rows.length && ` de ${rows.length}`}
                    </span>
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={exportar}
                        className="inline-flex items-center gap-2 border border-[#1d1d1f]/15 bg-white px-3.5 py-2 text-sm rounded-md hover:border-[#1d1d1f] transition-colors"
                    >
                        <Download className="w-4 h-4" strokeWidth={1.75} /> Exportar
                    </button>
                    <ImportCsv />
                    <button
                        onClick={() => setAdding((v) => !v)}
                        className="inline-flex items-center gap-2 bg-[#111111] text-white px-3.5 py-2 text-sm rounded-md hover:bg-black transition-colors"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2} /> {adding ? "Cancelar" : "Contacto"}
                    </button>
                </div>
            </header>

            {adding && (
                <form onSubmit={addLead} className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2 bg-white border border-[#1d1d1f]/10 rounded-lg p-3">
                    <input autoFocus value={draft.name} onChange={(ev) => setDraft({ ...draft, name: ev.target.value })} placeholder="Nombre *" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.email} onChange={(ev) => setDraft({ ...draft, email: ev.target.value })} placeholder="Correo" type="email" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.phone} onChange={(ev) => setDraft({ ...draft, phone: ev.target.value })} placeholder="Teléfono" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.company} onChange={(ev) => setDraft({ ...draft, company: ev.target.value })} placeholder="Empresa" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <button type="submit" disabled={saving || !draft.name.trim()} className="bg-[#111111] text-white text-sm rounded-md disabled:opacity-40">
                        Guardar
                    </button>
                </form>
            )}

            {/* Filtros, en una sola fila */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <input
                    value={query}
                    onChange={(ev) => setQuery(ev.target.value)}
                    placeholder="Buscar nombre, correo, empresa…"
                    className="flex-1 min-w-[200px] max-w-sm border border-[#1d1d1f]/15 bg-white px-3.5 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]"
                />
                <select value={correo} onChange={(ev) => setCorreo(ev.target.value)} className={selectCls}>
                    <option value="">Todo el correo</option>
                    <option value="sin">Aún sin enviar</option>
                    <option value="con">Ya se le envió</option>
                    <option value="abierto">Abrieron</option>
                    <option value="noabierto">Recibieron y no abrieron</option>
                    <option value="baja">Dados de baja</option>
                </select>
                <select value={etapa} onChange={(ev) => setEtapa(ev.target.value)} className={selectCls}>
                    <option value="">Todas las etapas</option>
                    {LEAD_STAGES.map((s) => (
                        <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                    ))}
                </select>
                {listas.length > 0 && (
                    <select value={lista} onChange={(ev) => setLista(ev.target.value)} className={selectCls}>
                        <option value="">Todas las listas</option>
                        {listas.map((l) => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                )}
                {(query || correo || etapa || lista) && (
                    <button
                        onClick={() => { setQuery(""); setCorreo(""); setEtapa(""); setLista(""); }}
                        className="text-sm text-[#1d1d1f]/50 hover:text-[#1d1d1f] px-2"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* La tabla */}
            <div className="bg-white border border-[#1d1d1f]/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 bg-[#FAFAF8] border-b border-[#1d1d1f]/10 text-xs uppercase tracking-wider">
                            <tr>
                                <Th k="name">Nombre</Th>
                                <Th k="email">Correo</Th>
                                <Th k="company">Empresa</Th>
                                <Th k="list_name">Lista</Th>
                                <Th k="stage">Etapa</Th>
                                <Th k="sentAt">Enviado</Th>
                                <Th k="openedAt">Abierto</Th>
                                <th className="text-left font-medium px-3 py-2.5 text-[#1d1d1f]/55">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtradas.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-b border-[#1d1d1f]/[0.06] last:border-0 hover:bg-[#1d1d1f]/[0.02]"
                                >
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        <Link href={`/admin/lead/${r.id}`} className="font-medium hover:underline underline-offset-2">
                                            {r.name}
                                        </Link>
                                    </td>
                                    <td className="px-3 py-2.5 text-[#1d1d1f]/70 whitespace-nowrap">
                                        {r.email ? (
                                            <a href={`mailto:${r.email}`} className="hover:underline underline-offset-2">
                                                {r.email}
                                            </a>
                                        ) : (
                                            <span className="text-[#1d1d1f]/30">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-[#1d1d1f]/70 max-w-[160px] truncate">
                                        {r.company || <span className="text-[#1d1d1f]/30">—</span>}
                                    </td>
                                    <td className="px-3 py-2.5 max-w-[130px]">
                                        {r.list_name ? (
                                            <span className="block text-xs font-mono text-[#1d1d1f]/50 truncate" title={r.list_name}>{r.list_name}</span>
                                        ) : (
                                            <span className="text-[#1d1d1f]/30">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5">
                                        {/* Etapa editable en la propia fila: es el cambio
                                            más frecuente y no merece abrir la ficha. */}
                                        <select
                                            value={r.stage}
                                            onChange={(ev) => cambiarEtapa(r.id, ev.target.value as LeadStage)}
                                            className={`text-xs px-2 py-1 rounded appearance-none cursor-pointer outline-none ${STAGE_STYLE[r.stage]}`}
                                        >
                                            {LEAD_STAGES.map((s) => (
                                                <option key={s} value={s} className="bg-white text-[#1d1d1f]">
                                                    {STAGE_LABELS[s]}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap tabular-nums" title={r.sentAt ? FECHA_LARGA.format(new Date(r.sentAt)) : ""}>
                                        {r.sentAt ? (
                                            <span className="text-[#1d1d1f]/70">
                                                {fecha(r.sentAt)}
                                                {r.sentCount > 1 && (
                                                    <span className="text-[#1d1d1f]/40"> ·{r.sentCount}</span>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-[#1d1d1f]/30">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap tabular-nums" title={r.openedAt ? FECHA_LARGA.format(new Date(r.openedAt)) : ""}>
                                        {r.openedAt ? (
                                            <span className="text-emerald-700 font-medium">{fecha(r.openedAt)}</span>
                                        ) : r.sentAt ? (
                                            <span className="text-[#1d1d1f]/30">sin abrir</span>
                                        ) : (
                                            <span className="text-[#1d1d1f]/30">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                        {r.unsubscribed && (
                                            <span className="text-xs px-2 py-1 rounded bg-[#b4472f]/10 text-[#b4472f]">
                                                Baja
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtradas.length === 0 && (
                    <div className="py-16 text-center text-sm text-[#1d1d1f]/40">
                        {rows.length === 0
                            ? "Todavía no hay contactos. Importa un CSV o añade uno a mano."
                            : "Ningún contacto coincide con estos filtros."}
                    </div>
                )}
            </div>
        </main>
    );
}
