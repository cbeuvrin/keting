"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Download, Plus, Trash2, Pencil, X } from "lucide-react";
import { LEAD_STAGES, STAGE_LABELS, LEAD_SOURCES,
    SOURCE_LABELS,
    LEAD_SERVICES, SERVICE_LABELS, SERVICE_SHORT, type LeadStage, type LeadService } from "@/lib/crm";
import type { LeadRow } from "@/lib/crm-rows";
import { ImportCsv } from "../ImportCsv";

// Tabla de contactos: filas y columnas, ordenable por cualquier columna, con
// filtros arriba y exportación a CSV. Sustituye a las tarjetas del tablero
// anterior — con decenas de contactos, una tabla se recorre y se compara; unas
// tarjetas, no.

type EditableField = "name" | "email" | "company" | "phone";

type SortKey = "name" | "email" | "company" | "city" | "list_name" | "stage" | "sentAt" | "openedAt" | "created_at";

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
    initialServicio,
    initialOrigen,
}: {
    rows: LeadRow[];
    initialCorreo: string;
    initialEtapa: string;
    initialServicio: string;
    initialOrigen: string;
}) {
    const router = useRouter();
    // Copia local de las filas: la edición se ve al instante y se confirma
    // detrás. Se resincroniza cuando el servidor manda datos nuevos.
    const [data, setData] = useState(rows);
    const [prevRows, setPrevRows] = useState(rows);
    if (prevRows !== rows) {
        // El servidor mandó datos nuevos (refresh tras guardar, importar o
        // borrar): esa es la verdad, se adopta y se descarta lo optimista.
        setPrevRows(rows);
        setData(rows);
    }
    const [editing, setEditing] = useState<{ id: string; field: EditableField } | null>(null);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [lista, setLista] = useState("");
    const [servicio, setServicio] = useState(initialServicio);
    const [origen, setOrigen] = useState(initialOrigen);
    const [ciudad, setCiudad] = useState("");
    const [etapa, setEtapa] = useState(initialEtapa);
    // "" todos · "con" con correo · "sin" sin correo · "abierto" abrieron ·
    // "noabierto" recibieron y no abrieron · "baja" dados de baja
    const [correo, setCorreo] = useState(initialCorreo);
    const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
        key: "created_at",
        dir: "desc",
    });
    // Selección para cambios en lote. Se guarda por id, así sobrevive a que
    // cambien los filtros: lo seleccionado sigue seleccionado aunque salga de
    // la vista, y el contador dice cuántos hay en total.
    const [sel, setSel] = useState<Set<string>>(new Set());
    const [loteBusy, setLoteBusy] = useState(false);
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState({ name: "", email: "", phone: "", company: "", service: "" });
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
            setDraft({ name: "", email: "", phone: "", company: "", service: "" });
            setAdding(false);
            router.refresh();
        }
        setSaving(false);
    }

    const listas = useMemo(() => {
        const set = new Set<string>();
        // Con un origen elegido solo se ofrecen sus listas: dentro de los
        // eventos no tiene sentido ver los nombres de las importaciones.
        for (const r of data) if (r.list_name && (!origen || r.source === origen)) set.add(r.list_name);
        return [...set].sort();
    }, [data, origen]);

    const ciudades = useMemo(() => {
        const cuenta = new Map<string, number>();
        for (const r of data) if (r.city) cuenta.set(r.city, (cuenta.get(r.city) ?? 0) + 1);
        return [...cuenta.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
    }, [data]);

    const filtradas = useMemo(() => {
        const q = query.trim().toLowerCase();
        const out = data.filter((r) => {
            if (origen && r.source !== origen) return false;
            if (ciudad && r.city !== ciudad) return false;
            if (lista && r.list_name !== lista) return false;
            if (etapa && r.stage !== etapa) return false;
            if (servicio && (r.service ?? "") !== servicio) return false;
            if (correo === "con" && !r.sentAt) return false;
            if (correo === "sin" && r.sentAt) return false;
            if (correo === "abierto" && !r.openedAt) return false;
            if (correo === "noabierto" && (!r.sentAt || r.openedAt)) return false;
            if (correo === "baja" && !r.unsubscribed) return false;
            if (!q) return true;
            return [r.name, r.email, r.company, r.phone, r.list_name, r.city].some((v) =>
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
    }, [data, query, lista, etapa, correo, servicio, origen, ciudad, sort]);

    function toggleSort(key: SortKey) {
        setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
    }

    async function guardarCampo(id: string, field: EditableField, value: string) {
        setEditing(null);
        const actual = data.find((r) => r.id === id);
        if (!actual || (actual[field] ?? "") === value.trim()) return;
        const previo = actual[field];
        setData((all) => all.map((r) => (r.id === id ? { ...r, [field]: value.trim() || null } : r)));
        setError("");
        const res = await fetch(`/api/admin/crm/leads/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: value }),
        });
        if (!res.ok) {
            // Revertir y decir por qué: un correo inválido no puede quedarse
            // en pantalla como si se hubiera guardado.
            const d = await res.json().catch(() => ({}));
            setData((all) => all.map((r) => (r.id === id ? { ...r, [field]: previo } : r)));
            setError(d.error || "No se pudo guardar");
        } else {
            router.refresh();
        }
    }

    const visiblesSel = useMemo(
        () => filtradas.filter((r) => sel.has(r.id)).length,
        [filtradas, sel]
    );

    function alternarSel(id: string) {
        setSel((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function alternarTodasVisibles() {
        setSel((prev) => {
            const next = new Set(prev);
            const todasPuestas = filtradas.every((r) => next.has(r.id));
            for (const r of filtradas) {
                if (todasPuestas) next.delete(r.id);
                else next.add(r.id);
            }
            return next;
        });
    }

    async function aplicarLote(patch: Record<string, unknown>) {
        const ids = [...sel];
        if (ids.length === 0) return;
        setLoteBusy(true);
        setError("");
        // Optimista, igual que la edición de celda.
        setData((all) => all.map((r) => (sel.has(r.id) ? { ...r, ...patch } as typeof r : r)));
        const res = await fetch("/api/admin/crm/leads/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids, ...patch }),
        });
        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            setError(d.error || "No se pudo aplicar el cambio");
        }
        router.refresh();
        setLoteBusy(false);
    }

    async function borrarLote() {
        const ids = [...sel];
        if (ids.length === 0) return;
        if (!confirm(`¿Borrar ${ids.length} contactos? Se van también sus notas y su historial de correos.`)) return;
        setLoteBusy(true);
        setData((all) => all.filter((r) => !sel.has(r.id)));
        await fetch("/api/admin/crm/leads/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids, action: "delete" }),
        });
        setSel(new Set());
        router.refresh();
        setLoteBusy(false);
    }

    async function borrar(id: string, name: string) {
        if (!confirm(`¿Borrar a ${name}? Se van también sus notas y su historial de correos.`)) return;
        setData((all) => all.filter((r) => r.id !== id));
        await fetch(`/api/admin/crm/leads/${id}`, { method: "DELETE" });
        router.refresh();
    }

    async function cambiarServicio(id: string, service: string) {
        setData((all) => all.map((r) => (r.id === id ? { ...r, service: (service || null) as LeadService | null } : r)));
        await fetch(`/api/admin/crm/leads/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service }),
        });
        router.refresh();
    }

    async function cambiarEtapa(id: string, stage: LeadStage) {
        setData((all) => all.map((r) => (r.id === id ? { ...r, stage } : r)));
        await fetch(`/api/admin/crm/leads/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stage }),
        });
        router.refresh();
    }

    function exportar() {
        const cols = ["Nombre", "Correo", "Empresa", "Teléfono", "Servicio", "Ciudad", "País", "Lista", "Etapa", "Enviado", "Abierto", "Baja"];
        const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const csv = [
            cols.join(","),
            ...filtradas.map((r) =>
                [
                    r.name, r.email, r.company, r.phone,
                    r.service ? SERVICE_LABELS[r.service] : "",
                    r.city, r.country,
                    r.list_name,
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

    // Celda editable: un clic la convierte en campo. Enter o salir guarda,
    // Escape cancela. El correo mantiene su enlace mailto cuando no se edita.
    const Cell = ({
        row,
        field,
        className = "",
    }: {
        row: LeadRow;
        field: EditableField;
        className?: string;
    }) => {
        const activa = editing?.id === row.id && editing.field === field;
        const valor = (row[field] as string | null) ?? "";
        if (activa) {
            return (
                <td className={`px-1 py-1 ${className}`}>
                    <input
                        autoFocus
                        defaultValue={valor}
                        onBlur={(ev) => guardarCampo(row.id, field, ev.target.value)}
                        onKeyDown={(ev) => {
                            if (ev.key === "Enter") (ev.target as HTMLInputElement).blur();
                            if (ev.key === "Escape") setEditing(null);
                        }}
                        className="w-full border border-[#1d1d1f] bg-white px-2 py-1.5 text-sm rounded outline-none"
                    />
                </td>
            );
        }
        return (
            <td
                onClick={() => { setEditing({ id: row.id, field }); setError(""); }}
                title="Clic para editar"
                className={`px-3 py-2.5 cursor-text truncate ${className}`}
            >
                {valor ? (
                    field === "email" ? (
                        <span>{valor}</span>
                    ) : (
                        valor
                    )
                ) : (
                    <span className="text-[#1d1d1f]/25">—</span>
                )}
            </td>
        );
    };

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
                        {filtradas.length !== data.length && ` de ${data.length}`}
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
                <form onSubmit={addLead} className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-2 bg-white border border-[#1d1d1f]/10 rounded-lg p-3">
                    <input autoFocus value={draft.name} onChange={(ev) => setDraft({ ...draft, name: ev.target.value })} placeholder="Nombre *" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.email} onChange={(ev) => setDraft({ ...draft, email: ev.target.value })} placeholder="Correo" type="email" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.phone} onChange={(ev) => setDraft({ ...draft, phone: ev.target.value })} placeholder="Teléfono" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.company} onChange={(ev) => setDraft({ ...draft, company: ev.target.value })} placeholder="Empresa" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]" />
                    <select value={draft.service} onChange={(ev) => setDraft({ ...draft, service: ev.target.value })} className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f] bg-white">
                        <option value="">Servicio…</option>
                        {LEAD_SERVICES.map((sv) => (
                            <option key={sv} value={sv}>{SERVICE_LABELS[sv]}</option>
                        ))}
                    </select>
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
                <select value={servicio} onChange={(ev) => setServicio(ev.target.value)} className={selectCls}>
                    <option value="">Todos los servicios</option>
                    {LEAD_SERVICES.map((sv) => (
                        <option key={sv} value={sv}>{SERVICE_LABELS[sv]}</option>
                    ))}
                </select>
                <select value={origen} onChange={(ev) => setOrigen(ev.target.value)} className={selectCls}>
                    <option value="">Todos los orígenes</option>
                    {LEAD_SOURCES.map((sc) => (
                        <option key={sc} value={sc}>{SOURCE_LABELS[sc]}</option>
                    ))}
                </select>
                {ciudades.length > 0 && (
                    <select value={ciudad} onChange={(ev) => setCiudad(ev.target.value)} className={selectCls}>
                        <option value="">Todas las ciudades</option>
                        {ciudades.map(([c, n]) => (
                            <option key={c} value={c}>{c} ({n})</option>
                        ))}
                    </select>
                )}
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
                {(query || correo || etapa || lista || servicio || origen || ciudad) && (
                    <button
                        onClick={() => { setQuery(""); setCorreo(""); setEtapa(""); setLista(""); setServicio(""); setOrigen(""); setCiudad(""); }}
                        className="text-sm text-[#1d1d1f]/50 hover:text-[#1d1d1f] px-2"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {sel.size > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-3 bg-[#111111] text-white rounded-lg px-4 py-3">
                    <span className="text-sm font-medium">
                        {sel.size} seleccionado{sel.size === 1 ? "" : "s"}
                        {visiblesSel !== sel.size && (
                            <span className="text-white/50"> · {sel.size - visiblesSel} fuera del filtro</span>
                        )}
                    </span>

                    <select
                        disabled={loteBusy}
                        value=""
                        onChange={(ev) => ev.target.value && aplicarLote({ service: ev.target.value === "__none" ? "" : ev.target.value })}
                        className="bg-white/10 border border-white/20 text-white px-3 py-1.5 text-sm rounded-md outline-none"
                    >
                        <option value="" className="text-[#1d1d1f]">Cambiar servicio…</option>
                        {LEAD_SERVICES.map((sv) => (
                            <option key={sv} value={sv} className="text-[#1d1d1f]">{SERVICE_LABELS[sv]}</option>
                        ))}
                        <option value="__none" className="text-[#1d1d1f]">Quitar servicio</option>
                    </select>

                    <select
                        disabled={loteBusy}
                        value=""
                        onChange={(ev) => ev.target.value && aplicarLote({ stage: ev.target.value })}
                        className="bg-white/10 border border-white/20 text-white px-3 py-1.5 text-sm rounded-md outline-none"
                    >
                        <option value="" className="text-[#1d1d1f]">Cambiar etapa…</option>
                        {LEAD_STAGES.map((st) => (
                            <option key={st} value={st} className="text-[#1d1d1f]">{STAGE_LABELS[st]}</option>
                        ))}
                    </select>

                    <button
                        disabled={loteBusy}
                        onClick={() => {
                            const nombre = prompt("Nombre de la lista (vacío para quitarla):", "");
                            if (nombre !== null) aplicarLote({ list_name: nombre });
                        }}
                        className="bg-white/10 border border-white/20 px-3 py-1.5 text-sm rounded-md hover:bg-white/20 transition-colors"
                    >
                        Asignar lista
                    </button>

                    <button
                        disabled={loteBusy}
                        onClick={borrarLote}
                        className="ml-auto flex items-center gap-1.5 text-white/70 hover:text-white px-2 py-1.5 text-sm"
                    >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} /> Borrar
                    </button>
                    <button
                        onClick={() => setSel(new Set())}
                        className="text-white/50 hover:text-white p-1.5"
                        title="Quitar selección"
                    >
                        <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>
            )}

            {error && (
                <p className="mb-3 text-sm text-[#b4472f]">{error}</p>
            )}

            {/* La tabla */}
            <div className="bg-white border border-[#1d1d1f]/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 bg-[#FAFAF8] border-b border-[#1d1d1f]/10 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="w-10 px-3 py-2.5">
                                    <input
                                        type="checkbox"
                                        checked={filtradas.length > 0 && filtradas.every((r) => sel.has(r.id))}
                                        onChange={alternarTodasVisibles}
                                        title="Seleccionar todo lo que se ve"
                                        className="w-4 h-4 accent-black align-middle"
                                    />
                                </th>
                                <Th k="name">Nombre</Th>
                                <Th k="email">Correo</Th>
                                <Th k="company">Empresa</Th>
                                <th className="text-left font-medium px-3 py-2.5 text-[#1d1d1f]/55 whitespace-nowrap">Teléfono</th>
                                <th className="text-left font-medium px-3 py-2.5 text-[#1d1d1f]/55 whitespace-nowrap">Servicio</th>
                                <Th k="city">Ciudad</Th>
                                <Th k="list_name">Lista</Th>
                                <Th k="stage">Etapa</Th>
                                <Th k="sentAt">Enviado</Th>
                                <Th k="openedAt">Abierto</Th>
                                <th className="text-left font-medium px-3 py-2.5 text-[#1d1d1f]/55">Estado</th>
                                <th className="w-10" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtradas.map((r) => (
                                <tr
                                    key={r.id}
                                    className={`group/row ${sel.has(r.id) ? "bg-[#1d1d1f]/[0.04]" : ""} border-b border-[#1d1d1f]/[0.06] last:border-0 hover:bg-[#1d1d1f]/[0.02]`}
                                >
                                    <td className="px-3 py-2.5">
                                        <input
                                            type="checkbox"
                                            checked={sel.has(r.id)}
                                            onChange={() => alternarSel(r.id)}
                                            className="w-4 h-4 accent-black align-middle"
                                        />
                                    </td>
                                    <Cell row={r} field="name" className="font-medium min-w-[150px]" />
                                    <Cell row={r} field="email" className="text-[#1d1d1f]/70 min-w-[200px]" />
                                    <Cell row={r} field="company" className="text-[#1d1d1f]/70 max-w-[160px]" />
                                    <Cell row={r} field="phone" className="text-[#1d1d1f]/70 whitespace-nowrap" />
                                    <td className="px-3 py-2.5">
                                        <select
                                            value={r.service ?? ""}
                                            onChange={(ev) => cambiarServicio(r.id, ev.target.value)}
                                            className={`text-xs px-2 py-1 rounded appearance-none cursor-pointer outline-none ${
                                                r.service ? "bg-[#1d1d1f]/[0.07] text-[#1d1d1f]" : "text-[#1d1d1f]/30"
                                            }`}
                                        >
                                            <option value="">—</option>
                                            {LEAD_SERVICES.map((sv) => (
                                                <option key={sv} value={sv} className="text-[#1d1d1f]">{SERVICE_LABELS[sv]}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-3 py-2.5 max-w-[120px]">
                                        {r.city ? (
                                            <span className="block text-xs truncate" title={[r.city, r.country].filter(Boolean).join(", ")}>{r.city}</span>
                                        ) : (
                                            <span className="text-[#1d1d1f]/30">—</span>
                                        )}
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
                                    <td className="px-2 py-2.5">
                                        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/lead/${r.id}`}
                                                title="Abrir ficha"
                                                className="p-1.5 rounded text-[#1d1d1f]/40 hover:text-[#1d1d1f] hover:bg-[#1d1d1f]/[0.06]"
                                            >
                                                <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                                            </Link>
                                            <button
                                                onClick={() => borrar(r.id, r.name)}
                                                title="Borrar contacto"
                                                className="p-1.5 rounded text-[#1d1d1f]/40 hover:text-[#b4472f] hover:bg-[#b4472f]/10"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtradas.length === 0 && (
                    <div className="py-16 text-center text-sm text-[#1d1d1f]/40">
                        {data.length === 0
                            ? "Todavía no hay contactos. Importa un CSV o añade uno a mano."
                            : "Ningún contacto coincide con estos filtros."}
                    </div>
                )}
            </div>
        </main>
    );
}
