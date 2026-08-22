import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const matrix = JSON.parse(readFileSync(new URL("../../plugin/meta/capability-matrix.json", import.meta.url), "utf8"));

test("PI-T02 matrix separates host mechanics and limitations", () => {
  assert.deepEqual(Object.keys(matrix.hosts).sort(), ["claude", "codex", "opencode"]);
  assert.equal(matrix.hosts.opencode.limitations.some((value) => value.includes("no npm plugin")), true);
  for (const host of Object.values(matrix.hosts)) assert.ok(host.limitations.length >= 2);
});
