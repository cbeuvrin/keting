"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
    "w-full bg-transparent border-b border-black/30 py-3 text-base md:text-lg text-black placeholder:text-black/45 focus:outline-none focus:border-black transition-colors";
const LABEL =
    "block text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-black/70 mb-2 font-sans";

// Mismos servicios que ofrece el sitio. Son opcionales a propósito: el modal de
// precios sí los exige (ahí el visitante ya venía decidido), pero en una página
// de contacto general obligar a clasificarse antes de escribir pierde leads.
const SERVICIOS = [
    "Web o landing",
    "Tienda en línea",
    "App móvil",
    "Software a medida",
    "Automatización con IA",
    "Todavía no lo sé",
];

export function ContactoForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string>("");
    const [servicios, setServicios] = useState<string[]>([]);

    function toggleServicio(s: string) {
        setServicios((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("sending");
        setError("");

        const fd = new FormData(e.currentTarget);
        const payload = {
            name: fd.get("name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            message: fd.get("message"),
            interests: servicios,
            // `source` sale en el asunto del correo: sirve para saber de qué
            // formulario vino el lead sin abrirlo.
            source: "Página de contacto",
            // Honeypot. La API descarta el envío si viene con valor (ver
            // app/api/contact/route.ts): el campo se llama `company` porque así
            // lo espera esa ruta, no porque pida la empresa del visitante.
            company: fd.get("company"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error || "No pudimos enviarlo. Inténtalo de nuevo.");
                setStatus("error");
                return;
            }
            setStatus("sent");
        } catch {
            setError("No pudimos enviarlo. Revisa tu conexión e inténtalo de nuevo.");
            setStatus("error");
        }
    }

    if (status === "sent") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="py-16 text-center"
            >
                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-8">
                    <Check className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5 text-black">
                    Mensaje recibido
                    <span className="inline-block ml-2 text-2xl md:text-3xl align-top rotate-12 text-black/30">*</span>
                </h2>
                <p className="text-black/60 font-light text-base md:text-lg max-w-md mx-auto leading-relaxed">
                    Te escribimos al correo que dejaste. Si prefieres ir más rápido, el WhatsApp
                    está aquí abajo.
                </p>
                <Link
                    href="/portafolio"
                    className="inline-flex items-center gap-3 mt-10 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors"
                >
                    <span className="block w-8 h-px bg-black/20" />
                    Ver proyectos mientras tanto
                </Link>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Honeypot: fuera de la vista y del foco, pero no con display:none —
                algunos bots lo detectan. */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="company">No rellenes este campo</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                <div>
                    <label htmlFor="name" className={LABEL}>Nombre</label>
                    <input id="name" name="name" type="text" required maxLength={200}
                        className={FIELD} placeholder="Cómo te llamas" />
                </div>
                <div>
                    <label htmlFor="email" className={LABEL}>Correo</label>
                    <input id="email" name="email" type="email" required maxLength={254}
                        className={FIELD} placeholder="tu@empresa.com" />
                </div>
            </div>

            <div>
                <label htmlFor="phone" className={LABEL}>Teléfono <span className="text-black/40 normal-case tracking-normal font-normal">(opcional)</span></label>
                <input id="phone" name="phone" type="tel" maxLength={40}
                    className={FIELD} placeholder="Por si es más cómodo llamarte" />
            </div>

            <fieldset>
                <legend className={LABEL}>Qué necesitas <span className="text-black/40 normal-case tracking-normal font-normal">(opcional, marca las que quieras)</span></legend>
                <div className="flex flex-wrap gap-3 mt-4">
                    {SERVICIOS.map((s) => {
                        const activo = servicios.includes(s);
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleServicio(s)}
                                aria-pressed={activo}
                                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                                    activo
                                        ? "bg-black text-white border-black"
                                        : "border-black/25 text-black/70 hover:border-black/60"
                                }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            <div>
                <label htmlFor="message" className={LABEL}>Cuéntanos</label>
                <textarea id="message" name="message" rows={5} required maxLength={5000}
                    className={`${FIELD} resize-none`}
                    placeholder="Qué quieres construir, para qué, y con qué tiene que conectarse. Cuanto más concreto, mejor te podemos responder." />
            </div>

            {status === "error" && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
                    {error}
                </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center px-9 py-4 bg-black text-white text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase hover:bg-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === "sending" ? "Enviando…" : "Enviar mensaje"}
                </button>
                <p className="text-sm text-black/50 font-light">
                    Te damos alcance y precio fijo, sin sorpresas.
                </p>
            </div>
        </form>
    );
}
