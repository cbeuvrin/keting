"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { LEAD_SERVICES, SERVICE_LABELS } from "@/lib/crm";

// Importador de CSV. El parseo pasa en el navegador (no se sube el archivo a
// ningún lado: al servidor solo viajan las filas ya estructuradas).

type Row = { name: string; email: string; phone: string; company: string };

// Parser de CSV con soporte de comillas y de ; como separador (Excel en
// español exporta con ;). Suficiente para archivos de contactos normales.
function parseCsv(text: string): string[][] {
    const delimiter = (text.split("\n")[0].match(/;/g)?.length ?? 0) > (text.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";
    const rows: string[][] = [];
    let row: string[] = [], cell = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
            else if (ch === '"') inQuotes = false;
            else cell += ch;
        } else if (ch === '"') inQuotes = true;
        else if (ch === delimiter) { row.push(cell); cell = ""; }
        else if (ch === "\n" || ch === "\r") {
            if (ch === "\r" && text[i + 1] === "\n") i++;
            row.push(cell); cell = "";
            if (row.some((c) => c.trim() !== "")) rows.push(row);
            row = [];
        } else cell += ch;
    }
    row.push(cell);
    if (row.some((c) => c.trim() !== "")) rows.push(row);
    return rows;
}

const HEADERS: Record<keyof Row, string[]> = {
    name: ["name", "nombre", "nombres", "contacto", "cliente"],
    email: ["email", "e-mail", "correo", "mail", "correo electronico", "correo electrónico"],
    phone: ["phone", "telefono", "teléfono", "tel", "celular", "whatsapp", "movil", "móvil"],
    company: ["company", "empresa", "negocio", "organizacion", "organización", "compania", "compañia", "compañía"],
};

function mapRows(raw: string[][]): Row[] {
    if (raw.length === 0) return [];
    const header = raw[0].map((h) => h.trim().toLowerCase());
    const col: Partial<Record<keyof Row, number>> = {};
    for (const key of Object.keys(HEADERS) as (keyof Row)[]) {
        const idx = header.findIndex((h) => HEADERS[key].includes(h));
        if (idx >= 0) col[key] = idx;
    }
    // Sin encabezado de correo reconocible: se busca la columna con más "@".
    let body = raw.slice(1);
    if (col.email === undefined) {
        const sample = raw.slice(0, 20);
        let best = -1, bestCount = 0;
        const width = Math.max(...raw.map((r) => r.length));
        for (let c = 0; c < width; c++) {
            const count = sample.filter((r) => r[c]?.includes("@")).length;
            if (count > bestCount) { best = c; bestCount = count; }
        }
        if (best === -1) return [];
        col.email = best;
        if (col.name === undefined) col.name = best === 0 ? 1 : 0;
        // Si la primera fila también era un dato (no encabezado), se incluye.
        if (raw[0][best]?.includes("@")) body = raw;
    }
    return body.map((r) => ({
        name: col.name !== undefined ? (r[col.name] ?? "").trim() : "",
        email: (r[col.email!] ?? "").trim(),
        phone: col.phone !== undefined ? (r[col.phone] ?? "").trim() : "",
        company: col.company !== undefined ? (r[col.company] ?? "").trim() : "",
    })).filter((r) => r.email.includes("@"));
}

export function ImportCsv() {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [rows, setRows] = useState<Row[] | null>(null);
    const [fileName, setFileName] = useState("");
    const [list, setList] = useState("");
    const [service, setService] = useState("");
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState("");

    async function onFile(ev: React.ChangeEvent<HTMLInputElement>) {
        const file = ev.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setResult("");
        const mapped = mapRows(parseCsv(await file.text()));
        setRows(mapped);
        if (!list) setList(file.name.replace(/\.[^.]+$/, ""));
    }

    async function doImport() {
        if (!rows?.length) return;
        setBusy(true);
        const res = await fetch("/api/admin/crm/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ list_name: list.trim() || null, service: service || null, rows }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
            setResult(`${data.inserted} nuevos · ${data.existing} ya existían · ${data.invalid} sin correo válido`);
            setRows(null);
            setFileName("");
            router.refresh();
        } else {
            setResult(data.error || "Error al importar");
        }
        setBusy(false);
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
            <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 border border-[#1d1d1f]/15 bg-white px-3.5 py-2 text-sm rounded-md hover:border-[#1d1d1f] transition-colors"
            >
                <Upload className="w-4 h-4" strokeWidth={1.75} /> Importar
            </button>
            {rows !== null && (
                <>
                    <span className="text-sm text-[#1d1d1f]/60">
                        {fileName}: <strong>{rows.length}</strong> contactos con correo
                    </span>
                    <input
                        value={list}
                        onChange={(ev) => setList(ev.target.value)}
                        placeholder="Nombre de la lista"
                        className="border border-[#1d1d1f]/15 px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]"
                    />
                    <select
                        value={service}
                        onChange={(ev) => setService(ev.target.value)}
                        className="border border-[#1d1d1f]/15 bg-white px-3 py-2 text-sm rounded-md outline-none focus:border-[#1d1d1f]"
                    >
                        <option value="">Servicio (opcional)</option>
                        {LEAD_SERVICES.map((sv) => (
                            <option key={sv} value={sv}>{SERVICE_LABELS[sv]}</option>
                        ))}
                    </select>
                    <button
                        onClick={doImport}
                        disabled={busy || rows.length === 0}
                        className="bg-[#111111] text-white px-4 py-2 text-sm rounded-md disabled:opacity-40"
                    >
                        {busy ? "Importando…" : "Importar"}
                    </button>
                </>
            )}
            {result && <span className="text-sm text-[#1d1d1f]/60">{result}</span>}
        </div>
    );
}
