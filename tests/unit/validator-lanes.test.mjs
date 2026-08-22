import assert from "node:assert/strict";
import test from "node:test";
import { validateInventoryReferences } from "../../plugin/skills/project-inventory/scripts/lib/validator/inventory-validator.mjs";
import { scope, evidence, findings, clone } from "../helpers/fixtures.mjs";

test("PI-T05 rejects repository evidence used as runtime proof", () => {
  const candidate = clone(findings);
  candidate.statements[0].claim_lane = "runtime";
  const result = validateInventoryReferences(evidence, candidate, scope.source_boundary);
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics.some((entry) => entry.code === "PI_EVIDENCE_LANE_OVERCLAIM"), true);
});

test("PI-T05 rejects repository traversal locators", () => {
  const candidateEvidence = clone(evidence);
  candidateEvidence.entries[0].locator = "../outside.txt";
  const result = validateInventoryReferences(candidateEvidence, findings, scope.source_boundary);
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics.some((entry) => entry.code === "PI_EVIDENCE_PATH_INVALID"), true);
});

test("PI-T05 rejects repository evidence outside the approved source boundary", () => {
  const result = validateInventoryReferences(evidence, findings, { repository_roots: ["src"], external_systems: [], exclusions: [] });
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics.some((entry) => entry.code === "PI_EVIDENCE_SOURCE_DISALLOWED"), true);
});
