"use client";

import { useMemo, useState } from "react";
import type { Lead } from "@/lib/crm";
import { greetingLine } from "@/lib/email-templates/greeting";
import { LEAD_SERVICES, SERVICE_LABELS } from "@/lib/crm";
import { PERSONAL_DEFAULT_BODY, buildSaludo, fillVars, varsFor } from "@/lib/email-templates/personal";
import type { PersonalCopy } from "@/lib/crm-settings";

// Campaña a una lista: el navegador recorre los destinatarios y dispara UN
// envío por petición, con pausa entre cada uno. Así ninguna función de
// servidor corre más de un envío (sin timeouts) y el ritmo queda dentro de
// los límites de Resend. Cerrar la pestaña detiene la campaña donde va.

const PAUSE_MS = 900;
type SendState = { email: string; name: string; status: "pendiente" | "enviando" | "ok" | "error"; detail?: string };

export function Campana({ leads, emailed, resendReady, templateSubject, personales }: { leads: Lead[]; emailed: Record<string, string>; resendReady: boolean; templateSubject: string; personales: Record<string, PersonalCopy> }) {
    const lists = useMemo(() => {
        const names = new Set<string>();
        for (const l of leads) if (l.list_name) names.add(l.list_name);
        return [...names].sort();
    }, [leads]);

    // Plazas presentes, ordenadas por volumen: con un centenar de valores, la
    // que interesa es siempre una de las de arriba.
    const ciudades = useMemo(() => {
        const cuenta = new Map<string, number>();
        for (const l of leads) if (l.city) cuenta.set(l.city, (cuenta.get(l.city) ?? 0) + 1);
        return [...cuenta.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
    }, [leads]);

    const [list, setList] = useState<string>("");
    const [ciudad, setCiudad] = useState<string>("");
    const [servicio, setServicio] = useState<string>("");
    // El texto activo es el del servicio elegido; cada grupo guarda el suyo.
    const copyActual = personales[servicio] ?? personales[""];
    // Por defecto la campaña solo va a quienes NUNCA han recibido un correo:
    // así puedes importar contactos nuevos a la misma lista y reenviar sin
    // miedo a repetirle a nadie. Desmarcable para reenvíos deliberados.
    const [onlyNew, setOnlyNew] = useState(true);
    const [template, setTemplate] = useState<"" | "prototipo-web" | "personal">("personal");
    const [firma, setFirma] = useState(copyActual.firma);
    const [saludo, setSaludo] = useState(copyActual.saludo);
    const [conLogo, setConLogo] = useState(copyActual.conLogo);
    const [guardando, setGuardando] = useState("");
    const [subject, setSubject] = useState(copyActual.subject);
    const [body, setBody] = useState(copyActual.body);
    // Ids desmarcados a mano dentro de la selección. Se guarda la exclusión y
    // no la inclusión: así, al cambiar de lista o de filtro, lo nuevo entra
    // marcado por defecto en vez de aparecer apagado sin motivo.
    const [excluidos, setExcluidos] = useState<Set<string>>(new Set());
    // Tanda: cuántos salen en este envío. Un dominio recién verificado que
    // manda cientos de correos en frío de golpe acaba en spam; por tandas la
    // reputación se construye. 0 = sin límite.
    const [tanda, setTanda] = useState(25);
    const [progress, setProgress] = useState<SendState[] | null>(null);
    const [running, setRunning] = useState(false);

    const inList = useMemo(
        () =>
            leads.filter(
                (l) =>
                    (list === "" ? true : l.list_name === list) &&
                    (ciudad === "" ? true : l.city === ciudad) &&
                    (servicio === "" ? true : (l.service ?? "") === servicio)
            ),
        [leads, list, ciudad, servicio]
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

    // Quiénes podrían recibir (filtros + desmarcados), y de esos, la tanda.
    const seleccionables = useMemo(
        () => eligible.filter((l) => !excluidos.has(l.id)),
        [eligible, excluidos]
    );
    const finales = useMemo(
        () => (tanda > 0 ? seleccionables.slice(0, tanda) : seleccionables),
        [seleccionables, tanda]
    );
    const enCola = seleccionables.length - finales.length;

    async function guardarTextos() {
        setGuardando("Guardando…");
        const res = await fetch("/api/admin/crm/template", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ template: "personal", service: servicio || null, subject, saludo, body, firma, conLogo }),
        });
        const d = await res.json().catch(() => ({}));
        setGuardando(
            res.ok
                ? servicio
                    ? `Guardado ✓ — así saldrá para «${SERVICE_LABELS[servicio as keyof typeof SERVICE_LABELS]}»`
                    : "Guardado ✓ — así saldrá para los que no tengan texto propio"
                : d.error || "No se pudo guardar"
        );
    }

    function alternar(id: string) {
        setExcluidos((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const bodyOk = template === "prototipo-web" || body.trim().length > 0;
    const esPersonal = template === "personal";

    async function run() {
        if (!finales.length || !subject.trim() || !bodyOk || running) return;
        if (!confirm(`Se enviará a ${finales.length} contactos, uno por uno. ¿Continuar?`)) return;
        setRunning(true);
        const states: SendState[] = finales.map((l) => ({
            email: l.email!,
            name: l.name,
            status: "pendiente",
        }));
        setProgress([...states]);

        for (let i = 0; i < finales.length; i++) {
            states[i].status = "enviando";
            setProgress([...states]);
            try {
                const res = await fetch("/api/admin/crm/campaign-send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lead_id: finales[i].id, subject: subject.trim(), body: body.trim(), template: template || undefined, firma, saludo, conLogo }),
                });
                const data = await res.json().catch(() => ({}));
                states[i].status = res.ok ? "ok" : "error";
                if (!res.ok) states[i].detail = data.error;
            } catch {
                states[i].status = "error";
                states[i].detail = "red";
            }
            setProgress([...states]);
            if (i < finales.length - 1) await new Promise((r) => setTimeout(r, PAUSE_MS));
        }
        setRunning(false);
    }

    // Cómo va a abrir el correo de cada destinatario. Se muestra ANTES de
    // enviar porque un saludo feo ("Hola lzaragoza,") solo se ve cuando ya
    // salió: aquí se detecta a tiempo y se corrige el nombre en su ficha.
    const saludos = useMemo(
        () =>
            finales.map((l) => {
                const faltan = esPersonal
                    ? fillVars(body, varsFor({ name: l.name, company: l.company, email: l.email })).missing
                    : [];
                return {
                    id: l.id,
                    name: l.name,
                    email: l.email ?? "",
                    line: esPersonal
                        ? buildSaludo(saludo, varsFor({ name: l.name, company: l.company, email: l.email }).nombre)
                        : greetingLine(l.name),
                    faltan,
                };
            }),
        [finales, body, esPersonal, saludo]
    );
    const sinNombre = saludos.filter((s) => !varsFor({ name: s.name, company: null, email: null }).nombre).length;
    const conHuecos = saludos.filter((s) => s.faltan.length > 0).length;

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
                    {ciudades.length > 0 && (
                        <select
                            value={ciudad}
                            onChange={(ev) => setCiudad(ev.target.value)}
                            disabled={running}
                            className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm rounded-md outline-none focus:border-[#1d1d1f]"
                        >
                            <option value="">Todas las ciudades</option>
                            {ciudades.map(([c, n]) => (
                                <option key={c} value={c}>{c} ({n})</option>
                            ))}
                        </select>
                    )}
                    <select
                        value={servicio}
                        onChange={(ev) => {
                            const sv = ev.target.value;
                            setServicio(sv);
                            // Cada servicio trae su propio texto guardado.
                            const c = personales[sv] ?? personales[""];
                            setSubject(c.subject);
                            setSaludo(c.saludo);
                            setBody(c.body);
                            setFirma(c.firma);
                            setConLogo(c.conLogo);
                            setGuardando("");
                        }}
                        disabled={running}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm rounded-md outline-none focus:border-[#1d1d1f]"
                    >
                        <option value="">Todos los servicios</option>
                        {LEAD_SERVICES.map((sv) => (
                            <option key={sv} value={sv}>{SERVICE_LABELS[sv]}</option>
                        ))}
                    </select>
                    <span className="text-sm text-[#1d1d1f]/60">
                        <strong>{finales.length}</strong> en esta tanda
                        {enCola > 0 && <> de {seleccionables.length} pendientes</>}
                        {excluidos.size > 0 && <> · {excluidos.size} desmarcados</>}
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

                <label className="flex flex-wrap items-center gap-2.5 text-sm text-[#1d1d1f]/70">
                    Enviar por tandas de
                    <select
                        value={tanda}
                        onChange={(ev) => setTanda(Number(ev.target.value))}
                        disabled={running}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-1.5 text-sm rounded-md outline-none focus:border-[#1d1d1f]"
                    >
                        {[10, 25, 50, 100].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                        <option value={0}>sin límite</option>
                    </select>
                    {enCola > 0 && (
                        <span className="text-[#1d1d1f]/45">
                            quedan {enCola} para las siguientes tandas
                        </span>
                    )}
                    {tanda === 0 && seleccionables.length > 50 && (
                        <span className="text-amber-700">
                            {seleccionables.length} de golpe es mucho para correo en frío
                        </span>
                    )}
                </label>

                <select
                    value={template}
                    onChange={(ev) => {
                        const t = ev.target.value as "" | "prototipo-web" | "personal";
                        setTemplate(t);
                        if (t === "prototipo-web" && !subject) setSubject(templateSubject);
                        if (t === "personal" && !body.trim()) setBody(PERSONAL_DEFAULT_BODY);
                    }}
                    disabled={running}
                    className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f]"
                >
                    <option value="personal">Personal — texto plano, como si lo escribieras tú</option>
                    <option value="prototipo-web">Con diseño — plantilla del prototipo</option>
                    <option value="">Texto simple, sin firma</option>
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
                    <>
                        <textarea
                            value={body}
                            onChange={(ev) => setBody(ev.target.value)}
                            placeholder={esPersonal
                                ? "Escríbelo como se lo escribirías a una persona."
                                : "Cuerpo del correo (texto). El pie con el enlace de baja se añade solo."}
                            rows={esPersonal ? 12 : 10}
                            disabled={running}
                            className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm rounded-md outline-none focus:border-[#1d1d1f] resize-y leading-relaxed"
                        />
                        {esPersonal && (
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                                <span className="text-[#1d1d1f]/50">
                                    Variables:{" "}
                                    {["nombre", "empresa", "correo"].map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => setBody((b) => `${b}{{${v}}}`)}
                                            className="font-mono text-xs bg-[#1d1d1f]/[0.06] hover:bg-[#1d1d1f]/10 px-1.5 py-0.5 rounded mr-1"
                                        >
                                            {`{{${v}}}`}
                                        </button>
                                    ))}
                                </span>
                                <label className="flex items-center gap-2 text-[#1d1d1f]/70">
                                    Saludo:
                                    <input
                                        value={saludo}
                                        onChange={(ev) => setSaludo(ev.target.value)}
                                        className="border border-[#1d1d1f]/15 px-2 py-1 text-sm rounded w-56 outline-none focus:border-[#1d1d1f]"
                                    />
                                </label>
                                <label className="flex items-center gap-2 text-[#1d1d1f]/70">
                                    Firma:
                                    <input
                                        value={firma}
                                        onChange={(ev) => setFirma(ev.target.value)}
                                        className="border border-[#1d1d1f]/15 px-2 py-1 text-sm rounded w-36 outline-none focus:border-[#1d1d1f]"
                                    />
                                </label>
                                <label className="flex items-center gap-2 text-[#1d1d1f]/70 select-none">
                                    <input
                                        type="checkbox"
                                        checked={conLogo}
                                        onChange={(ev) => setConLogo(ev.target.checked)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    Logo en la firma
                                    <span className="text-[#1d1d1f]/40">
                                        {conLogo ? "(permite medir aperturas)" : "(texto puro: sin datos de apertura)"}
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={guardarTextos}
                                    className="border border-[#1d1d1f]/20 px-3 py-1.5 rounded-md hover:border-[#1d1d1f] transition-colors"
                                >
                                    {servicio ? `Guardar para ${SERVICE_LABELS[servicio as keyof typeof SERVICE_LABELS]}` : "Guardar texto general"}
                                </button>
                                {guardando && <span className="text-[#1d1d1f]/60">{guardando}</span>}
                            </div>
                        )}
                    </>
                )}

                {/* Quién lo va a recibir — abierto por defecto cuando son
                    pocos, porque revisar la lista antes de enviar es el paso
                    que evita los errores caros. */}
                {eligible.length > 0 && (
                    <details open={eligible.length <= 25} className="border border-[#1d1d1f]/10 bg-white rounded-md">
                        <summary className="cursor-pointer px-3.5 py-3 text-sm">
                            <span className="font-medium">Le va a llegar a estos {finales.length}</span>
                            {onlyNew && alreadySent > 0 && (
                                <span className="text-[#1d1d1f]/50"> · los {alreadySent} que ya recibieron no salen aquí</span>
                            )}
                            {sinNombre > 0 && (
                                <span className="text-amber-700"> · {sinNombre} sin nombre en el saludo</span>
                            )}
                            {conHuecos > 0 && (
                                <span className="text-amber-700"> · {conHuecos} con variables sin dato</span>
                            )}
                        </summary>
                        <div className="flex items-center gap-4 px-3.5 py-2 border-t border-[#1d1d1f]/10 text-xs">
                            <button
                                type="button"
                                onClick={() => setExcluidos(new Set())}
                                className="text-[#1d1d1f]/60 hover:text-[#1d1d1f] underline underline-offset-2"
                            >
                                Marcar todos
                            </button>
                            <button
                                type="button"
                                onClick={() => setExcluidos(new Set(seleccionables.map((l) => l.id)))}
                                className="text-[#1d1d1f]/60 hover:text-[#1d1d1f] underline underline-offset-2"
                            >
                                Desmarcar todos
                            </button>
                            {conHuecos > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExcluidos(
                                            new Set(saludos.filter((s) => s.faltan.length > 0).map((s) => s.id))
                                        )
                                    }
                                    className="text-amber-700 hover:text-amber-900 underline underline-offset-2"
                                >
                                    Desmarcar los {conHuecos} con huecos
                                </button>
                            )}
                            <span className="text-[#1d1d1f]/40">
                                Desmarca a quien no quieras incluir en este envío.
                            </span>
                        </div>
                        <ul className="max-h-72 overflow-y-auto divide-y divide-[#1d1d1f]/5 border-t border-[#1d1d1f]/10">
                            {saludos.map((s) => (
                                <li
                                    key={s.id}
                                    className={`flex items-center gap-3 px-3.5 py-2 text-sm ${
                                        excluidos.has(s.id) ? "opacity-40" : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={!excluidos.has(s.id)}
                                        onChange={() => alternar(s.id)}
                                        disabled={running}
                                        className="w-4 h-4 accent-black shrink-0"
                                    />
                                    <a
                                        href={`/admin/lead/${s.id}`}
                                        className="min-w-0 flex-1 truncate hover:underline underline-offset-2"
                                    >
                                        <span className="font-medium">{s.name}</span>{" "}
                                        <span className="text-[#1d1d1f]/45">{s.email}</span>
                                    </a>
                                    {s.faltan.length > 0 ? (
                                        <span className="shrink-0 text-amber-700" title="Se enviaría con un hueco en el texto">
                                            falta {s.faltan.join(", ")}
                                        </span>
                                    ) : (
                                        <span className={"shrink-0 text-[#1d1d1f]/60 max-w-[45%] truncate"}>
                                            {s.line}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
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
                        disabled={!resendReady || running || !finales.length || !subject.trim() || !bodyOk}
                        className="bg-[#111111] text-white px-6 py-3 text-xs font-medium tracking-[0.25em] uppercase disabled:opacity-40 hover:bg-black transition-colors"
                    >
                        {running ? `Enviando… ${done + failed}/${finales.length}` : `Enviar a ${finales.length}`}
                    </button>
                    {running && (
                        <span className="text-sm text-[#1d1d1f]/60">
                            No cierres esta pestaña hasta que termine.
                        </span>
                    )}
                    {progress && !running && (
                        <span className="text-sm text-[#1d1d1f]/60">
                            Terminado: {done} enviados{failed > 0 && <>, {failed} con error</>}.
                            {enCola > 0 && " Recarga la página para preparar la siguiente tanda."}
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
