"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lead, LeadStage } from "@/lib/crm";
import { LEAD_STAGES, STAGE_LABELS } from "@/lib/crm";
import { ImportCsv } from "./ImportCsv";

// Tablero del pipeline. Sin librería de drag&drop: cada tarjeta se mueve con
// las flechas ‹ › entre etapas — más fiable en trackpad y móvil que arrastrar,
// y suficiente para un pipeline de una persona.

const SOURCE_BADGE: Record<string, string> = {
    contacto: "Formulario",
    testimonio: "Testimonio",
    manual: "Manual",
    csv: "CSV",
};

function timeAgo(iso: string): string {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (days === 0) return "hoy";
    if (days === 1) return "ayer";
    if (days < 30) return `hace ${days} d`;
    return `hace ${Math.floor(days / 30)} m`;
}

export function Board({ initialLeads }: { initialLeads: Lead[] }) {
    const router = useRouter();
    const [leads, setLeads] = useState(initialLeads);
    const [query, setQuery] = useState("");
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState({ name: "", email: "", phone: "", company: "" });
    const [busy, setBusy] = useState(false);
    const [listFilter, setListFilter] = useState("");

    const lists = useMemo(() => {
        const names = new Set<string>();
        for (const l of leads) if (l.list_name) names.add(l.list_name);
        return [...names].sort();
    }, [leads]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return leads.filter((l) => {
            if (listFilter && l.list_name !== listFilter) return false;
            if (!q) return true;
            return [l.name, l.email, l.company, l.phone, l.list_name].some((v) => v?.toLowerCase().includes(q));
        });
    }, [leads, query, listFilter]);

    async function move(lead: Lead, dir: -1 | 1) {
        const idx = LEAD_STAGES.indexOf(lead.stage);
        const next = LEAD_STAGES[idx + dir];
        if (!next) return;
        // Optimista: se mueve ya en pantalla y se confirma detrás.
        setLeads((all) => all.map((l) => (l.id === lead.id ? { ...l, stage: next } : l)));
        await fetch(`/api/admin/crm/leads/${lead.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stage: next }),
        });
        router.refresh();
    }

    async function addLead(ev: React.FormEvent) {
        ev.preventDefault();
        if (!draft.name.trim()) return;
        setBusy(true);
        const res = await fetch("/api/admin/crm/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
        });
        if (res.ok) {
            const { lead } = await res.json();
            setLeads((all) => [lead, ...all]);
            setDraft({ name: "", email: "", phone: "", company: "" });
            setAdding(false);
        }
        setBusy(false);
    }

    return (
        <main className="max-w-[1600px] mx-auto px-6 py-8">
            {/* Barra superior: buscador + alta rápida */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <input
                    value={query}
                    onChange={(ev) => setQuery(ev.target.value)}
                    placeholder="Buscar nombre, correo, empresa…"
                    className="flex-1 min-w-[220px] max-w-md border border-[#1d1d1f]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1d1d1f] transition-colors"
                />
                {lists.length > 0 && (
                    <select
                        value={listFilter}
                        onChange={(ev) => setListFilter(ev.target.value)}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f]"
                    >
                        <option value="">Todas las listas</option>
                        {lists.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                )}
                <button
                    onClick={() => setAdding((v) => !v)}
                    className="bg-[#111111] text-white px-5 py-2.5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-black transition-colors"
                >
                    {adding ? "Cancelar" : "+ Lead"}
                </button>
                <ImportCsv />
            </div>

            {adding && (
                <form onSubmit={addLead} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-3 bg-white border border-[#1d1d1f]/10 p-4">
                    <input autoFocus value={draft.name} onChange={(ev) => setDraft({ ...draft, name: ev.target.value })} placeholder="Nombre *" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.email} onChange={(ev) => setDraft({ ...draft, email: ev.target.value })} placeholder="Correo" type="email" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.phone} onChange={(ev) => setDraft({ ...draft, phone: ev.target.value })} placeholder="Teléfono" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm outline-none focus:border-[#1d1d1f]" />
                    <input value={draft.company} onChange={(ev) => setDraft({ ...draft, company: ev.target.value })} placeholder="Empresa" className="border border-[#1d1d1f]/15 px-3 py-2 text-sm outline-none focus:border-[#1d1d1f]" />
                    <button type="submit" disabled={busy || !draft.name.trim()} className="bg-[#111111] text-white text-xs font-medium tracking-[0.2em] uppercase disabled:opacity-40">
                        Guardar
                    </button>
                </form>
            )}

            {/* Columnas del pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {LEAD_STAGES.map((stage) => {
                    const column = filtered.filter((l) => l.stage === stage);
                    return (
                        <section key={stage} className="min-h-[300px]">
                            <header className="flex items-baseline justify-between mb-3 px-1">
                                <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-[#1d1d1f]/60">
                                    {STAGE_LABELS[stage]}
                                </h2>
                                <span className="font-mono text-xs text-[#1d1d1f]/40">{column.length}</span>
                            </header>
                            <div className="flex flex-col gap-2.5">
                                {column.map((lead) => (
                                    <article key={lead.id} className="group bg-white border border-[#1d1d1f]/10 hover:border-[#1d1d1f]/30 transition-colors p-3.5">
                                        <Link href={`/admin/lead/${lead.id}`} className="block">
                                            <div className="font-medium leading-tight">{lead.name}</div>
                                            {lead.company && <div className="text-sm text-[#1d1d1f]/60 mt-0.5">{lead.company}</div>}
                                            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[10px] font-mono uppercase tracking-wider text-[#1d1d1f]/40">
                                                <span className="border border-[#1d1d1f]/15 px-1.5 py-0.5">{SOURCE_BADGE[lead.source] ?? lead.source}</span>
                                                {lead.list_name && <span className="border border-[#1d1d1f]/15 px-1.5 py-0.5">{lead.list_name}</span>}
                                                {lead.unsubscribed && <span className="border border-red-300 text-red-600 px-1.5 py-0.5">Baja</span>}
                                                <span>{timeAgo(lead.updated_at)}</span>
                                            </div>
                                        </Link>
                                        <div className="flex justify-between mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => move(lead, -1)}
                                                disabled={stage === LEAD_STAGES[0]}
                                                aria-label="Mover a la etapa anterior"
                                                className="text-[#1d1d1f]/40 hover:text-[#1d1d1f] disabled:invisible px-1"
                                            >‹</button>
                                            <button
                                                onClick={() => move(lead, 1)}
                                                disabled={stage === LEAD_STAGES[LEAD_STAGES.length - 1]}
                                                aria-label="Mover a la etapa siguiente"
                                                className="text-[#1d1d1f]/40 hover:text-[#1d1d1f] disabled:invisible px-1"
                                            >›</button>
                                        </div>
                                    </article>
                                ))}
                                {column.length === 0 && (
                                    <div className="border border-dashed border-[#1d1d1f]/10 py-8 text-center text-xs text-[#1d1d1f]/30">
                                        vacío
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </main>
    );
}
