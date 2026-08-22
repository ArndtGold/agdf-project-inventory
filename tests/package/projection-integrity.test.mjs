import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages } from "../../src/package/build.mjs";
import { directoryDigest } from "../../plugin/skills/project-inventory/scripts/lib/shared/data.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-R3-T05 every host receives the byte-identical canonical skill directory", () => {
  const temporary = temporaryDirectory();
  try {
    buildPackages({ repoRoot, outputRoot: temporary.path });
    const canonical = directoryDigest(join(repoRoot, "plugin", "skills", "project-inventory"));
    const codexAndClaude = directoryDigest(join(temporary.path, "plugins", "agdf-project-inventory", "skills", "project-inventory"));
    const openCode = directoryDigest(join(temporary.path, "opencode", ".opencode", "skills", "project-inventory"));
    assert.equal(codexAndClaude, canonical);
    assert.equal(openCode, canonical);
  } finally {
    temporary.cleanup();
  }
});
