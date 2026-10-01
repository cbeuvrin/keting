// Pruebas de los cálculos de dinero del módulo CLIENTES (lib/clientes.ts).
// Correr: node --experimental-strip-types --test scripts/clientes-calc.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
    addMonths,
    monthRange,
    projectBalance,
    retainerBalance,
    summarizeClient,
    monthlySeries,
    todayMx,
    inMxn,
    currencyOf,
    formatMoney,
    pendingCollections,
} from "../lib/clientes.ts";

const client = { id: "c1", created_at: "", name: "Toogo", company: null, email: null, phone: null, notes: null, archived: false };
const project = (id, status, total, extra = {}) => ({ id, created_at: "", client_id: "c1", name: id, status, total, delivery_date: null, notes: null, ...extra });
const pay = (id, amount, paid_on, to) => ({ id, created_at: "", client_id: "c1", amount, paid_on, note: null, project_id: null, retainer_id: null, ...to });
const retainer = (id, monthly_amount, start_month, end_month = null) => ({ id, created_at: "", client_id: "c1", concept: "Mantenimiento", monthly_amount, start_month, end_month });

test("meses: suma y rangos cruzan el año", () => {
    assert.equal(addMonths("2026-11", 2), "2027-01");
    assert.equal(addMonths("2026-01", -1), "2025-12");
    assert.deepEqual(monthRange("2026-11", "2027-02"), ["2026-11", "2026-12", "2027-01", "2027-02"]);
    assert.deepEqual(monthRange("2026-05", "2026-04"), []);
});

test("todayMx usa la hora de Ciudad de México, no UTC", () => {
    // 29 sep 03:00 UTC = 28 sep 21:00 en CDMX
    assert.equal(todayMx(new Date("2026-09-29T03:00:00Z")), "2026-09-28");
});

test("proyecto: lo que falta, saldo a favor y primer pago", () => {
    const p = project("web", "aprobado", 40000);
    const pays = [pay("a", 20000, "2026-09-10", { project_id: "web" }), pay("b", 5000, "2026-08-30", { project_id: "web" }), pay("x", 999, "2026-09-01", { project_id: "otro" })];
    assert.deepEqual(projectBalance(p, pays), { paid: 25000, remaining: 15000, firstPaidOn: "2026-08-30" });
    const sobrepagado = projectBalance(project("app", "entregado", 1000), [pay("c", 1200, "2026-09-01", { project_id: "app" })]);
    assert.equal(sobrepagado.remaining, -200);
});

test("proyecto: centavos sin colas de coma flotante", () => {
    const b = projectBalance(project("p", "aprobado", 0.3), [pay("a", 0.1, "2026-01-01", { project_id: "p" }), pay("b", 0.2, "2026-01-01", { project_id: "p" })]);
    assert.equal(b.remaining, 0);
});

test("mensualidad: se acumula y los pagos cubren el mes más viejo", () => {
    const r = retainer("m", 3000, "2026-07-01");
    const b = retainerBalance(r, [pay("a", 3000, "2026-07-05", { retainer_id: "m" })], "2026-09-15");
    assert.deepEqual(b.dueMonths, ["2026-07", "2026-08", "2026-09"]);
    assert.equal(b.due, 9000);
    assert.equal(b.debt, 6000);
    assert.deepEqual(b.pendingMonths, ["2026-08", "2026-09"]);
    assert.equal(b.active, true);
});

test("mensualidad: pago parcial deja el mes pendiente; adelanto queda como crédito", () => {
    const r = retainer("m", 3000, "2026-09-01");
    const parcial = retainerBalance(r, [pay("a", 1500, "2026-09-02", { retainer_id: "m" })], "2026-09-20");
    assert.equal(parcial.debt, 1500);
    assert.deepEqual(parcial.pendingMonths, ["2026-09"]);
    const adelanto = retainerBalance(r, [pay("a", 6000, "2026-09-02", { retainer_id: "m" })], "2026-09-20");
    assert.equal(adelanto.debt, 0);
    assert.equal(adelanto.credit, 3000);
    assert.deepEqual(adelanto.pendingMonths, []);
});

test("mensualidad terminada deja de acumular y futura aún no se debe", () => {
    const cerrada = retainerBalance(retainer("m", 1000, "2026-01-01", "2026-03-01"), [], "2026-09-10");
    assert.equal(cerrada.due, 3000);
    assert.equal(cerrada.active, false);
    const futura = retainerBalance(retainer("f", 1000, "2026-10-01"), [], "2026-09-10");
    assert.equal(futura.due, 0);
    assert.equal(futura.active, false);
});

test("resumen del cliente: esperando es cotización, cancelado no cuenta, fijo si tiene mensualidad activa", () => {
    const projects = [project("a", "aprobado", 10000), project("e", "esperando", 5000), project("x", "cancelado", 8000), project("p", "en_pausa", 2000)];
    const retainers = [retainer("m", 1000, "2026-09-01")];
    const payments = [pay("1", 4000, "2026-09-01", { project_id: "a" })];
    const s = summarizeClient(client, projects, retainers, payments, "2026-09-15");
    assert.equal(s.owed, 6000 + 2000 + 1000);
    assert.equal(s.quoted, 5000);
    assert.equal(s.paidTotal, 4000);
    assert.equal(s.isFixed, true);
});

test("gráfica: venta = proyectos aprobados en el mes de su primer pago; ingreso = todo lo pagado", () => {
    const projects = [project("a", "aprobado", 40000), project("e", "esperando", 9000), project("c", "cancelado", 7000)];
    const payments = [
        pay("1", 20000, "2026-08-20", { project_id: "a" }),
        pay("2", 20000, "2026-09-05", { project_id: "a" }),
        pay("3", 3000, "2026-09-10", { retainer_id: "m" }),
        pay("4", 1000, "2026-09-11", { project_id: "c" }),
    ];
    const serie = monthlySeries(projects, payments, "2026-09-28", 3);
    assert.deepEqual(serie.map((p) => p.month), ["2026-07", "2026-08", "2026-09"]);
    assert.equal(serie[1].sales, 40000);
    assert.equal(serie[2].sales, 0);
    assert.equal(serie[1].income, 20000);
    assert.equal(serie[2].income, 24000);
});

test("formato de dinero en pesos", () => {
    assert.equal(formatMoney(40000).replace(/\s/g, " "), "$40,000");
    assert.equal(formatMoney(1500.5).replace(/\s/g, " "), "$1,500.50");
});

test("dólares: formato US$ y conversión a pesos solo de los clientes en USD", () => {
    assert.equal(formatMoney(800, "USD"), "US$800");
    assert.equal(formatMoney(-50.5, "USD"), "-US$50.50");
    const clients = [
        { id: "n", name: "Nelson", currency: "USD" },
        { id: "k", name: "Keting" },
    ];
    assert.equal(currencyOf(clients, "n"), "USD");
    assert.equal(currencyOf(clients, "k"), "MXN");
    const data = {
        clients,
        projects: [project("pn", "aprobado", 1000, { client_id: "n" }), project("pk", "aprobado", 1000, { client_id: "k" })],
        retainers: [{ ...retainer("rn", 800, "2026-09-01"), client_id: "n" }],
        payments: [pay("1", 100.5, "2026-09-02", { project_id: "pn", client_id: "n" }), pay("2", 100, "2026-09-02", { project_id: "pk", client_id: "k" })],
    };
    const mx = inMxn(data, 18.25);
    assert.equal(mx.projects[0].total, 18250);
    assert.equal(mx.projects[1].total, 1000);
    assert.equal(mx.retainers[0].monthly_amount, 14600);
    assert.equal(mx.payments[0].amount, 1834.13);
    assert.equal(mx.payments[1].amount, 100);
    assert.equal(data.projects[0].total, 1000, "no toca los datos originales");
});


test("cobros: reúne proyectos y mensualidades sin cotizaciones, cancelados ni saldos a favor", () => {
    const ps = [project("p1", "aprobado", 5000), project("p2", "entregado", 800), project("p3", "esperando", 9000), project("p4", "cancelado", 4000), project("p5", "en_pausa", 2000)];
    const rs = [retainer("r1", 1000, "2026-08-01"), retainer("r2", 500, "2026-08-01", "2026-08-01")];
    const pays = [pay("a", 1500, "2026-09-01", {project_id: "p1"}), pay("b", 900, "2026-09-01", {project_id: "p2"}), pay("c", 600, "2026-09-01", {retainer_id: "r1"})];
    const rows = pendingCollections(ps, rs, pays, "2026-09-15");
    assert.deepEqual(rows.map(r => [r.target, r.remaining]), [["p:p1", 3500], ["p:p5", 2000], ["r:r1", 1400], ["r:r2", 500]]);
    assert.deepEqual(rows.find(r => r.target === "r:r1").pendingMonths, ["2026-08", "2026-09"]);
    assert.equal(rows.reduce((s, r) => s + r.remaining, 0), summarizeClient(client, ps, rs, pays, "2026-09-15").owed);
});

test("cobros: los pagos parciales reducen el pendiente y liquidarlo lo elimina", () => {
    const ps = [project("p", "aprobado", 200)];
    const rows = payments => pendingCollections(ps, [], payments, "2026-10-01");
    const partial = pay("a", 75, "2026-10-01", {project_id: "p"});
    assert.equal(rows([partial])[0].remaining, 125);
    assert.deepEqual(rows([partial, pay("b", 125, "2026-10-01", {project_id: "p"})]), []);
});

test("cobros: conserva moneda original y el total convertido coincide con el resumen", () => {
    const clients = [client, {...client, id: "usd", currency: "USD"}];
    const projects = [project("mx", "aprobado", 1000), project("us", "aprobado", 100, {client_id: "usd"})];
    const data = {clients, projects, retainers: [], payments: []};
    assert.equal(pendingCollections(projects, [], [], "2026-10-01")[1].remaining, 100);
    const mx = inMxn(data, 18.5);
    const total = pendingCollections(mx.projects, [], [], "2026-10-01").reduce((s, r) => s + r.remaining, 0);
    assert.equal(total, 2850);
    assert.equal(total, clients.reduce((s, c) => s + summarizeClient(c, mx.projects, [], [], "2026-10-01").owed, 0));
});
