import { packageDiagnostic as diagnostic, packageValidationResult as validationResult } from "./diagnostics.mjs";

export function validateVersionCoherence(expectedVersion, surfaces) {
  const diagnostics = [];
  for (const [surface, version] of Object.entries(surfaces)) {
    if (version !== expectedVersion) diagnostics.push(diagnostic("PI_VERSION_DRIFT", "block", surface, `Expected ${expectedVersion}, observed ${version ?? "unknown"}.`, "Regenerate every derived version surface from the canonical definition."));
  }
  return validationResult(diagnostics);
}
