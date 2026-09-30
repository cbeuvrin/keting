import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { crmAdmin } from "@/lib/crm";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/clientes";

// Piezas comunes de las rutas /api/admin/clientes/*: el guard del panel y la
// validación de lo que llega del navegador. Convención de los lectores:
// `undefined` = el campo no vino (no se toca), `null` = se vació a propósito,
// `INVALID` = vino pero no sirve (la ruta responde 400).

export const INVALID = Symbol("invalid");

export async function guard(): Promise<NextResponse | null> {
    return (await isAdminRequest()) ? null : NextResponse.json({ error: "no" }, { status: 401 });
}

export const db = () => crmAdmin();
export const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
export const conflict = (error: string) => NextResponse.json({ error }, { status: 409 });
export const fail = (error: { message: string }) => NextResponse.json({ error: error.message }, { status: 500 });
export const ok = (extra: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...extra });

export async function readBody(request: Request): Promise<Record<string, unknown>> {
    const body = await request.json().catch(() => ({}));
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
}

export function text(v: unknown): string | null | undefined {
    if (v === undefined) return undefined;
    if (v === null) return null;
    return typeof v === "string" ? v.trim() || null : undefined;
}

/** Montos en pesos: acepta "40,000", "$1,500.50" o números. Nunca negativos. */
export function money(v: unknown): number | undefined | typeof INVALID {
    if (v === undefined) return undefined;
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/[$,\s]/g, "")) : NaN;
    if (!Number.isFinite(n) || n < 0) return INVALID;
    return Math.round(n * 100) / 100;
}

/** "YYYY-MM-DD" válido, o null si llega vacío. */
export function date(v: unknown): string | null | undefined | typeof INVALID {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return INVALID;
    const d = new Date(`${v}T12:00:00Z`);
    return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v ? INVALID : v;
}

/** "YYYY-MM" o "YYYY-MM-DD" → "YYYY-MM-01"; null si llega vacío. */
export function month(v: unknown): string | null | undefined | typeof INVALID {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    if (typeof v !== "string" || !/^\d{4}-\d{2}(-\d{2})?$/.test(v)) return INVALID;
    const m = Number(v.slice(5, 7));
    return m >= 1 && m <= 12 ? `${v.slice(0, 7)}-01` : INVALID;
}

export function status(v: unknown): ProjectStatus | undefined | typeof INVALID {
    if (v === undefined) return undefined;
    return PROJECT_STATUSES.includes(v as ProjectStatus) ? (v as ProjectStatus) : INVALID;
}
