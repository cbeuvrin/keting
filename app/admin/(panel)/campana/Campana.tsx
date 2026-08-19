"use client";

import { useMemo, useState } from "react";
import type { Lead } from "@/lib/crm";
import { greetingLine } from "@/lib/email-templates/greeting";
import { LEAD_SERVICES, SERVICE_LABELS } from "@/lib/crm";

// Campaña a una lista: el navegador recorre los destinatarios y dispara UN
// envío por petición, con pausa entre cada uno. Así ninguna función de
// servidor corre más de un envío (sin timeouts) y el ritmo queda dentro de
// los límites de Resend. Cerrar la pestaña detiene la campaña donde va.

const PAUSE_MS = 900;
type SendState = { email: string; name: string; status: "pendiente" | "enviando" | "ok" | "error"; detail?: string };

export function Campana({ leads, emailed, resendReady, templateSubject }: { leads: Lead[]; emailed: Record<string, string>; resendReady: boolean; templateSubject: string }) {
    const lists = useMemo(() => {
        const names = new Set<string>();
        for (const l of leads) if (l.list_name) names.add(l.list_name);
        return [...names].sort();
    }, [leads]);

    const [list, setList] = useState<string>("");
    const [servicio, setServicio] = useState<string>("");
    // Por defecto la campaña solo va a quienes NUNCA han recibido un correo:
    // así puedes importar contactos nuevos a la misma lista y reenviar sin
    // miedo a repetirle a nadie. Desmarcable para reenvíos deliberados.
    const [onlyNew, setOnlyNew] = useState(true);
    const [template, setTemplate] = useState<"" | "prototipo-web">("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [progress, setProgress] = useState<SendState[] | null>(null);
    const [running, setRunning] = useState(false);

    const inList = useMemo(
        () =>
            leads.filter(
                (l) =>
                    (list === "" ? true : l.list_name === list) &&
                    (servicio === "" ? true : (l.service ?? "") === servicio)
            ),
        [leads, list, servicio]
    );
    const eligible = useMemo(
        () =>
            inList.filter(
                (l) => l.email && !l.unsubscribed && (!onlyNew || !emailed[l.id])
            ),
        [inList, onlyNew, emailed]
    );
    const alreadySent = useMemo(
        () => inList.filter((l) => l.email && !l.unsubscribed && emailed[l.id]).length,
        [inList, emailed]
    );
    const excluded = useMemo(
        () => inList.filter((l) => !l.email || l.unsubscribed).length,
        [inList]
    );

    const bodyOk = template === "prototipo-web" || body.trim().length > 0;

    async function run() {
        if (!eligible.length || !subject.trim() || !bodyOk || running) return;
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
                    body: JSON.stringify({ lead_id: eligible[i].id, subject: subject.trim(), body: body.trim(), template: template || undefined }),
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

    // Cómo va a abrir el correo de cada destinatario. Se muestra ANTES de
    // enviar porque un saludo feo ("Hola lzaragoza,") solo se ve cuando ya
    // salió: aquí se detecta a tiempo y se corrige el nombre en su ficha.
    const saludos = useMemo(
        () =>
            eligible
                .slice(0, 100)
                .map((l) => ({ id: l.id, name: l.name, email: l.email ?? "", line: greetingLine(l.name) })),
        [eligible]
    );
    const sinNombre = saludos.filter((s) => s.line === "Hola,").length;

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
                    <select
                        value={servicio}
                        onChange={(ev) => setServicio(ev.target.value)}
                        disabled={running}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm rounded-md outline-none focus:border-[#1d1d1f]"
                    >
                        <option value="">Todos los servicios</option>
                        {LEAD_SERVICES.map((sv) => (
                            <option key={sv} value={sv}>{SERVICE_LABELS[sv]}</option>
                        ))}
                    </select>
                    <span className="text-sm text-[#1d1d1f]/60">
                        <strong>{eligible.length}</strong> destinatarios
                        {onlyNew && alreadySent > 0 && <> · {alreadySent} ya recibieron y quedan fuera</>}
                        {excluded > 0 && <> · {excluded} sin correo o de baja</>}
                    </span>
                </div>

                <label className="flex items-center gap-2.5 text-sm text-[#1d1d1f]/70 select-none">
                    <input
                        type="checkbox"
                        checked={onlyNew}
                        onChange={(ev) => setOnlyNew(ev.target.checked)}
                        disabled={running}
                        className="w-4 h-4 accent-black"
                    />
                    Solo a quienes aún no se les ha enviado ningún correo
                </label>

                <select
                    value={template}
                    onChange={(ev) => {
                        const t = ev.target.value as "" | "prototipo-web";
                        setTemplate(t);
                        if (t === "prototipo-web" && !subject) {
                            setSubject(templateSubject);
                        }
                    }}
                    disabled={running}
                    className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f]"
                >
                    <option value="">Texto simple (sin diseño)</option>
                    <option value="prototipo-web">Plantilla: Revisé tu web → prototipo sin costo</option>
                </select>
                <input
                    value={subject}
                    onChange={(ev) => setSubject(ev.target.value)}
                    placeholder="Asunto"
                    disabled={running}
                    className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f]"
                />
                {template === "prototipo-web" ? (
                    <p className="text-sm text-[#1d1d1f]/60 border border-[#1d1d1f]/10 bg-white px-3 py-3">
                        Esta plantilla lleva su propio diseño y contenido, personalizado con el
                        nombre de cada contacto. Sus textos se editan en la pestaña{" "}
                        <a href="/admin/plantilla" className="underline underline-offset-2">Plantilla</a>.
                    </p>
                ) : (
                    <textarea
                        value={body}
                        onChange={(ev) => setBody(ev.target.value)}
                        placeholder="Cuerpo del correo (texto). El pie con el enlace de baja se añade solo."
                        rows={10}
                        disabled={running}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f] resize-y"
                    />
                )}

                {/* Quién lo va a recibir — abierto por defecto cuando son
                    pocos, porque revisar la lista antes de enviar es el paso
                    que evita los errores caros. */}
                {eligible.length > 0 && (
                    <details open={eligible.length <= 25} className="border border-[#1d1d1f]/10 bg-white rounded-md">
                        <summary className="cursor-pointer px-3.5 py-3 text-sm">
                            <span className="font-medium">Le va a llegar a estos {eligible.length}</span>
                            {onlyNew && alreadySent > 0 && (
                                <span className="text-[#1d1d1f]/50"> · los {alreadySent} que ya recibieron no salen aquí</span>
                            )}
                            {template === "prototipo-web" && sinNombre > 0 && (
                                <span className="text-amber-700"> · {sinNombre} saludarán «Hola,»</span>
                            )}
                        </summary>
                        <ul className="max-h-72 overflow-y-auto divide-y divide-[#1d1d1f]/5 border-t border-[#1d1d1f]/10">
                            {saludos.map((s) => (
                                <li key={s.id} className="flex items-center justify-between gap-3 px-3.5 py-2 text-sm">
                                    <a
                                        href={`/admin/lead/${s.id}`}
                                        className="min-w-0 flex-1 truncate hover:underline underline-offset-2"
                                    >
                                        <span className="font-medium">{s.name}</span>{" "}
                                        <span className="text-[#1d1d1f]/45">{s.email}</span>
                                    </a>
                                    {template === "prototipo-web" && (
                                        <span className={`shrink-0 ${s.line === "Hola," ? "text-amber-700" : "text-[#1d1d1f]/60"}`}>
                                            {s.line}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {eligible.length > saludos.length && (
                            <p className="px-3.5 py-2 text-xs text-[#1d1d1f]/50 border-t border-[#1d1d1f]/10">
                                Se listan los primeros {saludos.length}; el envío va a los {eligible.length}.
                            </p>
                        )}
                    </details>
                )}

                {eligible.length === 0 && (
                    <p className="border border-[#1d1d1f]/10 bg-white rounded-md px-3.5 py-3 text-sm text-[#1d1d1f]/60">
                        {onlyNew && alreadySent > 0
                            ? `Todos los de esta selección (${alreadySent}) ya recibieron un correo. Importa contactos nuevos, o desmarca la casilla de arriba para volver a escribirles.`
                            : "No hay destinatarios con correo en esta selección."}
                    </p>
                )}

                <div className="flex items-center gap-4">
                    <button
                        onClick={run}
                        disabled={!resendReady || running || !eligible.length || !subject.trim() || !bodyOk}
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
