"use client";

import { useMemo, useState } from "react";
import {
    PROTOTIPO_DEFAULT_COPY,
    prototipoWebEmail,
    type PrototipoCopy,
} from "@/lib/email-templates/prototipo-web";

// Editor de los textos de la plantilla de campaña, con vista previa en vivo:
// la plantilla es una función pura, así que el navegador puede renderizarla
// aquí mismo con cada tecla. El diseño (barra, colores, imágenes, firma de
// contacto) es fijo; lo editable son los textos. Vaciar un campo y guardar lo
// devuelve al texto de fábrica.

const FIELDS: { key: keyof PrototipoCopy; label: string; rows?: number; hint?: string }[] = [
    { key: "subject", label: "Asunto" },
    { key: "preheader", label: "Previo (la línea gris junto al asunto en la bandeja)", rows: 2 },
    { key: "intro1", label: "Primer párrafo", rows: 4, hint: "**palabra** la pone en negritas" },
    { key: "intro2", label: "Segundo párrafo", rows: 2 },
    { key: "ofertaTitulo", label: "Título de la oferta" },
    { key: "ofertaSub", label: "Subtítulo de la oferta (va en cursiva)" },
    { key: "bullets", label: "Viñetas (una por línea)", rows: 4 },
    { key: "ctaLabel", label: "Texto del botón" },
    { key: "ctaNota", label: "Nota bajo el botón" },
    { key: "firmaNombre", label: "Firma — nombre" },
    { key: "firmaCargo", label: "Firma — cargo" },
];

export function PlantillaEditor({ initial }: { initial: PrototipoCopy }) {
    const [copy, setCopy] = useState<PrototipoCopy>(initial);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState("");

    const previewHtml = useMemo(
        () =>
            prototipoWebEmail({
                name: "Alejandra Ruiz",
                emailId: "00000000-0000-0000-0000-000000000000",
                leadId: "00000000-0000-0000-0000-000000000000",
                copy,
            }),
        [copy]
    );

    function setField(key: keyof PrototipoCopy, raw: string) {
        setStatus("");
        setCopy((c) => ({
            ...c,
            [key]: key === "bullets" ? raw.split("\n") : raw,
        }));
    }

    async function save() {
        setBusy(true);
        setStatus("");
        // Los vacíos no se mandan: el guardado solo lleva lo que tenga texto,
        // y lo que falte cae al default en el envío.
        const payload: Record<string, unknown> = { ...copy };
        payload.bullets = copy.bullets.map((b) => b.trim()).filter(Boolean);
        const res = await fetch("/api/admin/crm/template", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        setStatus(res.ok ? "Guardado ✓ — las próximas campañas saldrán así" : data.error || "Error al guardar");
        setBusy(false);
    }

    function reset() {
        setCopy(PROTOTIPO_DEFAULT_COPY);
        setStatus("Textos de fábrica restaurados (guarda para aplicarlos)");
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Plantilla{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                        revisé tu web → prototipo
                    </span>
                </h1>
            </div>
            <p className="text-sm text-[#1d1d1f]/60 mb-8 max-w-2xl">
                Edita los textos y mira el resultado al lado. El saludo se personaliza solo con el
                nombre de cada contacto (en la vista previa: «Alejandra»). Guardar aplica a todas
                las campañas siguientes.
            </p>

            <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">
                {/* Formulario */}
                <div className="grid gap-4">
                    {FIELDS.map((f) => {
                        const value =
                            f.key === "bullets" ? copy.bullets.join("\n") : (copy[f.key] as string);
                        return (
                            <label key={f.key} className="grid gap-1.5">
                                <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#1d1d1f]/60">
                                    {f.label}
                                </span>
                                {f.rows ? (
                                    <textarea
                                        value={value}
                                        onChange={(ev) => setField(f.key, ev.target.value)}
                                        rows={f.rows}
                                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#1d1d1f] resize-y"
                                    />
                                ) : (
                                    <input
                                        value={value}
                                        onChange={(ev) => setField(f.key, ev.target.value)}
                                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#1d1d1f]"
                                    />
                                )}
                                {f.hint && <span className="text-xs text-[#1d1d1f]/40">{f.hint}</span>}
                            </label>
                        );
                    })}

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={save}
                            disabled={busy}
                            className="bg-[#111111] text-white px-6 py-3 text-xs font-medium tracking-[0.25em] uppercase disabled:opacity-40 hover:bg-black transition-colors"
                        >
                            {busy ? "Guardando…" : "Guardar"}
                        </button>
                        <button
                            onClick={reset}
                            disabled={busy}
                            className="border border-[#1d1d1f]/20 px-4 py-3 text-xs font-medium tracking-[0.2em] uppercase hover:border-[#1d1d1f] transition-colors"
                        >
                            Restaurar
                        </button>
                    </div>
                    {status && <p className="text-sm text-[#1d1d1f]/70">{status}</p>}
                </div>

                {/* Vista previa en vivo */}
                <div className="lg:sticky lg:top-6">
                    <div className="text-xs font-medium tracking-[0.25em] uppercase text-[#1d1d1f]/50 mb-3">
                        Vista previa
                    </div>
                    <iframe
                        title="Vista previa del correo"
                        srcDoc={previewHtml}
                        sandbox=""
                        className="w-full h-[75vh] border border-[#1d1d1f]/15 bg-white"
                    />
                </div>
            </div>
        </main>
    );
}
