"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LEAD_STAGES, STAGE_LABELS, LEAD_SERVICES, SERVICE_LABELS } from "@/lib/crm";
import type { LeadRow } from "@/lib/crm-rows";

// Dashboard del CRM. Los gráficos van en HTML/CSS y no en SVG: el texto queda
// nítido a cualquier tamaño, el hover es un evento normal y no hay que pelear
// con viewBox. Paleta monocroma de la casa — cada barra lleva su etiqueta
// directa, así que el color nunca es el único portador del dato.

const DAYS = 14;

function fmtDay(iso: string): string {
    const [, m, d] = iso.split("-");
    return `${d}/${m}`;
}

function StatTile({
    label,
    value,
    hint,
    href,
}: {
    label: string;
    value: string;
    hint?: string;
    href?: string;
}) {
    const inner = (
        <>
            <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#1d1d1f]/45">
                {label}
            </div>
            <div className="mt-2.5 text-4xl font-bold tracking-tight tabular-nums">{value}</div>
            {hint && <div className="mt-1.5 text-xs text-[#1d1d1f]/50">{hint}</div>}
        </>
    );
    const cls =
        "block bg-white border border-[#1d1d1f]/10 p-5 rounded-lg" +
        (href ? " hover:border-[#1d1d1f]/30 transition-colors" : "");
    return href ? (
        <Link href={href} className={cls}>
            {inner}
        </Link>
    ) : (
        <div className={cls}>{inner}</div>
    );
}

export function Dashboard({
    rows,
    sentByDay,
}: {
    rows: LeadRow[];
    sentByDay: Record<string, number>;
}) {
    const [hover, setHover] = useState<string | null>(null);

    const stats = useMemo(() => {
        const conCorreo = rows.filter((r) => r.sentAt).length;
        const abiertos = rows.filter((r) => r.openedAt).length;
        const bajas = rows.filter((r) => r.unsubscribed).length;
        const sinCorreo = rows.filter((r) => r.email && !r.sentAt && !r.unsubscribed).length;
        return { total: rows.length, conCorreo, abiertos, bajas, sinCorreo };
    }, [rows]);

    // Últimos 14 días, incluidos los vacíos: un hueco también es información.
    const serie = useMemo(() => {
        const abiertosPorDia: Record<string, number> = {};
        for (const r of rows) {
            if (r.sentAt && r.openedAt) {
                const d = r.sentAt.slice(0, 10);
                abiertosPorDia[d] = (abiertosPorDia[d] ?? 0) + 1;
            }
        }
        const out: { day: string; total: number; abiertos: number }[] = [];
        const today = new Date();
        for (let i = DAYS - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            out.push({ day: key, total: sentByDay[key] ?? 0, abiertos: abiertosPorDia[key] ?? 0 });
        }
        return out;
    }, [rows, sentByDay]);

    const maxDia = Math.max(1, ...serie.map((s) => s.total));

    const pipeline = useMemo(
        () =>
            LEAD_STAGES.map((stage) => ({
                stage,
                label: STAGE_LABELS[stage],
                count: rows.filter((r) => r.stage === stage).length,
            })),
        [rows]
    );
    const maxEtapa = Math.max(1, ...pipeline.map((p) => p.count));

    // Cada grupo, con cuántos ya recibieron correo y cuántos siguen pendientes.
    const porServicio = useMemo(() => {
        const grupos = LEAD_SERVICES.map((sv) => {
            const del = rows.filter((r) => r.service === sv);
            return {
                key: sv as string,
                label: SERVICE_LABELS[sv],
                total: del.length,
                enviados: del.filter((r) => r.sentAt).length,
            };
        });
        const sinAsignar = rows.filter((r) => !r.service);
        if (sinAsignar.length > 0) {
            grupos.push({
                key: "",
                label: "Sin servicio asignado",
                total: sinAsignar.length,
                enviados: sinAsignar.filter((r) => r.sentAt).length,
            });
        }
        return grupos.filter((g) => g.total > 0);
    }, [rows]);

    const pctAperturas = stats.conCorreo > 0 ? Math.round((stats.abiertos / stats.conCorreo) * 100) : 0;

    return (
        <main className="px-6 md:px-8 py-8 max-w-[1400px]">
            <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Hola, Carlos.{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-[#1d1d1f]/50">
                        esto es lo que hay
                    </span>
                </h1>
            </header>

            {/* Cifras */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatTile label="Contactos" value={String(stats.total)} href="/admin/contactos" />
                <StatTile
                    label="Con correo enviado"
                    value={String(stats.conCorreo)}
                    hint={`${stats.sinCorreo} aún sin escribir`}
                    href="/admin/contactos?correo=con"
                />
                <StatTile
                    label="Abrieron"
                    value={`${pctAperturas}%`}
                    hint={`${stats.abiertos} de ${stats.conCorreo} · dato aproximado`}
                    href="/admin/contactos?correo=abierto"
                />
                <StatTile
                    label="Bajas"
                    value={String(stats.bajas)}
                    hint="no reciben más correos"
                    href="/admin/contactos?correo=baja"
                />
            </div>

            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
                {/* Envíos por día */}
                <section className="bg-white border border-[#1d1d1f]/10 rounded-lg p-5">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h2 className="font-bold tracking-tight">Correos enviados</h2>
                        <span className="text-xs text-[#1d1d1f]/45">últimos {DAYS} días</span>
                    </div>
                    {/* Leyenda: dos series ⇒ siempre presente */}
                    <div className="flex items-center gap-4 mb-5 text-xs text-[#1d1d1f]/60">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#1d1d1f]" /> abiertos
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#1d1d1f]/20" /> sin abrir
                        </span>
                    </div>

                    <div className="relative flex items-end gap-1.5 h-52">
                        {serie.map((s) => {
                            const h = (s.total / maxDia) * 100;
                            const hAbiertos = s.total > 0 ? (s.abiertos / s.total) * 100 : 0;
                            const activo = hover === s.day;
                            return (
                                <div
                                    key={s.day}
                                    className="flex-1 h-full flex flex-col justify-end items-center group"
                                    onMouseEnter={() => setHover(s.day)}
                                    onMouseLeave={() => setHover(null)}
                                >
                                    {activo && s.total > 0 && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-2.5 py-1.5 rounded whitespace-nowrap z-10">
                                            {fmtDay(s.day)} · {s.total} enviados · {s.abiertos} abiertos
                                        </div>
                                    )}
                                    {/* La barra: parte inferior = abiertos (tinta),
                                        superior = sin abrir (gris). 2px de aire entre
                                        segmentos, como manda el spec. */}
                                    <div
                                        className="w-full flex flex-col justify-end rounded-t transition-opacity"
                                        style={{ height: `${Math.max(h, s.total > 0 ? 3 : 0)}%` }}
                                    >
                                        {s.abiertos < s.total && (
                                            <div
                                                className={`w-full rounded-t bg-[#1d1d1f]/20 ${activo ? "opacity-100" : "opacity-90"}`}
                                                style={{ height: `${100 - hAbiertos}%`, marginBottom: s.abiertos > 0 ? 2 : 0 }}
                                            />
                                        )}
                                        {s.abiertos > 0 && (
                                            <div
                                                className={`w-full bg-[#1d1d1f] ${s.abiertos === s.total ? "rounded-t" : ""}`}
                                                style={{ height: `${hAbiertos}%` }}
                                            />
                                        )}
                                    </div>
                                    <span className="mt-2 text-[10px] text-[#1d1d1f]/35 tabular-nums">
                                        {fmtDay(s.day).slice(0, 2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {stats.conCorreo === 0 && (
                        <p className="mt-4 text-sm text-[#1d1d1f]/45">
                            Todavía no has enviado ningún correo desde el CRM.
                        </p>
                    )}
                </section>

                {/* Pipeline */}
                <section className="bg-white border border-[#1d1d1f]/10 rounded-lg p-5">
                    <h2 className="font-bold tracking-tight mb-5">Por etapa</h2>
                    <div className="grid gap-3.5">
                        {pipeline.map((p) => (
                            <Link
                                key={p.stage}
                                href={`/admin/contactos?etapa=${p.stage}`}
                                className="group block"
                            >
                                <div className="flex items-baseline justify-between mb-1.5">
                                    <span className="text-sm text-[#1d1d1f]/70 group-hover:text-[#1d1d1f]">
                                        {p.label}
                                    </span>
                                    <span className="text-sm font-medium tabular-nums">{p.count}</span>
                                </div>
                                <div className="h-2 bg-[#1d1d1f]/[0.06] rounded-sm overflow-hidden">
                                    <div
                                        className={`h-full rounded-sm ${
                                            p.stage === "perdido" ? "bg-[#b4472f]" : "bg-[#1d1d1f]"
                                        }`}
                                        style={{ width: `${(p.count / maxEtapa) * 100}%` }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Grupos por servicio: cuántos han recibido correo y cuántos no */}
            {porServicio.length > 0 && (
                <section className="bg-white border border-[#1d1d1f]/10 rounded-lg p-5 mt-6">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h2 className="font-bold tracking-tight">Por servicio</h2>
                        <span className="text-xs text-[#1d1d1f]/45">quién ya recibió correo y quién no</span>
                    </div>
                    <div className="flex items-center gap-4 mb-5 text-xs text-[#1d1d1f]/60">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#1d1d1f]" /> ya recibieron
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-[#1d1d1f]/15" /> pendientes
                        </span>
                    </div>

                    <div className="grid gap-4">
                        {porServicio.map((g) => {
                            const pendientes = g.total - g.enviados;
                            return (
                                <div key={g.key || "sin"}>
                                    <div className="flex items-baseline justify-between mb-1.5 gap-3">
                                        <span className="text-sm font-medium">{g.label}</span>
                                        <span className="text-sm text-[#1d1d1f]/60 tabular-nums">
                                            {g.enviados} de {g.total}
                                            {pendientes > 0 && (
                                                <Link
                                                    href={`/admin/contactos?correo=sin${g.key ? `&servicio=${g.key}` : ""}`}
                                                    className="ml-2 text-[#1d1d1f] underline underline-offset-2 hover:no-underline"
                                                >
                                                    {pendientes} sin escribir
                                                </Link>
                                            )}
                                        </span>
                                    </div>
                                    {/* Una sola barra partida: lo enviado y lo que falta,
                                        con 2px de aire entre los dos tramos. */}
                                    <div className="flex h-2.5 gap-0.5">
                                        <div
                                            className="bg-[#1d1d1f] rounded-sm"
                                            style={{ width: `${(g.enviados / g.total) * 100}%` }}
                                        />
                                        <div
                                            className="bg-[#1d1d1f]/15 rounded-sm"
                                            style={{ width: `${(pendientes / g.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}
