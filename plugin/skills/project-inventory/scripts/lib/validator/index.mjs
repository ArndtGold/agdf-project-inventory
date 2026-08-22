import { canonicalJson, sha256 } from "../shared/data.mjs";
import { diagnostic, validationResult } from "./diagnostics.mjs";
import { validateReportProjection } from "../renderers/report.mjs";
import { validateManagementProjection } from "../renderers/management-view.mjs";
import { validateInventoryReferences } from "./inventory-validator.mjs";

export function validateInventoryRunArtifacts({ run, intake, evidence, findings, report, reportIndex, managementView, managementViewIndex, authorityContext, approvedScope, registry, fixture = false }) {
  if (!fixture && (!run?.authority_context_ref || !run?.authority_context_digest)) {
    return validationResult([diagnostic("PI_SCHEMA_REVISION_UNSUPPORTED", "block", "INVENTORY_RUN.json", "Discovered Inventory Run predates the approved authority-context contract.", "Create a new Inventory Run from the current validator-confirmed authority context.")]);
  }
  const diagnostics = [];
  diagnostics.push(...registry.validate("inventory-run", run, "INVENTORY_RUN.json").diagnostics);
  if (!fixture && !authorityContext) diagnostics.push(diagnostic("PI_AUTHORITY_CONTEXT_REQUIRED", "block", "INVENTORY_RUN.json", "Inventory Run validation requires the current validator-confirmed authority context.", "Resolve one approved Inventory authority context and retry validation."));
  if (!fixture && !approvedScope) diagnostics.push(diagnostic("PI_APPROVED_SCOPE_REQUIRED", "block", "PROJECT_INVENTORY_SCOPE.json", "Inventory Run validation requires the scope declaration returned by the current validator-confirmed preflight.", "Resolve one approved Inventory scope through preflight and retry validation."));
  if (approvedScope) {
    diagnostics.push(...registry.validate("project-inventory-scope", approvedScope, "PROJECT_INVENTORY_SCOPE.json").diagnostics);
    if (authorityContext && !scopeMatchesAuthority(approvedScope, authorityContext)) diagnostics.push(diagnostic("PI_APPROVED_SCOPE_MISMATCH", "block", "PROJECT_INVENTORY_SCOPE.json", "Approved scope content does not match the current validator-confirmed authority context.", "Use the immutable scope declaration returned by the same successful preflight."));
  }
  if (intake) diagnostics.push(...registry.validate("assessment-intake", intake, "ASSESSMENT_INTAKE.json").diagnostics);
  if (evidence) diagnostics.push(...registry.validate("evidence-register", evidence, "EVIDENCE_REGISTER.json").diagnostics);
  if (findings) diagnostics.push(...registry.validate("findings-register", findings, "FINDINGS_AND_GAPS.json").diagnostics);
  if (evidence && findings && approvedScope) diagnostics.push(...validateInventoryReferences(evidence, findings, approvedScope.source_boundary).diagnostics);
  if (run?.artifacts?.report_index && !reportIndex) diagnostics.push(diagnostic("PI_REPORT_INDEX_MISSING", "block", "INVENTORY_REPORT.index.json", "Inventory Run declares a report index that was not supplied for validation.", "Load and validate the declared INVENTORY_REPORT.index.json."));
  if (reportIndex) diagnostics.push(...registry.validate("report-index", reportIndex, "INVENTORY_REPORT.index.json").diagnostics);
  if (managementViewIndex) diagnostics.push(...registry.validate("management-view-index", managementViewIndex, "MANAGEMENT_VIEW.index.json").diagnostics);
  if (run?.artifacts?.management_view && !managementViewIndex) diagnostics.push(diagnostic("PI_MANAGEMENT_INDEX_MISSING", "block", "MANAGEMENT_VIEW.index.json", "Inventory Run declares a management view without its required index.", "Generate and validate MANAGEMENT_VIEW.index.json from the current report index."));
  if (authorityContext) {
    if (run.agdf_run_id !== authorityContext.selected_run.run_id || run.authority_context_ref !== authorityContext.scope.scope_ref || run.authority_context_digest !== sha256(canonicalJson(authorityContext))) diagnostics.push(diagnostic("PI_AUTHORITY_CONTEXT_MISMATCH", "block", "INVENTORY_RUN.json", "Inventory Run authority reference or digest does not match the validator-confirmed context.", "Create or retry the run with the current immutable authority context."));
  }
  if (reportIndex && managementViewIndex && (managementViewIndex.source_report_id !== reportIndex.report_id || managementViewIndex.source_report_digest !== reportIndex.report_digest)) diagnostics.push(diagnostic("PI_MANAGEMENT_REPORT_STALE", "block", "MANAGEMENT_VIEW.index.json", "Management view index references a different or stale report.", "Regenerate the management projection from the current report index."));
  if (["report_ready", "complete"].includes(run?.status)) {
    if (!report || !intake || !evidence || !findings) diagnostics.push(diagnostic("PI_REPORT_EVIDENCE_MISSING", "block", "INVENTORY_REPORT.md", "Report-ready Inventory Run validation requires the report and all three source registers.", "Load the declared report, Intake, Evidence and Findings artefacts and retry."));
    else if (reportIndex) diagnostics.push(...validateReportProjection({ report, index: reportIndex, reportId: reportIndex.report_id, intake, evidence, findings }).diagnostics);
  }
  if (run?.artifacts?.management_view) {
    if (!managementView) diagnostics.push(diagnostic("PI_MANAGEMENT_VIEW_MISSING", "block", "MANAGEMENT_VIEW.md", "Inventory Run declares a management view that was not supplied for validation.", "Load and validate the declared MANAGEMENT_VIEW.md."));
    else if (report && reportIndex && managementViewIndex) diagnostics.push(...validateManagementProjection({ sourceReport: report, reportIndex, view: managementView, index: managementViewIndex }).diagnostics);
  }
  return validationResult(diagnostics);
}

function scopeMatchesAuthority(scope, context) {
  const authorityScope = context?.scope;
  return scope.scope_id === authorityScope?.scope_id
    && scope.agdf_run_id === context?.selected_run?.run_id
    && scope.approval_ref === authorityScope?.approval_ref
    && scope.approval_gate === authorityScope?.approval_gate
    && scope.approval_revision_id === authorityScope?.approval_revision_id
    && scope.allowed_outputs.includes(context?.requested_output)
    && JSON.stringify([...scope.allowed_outputs].sort()) === JSON.stringify(context?.allowed_outputs ?? []);
}
