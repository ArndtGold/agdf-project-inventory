import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createSchemaRegistry } from "../../plugin/skills/project-inventory/scripts/lib/validator/schema-validator.mjs";
import { intake, clone } from "../helpers/fixtures.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const registry = createSchemaRegistry(join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas"));

test("PI-T05 schema diagnostics are stable and actionable", () => {
  const invalid = clone(intake);
  delete invalid.decision;
  const result = registry.validate("assessment-intake", invalid, "ASSESSMENT_INTAKE.json");
  assert.equal(result.valid, false);
  assert.equal(result.diagnostics[0].code, "PI_SCHEMA_INVALID");
  assert.equal(result.diagnostics[0].severity, "block");
  assert.ok(result.diagnostics[0].next_action);
});

test("PI-R2-T06 missing required fields retain their schema JSON pointer", () => {
  const invalid = clone(intake);
  delete invalid.review_owner;
  const result = registry.validate("assessment-intake", invalid, "ASSESSMENT_INTAKE.json");
  assert.equal(result.diagnostics.some((item) => item.path === "ASSESSMENT_INTAKE.json/review_owner"), true);
});
