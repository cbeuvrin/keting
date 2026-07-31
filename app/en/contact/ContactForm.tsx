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

// Gemelo inglés de app/contacto/ContactoForm.tsx. Se mantiene como fichero
// aparte, y no como un componente con prop de idioma, por el mismo motivo que
// el resto del sitio EN: pasar objetos bilingües a un componente de cliente hace
// que Next serialice AMBOS idiomas en el payload RSC, y acaba habiendo español
// dentro del HTML inglés (ver la nota de splitCaseStudy en lib/case-studies.ts).
const SERVICES = [
    "Website or landing page",
    "Online store",
    "Mobile app",
    "Custom software",
    "AI automation",
    "Not sure yet",
];

export function ContactForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string>("");
    const [services, setServices] = useState<string[]>([]);

    function toggleService(s: string) {
        setServices((prev) =>
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
            interests: services,
            // Va en el asunto del correo: distingue los leads en inglés de los
            // que llegan por la página española.
            source: "Contact page (EN)",
            // Honeypot. La API lo espera con el nombre `company`.
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
                setError(data.error || "We couldn't send it. Please try again.");
                setStatus("error");
                return;
            }
            setStatus("sent");
        } catch {
            setError("We couldn't send it. Check your connection and try again.");
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
                    Message received
                    <span className="inline-block ml-2 text-2xl md:text-3xl align-top rotate-12 text-black/30">*</span>
                </h2>
                <p className="text-black/60 font-light text-base md:text-lg max-w-md mx-auto leading-relaxed">
                    We&rsquo;ll write back to the address you left. If you&rsquo;d rather move faster,
                    WhatsApp is right below.
                </p>
                <Link
                    href="/en/portafolio"
                    className="inline-flex items-center gap-3 mt-10 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors"
                >
                    <span className="block w-8 h-px bg-black/20" />
                    See our work meanwhile
                </Link>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="company">Leave this field empty</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                <div>
                    <label htmlFor="name" className={LABEL}>Name</label>
                    <input id="name" name="name" type="text" required maxLength={200}
                        className={FIELD} placeholder="What should we call you" />
                </div>
                <div>
                    <label htmlFor="email" className={LABEL}>Email</label>
                    <input id="email" name="email" type="email" required maxLength={254}
                        className={FIELD} placeholder="you@company.com" />
                </div>
            </div>

            <div>
                <label htmlFor="phone" className={LABEL}>Phone <span className="text-black/40 normal-case tracking-normal font-normal">(optional)</span></label>
                <input id="phone" name="phone" type="tel" maxLength={40}
                    className={FIELD} placeholder="In case a call is easier" />
            </div>

            <fieldset>
                <legend className={LABEL}>What you need <span className="text-black/40 normal-case tracking-normal font-normal">(optional, pick any)</span></legend>
                <div className="flex flex-wrap gap-3 mt-4">
                    {SERVICES.map((s) => {
                        const active = services.includes(s);
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleService(s)}
                                aria-pressed={active}
                                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                                    active
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
                <label htmlFor="message" className={LABEL}>Tell us</label>
                <textarea id="message" name="message" rows={5} required maxLength={5000}
                    className={`${FIELD} resize-none`}
                    placeholder="What you want to build, what it's for, and what it needs to connect to. The more specific, the better we can answer." />
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
                    {status === "sending" ? "Sending…" : "Send message"}
                </button>
                <p className="text-sm text-black/50 font-light">
                    You get a fixed scope and a fixed price. No surprises.
                </p>
            </div>
        </form>
    );
}
