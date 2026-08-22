import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const packageJson = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));

test("PI-T01 exposes a private pinned ESM test harness", () => {
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.version, "0.1.0");
  assert.equal(packageJson.dependencies.ajv, "8.20.0");
  assert.equal(packageJson.dependencies["ajv-formats"], "3.0.1");
  for (const script of ["build", "validate", "test:unit", "test:package", "test:lifecycle", "test:evals", "test:integration", "test"]) assert.equal(typeof packageJson.scripts[script], "string");
});

test("PI-R4-T01 exposes exact thin lifecycle aliases without host-mutating npm lifecycle hooks", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(packageJson.scripts).filter(([name]) => /^(install|status|uninstall):/.test(name))),
    {
      "install:codex": "node bin/agdf-project-inventory.mjs install --host codex",
      "install:claude": "node bin/agdf-project-inventory.mjs install --host claude",
      "install:opencode": "node bin/agdf-project-inventory.mjs install --host opencode",
      "status:codex": "node bin/agdf-project-inventory.mjs status --host codex",
      "status:claude": "node bin/agdf-project-inventory.mjs status --host claude",
      "status:opencode": "node bin/agdf-project-inventory.mjs status --host opencode",
      "uninstall:codex": "node bin/agdf-project-inventory.mjs uninstall --host codex",
      "uninstall:claude": "node bin/agdf-project-inventory.mjs uninstall --host claude",
      "uninstall:opencode": "node bin/agdf-project-inventory.mjs uninstall --host opencode",
    },
  );
  for (const hook of ["preinstall", "install", "postinstall", "prepare"]) assert.equal(packageJson.scripts[hook], undefined);
});

test("PI-R4-T02 README and UAT protocols expose the same explicit local commands", () => {
  const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");
  const protocols = ["CODEX.md", "CLAUDE.md", "OPENCODE.md"].map((name) => readFileSync(new URL(`../../evals/uat/${name}`, import.meta.url), "utf8"));
  for (const command of [
    "npm run install:codex",
    "npm run install:claude",
    "npm run install:opencode -- --repo <repository>",
  ]) assert.match(readme, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(protocols[0], /npm run install:codex/);
  assert.match(protocols[0], /npm run status:codex/);
  assert.match(protocols[0], /npm run uninstall:codex/);
  assert.match(protocols[1], /npm run install:claude/);
  assert.match(protocols[1], /npm run status:claude/);
  assert.match(protocols[1], /npm run uninstall:claude/);
  assert.match(protocols[2], /npm run install:opencode -- --repo <repository>/);
  assert.match(protocols[2], /npm run status:opencode -- --repo <repository>/);
  assert.match(protocols[2], /npm run uninstall:opencode -- --repo <repository>/);
});
