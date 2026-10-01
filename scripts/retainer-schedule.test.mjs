import { test } from "node:test";
import assert from "node:assert/strict";
import { readBillingDays } from "../lib/retainer-frequency.ts";
test("calendario: conserva defaults y valida cantidad, enteros y días que colisionan en febrero", () => {
    assert.deepEqual(readBillingDays(undefined, "mensual"), [1]);
    assert.deepEqual(readBillingDays(undefined, "quincenal"), [15, 31]);
    assert.deepEqual(readBillingDays([25, 10], "quincenal"), [10, 25]);
    assert.deepEqual(readBillingDays([31], "mensual"), [31]);
    for (const days of [[0], [32], [10.5], ["10"], [], [10, 15]]) assert.equal(readBillingDays(days, "mensual"), null);
    for (const days of [[10], [10, 10], [28, 31], [29, 30], [10, 15, 25]]) assert.equal(readBillingDays(days, "quincenal"), null);
});
