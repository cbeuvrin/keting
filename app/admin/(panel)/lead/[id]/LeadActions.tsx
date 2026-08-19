"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead, LeadEmail, LeadNote, LeadStage } from "@/lib/crm";
import { LEAD_STAGES, STAGE_LABELS } from "@/lib/crm";
import { greetingLine } from "@/lib/email-templates/greeting";

const DATE_FMT = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" });

export function LeadActions({
    lead,
    notes,
    emails,
    smtpReady,
}: {
    lead: Lead;
    notes: LeadNote[];
    emails: LeadEmail[];
    smtpReady: boolean;
}) {
    const router = useRouter();
    const [note, setNote] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [busy, setBusy] = useState<"" | "note" | "email" | "stage" | "name">("");
    const [emailStatus, setEmailStatus] = useState("");
    // Edición del nombre: importa porque de él sale el saludo del correo, y los
    // contactos importados de un CSV sin columna de nombre traen el trozo del
    // correo ("lzaragoza") en su lugar.
    const [editingName, setEditingName] = useState(false);
    const [draftName, setDraftName] = useState(lead.name);

    async function saveName() {
        if (!draftName.trim() || draftName.trim() === lead.name) {
            setEditingName(false);
            return;
        }
        setBusy("name");
        await fetch(`/api/admin/crm/leads/${lead.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: draftName.trim() }),
        });
        setEditingName(false);
        router.refresh();
        setBusy("");
    }

    async function setStage(stage: LeadStage) {
        setBusy("stage");
        await fetch(`/api/admin/crm/leads/${lead.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stage }),
        });
        router.refresh();
        setBusy("");
    }

    async function addNote(ev: React.FormEvent) {
        ev.preventDefault();
        if (!note.trim()) return;
        setBusy("note");
        await fetch("/api/admin/crm/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lead_id: lead.id, body: note.trim() }),
        });
        setNote("");
        router.refresh();
        setBusy("");
    }

    async function sendEmail(ev: React.FormEvent) {
        ev.preventDefault();
        if (!lead.email || !subject.trim() || !body.trim()) return;
        setBusy("email");
        setEmailStatus("");
        const res = await fetch("/api/admin/crm/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lead_id: lead.id, subject: subject.trim(), body: body.trim() }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
            setSubject("");
            setBody("");
            setEmailStatus("Enviado ✓");
            router.refresh();
        } else {
            setEmailStatus(data.error || "Error al enviar");
        }
        setBusy("");
    }

    return (
        <div className="mt-6">
            {/* Cabecera */}
            <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
                <div>
                    {editingName ? (
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                value={draftName}
                                onChange={(ev) => setDraftName(ev.target.value)}
                                onKeyDown={(ev) => {
                                    if (ev.key === "Enter") saveName();
                                    if (ev.key === "Escape") { setDraftName(lead.name); setEditingName(false); }
                                }}
                                className="text-2xl font-bold tracking-tight border border-[#1d1d1f]/20 px-2 py-1 outline-none focus:border-[#1d1d1f]"
                            />
                            <button onClick={saveName} disabled={busy === "name"} className="bg-[#111111] text-white px-3 py-2 text-xs tracking-[0.2em] uppercase disabled:opacity-40">
                                Guardar
                            </button>
                        </div>
                    ) : (
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight group inline-flex items-center gap-3">
                            {lead.name}
                            <button
                                onClick={() => { setDraftName(lead.name); setEditingName(true); }}
                                className="text-xs font-normal tracking-[0.2em] uppercase text-[#1d1d1f]/40 hover:text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Editar
                            </button>
                        </h1>
                    )}
                    <p className="mt-1.5 text-sm text-[#1d1d1f]/50">
                        En el correo se le saluda:{" "}
                        <span className={greetingLine(lead.name) === "Hola," ? "text-amber-700" : "text-[#1d1d1f]"}>
                            «{greetingLine(lead.name)}»
                        </span>
                    </p>
                    <div className="mt-2 text-[#1d1d1f]/60 space-y-0.5 text-sm">
                        {lead.company && <div>{lead.company}</div>}
                        {lead.email && <div>{lead.email}</div>}
                        {lead.phone && <div>{lead.phone}</div>}
                        <div className="text-xs font-mono uppercase tracking-wider text-[#1d1d1f]/40 pt-1">
                            Origen: {lead.source} · Alta: {DATE_FMT.format(new Date(lead.created_at))}
                        </div>
                    </div>
                </div>

                {/* Etapas */}
                <div className="flex flex-wrap gap-1.5">
                    {LEAD_STAGES.map((stage) => (
                        <button
                            key={stage}
                            onClick={() => setStage(stage)}
                            disabled={busy === "stage"}
                            className={`px-3 py-1.5 text-xs font-medium tracking-[0.15em] uppercase border transition-colors ${
                                lead.stage === stage
                                    ? "bg-[#111111] text-white border-[#111111]"
                                    : "border-[#1d1d1f]/20 text-[#1d1d1f]/60 hover:border-[#1d1d1f]"
                            }`}
                        >
                            {STAGE_LABELS[stage]}
                        </button>
                    ))}
                </div>
            </div>

            {lead.message && (
                <blockquote className="mb-10 border-l-2 border-[#1d1d1f]/20 pl-4 text-[#1d1d1f]/70 whitespace-pre-wrap">
                    {lead.message}
                    {lead.interests && (
                        <footer className="mt-2 text-xs font-mono uppercase tracking-wider text-[#1d1d1f]/40">
                            Intereses: {lead.interests}
                        </footer>
                    )}
                </blockquote>
            )}

            <div className="grid md:grid-cols-2 gap-10">
                {/* Notas */}
                <section>
                    <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-[#1d1d1f]/60 mb-4">Notas</h2>
                    <form onSubmit={addNote} className="mb-5">
                        <textarea
                            value={note}
                            onChange={(ev) => setNote(ev.target.value)}
                            placeholder="Llamé, quedamos en…"
                            rows={3}
                            className="w-full border border-[#1d1d1f]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#1d1d1f] resize-y"
                        />
                        <button
                            type="submit"
                            disabled={busy === "note" || !note.trim()}
                            className="mt-2 bg-[#111111] text-white px-4 py-2 text-xs font-medium tracking-[0.2em] uppercase disabled:opacity-40"
                        >
                            Guardar nota
                        </button>
                    </form>
                    <ul className="space-y-4">
                        {notes.map((n) => (
                            <li key={n.id} className="border-l-2 border-[#1d1d1f]/10 pl-3">
                                <div className="text-xs font-mono text-[#1d1d1f]/40 mb-1">{DATE_FMT.format(new Date(n.created_at))}</div>
                                <p className="text-sm whitespace-pre-wrap">{n.body}</p>
                            </li>
                        ))}
                        {notes.length === 0 && <li className="text-sm text-[#1d1d1f]/40">Sin notas todavía.</li>}
                    </ul>
                </section>

                {/* Correo */}
                <section>
                    <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-[#1d1d1f]/60 mb-4">Correo</h2>
                    {lead.unsubscribed ? (
                        <p className="text-sm text-red-600">Este contacto se dio de baja: no se le pueden enviar correos.</p>
                    ) : !lead.email ? (
                        <p className="text-sm text-[#1d1d1f]/40">Este lead no tiene correo registrado.</p>
                    ) : !smtpReady ? (
                        <p className="text-sm text-[#1d1d1f]/40">Falta configurar el SMTP en el entorno.</p>
                    ) : (
                        <form onSubmit={sendEmail} className="mb-6">
                            <input
                                value={subject}
                                onChange={(ev) => setSubject(ev.target.value)}
                                placeholder="Asunto"
                                className="w-full border border-[#1d1d1f]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#1d1d1f] mb-2"
                            />
                            <textarea
                                value={body}
                                onChange={(ev) => setBody(ev.target.value)}
                                placeholder={`Para: ${lead.email}`}
                                rows={6}
                                className="w-full border border-[#1d1d1f]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#1d1d1f] resize-y"
                            />
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    type="submit"
                                    disabled={busy === "email" || !subject.trim() || !body.trim()}
                                    className="bg-[#111111] text-white px-4 py-2 text-xs font-medium tracking-[0.2em] uppercase disabled:opacity-40"
                                >
                                    {busy === "email" ? "Enviando…" : "Enviar"}
                                </button>
                                {emailStatus && <span className="text-sm text-[#1d1d1f]/60">{emailStatus}</span>}
                            </div>
                        </form>
                    )}
                    <ul className="space-y-4">
                        {emails.map((m) => (
                            <li key={m.id} className="border border-[#1d1d1f]/10 bg-white p-3">
                                <div className="text-xs font-mono text-[#1d1d1f]/40 mb-1 flex items-center justify-between gap-2">
                                    <span>{DATE_FMT.format(new Date(m.created_at))} → {m.to_email}</span>
                                    {m.opened_at && (
                                        <span className="text-green-700 normal-case tracking-normal">
                                            Abierto {DATE_FMT.format(new Date(m.opened_at))}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm font-medium">{m.subject}</div>
                                <p className="text-sm text-[#1d1d1f]/60 mt-1 whitespace-pre-wrap line-clamp-4">{m.body}</p>
                            </li>
                        ))}
                        {emails.length === 0 && <li className="text-sm text-[#1d1d1f]/40">Sin correos enviados.</li>}
                    </ul>
                </section>
            </div>
        </div>
    );
}
