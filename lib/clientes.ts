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

export type Client = {
    id: string;
    created_at: string;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    notes: string | null;
    archived: boolean;
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

export type Retainer = {
    id: string;
    created_at: string;
    client_id: string;
    concept: string;
    monthly_amount: number;
    /** Primer mes que se cobra, "YYYY-MM-01" */
    start_month: string;
    /** Último mes que se cobra, "YYYY-MM-01"; null mientras siga activa */
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
    return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(now);
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
    /** Meses que ya se deben: del inicio al mes actual (o al fin, si terminó) */
    dueMonths: string[];
    due: number;
    paid: number;
    /** Lo que se debe; 0 si está al corriente */
    debt: number;
    /** Pagado por adelantado */
    credit: number;
    /** Meses aún no cubiertos, del más viejo al más nuevo (los pagos cubren primero el más viejo) */
    pendingMonths: string[];
    active: boolean;
};

/**
 * Cada mes cuenta como debido desde su día 1. Los pagos no llevan mes: se
 * aplican al mes pendiente más viejo, que es como se cobra en la práctica.
 */
export function retainerBalance(retainer: Retainer, payments: Payment[], today: string): RetainerBalance {
    const current = monthOf(today);
    const start = monthOf(retainer.start_month);
    const end = retainer.end_month ? monthOf(retainer.end_month) : null;
    const lastDue = end && end < current ? end : current;
    const dueMonths = monthRange(start, lastDue);
    const due = cents(dueMonths.length * retainer.monthly_amount);

    let paid = 0;
    for (const p of payments) if (p.retainer_id === retainer.id) paid += p.amount;
    paid = cents(paid);

    const covered = retainer.monthly_amount > 0 ? Math.floor(cents(paid / retainer.monthly_amount) + 1e-9) : 0;
    const pendingMonths = dueMonths.slice(Math.min(covered, dueMonths.length));

    return {
        dueMonths,
        due,
        paid,
        debt: Math.max(0, cents(due - paid)),
        credit: Math.max(0, cents(paid - due)),
        pendingMonths,
        active: start <= current && (!end || end >= current),
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

export function summarizeClient(
    client: Client,
    projects: Project[],
    retainers: Retainer[],
    payments: Payment[],
    today: string,
): ClientSummary {
    const own = payments.filter((p) => p.client_id === client.id);
    const ps = projects.filter((p) => p.client_id === client.id).map((project) => ({ project, balance: projectBalance(project, own) }));
    const rs = retainers.filter((r) => r.client_id === client.id).map((retainer) => ({ retainer, balance: retainerBalance(retainer, own, today) }));

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
        point.soldProjects.push({ id: project.id, name: project.name, total: project.total });
    }
    return range.map((m) => points.get(m)!);
}

export function formatMoney(n: number): string {
    const hasCents = Math.round(n * 100) % 100 !== 0;
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: hasCents ? 2 : 0,
        maximumFractionDigits: 2,
    }).format(n);
}
