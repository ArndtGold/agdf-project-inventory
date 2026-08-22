import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { extname, isAbsolute } from "node:path";
import process from "node:process";
import { diagnostic, validationResult } from "../validator/diagnostics.mjs";

export function resolveAgdfValidator({ hostValidatorPath, explicitValidatorPath, expectedVersion, exec = execFileSync }) {
  const candidates = [hostValidatorPath, explicitValidatorPath].filter(Boolean);
  if (candidates.length === 0) {
    return { ...validationResult([diagnostic("PI_AGDF_UNAVAILABLE", "block", "agdf_validator", "No host-local or explicit AGDF validator is available.", "Provide a version-matched absolute local validator path.")]), validator: null };
  }
  if (new Set(candidates).size > 1 && candidates[0] !== candidates[1]) {
    return { ...validationResult([diagnostic("PI_AGDF_AMBIGUOUS", "block", "agdf_validator", "More than one AGDF validator candidate was supplied.", "Select exactly one authoritative local validator.")]), validator: null };
  }
  const path = candidates[0];
  if (!isAbsolute(path) || !existsSync(path) || !statSync(path).isFile()) {
    return { ...validationResult([diagnostic("PI_AGDF_PATH_INVALID", "block", path, "AGDF validator path must be an existing absolute file.", "Provide an existing absolute local validator path.")]), validator: null };
  }
  try {
    const invocation = validatorInvocation(path, ["--resolve-only", "--json"]);
    const output = exec(invocation.executable, invocation.args, { encoding: "utf8", stdio: "pipe" });
    const resolved = JSON.parse(output);
    const envelopeDiagnostic = validateResolutionEnvelope(resolved, expectedVersion, path);
    if (envelopeDiagnostic) return { ...validationResult([envelopeDiagnostic]), validator: null };
    return { ...validationResult(), validator: { path, id: "agdf", version: resolved.observed_version } };
  } catch (error) {
    const resolved = parseResolutionEnvelope(error.stdout);
    if (resolved) {
      const envelopeDiagnostic = validateResolutionEnvelope(resolved, expectedVersion, path);
      if (envelopeDiagnostic) return { ...validationResult([envelopeDiagnostic]), validator: null };
    }
    return { ...validationResult([diagnostic("PI_AGDF_RESOLUTION_FAILED", "block", path, commandError(error), "Correct the local validator and retry preflight.")]), validator: null };
  }
}

export function validatorInvocation(path, args) {
  return [".js", ".mjs", ".cjs"].includes(extname(path))
    ? { executable: process.execPath, args: [path, ...args] }
    : { executable: path, args };
}

function commandError(error) {
  return (error.stderr || error.stdout || error.message || "AGDF validator failed").toString().trim();
}

function validateResolutionEnvelope(resolved, expectedVersion, path) {
  const matched = ["owned_version_matched", "configured_version_matched"];
  if (resolved?.schema_version !== "1" || !resolved.machine_validation) {
    return diagnostic("PI_AGDF_RESOLUTION_FAILED", "block", path, "AGDF --resolve-only returned an unsupported machine envelope.", "Use the exact supported AGDF local validator runtime.");
  }
  if (!matched.includes(resolved.machine_validation) || resolved.expected_version !== expectedVersion || resolved.observed_version !== expectedVersion) {
    const unavailable = ["unavailable", "external_required"].includes(resolved.machine_validation);
    return diagnostic(unavailable ? "PI_AGDF_UNAVAILABLE" : "PI_AGDF_INCOMPATIBLE", "block", path, `Expected AGDF ${expectedVersion}; validator reported ${resolved.machine_validation} with observed version ${resolved.observed_version ?? "unknown"}.`, "Provide the exact supported version-matched local AGDF validator.");
  }
  return null;
}

function parseResolutionEnvelope(output) {
  try {
    return JSON.parse(String(output ?? ""));
  } catch {
    return null;
  }
}
