import { isDeepStrictEqual } from "node:util";
import { sha256 } from "../shared/data.mjs";
import { diagnostic, validationResult } from "../validator/diagnostics.mjs";

export function renderManagementView({ sourceReport, reportIndex, includedIds }) {
  const diagnostics = validateSourceReport(sourceReport, reportIndex);
  const projections = reportIndex?.statement_projections ?? [];
  const byId = new Map(projections.map((entry) => [entry.statement_id, entry]));
  if (new Set(includedIds).size !== includedIds.length) diagnostics.push(diagnostic("PI_MANAGEMENT_SELECTION_DUPLICATE", "block", "management.selected_statement_ids", "Management view selection contains duplicate statement IDs.", "Select every source statement at most once."));
  const selected = [];
  for (const id of includedIds) {
    const statement = byId.get(id);
    if (!statement) diagnostics.push(diagnostic("PI_MANAGEMENT_SOURCE_UNKNOWN", "block", id, "Management view references an unknown report statement.", "Select an existing report statement ID."));
    else selected.push(statement);
  }
  if (diagnostics.length) return { ...validationResult(diagnostics), view: null, index: null, selected: [], omitted: [] };

  const omitted = projections.map((entry) => entry.statement_id).filter((id) => !includedIds.includes(id));
  const view = renderView(reportIndex, selected, omitted);
  const index = {
    schema_version: "1",
    source_report_id: reportIndex.report_id,
    source_report_digest: reportIndex.report_digest,
    selected_statement_ids: selected.map((entry) => entry.statement_id),
    selected_statement_digests: selected.map((entry) => ({ statement_id: entry.statement_id, statement_digest: entry.statement_digest })),
    omitted_statement_ids: omitted,
    management_view_digest: sha256(view),
  };
  return { ...validationResult(), view, index, selected, omitted };
}

export function validateManagementProjection({ sourceReport, reportIndex, view, index }) {
  const sourceDiagnostics = validateSourceReport(sourceReport, reportIndex);
  if (sourceDiagnostics.length) return validationResult(sourceDiagnostics);
  const expected = renderManagementView({ sourceReport, reportIndex, includedIds: index?.selected_statement_ids ?? [] });
  if (!expected.valid) return expected;
  const diagnostics = [];
  if (view !== expected.view) diagnostics.push(diagnostic("PI_MANAGEMENT_PARAPHRASE", "block", "management_view", "Management view bytes differ from the exact source statement projection.", "Regenerate the management view from the report index without paraphrase, merge or added assessment."));
  if (!isDeepStrictEqual(index, expected.index)) diagnostics.push(diagnostic("PI_MANAGEMENT_INDEX_INVALID", "block", "management_view_index", "Management view index does not match the source report projection.", "Regenerate the management view index from the current report index."));
  return validationResult(diagnostics);
}

function validateSourceReport(sourceReport, reportIndex) {
  if (!reportIndex || sha256(sourceReport ?? "") !== reportIndex.report_digest) return [diagnostic("PI_MANAGEMENT_REPORT_STALE", "block", "source_report_digest", "Source report bytes do not match the report index digest.", "Use the current validated Inventory Report and index.")];
  return [];
}

function renderView(reportIndex, selected, omitted) {
  return [
    `# Management View: ${reportIndex.report_id}`,
    "",
    `Source report: ${reportIndex.report_id} (${reportIndex.report_digest})`,
    "",
    "## Selected Statements",
    "",
    ...selected.map((entry) => entry.rendered_text),
    ...(selected.length ? [] : ["- No statements selected."]),
    "",
    "## Omitted Detail",
    "",
    omitted.length ? omitted.join(", ") : "None",
    "",
  ].join("\n");
}
