#!/usr/bin/env node
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages } from "../src/package/build.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
try {
  const result = buildPackages({ repoRoot });
  console.log(JSON.stringify({ status: "pass", version: result.version, output_digest: result.output_digest, files: result.files.length + 1 }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ status: "block", code: "PI_BUILD_FAILED", message: error.message }, null, 2));
  process.exitCode = 1;
}
