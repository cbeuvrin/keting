import type { Payment, Project } from "./clientes";

export type PaymentStage = { id: string; label: string; kind: "percent" | "amount" | "remainder"; value: number; dueOn: string | null };
export type PaymentPlan = { stages: PaymentStage[] };
export type StageBalance = PaymentStage & { expected: number; paid: number; remaining: number; contributions: { payment: Payment; amount: number }[] };
const round = (n: number) => Math.round(n * 100) / 100;
export const planKey = (id: string) => `cli_payment_plan:${id}`;
export const defaultPaymentPlan = (): PaymentPlan => ({ stages: [
    { id: "deposit", label: "Anticipo", kind: "percent", value: 50, dueOn: null },
    { id: "final", label: "Finiquito", kind: "remainder", value: 0, dueOn: null },
] });

export function validDay(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function planError(input: unknown, total: number): string | null {
    if (!input || typeof input !== "object" || !("stages" in input) || !Array.isArray(input.stages) || input.stages.length < 2 || input.stages.length > 12) return "El plan necesita de 2 a 12 etapas.";
    const ids = new Set<string>();
    let planned = 0;
    for (let index = 0; index < input.stages.length; index++) {
        const s = input.stages[index];
        if (!s || typeof s !== "object" || typeof s.id !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(s.id) || ids.has(s.id)) return "Cada etapa necesita un identificador único.";
        ids.add(s.id);
        if (typeof s.label !== "string" || !s.label.trim() || s.label.length > 80) return "Pon un nombre de hasta 80 caracteres a cada etapa.";
        if (typeof s.value !== "number" || !Number.isFinite(s.value) || s.value < 0 || Math.abs(s.value - round(s.value)) > 1e-8) return "Usa valores positivos con un máximo de dos decimales.";
        if (s.dueOn !== null && (typeof s.dueOn !== "string" || !validDay(s.dueOn))) return "Una fecha prevista no es válida.";
        if (index === input.stages.length - 1) {
            if (s.kind !== "remainder" || s.value !== 0) return "La última etapa debe cubrir el saldo restante.";
        } else {
            if (s.kind !== "percent" && s.kind !== "amount") return "Elige porcentaje o importe para cada etapa.";
            if (s.kind === "percent" && s.value > 100) return "Un porcentaje no puede superar el 100%.";
            planned = round(planned + (s.kind === "percent" ? round(total * s.value / 100) : s.value));
        }
    }
    if (planned > round(total)) return "Los cobros pactados superan el total del proyecto. Ajusta el plan o el total.";
    return null;
}

/** Los pagos existentes cubren las etapas en orden; el plan nunca crea ni modifica pagos. */
export function stageBalances(project: Project, payments: Payment[], plan: PaymentPlan = defaultPaymentPlan()): StageBalance[] {
    let expectedSoFar = 0;
    const stages = plan.stages.map((s) => {
        const expected = s.kind === "remainder" ? round(project.total - expectedSoFar) : s.kind === "percent" ? round(project.total * s.value / 100) : s.value;
        expectedSoFar = round(expectedSoFar + expected);
        return { ...s, expected, paid: 0, remaining: expected, contributions: [] } as StageBalance;
    });
    const own = payments.filter((p) => p.project_id === project.id).sort((a, b) => a.paid_on.localeCompare(b.paid_on) || a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
    for (const payment of own) {
        let available = payment.amount;
        for (const stage of stages) {
            const amount = round(Math.min(available, Math.max(0, stage.remaining)));
            if (amount <= 0) continue;
            stage.contributions.push({ payment, amount });
            stage.paid = round(stage.paid + amount);
            stage.remaining = round(stage.expected - stage.paid);
            available = round(available - amount);
        }
    }
    return stages;
}

/** Solo una fecha real inequívoca se edita desde la fila principal. */
export function singleStagePayment(stage: StageBalance, stages: StageBalance[]): Payment | null {
    if (stage.contributions.length !== 1) return null;
    const payment = stage.contributions[0].payment;
    return stages.filter((s) => s.contributions.some((c) => c.payment.id === payment.id)).length === 1 ? payment : null;
}
