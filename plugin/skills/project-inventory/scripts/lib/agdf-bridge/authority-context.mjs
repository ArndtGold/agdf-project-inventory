export function authorityContext({ validator, runId, revisionId, scopeRef, scope, requestedOutput }) {
  return deepFreeze({
    schema_version: "1",
    validator: {
      id: validator.id,
      version: validator.version,
      compatibility: "confirmed",
    },
    selected_run: {
      run_id: runId,
      revision_id: revisionId,
    },
    scope: {
      scope_id: scope.scope_id,
      scope_ref: scopeRef,
      approval_ref: scope.approval_ref,
      approval_gate: scope.approval_gate,
      approval_revision_id: scope.approval_revision_id,
    },
    allowed_outputs: [...scope.allowed_outputs].sort(),
    requested_output: requestedOutput,
  });
}

export function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}
