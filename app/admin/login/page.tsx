"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function submit(ev: React.FormEvent) {
        ev.preventDefault();
        setBusy(true);
        setError("");
        const res = await fetch("/api/admin/crm/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            router.push("/admin");
            router.refresh();
        } else {
            setError("Contraseña incorrecta");
            setBusy(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <form onSubmit={submit} className="w-full max-w-sm">
                <div className="flex items-center gap-3 mb-8">
                    <span className="block w-12 h-px bg-[#1d1d1f]/40" />
                    <span className="text-xs uppercase tracking-[0.3em] text-[#1d1d1f]/50">CRM · Keting</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-8">
                    Panel <span className="font-[family-name:var(--font-playfair)] italic font-normal">interno</span>
                </h1>
                <input
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Contraseña"
                    autoFocus
                    className="w-full border border-[#1d1d1f]/20 bg-white px-4 py-3 text-base outline-none focus:border-[#1d1d1f] transition-colors"
                />
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={busy || !password}
                    className="mt-4 w-full bg-[#111111] text-white py-3 text-xs font-medium tracking-[0.3em] uppercase disabled:opacity-40 hover:bg-black transition-colors"
                >
                    {busy ? "Entrando…" : "Entrar"}
                </button>
            </form>
        </main>
    );
}
