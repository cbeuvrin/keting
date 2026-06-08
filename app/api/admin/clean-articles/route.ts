import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sanitizeText } from "@/lib/sanitize-text";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;

interface ArticleRow {
    id?: string | number;
    slug: string;
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    author?: string;
}

export async function GET(req: NextRequest) {
    // Auth: header Authorization: Bearer <CRON_SECRET>  o  ?secret=<CRON_SECRET>
    const auth = req.headers.get("authorization");
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const dryRun = url.searchParams.get("dryRun") === "true";

    const ok = auth === `Bearer ${CRON_SECRET}` || secret === CRON_SECRET;
    if (!ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        return NextResponse.json({ error: "Supabase env missing" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: rows, error } = await supabase
        .from("articles")
        .select("slug, title, excerpt, content, category, author");

    if (error || !rows) {
        return NextResponse.json({ error: "Read failed", detail: error?.message }, { status: 500 });
    }

    const fields = ["title", "excerpt", "content", "category", "author"] as const;
    const updates: Array<{ slug: string; before: Partial<ArticleRow>; after: Partial<ArticleRow> }> = [];

    for (const row of rows as ArticleRow[]) {
        const before: Partial<ArticleRow> = {};
        const after: Partial<ArticleRow> = {};
        let changed = false;

        for (const f of fields) {
            const original = (row[f] ?? "") as string;
            const cleaned = sanitizeText(original);
            if (original !== cleaned) {
                changed = true;
                before[f] = original;
                after[f] = cleaned;
            }
        }

        if (changed) {
            updates.push({ slug: row.slug, before, after });
        }
    }

    if (dryRun) {
        return NextResponse.json({
            mode: "dryRun",
            total: rows.length,
            wouldUpdate: updates.length,
            samples: updates.slice(0, 5).map(u => ({
                slug: u.slug,
                changedFields: Object.keys(u.after),
                previewBefore: Object.fromEntries(
                    Object.entries(u.before).map(([k, v]) => [k, (v as string).slice(0, 120)]),
                ),
                previewAfter: Object.fromEntries(
                    Object.entries(u.after).map(([k, v]) => [k, (v as string).slice(0, 120)]),
                ),
            })),
        });
    }

    // Aplicar updates uno por uno (Supabase no soporta bulk update con set por fila)
    const results = { ok: 0, failed: 0, errors: [] as Array<{ slug: string; error: string }> };
    for (const u of updates) {
        const { error: upErr } = await supabase
            .from("articles")
            .update(u.after)
            .eq("slug", u.slug);
        if (upErr) {
            results.failed += 1;
            results.errors.push({ slug: u.slug, error: upErr.message });
        } else {
            results.ok += 1;
        }
    }

    return NextResponse.json({
        mode: "executed",
        total: rows.length,
        scanned: rows.length,
        attempted: updates.length,
        ...results,
    });
}
