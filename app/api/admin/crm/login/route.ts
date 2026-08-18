import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Rate limit sencillo en memoria: 10 intentos / 10 min por IP. Igual que en
// /api/contact, es por instancia — suficiente para frenar fuerza bruta casual.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_TRIES = 10;
const tries = new Map<string, number[]>();

export async function POST(request: Request) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const now = Date.now();
    const recent = (tries.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    recent.push(now);
    tries.set(ip, recent);
    if (recent.length > MAX_TRIES) {
        return NextResponse.json({ ok: false }, { status: 429 });
    }

    const { password } = await request.json().catch(() => ({}));
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || typeof password !== "string") {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, adminToken(), {
        httpOnly: true,
        sameSite: "lax",
        // Secure solo en Vercel: el build local también corre como "production"
        // pero sirve por HTTP, y una cookie Secure ahí se pierde en Safari.
        secure: process.env.VERCEL === "1",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 días
    });
    return res;
}
