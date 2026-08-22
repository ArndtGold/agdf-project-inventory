import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createSchemaRegistry } from "../../plugin/skills/project-inventory/scripts/lib/validator/schema-validator.mjs";
import { uatRecord, clone } from "../helpers/fixtures.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const registry = createSchemaRegistry(join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas"));

test("PI-T15 UAT requires observed behavior and a human decision", () => {
  assert.equal(registry.validate("uat-record", uatRecord).valid, true);
  for (const missing of ["host_version", "activation_scope", "invoked_intent", "observed_behavior", "human_decision"]) {
    const candidate = clone(uatRecord);
    delete candidate[missing];
    assert.equal(registry.validate("uat-record", candidate).valid, false, missing);
  }
});

test("PI-T15 each host protocol keeps human UAT separate and provides reversible uninstall", () => {
  for (const host of ["CODEX", "CLAUDE", "OPENCODE"]) {
    const protocol = readFileSync(join(repoRoot, "evals", "uat", `${host}.md`), "utf8");
    assert.match(protocol, /Status: not_performed/);
    assert.match(protocol, /fresh/i);
    assert.match(protocol, /human/i);
    assert.match(protocol, /npm run uninstall:(codex|claude|opencode)/);
    assert.match(protocol, /validator-confirmed/);
    for (const state of ["not_checked", "inaccessible", "evidence_of_absence", "conflicting"]) assert.match(protocol, new RegExp(state));
  }
});
