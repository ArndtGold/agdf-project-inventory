import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages } from "../../src/package/build.mjs";
import { assertBuiltPluginCompatible } from "../../src/lifecycle/local-marketplace.mjs";
import { listFiles } from "../../src/shared/files.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T13 packages contain required assets exactly once and no tests", () => {
  const temporary = temporaryDirectory();
  try {
    buildPackages({ repoRoot, outputRoot: temporary.path });
    const files = listFiles(temporary.path).map((path) => relative(temporary.path, path).replaceAll("\\", "/"));
    const required = [
      "plugins/agdf-project-inventory/.codex-plugin/plugin.json",
      "plugins/agdf-project-inventory/.claude-plugin/plugin.json",
      "plugins/agdf-project-inventory/skills/project-inventory/SKILL.md",
      "plugins/agdf-project-inventory/runtime/bin/agdf-project-inventory.mjs",
      "plugins/agdf-project-inventory/meta/generation.json",
      "plugins/agdf-project-inventory/skills/project-inventory/scripts/project-inventory.mjs",
      "opencode/.opencode/skills/project-inventory/SKILL.md",
      "opencode/.opencode/project-inventory/ownership.json",
      "opencode/.opencode/project-inventory/meta/project-inventory-plugin.definition.json",
      "opencode/.opencode/project-inventory/runtime/package.json"
    ];
    for (const path of required) assert.equal(files.filter((candidate) => candidate === path).length, 1, path);
    assert.equal(files.some((path) => path.includes("/tests/") || path.startsWith("tests/")), false);
    assert.equal(files.some((path) => path.includes("/runtime/plugin/skills/")), false);
    assert.equal(files.some((path) => path.includes("/runtime/node_modules/")), false);
    assert.equal(files.some((path) => path.includes("/runtime/scripts/")), false);
    assert.equal(new Set(files).size, files.length);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T13 local marketplace rejects stale generated plugin content", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    buildPackages({ repoRoot, outputRoot });
    const pluginRoot = join(outputRoot, "plugins", "agdf-project-inventory");
    const definition = JSON.parse(readFileSync(join(repoRoot, "plugin", "meta", "project-inventory-plugin.definition.json"), "utf8"));
    const stale = JSON.parse(readFileSync(join(pluginRoot, "meta", "generation.json"), "utf8"));
    stale.version = "0.0.0";
    writeFileSync(join(pluginRoot, "meta", "generation.json"), JSON.stringify(stale));
    assert.throws(() => assertBuiltPluginCompatible(pluginRoot, definition), /version mismatch/);
  } finally {
    temporary.cleanup();
  }
});
