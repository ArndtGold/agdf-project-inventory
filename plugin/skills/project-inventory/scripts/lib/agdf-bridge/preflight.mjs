import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { directoryDigest } from "../shared/data.mjs";
import { diagnostic, validationResult } from "../validator/diagnostics.mjs";
import { normalizedRepositoryPath, pathWithinRoot } from "../validator/path-boundary.mjs";
import { createSchemaRegistry } from "../validator/schema-validator.mjs";
import { SUPPORTED_AGDF_VERSION } from "../shared/config.mjs";
import { authorityContext } from "./authority-context.mjs";
import { deepFreeze } from "./authority-context.mjs";
import { resolveAgdfValidator, validatorInvocation } from "./resolver.mjs";

const schemaRoot = fileURLToPath(new URL("../../../assets/schemas", import.meta.url));

export function resolveApprovedInventoryContext({ validatorPath, selectedRunId, requestedOutput, controlRoot, exec = execFileSync }) {
  if (!selectedRunId) return failed("PI_AGDF_RUN_MISSING", "agdf_run", "No selected AGDF run was supplied.", "Select exactly one AGDF run.");
  if (!requestedOutput) return failed("PI_SCOPE_OUTPUT_DISALLOWED", "requested_output", "No requested Inventory output was supplied.", "Request one output allowed by the approved Project Inventory scope.");

  const expectedVersion = SUPPORTED_AGDF_VERSION;
  const resolvedValidator = resolveAgdfValidator({ explicitValidatorPath: validatorPath, expectedVersion, exec });
  if (!resolvedValidator.valid) return { ...resolvedValidator, authority_context: null, approved_scope: null, evidence: [] };

  let before;
  try {
    before = directoryDigest(controlRoot);
  } catch (error) {
    return failed("PI_AGDF_CONTROL_UNSAFE", controlRoot, error.message, "Remove symbolic links or unreadable entries from AGDF control state and retry.");
  }
  const calls = [
    ["doctor", "--json"],
    ["gate-check", "--run", selectedRunId, "--json"],
    ["delivery-map", "--run", selectedRunId, "--json"],
  ];
  const evidence = [];
  const diagnostics = [];
  for (const args of calls) {
    try {
      const invocation = validatorInvocation(resolvedValidator.validator.path, args);
      const output = exec(invocation.executable, invocation.args, { encoding: "utf8", stdio: "pipe" });
      const value = JSON.parse(output);
      evidence.push({ command: args[0], args: [...args], result: value });
    } catch (error) {
      diagnostics.push(diagnostic("PI_AGDF_PREFLIGHT_FAILED", "block", "agdf_preflight", commandError(error), "Resolve the AGDF blocker and retry without writing Inventory artefacts."));
      break;
    }
  }

  const doctor = resultFor(evidence, "doctor");
  const gate = resultFor(evidence, "gate-check");
  const deliveryMap = resultFor(evidence, "delivery-map");
  if (diagnostics.length === 0) diagnostics.push(...validateMachineResults({ doctor, gate, deliveryMap, selectedRunId, controlRoot }));

  let scopeRef;
  let scope;
  if (diagnostics.length === 0) {
    const resolvedScope = resolveScopeReference(deliveryMap);
    diagnostics.push(...resolvedScope.diagnostics);
    scopeRef = resolvedScope.scopeRef;
  }
  if (diagnostics.length === 0) {
    try {
      const projectRoot = resolve(controlRoot, "../..");
      const scopePath = resolve(projectRoot, scopeRef);
      const realControlRoot = realpathSync(controlRoot);
      const realScopePath = realpathSync(scopePath);
      if (!pathWithinRoot(realControlRoot, realScopePath) || !statSync(realScopePath).isFile()) throw new ScopeBoundaryError();
      scope = JSON.parse(readFileSync(realScopePath, "utf8"));
      const schemaResult = createSchemaRegistry(schemaRoot).validate("project-inventory-scope", scope, scopeRef);
      diagnostics.push(...schemaResult.diagnostics);
    } catch (error) {
      const boundary = error instanceof ScopeBoundaryError;
      diagnostics.push(diagnostic(boundary ? "PI_SCOPE_REFERENCE_INVALID" : "PI_SCOPE_READ_FAILED", "block", scopeRef, boundary ? "Project Inventory Scope resolves outside the AGDF control boundary." : error.message, boundary ? "Replace the scope reference with one regular file inside .agdf/control/." : "Restore the validator-linked scope artefact and retry."));
    }
  }

  const revisionId = selectedRevisionId(gate);
  if (diagnostics.length === 0) {
    if (scope.agdf_run_id !== selectedRunId) diagnostics.push(diagnostic("PI_SCOPE_RUN_STALE", "block", "scope.agdf_run_id", "Scope declaration does not reference the selected run.", "Use the approved scope for the selected run."));
    const approvalDiagnostic = validateScopeApproval(scope, deliveryMap);
    if (approvalDiagnostic) diagnostics.push(approvalDiagnostic);
    if (!scope.allowed_outputs.includes(requestedOutput)) diagnostics.push(diagnostic("PI_SCOPE_OUTPUT_DISALLOWED", "block", "scope.allowed_outputs", `Requested output is not approved: ${requestedOutput}.`, "Request only an output listed by the approved Project Inventory scope."));
  }
  try {
    if (directoryDigest(controlRoot) !== before) diagnostics.push(diagnostic("PI_AGDF_CONTROL_MUTATED", "block", controlRoot, "AGDF control state changed during read-only preflight.", "Restore AGDF control state and inspect the validator boundary."));
  } catch (error) {
    diagnostics.push(diagnostic("PI_AGDF_CONTROL_UNSAFE", "block", controlRoot, error.message, "Remove symbolic links or unreadable entries from AGDF control state and retry."));
  }

  const result = validationResult(diagnostics);
  if (!result.valid) return { ...result, authority_context: null, approved_scope: null, evidence };
  return {
    ...result,
    authority_context: authorityContext({ validator: resolvedValidator.validator, runId: selectedRunId, revisionId, scopeRef, scope, requestedOutput }),
    approved_scope: deepFreeze(structuredClone(scope)),
    evidence,
  };
}

export function validateScopeApproval(scope, deliveryMap) {
  const [rawPath, fragment, ...extra] = String(scope.approval_ref ?? "").split("#");
  const path = normalizedRepositoryPath(rawPath);
  if (!path || !fragment || extra.length || !path.startsWith(".agdf/control/artefacts/")) {
    return diagnostic("PI_SCOPE_APPROVAL_UNVERIFIED", "block", "scope.approval_ref", "Scope approval reference is not a normalized AGDF artefact anchor.", "Reference the scope anchor in exactly one approved AGDF gate artefact.");
  }
  const artefact = deliveryMap?.artefacts?.[scope.approval_gate];
  const approval = deliveryMap?.approvals?.[scope.approval_gate];
  if (artefact?.path !== path || artefact?.status !== "approved" || approval?.status !== "approved") {
    return diagnostic("PI_SCOPE_APPROVAL_UNVERIFIED", "block", "scope.approval_ref", `AGDF gate ${scope.approval_gate} is not durably approved for this scope reference.`, "Obtain AGDF approval for the referenced gate revision and retry.");
  }
  const approvalRevision = String(approval.evidence ?? "").match(/run revision `([a-f0-9-]+)`/i)?.[1];
  if (!approvalRevision || approvalRevision !== scope.approval_revision_id) {
    return diagnostic("PI_SCOPE_APPROVAL_UNVERIFIED", "block", "scope.approval_revision_id", "Scope approval revision does not match the validator-confirmed approval relationship.", "Bind the scope to the exact approved AGDF gate revision and retry.");
  }
  return null;
}

function validateMachineResults({ doctor, gate, deliveryMap, selectedRunId, controlRoot }) {
  const diagnostics = [];
  for (const [name, value] of [["doctor", doctor], ["gate-check", gate], ["delivery-map", deliveryMap]]) {
    if (!value || value.schema_version !== "1") diagnostics.push(diagnostic("PI_AGDF_RESULT_INVALID", "block", name, `${name} did not return a supported machine result.`, "Use the version-matched AGDF validator and retry."));
    else if (["blocked", "block", "revise"].includes(value.status)) diagnostics.push(diagnostic("PI_AGDF_RUN_BLOCKED", "block", name, value.blocking_reason || value.status, "Resolve the selected AGDF run and retry preflight."));
  }
  if (diagnostics.length) return diagnostics;
  const gateRun = gate.status_card?.run_id;
  const deliveryRun = deliveryMap.status_card?.run_id;
  const gateRevision = selectedRevisionId(gate);
  const deliveryRevision = selectedRevisionId(deliveryMap);
  if (gateRun !== selectedRunId || deliveryRun !== selectedRunId || !gateRevision || (deliveryRevision && deliveryRevision !== gateRevision)) {
    diagnostics.push(diagnostic("PI_AGDF_IDENTITY_MISMATCH", "block", "agdf_preflight", "AGDF command results do not identify one matching selected run and revision.", "Re-run the version-matched validator against one unchanged selected run."));
  }
  if (!sameRepositoryTarget(doctor.target_dir, resolve(controlRoot, "../.."))) diagnostics.push(diagnostic("PI_AGDF_TARGET_MISMATCH", "block", "doctor.target_dir", "AGDF doctor result belongs to a different repository target.", "Run the validator from the repository that owns the selected scope and control root."));
  if (gate.blocking_reason && gate.blocking_reason !== "none") diagnostics.push(diagnostic("PI_AGDF_RUN_BLOCKED", "block", selectedRunId, gate.blocking_reason, "Resolve the selected AGDF run and retry preflight."));
  return diagnostics;
}

function resolveScopeReference(deliveryMap) {
  const refs = (deliveryMap?.evidence_refs ?? []).filter((entry) => entry?.evidence === "Project Inventory Scope");
  if (refs.length === 0) return { scopeRef: null, diagnostics: [diagnostic("PI_SCOPE_RESOLUTION_MISSING", "block", "delivery_map.evidence_refs", "The selected AGDF run exposes no Project Inventory Scope reference.", "Link exactly one approved Project Inventory Scope artefact from the selected run.")] };
  if (refs.length !== 1) return { scopeRef: null, diagnostics: [diagnostic("PI_SCOPE_RESOLUTION_AMBIGUOUS", "block", "delivery_map.evidence_refs", `The selected AGDF run exposes ${refs.length} Project Inventory Scope references.`, "Retain exactly one approved Project Inventory Scope reference for the selected run.")] };
  const raw = String(refs[0].source ?? "").replace(/^`|`$/g, "");
  const scopeRef = normalizedRepositoryPath(raw);
  if (!scopeRef || !scopeRef.startsWith(".agdf/control/artefacts/") || !scopeRef.endsWith(".json")) return { scopeRef: null, diagnostics: [diagnostic("PI_SCOPE_REFERENCE_INVALID", "block", raw, "Project Inventory Scope reference is not a normalized control artefact JSON path.", "Link one normalized scope artefact beneath .agdf/control/artefacts/.")] };
  return { scopeRef, diagnostics: [] };
}

function selectedRevisionId(value) {
  return value?.status_presentation?.revision_id ?? null;
}

function resultFor(evidence, command) {
  return evidence.find((entry) => entry.command === command)?.result;
}

function failed(code, path, message, nextAction) {
  return { ...validationResult([diagnostic(code, "block", path, message, nextAction)]), authority_context: null, approved_scope: null, evidence: [] };
}

function commandError(error) {
  return (error.stderr || error.stdout || error.message || "AGDF preflight failed").toString().trim();
}

function sameRepositoryTarget(left, right) {
  if (!left) return false;
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

class ScopeBoundaryError extends Error {}
