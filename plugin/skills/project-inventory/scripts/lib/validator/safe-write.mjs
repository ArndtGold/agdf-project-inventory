import { existsSync, lstatSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { validationResult, diagnostic } from "./diagnostics.mjs";
import { sha256 } from "../shared/data.mjs";

export function promoteJsonCandidate({ candidatePath, targetPath, validate, expectedTargetDigest, artifactId = basename(targetPath) }) {
  const retainedValidState = () => retainedState({ targetPath, validate, expectedTargetDigest, artifactId });
  const candidate = resolve(candidatePath);
  const target = resolve(targetPath);
  if (targetsAgdfControl(candidate) || targetsAgdfControl(target)) {
    return validationResult([diagnostic("PI_AGDF_CONTROL_WRITE_FORBIDDEN", "block", targetPath, "Project Inventory promotion cannot write AGDF control state.", "Use a controlled Inventory Run directory outside .agdf/control and retry.")]);
  }
  if (candidate === target) {
    return validationResult([diagnostic("PI_CANDIDATE_TARGET_ALIAS", "block", candidatePath, "Candidate and target must be different files.", "Place the candidate beside the target under a distinct filename and retry.")], { retainedValidState: retainedValidState() });
  }
  if (dirname(candidate) !== dirname(target)) {
    return validationResult([diagnostic("PI_CANDIDATE_DIRECTORY_MISMATCH", "block", candidatePath, "Candidate and target must share one controlled directory.", "Place the candidate beside the target and retry.")], { retainedValidState: retainedValidState() });
  }
  let candidateBytes;
  let value;
  try {
    const stats = lstatSync(candidate);
    if (stats.isSymbolicLink() || !stats.isFile()) throw new Error("Candidate must be one regular file and cannot be a symbolic link.");
    candidateBytes = readFileSync(candidate);
    value = JSON.parse(candidateBytes.toString("utf8"));
  } catch (error) {
    return validationResult([diagnostic("PI_CANDIDATE_JSON_INVALID", "block", candidatePath, error.message, "Correct the candidate JSON and retry.")], { retainedValidState: retainedValidState() });
  }
  let checked;
  try {
    checked = validate(value);
    if (!checked || typeof checked.valid !== "boolean" || !Array.isArray(checked.diagnostics)) throw new Error("Candidate validator returned an unsupported result.");
  } catch (error) {
    return validationResult([diagnostic("PI_CANDIDATE_VALIDATION_FAILED", "block", candidatePath, error.message, "Correct the candidate validator and retry without replacing the last-valid target.")], { retainedValidState: retainedValidState() });
  }
  if (!checked.valid) return validationResult(checked.diagnostics, { retainedValidState: retainedValidState() });
  const stagedPath = `${target}.promote-${randomUUID()}`;
  try {
    writeFileSync(stagedPath, candidateBytes);
    renameSync(stagedPath, target);
  } catch (error) {
    if (existsSync(stagedPath)) unlinkSync(stagedPath);
    return validationResult([diagnostic("PI_CANDIDATE_PROMOTION_FAILED", "block", targetPath, error.message, "Keep the last valid target, correct the local filesystem problem and retry promotion.")], { retainedValidState: retainedValidState() });
  }
  const cleanupDiagnostics = [];
  try {
    if (existsSync(candidatePath)) unlinkSync(candidatePath);
  } catch (error) {
    cleanupDiagnostics.push(diagnostic("PI_CANDIDATE_CLEANUP_FAILED", "warn", candidatePath, error.message, "Remove the already-promoted candidate file when safe."));
  }
  return { ...validationResult(cleanupDiagnostics), promoted: true, target: targetPath };
}

function targetsAgdfControl(path) {
  let canonical;
  try {
    canonical = realpathSync(path);
  } catch {
    try {
      canonical = join(realpathSync(dirname(path)), basename(path));
    } catch {
      canonical = resolve(path);
    }
  }
  return /(?:^|\/)\.agdf\/control(?:\/|$)/.test(canonical.replaceAll("\\", "/"));
}

function retainedState({ targetPath, validate, expectedTargetDigest, artifactId }) {
  if (!existsSync(targetPath) || typeof expectedTargetDigest !== "string") return [];
  try {
    const stats = lstatSync(targetPath);
    if (stats.isSymbolicLink() || !stats.isFile()) return [];
    const bytes = readFileSync(targetPath);
    const value = JSON.parse(bytes.toString("utf8"));
    const checked = validate(value);
    if (!checked.valid || sha256(bytes) !== expectedTargetDigest) return [];
    return [artifactId];
  } catch {
    return [];
  }
}
