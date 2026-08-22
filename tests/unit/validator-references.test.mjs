import assert from "node:assert/strict";
import test from "node:test";
import { validateInventoryReferences } from "../../plugin/skills/project-inventory/scripts/lib/validator/inventory-validator.mjs";
import { scope, evidence, findings, clone } from "../helpers/fixtures.mjs";

test("PI-T05 rejects unknown evidence references", () => {
  const candidate = clone(findings);
  candidate.statements[0].evidence_refs = ["ev-missing-001"];
  const result = validateInventoryReferences(evidence, candidate, scope.source_boundary);
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics.some((entry) => entry.code === "PI_EVIDENCE_REFERENCE_UNKNOWN"), true);
});
