"use client";

import { useState } from "react";
import { LEAD_SERVICES, SERVICE_LABELS } from "@/lib/crm";
import { buildSaludo, fillVars, varsFor } from "@/lib/email-templates/personal";
import type { PersonalCopy } from "@/lib/crm-settings";

// El recordatorio que el cron manda solo, sin que nadie lo dispare a mano:
// a quien abrió el correo inicial hace unos días y no ha recibido ya uno.
// Aquí solo se edita el texto — el envío lo hace la segunda pasada del cron
// (app/api/cron/campana/route.ts). Un lead recibe como máximo uno.

export function SeguimientoEditor({
    seguimientos,
    elegiblesHoy,
}: {
    seguimientos: Record<string, PersonalCopy>;
    elegiblesHoy: number;
}) {
    const [servicio, setServicio] = useState("");
    const copyActual = seguimientos[servicio] ?? seguimientos[""];
    const [subject, setSubject] = useState(copyActual.subject);
    const [saludo, setSaludo] = useState(copyActual.saludo);
    const [body, setBody] = useState(copyActual.body);
    const [firma, setFirma] = useState(copyActual.firma);
    const [conLogo, setConLogo] = useState(copyActual.conLogo);
    const [guardando, setGuardando] = useState("");

    function cambiarServicio(sv: string) {
        setServicio(sv);
        const c = seguimientos[sv] ?? seguimientos[""];
        setSubject(c.subject);
        setSaludo(c.saludo);
        setBody(c.body);
        setFirma(c.firma);
        setConLogo(c.conLogo);
        setGuardando("");
    }

    async function guardar() {
        setGuardando("Guardando…");
        const res = await fetch("/api/admin/crm/template", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ template: "seguimiento", service: servicio || null, subject, saludo, body, firma, conLogo }),
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

    const vistaEjemplo = buildSaludo(saludo, "Alejandra");
    const huecos = fillVars(body, varsFor({ name: "Alejandra", company: "Su empresa", email: null })).missing;

    return (
        <main className="max-w-3xl mx-auto px-6 pb-10">
            <div className="border-t border-[#1d1d1f]/10 pt-8">
                <h2 className="text-xl font-bold tracking-tight mb-1">
                    Seguimiento{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                        a quien abrió y no respondió
                    </span>
                </h2>
                <p className="text-sm text-[#1d1d1f]/60 mb-6 max-w-2xl">
                    Cada mañana, después de los correos nuevos, el cron manda este recordatorio a quien
                    abrió su correo inicial hace 4 días o más y todavía no recibió uno — como máximo
                    diez al día, uno por contacto para siempre. Esto solo edita el texto; no envía nada.
                    {elegiblesHoy > 0 ? (
                        <> Ahora mismo hay <strong>{elegiblesHoy}</strong> que calificarían.</>
                    ) : (
                        <> Ahora mismo no hay ninguno que califique.</>
                    )}
                </p>

                <div className="grid gap-4">
                    <select
                        value={servicio}
                        onChange={(ev) => cambiarServicio(ev.target.value)}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm rounded-md outline-none focus:border-[#1d1d1f] w-fit"
                    >
                        <option value="">Texto general</option>
                        {LEAD_SERVICES.map((sv) => (
                            <option key={sv} value={sv}>{SERVICE_LABELS[sv]}</option>
                        ))}
                    </select>

                    <input
                        value={subject}
                        onChange={(ev) => setSubject(ev.target.value)}
                        placeholder="Asunto"
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1d1d1f]"
                    />
                    <textarea
                        value={body}
                        onChange={(ev) => setBody(ev.target.value)}
                        placeholder="Escríbelo como se lo escribirías a una persona."
                        rows={6}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2.5 text-sm rounded-md outline-none focus:border-[#1d1d1f] resize-y leading-relaxed"
                    />
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
                        </label>
                        <button
                            type="button"
                            onClick={guardar}
                            className="border border-[#1d1d1f]/20 px-3 py-1.5 rounded-md hover:border-[#1d1d1f] transition-colors"
                        >
                            {servicio ? `Guardar para ${SERVICE_LABELS[servicio as keyof typeof SERVICE_LABELS]}` : "Guardar texto general"}
                        </button>
                        {guardando && <span className="text-[#1d1d1f]/60">{guardando}</span>}
                    </div>
                    <p className="text-xs text-[#1d1d1f]/40">
                        Ejemplo de saludo: «{vistaEjemplo}»{huecos.length > 0 && <> · falta {huecos.join(", ")} en el cuerpo</>}
                    </p>
                </div>
            </div>
        </main>
    );
}
