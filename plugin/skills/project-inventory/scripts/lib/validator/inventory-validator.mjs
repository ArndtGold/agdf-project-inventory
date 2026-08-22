import { diagnostic, validationResult } from "./diagnostics.mjs";
import { normalizedRepositoryPath } from "./path-boundary.mjs";
import { deriveEpistemicState } from "./epistemic-state.mjs";

export function validateInventoryReferences(evidenceRegister, findingsRegister, sourceBoundary) {
  const diagnostics = [];
  const repositoryRoots = (sourceBoundary?.repository_roots ?? []).map(normalizedRepositoryPath).filter(Boolean);
  if (!sourceBoundary) {
    diagnostics.push(diagnostic("PI_SOURCE_BOUNDARY_MISSING", "block", "source_boundary", "Evidence validation requires the approved source boundary.", "Pass the validated source boundary from the approved Project Inventory scope."));
  }
  const evidenceById = uniqueIndex(evidenceRegister.entries ?? [], "evidence_id", "PI_EVIDENCE_ID_DUPLICATE", diagnostics);
  uniqueIndex(findingsRegister.statements ?? [], "statement_id", "PI_STATEMENT_ID_DUPLICATE", diagnostics);

  for (const entry of evidenceRegister.entries ?? []) {
    if (entry.source_type === "repository_file") {
      const locator = normalizedRepositoryPath(entry.locator);
      if (!locator) {
        diagnostics.push(diagnostic("PI_EVIDENCE_PATH_INVALID", "block", entry.evidence_id, "Repository evidence locator must be a normalized repository-relative path.", "Use a normalized path inside the approved repository boundary."));
      } else if (!repositoryRoots.some((root) => root === "." || locator === root || locator.startsWith(`${root}/`))) {
        diagnostics.push(diagnostic("PI_EVIDENCE_SOURCE_DISALLOWED", "block", entry.evidence_id, "Repository evidence locator is outside the approved source boundary.", "Use evidence from an approved repository root or revise the AGDF-approved scope."));
      }
    }
    if (entry.source_type === "external_record" && (sourceBoundary?.external_systems ?? []).length === 0) {
      diagnostics.push(diagnostic("PI_EVIDENCE_SOURCE_DISALLOWED", "block", entry.evidence_id, "External evidence is not allowed by the approved source boundary.", "Add the external system through the AGDF-approved scope before collecting its evidence."));
    }
  }

  for (const statement of findingsRegister.statements ?? []) {
    const refs = statement.evidence_refs ?? [];
    if (["supported", "partial"].includes(statement.support_state) && refs.length === 0) {
      diagnostics.push(diagnostic("PI_SUPPORT_WITHOUT_EVIDENCE", "block", statement.statement_id, "Supported or partial statements require evidence references.", "Add resolvable evidence or lower the support state."));
    }
    for (const ref of refs) {
      if (!evidenceById.has(ref)) diagnostics.push(diagnostic("PI_EVIDENCE_REFERENCE_UNKNOWN", "block", statement.statement_id, `Unknown evidence reference: ${ref}`, "Reference an existing evidence identifier."));
    }
    const lanes = refs.map((ref) => evidenceById.get(ref)?.lane).filter(Boolean);
    diagnostics.push(...deriveEpistemicState(statement, evidenceById).diagnostics);
    if (statement.claim_lane !== "repository" && ["supported", "partial"].includes(statement.support_state) && !lanes.includes(statement.claim_lane)) {
      diagnostics.push(diagnostic("PI_EVIDENCE_LANE_OVERCLAIM", "block", statement.statement_id, `A ${statement.claim_lane} claim lacks evidence from that lane.`, "Add evidence from the claimed lane or classify the statement as unknown or missing."));
    }
  }
  return validationResult(diagnostics);
}

function uniqueIndex(items, key, code, diagnostics) {
  const index = new Map();
  for (const item of items) {
    const id = item[key];
    if (index.has(id)) diagnostics.push(diagnostic(code, "block", id, `Duplicate identifier: ${id}`, "Use a unique stable identifier."));
    else index.set(id, item);
  }
  return index;
}
