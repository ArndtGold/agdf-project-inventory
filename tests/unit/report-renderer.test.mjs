import assert from "node:assert/strict";
import test from "node:test";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { intake, evidence, findings } from "../helpers/fixtures.mjs";

test("PI-T06 report contains all required sections and stable statement IDs", () => {
  const result = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  for (const heading of ["Decision Context", "Scope And Exclusions", "Evidence Coverage", "Findings", "Unknowns And Conflicts", "Recommendations", "Review State", "Limitations"]) assert.match(result.report, new RegExp(`## ${heading}`));
  for (const statement of findings.statements) assert.match(result.report, new RegExp(statement.statement_id));
});
