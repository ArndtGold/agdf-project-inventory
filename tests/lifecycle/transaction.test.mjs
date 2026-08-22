import assert from "node:assert/strict";
import test from "node:test";
import { runTransaction } from "../../src/lifecycle/transaction.mjs";

test("PI-T09 current-operation failure reports applied and rolled-back items", async () => {
  const state = [];
  const result = await runTransaction([
    { id: "first", apply: () => state.push("first"), rollback: () => state.pop() },
    { id: "second", apply: () => { throw new Error("simulated failure"); }, rollback: () => {} },
  ]);
  assert.equal(result.status, "rolled_back");
  assert.deepEqual(result.applied, ["first"]);
  assert.deepEqual(result.rolled_back, ["first"]);
  assert.deepEqual(result.retained, []);
  assert.deepEqual(state, []);
});

test("PI-T09 failed rollback remains explicitly partial", async () => {
  const result = await runTransaction([
    { id: "first", apply: () => true, rollback: () => { throw new Error("retained"); } },
    { id: "second", apply: () => { throw new Error("failure"); }, rollback: () => {} },
  ]);
  assert.equal(result.status, "partial");
  assert.equal(result.retained[0].step, "first");
});
