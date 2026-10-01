"use client";
import { useMemo, useSyncExternalStore } from "react";
const KEY = "keting-finance-sheet-v1";
let memory = "";
const subscribe = (callback: () => void) => { window.addEventListener("storage", callback); window.addEventListener(KEY, callback); return () => { window.removeEventListener("storage", callback); window.removeEventListener(KEY, callback); }; };
const snapshot = () => { try { return localStorage.getItem(KEY) ?? memory; } catch { return memory; } };
export type SavedView = { name: string; view: string; query: string; status: string; group: string; hidden: string[] };
export type Preferences = { widths: Record<string, number>; hidden: string[]; views: SavedView[] };
export function usePreferences() {
    const raw = useSyncExternalStore(subscribe, snapshot, () => "");
    const preferences = useMemo<Preferences>(() => {
        try { const p = JSON.parse(raw); return { widths: p.widths ?? {}, hidden: Array.isArray(p.hidden) ? p.hidden : ["paid", "notes", "quote"], views: Array.isArray(p.views) ? p.views : [] }; }
        catch { return { widths: {}, hidden: ["paid", "notes", "quote"], views: [] }; }
    }, [raw]);
    const update = (patch: Partial<Preferences>) => {
        memory = JSON.stringify({ ...preferences, ...patch });
        try { localStorage.setItem(KEY, memory); } catch { /* La preferencia sigue disponible durante esta sesión. */ }
        window.dispatchEvent(new Event(KEY));
    };
    return { preferences, update };
}
