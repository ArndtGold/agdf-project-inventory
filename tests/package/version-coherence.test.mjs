import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages } from "../../src/package/build.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T13 definition, package and generated manifests report one version", () => {
  const temporary = temporaryDirectory();
  try {
    buildPackages({ repoRoot, outputRoot: temporary.path });
    const packageVersion = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")).version;
    const definitionVersion = JSON.parse(readFileSync(join(repoRoot, "plugin", "meta", "project-inventory-plugin.definition.json"), "utf8")).version;
    const codexVersion = JSON.parse(readFileSync(join(temporary.path, "plugins", "agdf-project-inventory", ".codex-plugin", "plugin.json"), "utf8")).version;
    const claudeVersion = JSON.parse(readFileSync(join(temporary.path, "plugins", "agdf-project-inventory", ".claude-plugin", "plugin.json"), "utf8")).version;
    const openCodeVersion = JSON.parse(readFileSync(join(temporary.path, "opencode", ".opencode", "project-inventory", "ownership.json"), "utf8")).version;
    assert.equal(new Set([packageVersion, definitionVersion, codexVersion, claudeVersion, openCodeVersion]).size, 1);
  } finally {
    temporary.cleanup();
  }
});
