#!/usr/bin/env node
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages, canonicalSourceDigest } from "../src/package/build.mjs";
import { directoryDigest } from "../src/shared/files.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = mkdtempSync(join(tmpdir(), "agdf-project-inventory-integrity-"));
try {
  const before = canonicalSourceDigest(repoRoot);
  const firstRoot = join(temporaryRoot, "first");
  const secondRoot = join(temporaryRoot, "second");
  buildPackages({ repoRoot, outputRoot: firstRoot });
  buildPackages({ repoRoot, outputRoot: secondRoot });
  const after = canonicalSourceDigest(repoRoot);
  const first = directoryDigest(firstRoot);
  const second = directoryDigest(secondRoot);
  if (before !== after || first !== second) throw new Error("Source immutability or reproducibility check failed.");
  console.log(JSON.stringify({ status: "pass", source_digest: before, build_digest: first }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ status: "block", code: "PI_SOURCE_INTEGRITY_FAILED", message: error.message }, null, 2));
  process.exitCode = 1;
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
