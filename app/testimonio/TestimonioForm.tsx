"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Plus } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
    "w-full bg-transparent border-b border-black/30 py-3 text-base md:text-lg text-black placeholder:text-black/45 focus:outline-none focus:border-black transition-colors";
const LABEL =
    "block text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-black/70 mb-2 font-sans";

export function TestimonioForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string>("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("sending");
        setError("");

        const fd = new FormData(e.currentTarget);
        const payload = {
            name: fd.get("name"),
            role: fd.get("role"),
            company: fd.get("company"),
            project: fd.get("project"),
            testimonial: fd.get("testimonial"),
            email: fd.get("email"),
            consent: fd.get("consent") === "on",
            website: fd.get("website"), // honeypot
        };

        try {
            const res = await fetch("/api/testimonio", {
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
                    Gracias, de verdad
                    <span className="inline-block ml-2 text-2xl md:text-3xl align-top rotate-12 text-black/30">*</span>
                </h2>
                <p className="text-black/60 font-light text-base md:text-lg max-w-md mx-auto leading-relaxed">
                    Lo hemos recibido. Le echamos un ojo y aparecerá en la página del proyecto — si
                    hay que ajustar algo, te escribimos antes de publicarlo.
                </p>
                <Link
                    href="/casos"
                    className="inline-flex items-center gap-3 mt-10 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors"
                >
                    <span className="block w-8 h-px bg-black/20" />
                    Ver los casos
                </Link>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Honeypot: invisible para personas, tentador para bots. */}
            <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute w-px h-px -left-[9999px] opacity-0"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div>
                    <label className={LABEL} htmlFor="name">Tu nombre</label>
                    <input id="name" name="name" required className={FIELD} placeholder="Ana García" />
                </div>
                <div>
                    <label className={LABEL} htmlFor="role">Tu cargo</label>
                    <input id="role" name="role" required className={FIELD} placeholder="Directora de Operaciones" />
                </div>
                <div>
                    <label className={LABEL} htmlFor="company">Empresa</label>
                    <input id="company" name="company" required className={FIELD} placeholder="Nombre de tu empresa" />
                </div>
                <div>
                    {/* Campo libre, no un desplegable con los casos publicados: el
                        cliente puede venir de un proyecto que todavía no está en la
                        web. Ya lo asignamos nosotros al recibirlo. */}
                    <label className={LABEL} htmlFor="project">Proyecto</label>
                    <input
                        id="project"
                        name="project"
                        required
                        className={FIELD}
                        placeholder="¿Qué te construimos?"
                    />
                </div>
            </div>

            <div>
                <label className={LABEL} htmlFor="testimonial">Tu testimonio</label>
                <textarea
                    id="testimonial"
                    name="testimonial"
                    required
                    rows={6}
                    className={`${FIELD} resize-none leading-relaxed`}
                    placeholder="¿Qué problema tenías antes? ¿Qué cambió después? Si puedes dar un dato concreto —tiempo ahorrado, ventas, lo que sea— mucho mejor."
                />
                <p className="text-sm text-black/55 mt-3 font-light">
                    Escríbelo como hablas. No hace falta que suene a nota de prensa.
                </p>
            </div>

            <div>
                <label className={LABEL} htmlFor="email">Tu correo</label>
                <input id="email" name="email" type="email" required className={FIELD} placeholder="por si necesitamos confirmarte algo" />
            </div>

            <label className="flex items-start gap-4 cursor-pointer group pt-2">
                <input type="checkbox" name="consent" required className="mt-1 w-4 h-4 accent-black flex-shrink-0" />
                <span className="text-sm text-black/75 font-light leading-relaxed">
                    Autorizo a Keting Media a publicar este testimonio junto a mi nombre, cargo y
                    empresa en <strong className="text-black font-medium">ketingmedia.com</strong>.
                    Puedo pedir que se retire cuando quiera.
                </span>
            </label>

            {status === "error" && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-base font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === "sending" ? "Enviando…" : "Enviar testimonio"}
                {status !== "sending" && (
                    <Plus className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
                )}
            </button>
        </form>
    );
}
