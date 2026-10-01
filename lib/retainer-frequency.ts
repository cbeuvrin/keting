import type { BillingFrequency } from "./clientes";
export const frequencyKey = (id: string) => `cli_retainer_frequency:${id}`;
export function readFrequency(value: unknown): BillingFrequency | null {
    return value === "mensual" || value === "quincenal" ? value : null;
}
