import { crmAdmin } from "@/lib/crm";

// Tipo de cambio USD→MXN del día, para sumar en pesos lo de los clientes que
// pagan en dólares. Fuente: Frankfurter (referencia del BCE, sin llave); si no
// responde, open.er-api.com. Se cachea 6 horas. El último bueno se guarda en
// crm_settings para usarlo si las dos fuentes fallan.

export type UsdRate = { rate: number; date: string; stale: boolean };

const SETTINGS_KEY = "cli_usd_mxn";
const SIX_HOURS = 6 * 60 * 60;

async function fromFrankfurter(): Promise<{
    rate: number;
    date: string;
} | null> {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=MXN", { next: { revalidate: SIX_HOURS } });
    if (!res.ok) return null;
    const j = (await res.json()) as { date?: string; rates?: { MXN?: number } };
    return j.rates?.MXN && j.date ? { rate: j.rates.MXN, date: j.date } : null;
}

async function fromErApi(): Promise<{ rate: number; date: string } | null> {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
        next: { revalidate: SIX_HOURS },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as {
        rates?: { MXN?: number };
        time_last_update_unix?: number;
    };
    if (!j.rates?.MXN) return null;
    const date = new Date((j.time_last_update_unix ?? Date.now() / 1000) * 1000).toISOString().slice(0, 10);
    return { rate: j.rates.MXN, date };
}

export async function usdRate(): Promise<UsdRate | null> {
    for (const source of [fromFrankfurter, fromErApi]) {
        const found = await source().catch(() => null);
        if (!found) continue;
        const rate = Math.round(found.rate * 10000) / 10000;
        await crmAdmin()
            .from("crm_settings")
            .upsert({
                key: SETTINGS_KEY,
                value: { rate, date: found.date },
                updated_at: new Date().toISOString(),
            })
            .then(
                () => undefined,
                () => undefined,
            );
        return { rate, date: found.date, stale: false };
    }
    const { data } = await crmAdmin().from("crm_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
    const last = data?.value as { rate?: number; date?: string } | undefined;
    return last?.rate && last.date ? { rate: last.rate, date: last.date, stale: true } : null;
}
