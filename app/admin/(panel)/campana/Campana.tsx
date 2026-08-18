"use client";

import { useMemo, useState } from "react";
import type { Lead } from "@/lib/crm";

// Campaña a una lista: el navegador recorre los destinatarios y dispara UN
// envío por petición, con pausa entre cada uno. Así ninguna función de
// servidor corre más de un envío (sin timeouts) y el ritmo queda dentro de
// los límites de Resend. Cerrar la pestaña detiene la campaña donde va.

const PAUSE_MS = 900;
type SendState = { email: string; name: string; status: "pendiente" | "enviando" | "ok" | "error"; detail?: string };

export function Campana({ leads, resendReady }: { leads: Lead[]; resendReady: boolean }) {
    const lists = useMemo(() => {
        const names = new Set<string>();
        for (const l of leads) if (l.list_name) names.add(l.list_name);
        return [...names].sort();
    }, [leads]);

    const [list, setList] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [progress, setProgress] = useState<SendState[] | null>(null);
    const [running, setRunning] = useState(false);

    const eligible = useMemo(
        () =>
            leads.filter(
                (l) => l.email && !l.unsubscribed && (list === "" ? true : l.list_name === list)
            ),
        [leads, list]
    );
    const excluded = useMemo(
        () =>
            leads.filter(
                (l) => (list === "" ? true : l.list_name === list) && (!l.email || l.unsubscribed)
            ).length,
        [leads, list]
    );

    async function run() {
        if (!eligible.length || !subject.trim() || !body.trim() || running) return;
        if (!confirm(`Se enviará a ${eligible.length} contactos, uno por uno. ¿Continuar?`)) return;
        setRunning(true);
        const states: SendState[] = eligible.map((l) => ({
            email: l.email!,
            name: l.name,
            status: "pendiente",
        }));
        setProgress([...states]);

        for (let i = 0; i < eligible.length; i++) {
            states[i].status = "enviando";
            setProgress([...states]);
            try {
                const res = await fetch("/api/admin/crm/campaign-send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lead_id: eligible[i].id, subject: subject.trim(), body: body.trim() }),
                });
                const data = await res.json().catch(() => ({}));
                states[i].status = res.ok ? "ok" : "error";
                if (!res.ok) states[i].detail = data.error;
            } catch {
                states[i].status = "error";
                states[i].detail = "red";
            }
            setProgress([...states]);
            if (i < eligible.length - 1) await new Promise((r) => setTimeout(r, PAUSE_MS));
        }
        setRunning(false);
    }

    const done = progress?.filter((s) => s.status === "ok").length ?? 0;
    const failed = progress?.filter((s) => s.status === "error").length ?? 0;

    return (
        <main className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
                Campaña <span className="font-[family-name:var(--font-playfair)] italic font-normal">a una lista</span>
            </h1>
            <p className="text-sm text-[#1d1d1f]/60 mb-8">
                Envío uno por uno vía Resend, con pausa entre correos. Los dados de baja se saltan solos.
            </p>

            {!resendReady && (
                <div className="mb-8 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                    Falta conectar el Resend de Keting: crea la cuenta, y añade{" "}
                    <code className="font-mono">RESEND_KETING_API_KEY</code> y{" "}
                    <code className="font-mono">RESEND_KETING_FROM</code> al entorno. Mientras tanto puedes
                    preparar listas y borradores, pero no enviar.
                </div>
            )}

            <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={list}
                        onChange={(ev) => setList(ev.target.value)}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f]"
                    >
                        <option value="">Todos los contactos</option>
                        {lists.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <span className="text-sm text-[#1d1d1f]/60">
                        <strong>{eligible.length}</strong> destinatarios
                        {excluded > 0 && <> · {excluded} excluidos (sin correo o de baja)</>}
                    </span>
                </div>

                <input
                    value={subject}
                    onChange={(ev) => setSubject(ev.target.value)}
                    placeholder="Asunto"
                    disabled={running}
                    className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f]"
                />
                <textarea
                    value={body}
                    onChange={(ev) => setBody(ev.target.value)}
                    placeholder="Cuerpo del correo (texto). El pie con el enlace de baja se añade solo."
                    rows={10}
                    disabled={running}
                    className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f] resize-y"
                />

                <div className="flex items-center gap-4">
                    <button
                        onClick={run}
                        disabled={!resendReady || running || !eligible.length || !subject.trim() || !body.trim()}
                        className="bg-[#111111] text-white px-6 py-3 text-xs font-medium tracking-[0.25em] uppercase disabled:opacity-40 hover:bg-black transition-colors"
                    >
                        {running ? `Enviando… ${done + failed}/${eligible.length}` : `Enviar a ${eligible.length}`}
                    </button>
                    {running && (
                        <span className="text-sm text-[#1d1d1f]/60">
                            No cierres esta pestaña hasta que termine.
                        </span>
                    )}
                    {progress && !running && (
                        <span className="text-sm text-[#1d1d1f]/60">
                            Terminado: {done} enviados{failed > 0 && <>, {failed} con error</>}.
                        </span>
                    )}
                </div>

                {progress && (
                    <ul className="mt-4 border border-[#1d1d1f]/10 bg-white divide-y divide-[#1d1d1f]/5 max-h-80 overflow-y-auto">
                        {progress.map((s) => (
                            <li key={s.email} className="flex items-center justify-between px-4 py-2 text-sm">
                                <span className="truncate">{s.name} <span className="text-[#1d1d1f]/40">{s.email}</span></span>
                                <span className={
                                    s.status === "ok" ? "text-green-700" :
                                    s.status === "error" ? "text-red-600" :
                                    s.status === "enviando" ? "text-[#1d1d1f]" : "text-[#1d1d1f]/30"
                                }>
                                    {s.status === "ok" ? "✓" : s.status === "error" ? `✕ ${s.detail ?? ""}`.trim() : s.status === "enviando" ? "…" : "·"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
