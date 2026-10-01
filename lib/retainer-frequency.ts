import type { BillingFrequency } from "./clientes";
export const frequencyKey = (id: string) => `cli_retainer_frequency:${id}`;
export function readFrequency(value: unknown): BillingFrequency | null {
    return value === "mensual" || value === "quincenal" ? value : null;
}

/** Dos días distintos incluso en febrero: no juntar ambos al final del mes. */
export function readBillingDays(value: unknown, frequency: BillingFrequency): number[] | null {
    if (value === undefined) return frequency === "quincenal" ? [15, 31] : [1];
    if (!Array.isArray(value) || value.length !== (frequency === "quincenal" ? 2 : 1)) return null;
    if (!value.every((day) => typeof day === "number" && Number.isInteger(day) && day >= 1 && day <= 31)) return null;
    const days = [...value].sort((a, b) => a - b);
    if (days.length === 2 && Math.min(days[0], 28) === Math.min(days[1], 28)) return null;
    return days;
}
