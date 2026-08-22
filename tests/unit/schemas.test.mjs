import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createSchemaRegistry } from "../../plugin/skills/project-inventory/scripts/lib/validator/schema-validator.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const registry = createSchemaRegistry(join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas"));

for (const name of registry.names) {
  test(`PI-T03 ${name} accepts valid and rejects minimal invalid fixture`, () => {
    const valid = JSON.parse(readFileSync(join(repoRoot, "tests", "fixtures", "schema", "valid", `${name}.json`), "utf8"));
    const invalid = JSON.parse(readFileSync(join(repoRoot, "tests", "fixtures", "schema", "invalid", `${name}.json`), "utf8"));
    assert.equal(registry.validate(name, valid).valid, true);
    assert.equal(registry.validate(name, invalid).valid, false);
  });
}
