import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { listFiles } from "../../plugin/skills/project-inventory/scripts/lib/shared/data.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const skillRoot = join(repoRoot, "plugin", "skills", "project-inventory");

test("PI-R3-T01 canonical skill owns every declared reference, schema and executable", () => {
  const skill = readFileSync(join(skillRoot, "SKILL.md"), "utf8");
  const declared = [...skill.matchAll(/`([^`]+\.(?:md|json|mjs))`/g)].map((match) => match[1]);

  assert.ok(declared.includes("scripts/project-inventory.mjs"));
  for (const path of declared) {
    assert.equal(path.includes(".."), false, `escaping skill reference: ${path}`);
    assert.equal(existsSync(join(skillRoot, path)), true, `missing skill-owned path: ${path}`);
  }
  assert.equal(existsSync(join(skillRoot, "references", "assessment-intake.md")), true);
  assert.equal(existsSync(join(skillRoot, "assets", "schemas", "inventory-run.schema.json")), true);
});

test("PI-R3-T01 obsolete domain owners are absent", () => {
  for (const path of ["plugin/resources", "plugin/schemas", "src/agdf-bridge", "src/renderers", "src/validator"]) {
    assert.equal(existsSync(join(repoRoot, path)), false, `obsolete owner remains: ${path}`);
  }
});

test("PI-R3-T01 relative imports below skill scripts stay inside the skill root", () => {
  for (const file of listFiles(join(skillRoot, "scripts")).filter((path) => path.endsWith(".mjs"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\()["'](\.[^"']+)["']/g)) {
      const target = resolve(dirname(file), match[1]);
      assert.equal(relative(skillRoot, target).startsWith(".."), false, `escaping import: ${match[1]}`);
      assert.equal(existsSync(target), true, `missing relative import: ${match[1]}`);
    }
  }
});
