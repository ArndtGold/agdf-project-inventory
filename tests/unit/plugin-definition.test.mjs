import assert from "node:assert/strict";
import test from "node:test";
import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateDefinition } from "../../src/package/definition-validator.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T02 canonical definition owns one coherent inventory", () => {
  const result = validateDefinition(repoRoot);
  assert.equal(result.valid, true, JSON.stringify(result.diagnostics));
  assert.equal(result.definition.skills.length, 1);
  assert.equal(result.definition.version, "0.1.0");
});

test("PI-T02 canonical inventory rejects duplicate, missing and undeclared paths", () => {
  for (const [expectedCode, mutate] of [
    ["PI_DEFINITION_DUPLICATE_PATH", (definition) => definition.resources.push(definition.resources[0])],
    ["PI_DEFINITION_PATH_MISSING", (definition) => { definition.resources[0] = "plugin/skills/project-inventory/references/missing.md"; }],
    ["PI_DEFINITION_EXTRA_PATH", (_definition, root) => writeFileSync(join(root, "plugin", "skills", "project-inventory", "references", "undeclared.md"), "# Undeclared\n")],
    ["PI_DEFINITION_LONG_DESCRIPTION", (definition) => { definition.long_description = ""; }],
    ["PI_DEFINITION_DEFAULT_PROMPT", (definition) => { definition.default_prompt = ""; }],
  ]) {
    const temporary = temporaryDirectory();
    try {
      cpSync(join(repoRoot, "plugin"), join(temporary.path, "plugin"), { recursive: true });
      const definitionPath = join(temporary.path, "plugin", "meta", "project-inventory-plugin.definition.json");
      const definition = JSON.parse(readFileSync(definitionPath, "utf8"));
      mutate(definition, temporary.path);
      writeFileSync(definitionPath, `${JSON.stringify(definition, null, 2)}\n`);
      const result = validateDefinition(temporary.path);
      assert.equal(result.diagnostics.some((item) => item.code === expectedCode), true, expectedCode);
    } finally {
      temporary.cleanup();
    }
  }
});
