import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildPackages, canonicalSourceDigest } from "../../src/package/build.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T08 build leaves canonical source bytes unchanged", () => {
  const temporary = temporaryDirectory();
  try {
    const before = canonicalSourceDigest(repoRoot);
    buildPackages({ repoRoot, outputRoot: temporary.path });
    assert.equal(canonicalSourceDigest(repoRoot), before);
  } finally {
    temporary.cleanup();
  }
});
