import assert from "node:assert/strict";
import test from "node:test";
import { deriveEpistemicState } from "../../plugin/skills/project-inventory/scripts/lib/validator/epistemic-state.mjs";
import { clone, evidence, findings } from "../helpers/fixtures.mjs";

function evidenceMap(register) {
  return new Map(register.entries.map((entry) => [entry.evidence_id, entry]));
}

test("PI-R2-T05 keeps the four critical epistemic states distinct", () => {
  const register = clone(evidence);
  register.entries.push({
    evidence_id: "ev-denied-001",
    source_type: "command_output",
    locator: "production status",
    captured_at: "2026-08-21T12:10:00.000Z",
    lane: "runtime",
    reach: "Records only the access attempt.",
    limitation: "No runtime content was obtained.",
    confidentiality: "internal",
    access_state: "inaccessible",
    access_attempt: { attempted_at: "2026-08-21T12:10:00.000Z", outcome: "denied", detail: "Permission was not granted." },
  });
  register.entries.push({ ...clone(register.entries[0]), evidence_id: "ev-repo-002", locator: "README.md", content_digest: `sha256:${"b".repeat(64)}` });
  const byId = evidenceMap(register);
  const notChecked = { ...clone(findings.statements[2]), unknown_reason: "not_checked" };
  const inaccessible = { ...clone(notChecked), statement_id: "unk-002", unknown_reason: "inaccessible", evidence_refs: ["ev-denied-001"] };
  const absence = { ...clone(findings.statements[0]), statement_id: "obs-absence-001", claim_type: "absence", evidence_refs: ["ev-repo-001"] };
  const conflict = { ...clone(findings.statements[0]), statement_id: "obs-conflict-001", support_state: "conflicting", evidence_refs: ["ev-repo-001", "ev-repo-002"] };
  assert.equal(deriveEpistemicState(notChecked, byId).state, "not_checked");
  assert.equal(deriveEpistemicState(inaccessible, byId).state, "inaccessible");
  assert.equal(deriveEpistemicState(absence, byId).state, "evidence_of_absence");
  assert.equal(deriveEpistemicState(conflict, byId).state, "conflicting");
});

test("PI-R2-T05 inaccessible evidence cannot substantively support an observation", () => {
  const inaccessibleEvidence = {
    ...clone(evidence),
    entries: [{ ...clone(evidence.entries[0]), access_state: "inaccessible", access_attempt: { attempted_at: "2026-08-21T12:10:00.000Z", outcome: "denied", detail: "Denied." } }],
  };
  delete inaccessibleEvidence.entries[0].content_digest;
  const result = deriveEpistemicState(findings.statements[0], evidenceMap(inaccessibleEvidence));
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics[0].code, "PI_INACCESSIBLE_EVIDENCE_SUPPORT");
});

test("PI-R2-T05 inaccessible evidence cannot collapse into insufficient evidence", () => {
  const inaccessibleEvidence = {
    ...clone(evidence),
    entries: [{ ...clone(evidence.entries[1]), access_state: "inaccessible", access_attempt: { attempted_at: "2026-08-21T12:10:00.000Z", outcome: "denied", detail: "Denied." } }],
  };
  const statement = { ...clone(findings.statements[2]), unknown_reason: "insufficient_evidence", evidence_refs: ["ev-runtime-001"] };
  const result = deriveEpistemicState(statement, evidenceMap(inaccessibleEvidence));
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics[0].code, "PI_EPISTEMIC_STATE_COLLAPSED");
});
