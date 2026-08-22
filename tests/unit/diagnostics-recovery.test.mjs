import assert from "node:assert/strict";
import test from "node:test";
import { diagnostic, validationResult } from "../../plugin/skills/project-inventory/scripts/lib/validator/diagnostics.mjs";

test("PI-R2-T08 shows every blocker, retained state and exactly one deterministic recovery action", () => {
  const diagnostics = [
    diagnostic("PI_MANAGEMENT_PARAPHRASE", "block", "projection/view", "Changed text.", "Regenerate the exact projection."),
    diagnostic("PI_EVIDENCE_REFERENCE_UNKNOWN", "block", "evidence/ref", "Unknown ref.", "Correct the evidence reference."),
    diagnostic("PI_SCOPE_RESOLUTION_MISSING", "block", "scope", "Missing scope.", "Link one approved scope."),
  ];
  const first = validationResult(diagnostics, { retainedValidState: ["report-001", "evidence-register-001"] });
  const second = validationResult([...diagnostics].reverse(), { retainedValidState: ["report-001", "evidence-register-001"] });
  assert.equal(first.blockers.length, 3);
  assert.deepEqual(first.blockers, second.blockers);
  assert.deepEqual(first.retained_valid_state, ["evidence-register-001", "report-001"]);
  assert.equal(first.next_recovery_action, "Link one approved scope.");
  assert.equal(first.next_recovery_action_code, "PI_SCOPE_RESOLUTION_MISSING");
});
