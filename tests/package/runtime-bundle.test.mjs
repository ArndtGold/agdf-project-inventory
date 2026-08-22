import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { buildPackages } from "../../src/package/build.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T08 bundled Codex/Claude and OpenCode validators run offline from generated roots", () => {
  const temporary = temporaryDirectory();
  try {
    buildPackages({ repoRoot, outputRoot: temporary.path });
    const launchers = [
      join(temporary.path, "plugins", "agdf-project-inventory", "runtime", "bin", "agdf-project-inventory.mjs"),
      join(temporary.path, "opencode", ".opencode", "project-inventory", "runtime", "bin", "agdf-project-inventory.mjs"),
    ];
    for (const launcher of launchers) {
      const output = execFileSync(process.execPath, [launcher, "validate"], { encoding: "utf8", stdio: "pipe" });
      assert.equal(JSON.parse(output).status, "pass");
    }
  } finally {
    temporary.cleanup();
  }
});

test("PI-R3-T03 projected skill entrypoints run directly outside the source repository", () => {
  const temporary = temporaryDirectory();
  try {
    buildPackages({ repoRoot, outputRoot: temporary.path });
    const entrypoints = [
      join(temporary.path, "plugins", "agdf-project-inventory", "skills", "project-inventory", "scripts", "project-inventory.mjs"),
      join(temporary.path, "opencode", ".opencode", "skills", "project-inventory", "scripts", "project-inventory.mjs"),
    ];
    for (const entrypoint of entrypoints) {
      const output = execFileSync(process.execPath, [entrypoint, "validate"], { encoding: "utf8", stdio: "pipe" });
      assert.equal(JSON.parse(output).status, "pass");
    }
  } finally {
    temporary.cleanup();
  }
});
