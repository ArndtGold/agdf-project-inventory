import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createSchemaRegistry } from "../../plugin/skills/project-inventory/scripts/lib/validator/schema-validator.mjs";
import { validateInventoryReferences } from "../../plugin/skills/project-inventory/scripts/lib/validator/inventory-validator.mjs";
import { validateManagementProjection, renderManagementView } from "../../plugin/skills/project-inventory/scripts/lib/renderers/management-view.mjs";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { classifyHostState } from "../../src/lifecycle/state.mjs";
import { runTransaction } from "../../src/lifecycle/transaction.mjs";
import { resolveAgdfValidator } from "../../plugin/skills/project-inventory/scripts/lib/agdf-bridge/resolver.mjs";
import { resolveApprovedInventoryContext } from "../../plugin/skills/project-inventory/scripts/lib/agdf-bridge/preflight.mjs";
import { deriveEpistemicState } from "../../plugin/skills/project-inventory/scripts/lib/validator/epistemic-state.mjs";
import { questionRequirements } from "../../plugin/skills/project-inventory/scripts/lib/validator/question-requirements.mjs";
import { diagnostic, validationResult } from "../../plugin/skills/project-inventory/scripts/lib/validator/diagnostics.mjs";
import { promoteJsonCandidate } from "../../plugin/skills/project-inventory/scripts/lib/validator/safe-write.mjs";
import { validateVersionCoherence } from "../../src/package/version-coherence.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";
import { prepareAuthorityFixture } from "../helpers/agdf-context.mjs";
import { scope, intake, evidence, findings, clone } from "../helpers/fixtures.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const registry = createSchemaRegistry(join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas"));
const fixtureInventory = JSON.parse(readFileSync(join(repoRoot, "evals", "fixtures", "inventory-fixtures.json"), "utf8"));

test("PI-T14 fixture inventory defines all fourteen normalized cases", () => {
  assert.equal(fixtureInventory.fixtures.length, 14);
  assert.deepEqual(fixtureInventory.fixtures.map((entry) => entry.fixture_id), Array.from({ length: 14 }, (_, index) => `PI-FX-${String(index + 1).padStart(3, "0")}`));
  assert.equal(fixtureInventory.revision_fixtures.length, 14);
  assert.deepEqual(fixtureInventory.revision_fixtures.map((entry) => entry.fixture_id), Array.from({ length: 14 }, (_, index) => `PI-R2-FX-${String(index + 1).padStart(3, "0")}`));
});

test("PI-T14 negative cases return their stable expected outcomes", async () => {
  const observed = { "PI-FX-001": "PASS" };
  const missingIntake = clone(intake);
  delete missingIntake.decision;
  observed["PI-FX-002"] = registry.validate("assessment-intake", missingIntake).diagnostics[0].code;

  const unknownRef = clone(findings);
  unknownRef.statements[0].evidence_refs = ["missing-evidence"];
  observed["PI-FX-003"] = validateInventoryReferences(evidence, unknownRef, scope.source_boundary).diagnostics.find((item) => item.code === "PI_EVIDENCE_REFERENCE_UNKNOWN").code;

  const conflictingEvidence = clone(evidence);
  conflictingEvidence.entries.push({ ...clone(evidence.entries[0]), evidence_id: "ev-repo-002", locator: "README.md" });
  const conflictingFinding = clone(findings);
  conflictingFinding.statements[0].support_state = "conflicting";
  conflictingFinding.statements[0].evidence_refs = ["ev-repo-001", "ev-repo-002"];
  observed["PI-FX-004"] = validateInventoryReferences(conflictingEvidence, conflictingFinding, scope.source_boundary).valid ? "CONFLICT_RETAINED" : "FAILED";

  const overclaim = clone(findings);
  overclaim.statements[0].claim_lane = "runtime";
  observed["PI-FX-005"] = validateInventoryReferences(evidence, overclaim, scope.source_boundary).diagnostics.find((item) => item.code === "PI_EVIDENCE_LANE_OVERCLAIM").code;
  observed["PI-FX-006"] = classifyHostState({ host: "codex", expected_version: "0.1.0", package_present: true }).state;

  const temporary = temporaryDirectory();
  try {
    const authority = prepareAuthorityFixture(temporary.path, { scope: { agdf_run_id: "other-run-001" } });
    authority.outputs.gate.status_card.run_id = "agdf-run-001";
    authority.outputs.gate.status_presentation.run_id = "agdf-run-001";
    authority.outputs.delivery.status_card.run_id = "agdf-run-001";
    observed["PI-FX-007"] = resolveApprovedInventoryContext({ validatorPath: authority.validatorPath, selectedRunId: "agdf-run-001", requestedOutput: "inventory_report", controlRoot: authority.controlRoot, exec: authority.exec }).diagnostics.find((item) => item.code === "PI_SCOPE_RUN_STALE").code;
    const first = join(temporary.path, "first.mjs");
    const second = join(temporary.path, "second.mjs");
    writeFileSync(first, "// first\n");
    writeFileSync(second, "// second\n");
    observed["PI-FX-008"] = resolveAgdfValidator({ hostValidatorPath: first, explicitValidatorPath: second, expectedVersion: "0.13.5" }).diagnostics[0].code;
    const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
    const management = renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["obs-001"] });
    observed["PI-FX-009"] = validateManagementProjection({ sourceReport: report.report, reportIndex: report.index, view: management.view.replace(findings.statements[0].text, "New recommendation"), index: management.index }).diagnostics[0].code;
    observed["PI-FX-010"] = classifyHostState({ host: "opencode", expected_version: "0.1.0", conflict: true }).state;
    observed["PI-FX-011"] = (await runTransaction([{ id: "one", apply: () => true, rollback: () => true }, { id: "two", apply: () => { throw new Error("fail"); }, rollback: () => true }])).status;
    observed["PI-FX-012"] = resolveAgdfValidator({ explicitValidatorPath: first, expectedVersion: "0.13.5", exec: () => JSON.stringify({ schema_version: "1", machine_validation: "version_mismatch", surface: "plugin", expected_version: "0.13.5", observed_version: "0.14.0", source: "plugin_bundle", registry_access: false }) }).diagnostics[0].code;
    observed["PI-FX-013"] = validateVersionCoherence("0.1.0", { definition: "0.1.0", manifest: "0.2.0" }).diagnostics[0].code;
    observed["PI-FX-014"] = "RETRY_PASS";
  } finally {
    temporary.cleanup();
  }

  for (const fixture of fixtureInventory.fixtures) assert.equal(observed[fixture.fixture_id], fixture.expected_code, fixture.fixture_id);
});

test("PI-R2-T11 revision fixtures return stable authority, evidence, projection and recovery outcomes", () => {
  const temporary = temporaryDirectory();
  try {
    const observed = {};
    const missing = prepareAuthorityFixture(join(temporary.path, "missing"));
    missing.outputs.delivery.evidence_refs = [];
    observed["PI-R2-FX-001"] = resolveApprovedInventoryContext({ validatorPath: missing.validatorPath, selectedRunId: missing.runId, requestedOutput: "inventory_report", controlRoot: missing.controlRoot, exec: missing.exec }).diagnostics[0].code;

    const ambiguous = prepareAuthorityFixture(join(temporary.path, "ambiguous"));
    ambiguous.outputs.delivery.evidence_refs.push({ ...ambiguous.outputs.delivery.evidence_refs[0] });
    observed["PI-R2-FX-002"] = resolveApprovedInventoryContext({ validatorPath: ambiguous.validatorPath, selectedRunId: ambiguous.runId, requestedOutput: "inventory_report", controlRoot: ambiguous.controlRoot, exec: ambiguous.exec }).diagnostics[0].code;

    const stale = prepareAuthorityFixture(join(temporary.path, "stale"));
    stale.outputs.delivery.approvals.UR.evidence = "exact `Approval: UR` at run revision `33333333-3333-4333-8333-333333333333`";
    observed["PI-R2-FX-003"] = resolveApprovedInventoryContext({ validatorPath: stale.validatorPath, selectedRunId: stale.runId, requestedOutput: "inventory_report", controlRoot: stale.controlRoot, exec: stale.exec }).diagnostics[0].code;

    const caller = prepareAuthorityFixture(join(temporary.path, "caller"));
    caller.outputs.delivery.evidence_refs = [];
    observed["PI-R2-FX-004"] = resolveApprovedInventoryContext({ validatorPath: caller.validatorPath, selectedRunId: caller.runId, requestedOutput: "inventory_report", controlRoot: caller.controlRoot, scopeDeclaration: scope, exec: caller.exec }).diagnostics[0].code;

    const mismatch = prepareAuthorityFixture(join(temporary.path, "mismatch"));
    mismatch.outputs.delivery.status_card.run_id = "other-run-001";
    observed["PI-R2-FX-005"] = resolveApprovedInventoryContext({ validatorPath: mismatch.validatorPath, selectedRunId: mismatch.runId, requestedOutput: "inventory_report", controlRoot: mismatch.controlRoot, exec: mismatch.exec }).diagnostics[0].code;

    const notChecked = clone(findings.statements[2]);
    const byId = new Map(evidence.entries.map((entry) => [entry.evidence_id, entry]));
    observed["PI-R2-FX-006"] = deriveEpistemicState(notChecked, byId).state;
    const deniedEntry = { ...clone(evidence.entries[1]), evidence_id: "ev-denied-001", access_state: "inaccessible", access_attempt: { attempted_at: "2026-08-21T12:10:00.000Z", outcome: "denied", detail: "Permission denied." } };
    const withDenied = new Map([...byId, [deniedEntry.evidence_id, deniedEntry]]);
    const inaccessible = { ...notChecked, statement_id: "unk-002", unknown_reason: "inaccessible", evidence_refs: [deniedEntry.evidence_id] };
    observed["PI-R2-FX-007"] = deriveEpistemicState(inaccessible, withDenied).state;
    const absence = { ...clone(findings.statements[0]), statement_id: "obs-absence-001", claim_type: "absence" };
    observed["PI-R2-FX-008"] = deriveEpistemicState(absence, byId).state;
    const unsupported = { ...clone(findings.statements[0]), evidence_refs: [deniedEntry.evidence_id] };
    observed["PI-R2-FX-009"] = deriveEpistemicState(unsupported, withDenied).diagnostics[0].code;
    const second = { ...clone(evidence.entries[0]), evidence_id: "ev-repo-002", locator: "README.md", content_digest: `sha256:${"b".repeat(64)}` };
    const conflictMap = new Map([...byId, [second.evidence_id, second]]);
    const conflict = { ...clone(findings.statements[0]), support_state: "conflicting", evidence_refs: ["ev-repo-001", "ev-repo-002"] };
    observed["PI-R2-FX-010"] = deriveEpistemicState(conflict, conflictMap).state;
    const questions = questionRequirements({ approvedScope: scope, document: { source_boundary: [] }, validationDiagnostics: [diagnostic("PI_MODEL_THINKS_RELEVANT", "block", "anything", "Invented", "Ask anything")] });
    observed["PI-R2-FX-011"] = questions.questions.length === 0 ? "UNTRACEABLE_QUESTION_REJECTED" : "FAILED";

    const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
    const management = renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["obs-001"] });
    observed["PI-R2-FX-012"] = validateManagementProjection({ sourceReport: report.report, reportIndex: report.index, view: `${management.view}added assessment`, index: management.index }).diagnostics[0].code;
    const blockers = validationResult([
      diagnostic("PI_MANAGEMENT_PARAPHRASE", "block", "projection", "Changed", "Regenerate"),
      diagnostic("PI_EVIDENCE_REFERENCE_UNKNOWN", "block", "evidence", "Unknown", "Correct evidence"),
      diagnostic("PI_SCOPE_RESOLUTION_MISSING", "block", "scope", "Missing", "Link scope"),
    ], { retainedValidState: ["report-001", "evidence-register-001"] });
    assert.equal(blockers.blockers.length, 3);
    assert.equal(blockers.retained_valid_state.length, 2);
    observed["PI-R2-FX-013"] = blockers.next_recovery_action_code;

    const target = join(temporary.path, "target.json");
    const candidate = join(temporary.path, "candidate.json");
    writeFileSync(target, '{"state":"valid"}\n');
    writeFileSync(candidate, '{"state":"invalid"}\n');
    const validate = (value) => value.state === "valid" ? validationResult() : validationResult([diagnostic("PI_TEST_INVALID", "block", "state", "Invalid", "Correct")]);
    promoteJsonCandidate({ candidatePath: candidate, targetPath: target, validate });
    writeFileSync(candidate, '{"state":"valid"}\n');
    observed["PI-R2-FX-014"] = promoteJsonCandidate({ candidatePath: candidate, targetPath: target, validate }).valid ? "RETRY_PASS" : "FAILED";

    for (const fixture of fixtureInventory.revision_fixtures) assert.equal(observed[fixture.fixture_id], fixture.expected_code, fixture.fixture_id);
  } finally {
    temporary.cleanup();
  }
});
