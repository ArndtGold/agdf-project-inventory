export function diagnostic(code, severity, path, message, next_action) {
  return { code, severity, path, message, next_action };
}

const phaseOrder = ["authority", "scope", "schema", "intake", "evidence", "findings", "report", "projection", "lifecycle"];

export function validationResult(diagnostics = [], { retainedValidState = [] } = {}) {
  const rank = { block: 3, revise: 2, warn: 1 };
  const status = diagnostics.length === 0
    ? "pass"
    : diagnostics.reduce((current, item) => rank[item.severity] > rank[current] ? item.severity : current, "warn");
  const blockers = diagnostics
    .filter((item) => item.severity === "block" || item.severity === "revise")
    .sort(compareDiagnostics);
  const retained_valid_state = [...new Set(retainedValidState)].sort();
  return {
    valid: blockers.length === 0,
    status,
    diagnostics,
    blockers,
    retained_valid_state,
    next_recovery_action: blockers[0]?.next_action ?? null,
    next_recovery_action_code: blockers[0]?.code ?? null,
  };
}

export function deriveRetainedValidState(candidates = []) {
  return candidates
    .filter((candidate) => candidate?.artifact_id && candidate.schema_valid === true && candidate.digest_valid === true && candidate.references_valid === true)
    .map((candidate) => candidate.artifact_id)
    .sort();
}

function compareDiagnostics(left, right) {
  const phase = phaseRank(left) - phaseRank(right);
  if (phase !== 0) return phase;
  const severity = severityRank(left.severity) - severityRank(right.severity);
  if (severity !== 0) return severity;
  const code = String(left.code).localeCompare(String(right.code));
  return code || String(left.path).localeCompare(String(right.path));
}

function phaseRank(item) {
  return phaseOrder.indexOf(inferPhase(item));
}

function inferPhase(item) {
  const code = String(item.code ?? "");
  const path = String(item.path ?? "");
  if (/^PI_AGDF_|AUTHORITY/i.test(code) || /agdf_preflight|validator/i.test(path)) return "authority";
  if (/^PI_SCOPE_/i.test(code) || /scope/i.test(path)) return "scope";
  if (/^PI_SCHEMA_/i.test(code)) return "schema";
  if (/^PI_INTAKE_/i.test(code) || /ASSESSMENT_INTAKE/i.test(path)) return "intake";
  if (/^PI_EVIDENCE_(?:ID|PATH|SOURCE|REFERENCE)/i.test(code) || /evidence/i.test(path)) return "evidence";
  if (/^PI_(?:STATEMENT|SUPPORT|CONFLICT|INACCESSIBLE|UNKNOWN|EPISTEMIC|EVIDENCE_LANE)/i.test(code) || /finding|statement/i.test(path)) return "findings";
  if (/^PI_(?:MANAGEMENT|PROJECTION)/i.test(code) || /projection|management/i.test(path)) return "projection";
  if (/^PI_REPORT_/i.test(code) || /report/i.test(path)) return "report";
  return "lifecycle";
}

function severityRank(severity) {
  return severity === "block" ? 0 : severity === "revise" ? 1 : 2;
}
