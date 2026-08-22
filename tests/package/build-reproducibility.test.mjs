import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertSafeBuildOutput, buildPackages } from "../../src/package/build.mjs";
import { directoryDigest } from "../../src/shared/files.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T13 two isolated complete builds are byte-identical", () => {
  const temporary = temporaryDirectory();
  try {
    const first = join(temporary.path, "first");
    const second = join(temporary.path, "second");
    const result = buildPackages({ repoRoot, outputRoot: first });
    buildPackages({ repoRoot, outputRoot: second });
    assert.equal(directoryDigest(first), directoryDigest(second));
    const report = JSON.parse(readFileSync(join(first, "BUILD_REPORT.json"), "utf8"));
    assert.equal(result.output_digest, directoryDigest(first));
    assert.equal(report.package_payload_digest.startsWith("sha256:"), true);
    assert.equal("output_digest" in report, false);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T13 build refuses repository-wide and unrelated output deletion targets", () => {
  assert.throws(() => assertSafeBuildOutput(repoRoot, repoRoot), /unsafe build output path/);
  assert.throws(() => assertSafeBuildOutput(repoRoot, "/tmp"), /unsafe build output path/);
  assert.equal(assertSafeBuildOutput(repoRoot, join(repoRoot, "generated")), join(repoRoot, "generated"));
});
