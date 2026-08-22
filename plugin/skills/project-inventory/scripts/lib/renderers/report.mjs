import { isDeepStrictEqual } from "node:util";
import { canonicalJson, sha256 } from "../shared/data.mjs";
import { diagnostic, validationResult } from "../validator/diagnostics.mjs";
import { deriveEpistemicState } from "../validator/epistemic-state.mjs";

const sections = {
  decision_context: true,
  scope: true,
  evidence_coverage: true,
  findings: true,
  unknowns: true,
  recommendations: true,
  review_state: true,
  limitations: true,
};

export function renderInventoryReport({ reportId, intake, evidence, findings }) {
  const statements = [...findings.statements].sort((a, b) => a.statement_id.localeCompare(b.statement_id));
  const evidenceEntries = [...evidence.entries].sort((a, b) => a.evidence_id.localeCompare(b.evidence_id));
  const evidenceById = new Map(evidenceEntries.map((entry) => [entry.evidence_id, entry]));
  const diagnostics = [];
  const statementProjections = statements.map((statement) => {
    const epistemic = deriveEpistemicState(statement, evidenceById);
    diagnostics.push(...epistemic.diagnostics);
    const renderedText = renderStatement(statement, epistemic.state);
    return {
      statement_id: statement.statement_id,
      rendered_text: renderedText,
      statement_digest: sha256(renderedText),
      epistemic_state: epistemic.state,
    };
  });
  const checked = validationResult(diagnostics);
  if (!checked.valid) return { ...checked, report: null, index: null, statements, statement_projections: statementProjections };
  const projectionById = new Map(statementProjections.map((entry) => [entry.statement_id, entry]));
  const byClass = (name) => statements.filter((entry) => entry.class === name);
  const report = [
    `# Inventory Report: ${reportId}`,
    "",
    "## Decision Context",
    "",
    intake.decision,
    "",
    "## Scope And Exclusions",
    "",
    ...intake.scope.map((value) => `- Scope: ${value}`),
    ...intake.exclusions.map((value) => `- Excluded: ${value}`),
    "",
    "## Evidence Coverage",
    "",
    ...evidenceEntries.map((entry) => `- **${entry.evidence_id}** [${entry.lane}; ${entry.access_state}] ${entry.reach} — Limitation: ${entry.limitation}`),
    ...(evidenceEntries.length ? [] : ["- No evidence registered."]),
    "",
    "## Findings",
    "",
    ...renderStatements(statements.filter((entry) => ["observation", "interpretation"].includes(entry.class)), projectionById),
    "",
    "## Unknowns And Conflicts",
    "",
    ...renderStatements(statements.filter((entry) => entry.class === "unknown" || entry.support_state === "conflicting"), projectionById),
    "",
    "## Recommendations",
    "",
    ...renderStatements(byClass("recommendation"), projectionById),
    "",
    "## Review State",
    "",
    `Review owner: ${intake.review_owner}`,
    "",
    "## Limitations",
    "",
    ...evidenceEntries.map((entry) => `- ${entry.evidence_id}: ${entry.limitation}`),
    ...(evidenceEntries.length ? [] : ["- No evidence was available for assessment."]),
    "",
  ].join("\n");

  const index = {
    schema_version: "1",
    report_id: reportId,
    source_digests: {
      intake: sha256(canonicalJson(intake)),
      evidence: sha256(canonicalJson(evidence)),
      findings: sha256(canonicalJson(findings)),
    },
    included_statement_ids: statements.map((entry) => entry.statement_id),
    statement_projections: statementProjections,
    sections,
    report_digest: sha256(report),
  };
  return { ...checked, report, index, statements, statement_projections: statementProjections };
}

export function validateReportProjection({ report, index, reportId, intake, evidence, findings }) {
  const expected = renderInventoryReport({ reportId, intake, evidence, findings });
  if (!expected.valid) return expected;
  const diagnostics = [];
  if (report !== expected.report) diagnostics.push(diagnostic("PI_REPORT_TEXT_MISMATCH", "block", "INVENTORY_REPORT.md", "Inventory Report bytes do not match the validated source registers.", "Regenerate the report from the current Intake, Evidence and Findings registers."));
  if (!isDeepStrictEqual(index, expected.index)) diagnostics.push(diagnostic("PI_REPORT_INDEX_INVALID", "block", "INVENTORY_REPORT.index.json", "Report index does not match the current source registers and rendered report.", "Regenerate the report and index together from the validated source registers."));
  return validationResult(diagnostics);
}

function renderStatements(statements, projectionById) {
  if (statements.length === 0) return ["- None recorded."];
  return statements.map((entry) => projectionById.get(entry.statement_id).rendered_text);
}

function renderStatement(entry, epistemicState) {
  return `- **${entry.statement_id}** [${entry.class}; ${entry.support_state}; ${epistemicState}] ${entry.text} (evidence: ${entry.evidence_refs.join(", ") || "none"})`;
}
