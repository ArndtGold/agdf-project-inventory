import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createSchemaRegistry } from "../../plugin/skills/project-inventory/scripts/lib/validator/schema-validator.mjs";
import { validateInventoryRunArtifacts } from "../../plugin/skills/project-inventory/scripts/lib/validator/index.mjs";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { renderManagementView } from "../../plugin/skills/project-inventory/scripts/lib/renderers/management-view.mjs";
import { canonicalJson, sha256 } from "../../plugin/skills/project-inventory/scripts/lib/shared/data.mjs";
import { inventoryRun, scope, intake, evidence, findings, clone } from "../helpers/fixtures.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const registry = createSchemaRegistry(join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas"));

test("PI-R2-T09 validates both report indexes against one authority context", () => {
  const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  const management = renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["obs-001"] });
  const authorityContext = {
    schema_version: "1",
    validator: { id: "agdf", version: "0.13.5", compatibility: "confirmed" },
    selected_run: { run_id: "agdf-run-001", revision_id: "22222222-2222-4222-8222-222222222222" },
    scope: { scope_id: "scope-001", scope_ref: inventoryRun.authority_context_ref, approval_ref: ".agdf/control/artefacts/demo/UR.md#project-inventory-scope", approval_gate: "UR", approval_revision_id: "11111111-1111-4111-8111-111111111111" },
    allowed_outputs: [...scope.allowed_outputs].sort(),
    requested_output: "inventory_report",
  };
  const run = { ...clone(inventoryRun), authority_context_digest: sha256(canonicalJson(authorityContext)) };
  assert.equal(validateInventoryRunArtifacts({ run, intake, evidence, findings, report: report.report, reportIndex: report.index, managementView: management.view, managementViewIndex: management.index, authorityContext, approvedScope: scope, registry }).valid, true);
});

test("PI-R2-T09 blocks a discovered pre-revision run without migrating it", () => {
  const legacy = clone(inventoryRun);
  delete legacy.authority_context_ref;
  delete legacy.authority_context_digest;
  const result = validateInventoryRunArtifacts({ run: legacy, registry });
  assert.equal(result.diagnostics[0].code, "PI_SCHEMA_REVISION_UNSUPPORTED");
});

test("PI-R2-T09 current runs cannot validate without live authority and report sources", () => {
  const result = validateInventoryRunArtifacts({ run: inventoryRun, registry });
  assert.equal(result.diagnostics.some((item) => item.code === "PI_AUTHORITY_CONTEXT_REQUIRED"), true);
  assert.equal(result.diagnostics.some((item) => item.code === "PI_APPROVED_SCOPE_REQUIRED"), true);
  assert.equal(result.diagnostics.some((item) => item.code === "PI_REPORT_EVIDENCE_MISSING"), true);
  assert.equal(result.diagnostics.some((item) => item.code === "PI_REPORT_INDEX_MISSING"), true);
});

test("PI-R2-T09 integrated run validation rejects invalid source references", () => {
  const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  const authorityContext = {
    schema_version: "1",
    validator: { id: "agdf", version: "0.13.5", compatibility: "confirmed" },
    selected_run: { run_id: "agdf-run-001", revision_id: "22222222-2222-4222-8222-222222222222" },
    scope: { scope_id: "scope-001", scope_ref: inventoryRun.authority_context_ref, approval_ref: scope.approval_ref, approval_gate: scope.approval_gate, approval_revision_id: scope.approval_revision_id },
    allowed_outputs: [...scope.allowed_outputs].sort(),
    requested_output: "inventory_report",
  };
  const run = { ...clone(inventoryRun), authority_context_digest: sha256(canonicalJson(authorityContext)) };
  const invalidFindings = clone(findings);
  invalidFindings.statements[0].evidence_refs = ["missing-evidence"];
  const result = validateInventoryRunArtifacts({ run, intake, evidence, findings: invalidFindings, report: report.report, reportIndex: report.index, authorityContext, approvedScope: scope, registry });
  assert.equal(result.diagnostics.some((item) => item.code === "PI_EVIDENCE_REFERENCE_UNKNOWN"), true);
});
