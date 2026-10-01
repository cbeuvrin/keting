// Módulo CLIENTES del panel: tipos y cálculos de dinero.
//
// Sin dependencias a propósito (ni Supabase ni alias "@/"): así se prueba con
// Node a secas (scripts/clientes-calc.test.mjs). A mano solo se capturan
// clientes, proyectos con su total, mensualidades con su monto y pagos; saldos,
// adeudos y gráficas salen de aquí, para que nunca haya una cifra escrita a
// mano que no cuadre con los pagos.

export const PROJECT_STATUSES = ["esperando", "aprobado", "entregado", "en_pausa", "cancelado"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
    esperando: "Esperando",
    aprobado: "Aprobado",
    entregado: "Entregado",
    en_pausa: "En pausa",
    cancelado: "Cancelado",
};

/** Estados en los que lo que falta ya se debe. "Esperando" es cotización y "Cancelado" no cuenta. */
export const OWED_STATUSES: readonly ProjectStatus[] = ["aprobado", "entregado", "en_pausa"];

/** Moneda en la que se le cobra a un cliente. Todo lo suyo (totales, mensualidades, pagos) va en esa moneda. */
export type Currency = "MXN" | "USD";
export const CURRENCIES: readonly Currency[] = ["MXN", "USD"];

export type Client = {
    id: string;
    created_at: string;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    notes: string | null;
    archived: boolean;
    /** Puede faltar si la columna aún no existe en la base: entonces es MXN. */
    currency?: Currency | null;
};

export type Project = {
    id: string;
    created_at: string;
    client_id: string;
    name: string;
    status: ProjectStatus;
    total: number;
    delivery_date: string | null;
    notes: string | null;
};

export type BillingFrequency = "mensual" | "quincenal";

export type Retainer = {
    id: string;
    created_at: string;
    client_id: string;
    concept: string;
    /** Importe de cada cobro, mensual o quincenal. Nombre de columna histórico. */
    monthly_amount: number;
    frequency?: BillingFrequency;
    /** Días pactados (1–31); 31 se ajusta al último día disponible. */
    billing_days?: number[];
    /** Inicio: primer mes mensual (día 1), o fecha exacta quincenal. */
    start_month: string;
    /** Fin inclusivo: último mes mensual o fecha exacta quincenal; null si sigue activo. */
    end_month: string | null;
};

export type Payment = {
    id: string;
    created_at: string;
    client_id: string;
    project_id: string | null;
    retainer_id: string | null;
    amount: number;
    /** "YYYY-MM-DD" */
    paid_on: string;
    note: string | null;
};

// ── Fechas ──────────────────────────────────────────────────────────────────
// Todo trabaja con cadenas "YYYY-MM-DD" / "YYYY-MM" y nunca con Date locales,
// para que un servidor en UTC no mueva un pago de mes.

/** "YYYY-MM-DD" de hoy en Ciudad de México. */
export function todayMx(now: Date = new Date()): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Mexico_City",
    }).format(now);
}

/** "2026-09-14" → "2026-09" */
export function monthOf(date: string): string {
    return date.slice(0, 7);
}

/** Suma n meses a "YYYY-MM". */
export function addMonths(month: string, n: number): string {
    const [y, m] = month.split("-").map(Number);
    const total = y * 12 + (m - 1) + n;
    const yy = Math.floor(total / 12);
    const mm = (total % 12) + 1;
    return `${yy}-${String(mm).padStart(2, "0")}`;
}

/** Meses de `from` a `to` (ambos "YYYY-MM", incluidos). Vacío si from > to. */
export function monthRange(from: string, to: string): string[] {
    const out: string[] = [];
    for (let m = from; m <= to; m = addMonths(m, 1)) out.push(m);
    return out;
}

const MONTH_NAMES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-09" → "sep 2026" */
export function monthLabel(month: string): string {
    const [y, m] = month.split("-").map(Number);
    return `${MONTH_NAMES[m - 1]} ${y}`;
}

/** Redondeo a centavos: sumar decimales en coma flotante deja colas (0.1 + 0.2). */
export function cents(n: number): number {
    return Math.round(n * 100) / 100;
}

// ── Proyectos ───────────────────────────────────────────────────────────────

export type ProjectBalance = {
    paid: number;
    /** Positivo = lo que falta; negativo = saldo a favor del cliente */
    remaining: number;
    /** Fecha del primer pago, o null si no ha pagado nada */
    firstPaidOn: string | null;
};

export function projectBalance(project: Project, payments: Payment[]): ProjectBalance {
    let paid = 0;
    let firstPaidOn: string | null = null;
    for (const p of payments) {
        if (p.project_id !== project.id) continue;
        paid += p.amount;
        if (!firstPaidOn || p.paid_on < firstPaidOn) firstPaidOn = p.paid_on;
    }
    paid = cents(paid);
    return { paid, remaining: cents(project.total - paid), firstPaidOn };
}

// ── Mensualidades ───────────────────────────────────────────────────────────

export type RetainerBalance = {
    dueMonths: string[];
    dueDates: string[];
    due: number;
    paid: number;
    debt: number;
    credit: number;
    pendingMonths: string[];
    pendingDates: string[];
    nextDueOn: string | null;
    active: boolean;
};

/** Último día real del mes: incluye febrero y años bisiestos. */
export function lastDayOfMonth(month: string): string {
    const next = new Date(`${addMonths(month, 1)}-01T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() - 1);
    return next.toISOString().slice(0, 10);
}

export function billingDays(retainer: Pick<Retainer, "frequency" | "billing_days">): number[] {
    return retainer.billing_days ?? (retainer.frequency === "quincenal" ? [15, 31] : [1]);
}

export function billingLabel(retainer: Pick<Retainer, "frequency" | "billing_days">): string {
    return billingDays(retainer).map((day) => day === 31 ? "fin de mes" : String(day)).join(" y ");
}

/** Días pactados por servicio; las mensualidades conservan inicio y fin por mes. */
export function recurringDates(retainer: Retainer, through: string): string[] {
    const monthly = retainer.frequency !== "quincenal";
    const start = monthly ? `${monthOf(retainer.start_month)}-01` : retainer.start_month;
    const end = retainer.end_month && (monthly ? lastDayOfMonth(monthOf(retainer.end_month)) : retainer.end_month);
    const limit = end && end < through ? end : through;
    return monthRange(monthOf(start), monthOf(limit))
        .flatMap((month) => billingDays(retainer).map((day) => `${month}-${String(Math.min(day, Number(lastDayOfMonth(month).slice(-2)))).padStart(2, "0")}`))
        .filter((date) => date >= start && date <= limit).sort();
}

/** Cada abono cubre primero el periodo pendiente más antiguo. */
export function retainerBalance(retainer: Retainer, payments: Payment[], today: string): RetainerBalance {
    const dueDates = recurringDates(retainer, today);
    const dueMonths = [...new Set(dueDates.map(monthOf))];
    const due = cents(dueDates.length * retainer.monthly_amount);
    const paid = cents(payments.filter((p) => p.retainer_id === retainer.id).reduce((sum, p) => sum + p.amount, 0));
    // División en centavos: un abono casi completo no liquida el periodo.
    const covered = retainer.monthly_amount > 0 ? Math.floor(Math.round(paid * 100) / Math.round(retainer.monthly_amount * 100)) : 0;
    const pendingDates = dueDates.slice(Math.min(covered, dueDates.length));
    const nextMonth = addMonths(monthOf(retainer.start_month > today ? retainer.start_month : today), 1);
    const nextDueOn = recurringDates(retainer, lastDayOfMonth(nextMonth)).find((day) => day > today) ?? null;
    return {
        dueMonths, dueDates, due, paid,
        debt: Math.max(0, cents(due - paid)),
        credit: Math.max(0, cents(paid - due)),
        pendingMonths: [...new Set(pendingDates.map(monthOf))], pendingDates, nextDueOn,
        active: retainer.frequency === "quincenal"
            ? retainer.start_month <= today && (!retainer.end_month || retainer.end_month >= today)
            : monthOf(retainer.start_month) <= monthOf(today) && (!retainer.end_month || monthOf(retainer.end_month) >= monthOf(today)),
    };
}

// ── Resumen y gráficas ──────────────────────────────────────────────────────

export type ClientSummary = {
    client: Client;
    projects: { project: Project; balance: ProjectBalance }[];
    retainers: { retainer: Retainer; balance: RetainerBalance }[];
    /** Lo que ya se debe: proyectos en estados que cobran + mensualidades atrasadas */
    owed: number;
    /** Cotizado y sin aprobar */
    quoted: number;
    paidTotal: number;
    /** Tiene al menos una mensualidad activa */
    isFixed: boolean;
};

export function summarizeClient(client: Client, projects: Project[], retainers: Retainer[], payments: Payment[], today: string): ClientSummary {
    const own = payments.filter((p) => p.client_id === client.id);
    const ps = projects.filter((p) => p.client_id === client.id).map((project) => ({ project, balance: projectBalance(project, own) }));
    const rs = retainers
        .filter((r) => r.client_id === client.id)
        .map((retainer) => ({
            retainer,
            balance: retainerBalance(retainer, own, today),
        }));

    let owed = 0;
    let quoted = 0;
    for (const { project, balance } of ps) {
        if (OWED_STATUSES.includes(project.status) && balance.remaining > 0) owed += balance.remaining;
        if (project.status === "esperando") quoted += project.total;
    }
    for (const { balance } of rs) owed += balance.debt;

    return {
        client,
        projects: ps,
        retainers: rs,
        owed: cents(owed),
        quoted: cents(quoted),
        paidTotal: cents(own.reduce((s, p) => s + p.amount, 0)),
        isFixed: rs.some((r) => r.balance.active),
    };
}

export type MonthPoint = {
    month: string;
    /** Proyectos aprobados cuyo primer pago cayó este mes, por su total */
    sales: number;
    /** Todo lo que entró este mes: pagos de proyectos y de mensualidades */
    income: number;
    soldProjects: { id: string; name: string; total: number }[];
};

/**
 * Venta de un mes = el total de los proyectos que ese mes ya estaban aprobados
 * y recibieron su primer pago (definición de Carlos). Una mensualidad no es
 * venta: solo entra en el ingreso de cada mes que se paga.
 */
export function monthlySeries(projects: Project[], payments: Payment[], today: string, months = 12): MonthPoint[] {
    const last = monthOf(today);
    const range = monthRange(addMonths(last, -(months - 1)), last);
    const points = new Map<string, MonthPoint>(range.map((m) => [m, { month: m, sales: 0, income: 0, soldProjects: [] }]));

    for (const p of payments) {
        const point = points.get(monthOf(p.paid_on));
        if (point) point.income = cents(point.income + p.amount);
    }
    for (const project of projects) {
        if (!OWED_STATUSES.includes(project.status)) continue;
        const { firstPaidOn } = projectBalance(project, payments);
        const point = firstPaidOn ? points.get(monthOf(firstPaidOn)) : undefined;
        if (!point) continue;
        point.sales = cents(point.sales + project.total);
        point.soldProjects.push({
            id: project.id,
            name: project.name,
            total: project.total,
        });
    }
    return range.map((m) => points.get(m)!);
}

export function formatMoney(n: number, currency: Currency = "MXN"): string {
    const hasCents = Math.round(n * 100) % 100 !== 0;
    const text = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: hasCents ? 2 : 0,
        maximumFractionDigits: 2,
    }).format(Math.abs(n));
    return (n < 0 ? "-" : "") + (currency === "USD" ? `US${text}` : text);
}

/** Un pendiente por concepto, siempre en la moneda original del cliente. */
export type PendingCollection = {
    target: string;
    clientId: string;
    name: string;
    kind: "proyecto" | "mensualidad";
    remaining: number;
    status?: ProjectStatus;
    pendingMonths: string[];
};

export function pendingCollections(projects: Project[], retainers: Retainer[], payments: Payment[], today: string): PendingCollection[] {
    const rows: PendingCollection[] = [];
    for (const project of projects) {
        if (!OWED_STATUSES.includes(project.status)) continue;
        const { remaining } = projectBalance(project, payments);
        if (remaining > 0) rows.push({ target: `p:${project.id}`, clientId: project.client_id, name: project.name, kind: "proyecto", remaining, status: project.status, pendingMonths: [] });
    }
    for (const retainer of retainers) {
        const { debt, pendingMonths } = retainerBalance(retainer, payments, today);
        if (debt > 0) rows.push({ target: `r:${retainer.id}`, clientId: retainer.client_id, name: retainer.concept, kind: "mensualidad", remaining: debt, pendingMonths });
    }
    return rows;
}

/** Moneda del cliente (MXN si no tiene). */
export function currencyOf(clients: Client[], clientId: string): Currency {
    return clients.find((c) => c.id === clientId)?.currency === "USD" ? "USD" : "MXN";
}

/**
 * Pasa a pesos todo lo de los clientes en dólares, con un solo tipo de cambio,
 * para que los totales y la gráfica sumen peras con peras. Lo de cada cliente
 * se sigue mostrando en su moneda; esto es solo para sumar.
 */
export function inMxn<
    T extends {
        clients: Client[];
        projects: Project[];
        retainers: Retainer[];
        payments: Payment[];
    },
>(data: T, usdRate: number): T {
    const usd = new Set(data.clients.filter((c) => c.currency === "USD").map((c) => c.id));
    if (usd.size === 0) return data;
    const fx = (clientId: string, n: number) => (usd.has(clientId) ? cents(n * usdRate) : n);
    return {
        ...data,
        projects: data.projects.map((p) => ({
            ...p,
            total: fx(p.client_id, p.total),
        })),
        retainers: data.retainers.map((r) => ({
            ...r,
            monthly_amount: fx(r.client_id, r.monthly_amount),
        })),
        payments: data.payments.map((p) => ({
            ...p,
            amount: fx(p.client_id, p.amount),
        })),
    };
}
