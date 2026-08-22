import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createSchemaRegistry } from "../../plugin/skills/project-inventory/scripts/lib/validator/schema-validator.mjs";
import { validateInventoryReferences } from "../../plugin/skills/project-inventory/scripts/lib/validator/inventory-validator.mjs";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { renderManagementView } from "../../plugin/skills/project-inventory/scripts/lib/renderers/management-view.mjs";
import { scope, inventoryRun, intake, evidence, findings } from "../helpers/fixtures.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const registry = createSchemaRegistry(join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas"));

test("PI-T14 positive synthetic Inventory Run produces every validated semantic output", () => {
  for (const [name, value] of [["project-inventory-scope", scope], ["inventory-run", inventoryRun], ["assessment-intake", intake], ["evidence-register", evidence], ["findings-register", findings]]) {
    assert.equal(registry.validate(name, value).valid, true, name);
  }
  assert.equal(validateInventoryReferences(evidence, findings, scope.source_boundary).valid, true);
  const rendered = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  assert.equal(registry.validate("report-index", rendered.index).valid, true);
  const management = renderManagementView({ sourceReport: rendered.report, reportIndex: rendered.index, includedIds: ["obs-001", "rec-001"] });
  assert.equal(management.valid, true);
  assert.equal(registry.validate("management-view-index", management.index).valid, true);
  assert.match(management.view, /Omitted Detail/);
});
