export function packageDiagnostic(code, severity, path, message, next_action) {
  return { code, severity, path, message, next_action };
}

export function packageValidationResult(diagnostics = []) {
  return {
    valid: !diagnostics.some((item) => ["block", "revise"].includes(item.severity)),
    status: diagnostics.some((item) => ["block", "revise"].includes(item.severity)) ? "block" : "pass",
    diagnostics,
  };
}
