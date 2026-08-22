import { diagnostic, validationResult } from "./diagnostics.mjs";

export function deriveEpistemicState(statement, evidenceById) {
  const refs = statement.evidence_refs ?? [];
  const evidence = refs.map((ref) => evidenceById.get(ref)).filter(Boolean);
  const diagnostics = [];
  const inaccessible = evidence.filter((entry) => entry.access_state === "inaccessible");

  if (["observation", "interpretation", "recommendation"].includes(statement.class) && inaccessible.length > 0) {
    diagnostics.push(diagnostic("PI_INACCESSIBLE_EVIDENCE_SUPPORT", "block", statement.statement_id, "Inaccessible evidence cannot substantively support a statement.", "Use obtained evidence or represent the condition as inaccessible."));
  }
  if (statement.class === "unknown" && statement.support_state === "missing" && statement.unknown_reason === "not_checked") {
    if (refs.length !== 0) diagnostics.push(diagnostic("PI_NOT_CHECKED_HAS_EVIDENCE", "block", statement.statement_id, "A not-checked state must have zero evidence references.", "Remove evidence references or choose the evidenced unknown state."));
    return finish("not_checked", diagnostics);
  }
  if (statement.class === "unknown" && statement.support_state === "missing" && statement.unknown_reason === "inaccessible") {
    if (refs.length === 0 || evidence.length !== refs.length || evidence.some((entry) => entry.access_state !== "inaccessible")) diagnostics.push(diagnostic("PI_INACCESSIBLE_STATE_INVALID", "block", statement.statement_id, "An inaccessible state requires only resolvable inaccessible access-attempt references.", "Reference one or more inaccessible evidence entries."));
    return finish("inaccessible", diagnostics);
  }
  if (statement.class === "unknown" && statement.support_state === "missing" && statement.unknown_reason === "insufficient_evidence" && inaccessible.length > 0) {
    diagnostics.push(diagnostic("PI_EPISTEMIC_STATE_COLLAPSED", "block", statement.statement_id, "Inaccessible evidence cannot be collapsed into insufficient evidence.", "Use unknown_reason inaccessible and retain only inaccessible access-attempt references."));
  }
  if (statement.class === "observation" && statement.claim_type === "absence" && statement.support_state === "supported") {
    if (refs.length === 0 || evidence.length !== refs.length || evidence.some((entry) => entry.access_state !== "obtained")) diagnostics.push(diagnostic("PI_ABSENCE_EVIDENCE_INVALID", "block", statement.statement_id, "Evidence of absence requires obtained evidence.", "Reference obtained evidence that directly supports the absence claim."));
    return finish("evidence_of_absence", diagnostics);
  }
  if (statement.support_state === "conflicting") {
    const signatures = new Set(evidence.map(evidenceSignature));
    if (new Set(refs).size < 2 || evidence.length !== refs.length || evidence.some((entry) => entry.access_state !== "obtained") || signatures.size < 2) diagnostics.push(diagnostic("PI_CONFLICT_EVIDENCE_INSUFFICIENT", "block", statement.statement_id, "Conflicting support requires at least two materially distinct obtained evidence references.", "Reference the materially conflicting obtained evidence items."));
    return finish("conflicting", diagnostics);
  }
  if (statement.support_state === "supported") return finish("supported", diagnostics);
  if (statement.support_state === "partial") return finish("partial", diagnostics);
  return finish("missing", diagnostics);
}

function finish(state, diagnostics) {
  return { ...validationResult(diagnostics), state };
}

function evidenceSignature(entry) {
  return [entry.source_type, entry.locator, entry.lane, entry.content_digest ?? entry.access_attempt?.attempted_at ?? ""].join("\0");
}
