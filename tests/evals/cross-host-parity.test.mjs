import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { validateInventoryReferences } from "../../plugin/skills/project-inventory/scripts/lib/validator/inventory-validator.mjs";
import { deriveEpistemicState } from "../../plugin/skills/project-inventory/scripts/lib/validator/epistemic-state.mjs";
import { questionRequirements } from "../../plugin/skills/project-inventory/scripts/lib/validator/question-requirements.mjs";
import { scope, intake, evidence, findings } from "../helpers/fixtures.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const expectation = JSON.parse(readFileSync(join(repoRoot, "evals", "expectations", "cross-host-semantics.json"), "utf8"));

test("PI-T14 Codex, Claude and OpenCode normalize to identical domain semantics", () => {
  const validation = validateInventoryReferences(evidence, findings, scope.source_boundary);
  const rendered = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  const evidenceById = new Map(evidence.entries.map((entry) => [entry.evidence_id, entry]));
  const questions = questionRequirements({ approvedScope: scope, document: intake });
  const domain = {
    schema_version: "1",
    valid: validation.valid,
    status: validation.status,
    diagnostic_codes: validation.diagnostics.map((item) => item.code),
    statement_classes: findings.statements.map((item) => item.class),
    support_states: findings.statements.map((item) => item.support_state),
    epistemic_states: findings.statements.map((item) => deriveEpistemicState(item, evidenceById).state),
    question_requirement_sources: questions.questions.map((item) => item.required_by),
    blocker_codes: validation.blockers.map((item) => item.code),
    retained_state_ids: validation.retained_valid_state,
    next_recovery_action_code: validation.next_recovery_action_code,
    report_digest: rendered.index.report_digest,
  };
  const hostResults = Object.fromEntries(expectation.hosts.map((host) => [host, { host, skill_name: "project-inventory", ...domain }]));
  const normalize = (value) => Object.fromEntries(expectation.normalized_fields.map((field) => [field, value[field]]));
  assert.deepEqual(normalize(hostResults.codex), normalize(hostResults.claude));
  assert.deepEqual(normalize(hostResults.codex), normalize(hostResults.opencode));
});
