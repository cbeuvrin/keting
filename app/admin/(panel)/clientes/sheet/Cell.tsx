"use client";

import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent } from "react";
import styles from "./sheet.module.css";

export function Cell({ value, label, type = "text", onSave, onPaste, row, column, options }: {
    value: string | number | null; label: string; type?: "text" | "date" | "month" | "money";
    onSave: (value: string) => Promise<boolean>; onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
    row?: number; column?: string; options?: { value: string; label: string }[];
}) {
    const external = String(value ?? "");
    const [last, setLast] = useState(external);
    const [draft, setDraft] = useState(external);
    const [invalid, setInvalid] = useState(false);
    const [saving, setSaving] = useState(false);
    const submitted = useRef<string | null>(null);
    const cancelled = useRef(false);
    const accepted = useRef(external);
    if (last !== external) { setLast(external); setDraft(external); }

    useEffect(() => { accepted.current = external; }, [external]);

    const commit = async (raw = draft) => {
        if (cancelled.current) { cancelled.current = false; return true; }
        if (raw === external || raw === accepted.current || submitted.current === raw) return true;
        submitted.current = raw;
        setSaving(true);
        const ok = await onSave(raw);
        if (ok) accepted.current = raw;
        setInvalid(!ok);
        setSaving(false);
        submitted.current = null;
        return ok;
    };
    const shared = {
        "aria-label": label, "aria-invalid": invalid || undefined, "data-row": row, "data-col": column,
        title: invalid ? "No se guardó. Corrige el valor o pulsa Escape para restaurarlo." : label,
        className: `${styles.cell} ${invalid ? styles.invalid : ""} ${saving ? styles.saving : ""}`,
    };
    if (options) return <select {...shared} value={draft} onChange={(ev) => { setDraft(ev.target.value); void commit(ev.target.value); }} onKeyDown={(ev) => { if (ev.key === "Escape") { setDraft(external); setInvalid(false); } }}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
    return <input {...shared} type={type === "money" ? "text" : type} inputMode={type === "money" ? "decimal" : undefined} value={draft} onChange={(ev) => { setDraft(ev.target.value); setInvalid(false); }} onFocus={(ev) => { if (type === "money") ev.target.select(); }} onBlur={() => void commit()} onPaste={onPaste} onKeyDown={(ev) => {
        if (ev.key === "Escape") { cancelled.current = true; setDraft(external); setInvalid(false); ev.currentTarget.blur(); }
        if (ev.key === "Tab") {
            const input = ev.currentTarget;
            const fields = Array.from(input.closest("table")?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input[data-col], select[data-col]") ?? []);
            const next = fields[fields.indexOf(input) + (ev.shiftKey ? -1 : 1)];
            if (next) { ev.preventDefault(); void commit().then((ok) => { if (ok) next.focus(); }); }
        }
        if (ev.key === "Enter") {
            ev.preventDefault();
            const input = ev.currentTarget;
            void commit().then((ok) => {
                if (!ok) return;
                const next = row === undefined ? null : input.closest("table")?.querySelector<HTMLInputElement>(`[data-row="${row + (ev.shiftKey ? -1 : 1)}"][data-col="${column}"]`);
                if (next) next.focus(); else input.blur();
            });
        }
    }} />;
}
