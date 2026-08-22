import assert from "node:assert/strict";
import test from "node:test";
import { renderInventoryReport, validateReportProjection } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { intake, evidence, findings } from "../helpers/fixtures.mjs";

test("PI-T06 identical inputs produce byte-identical report and index", () => {
  const first = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  const second = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  assert.equal(first.report, second.report);
  assert.deepEqual(first.index, second.index);
  assert.match(first.index.report_digest, /^sha256:[a-f0-9]{64}$/);
  assert.equal(first.index.statement_projections.length, findings.statements.length);
  assert.equal(first.index.statement_projections.every((item) => /^sha256:[a-f0-9]{64}$/.test(item.statement_digest)), true);
});

test("PI-R2-T07 report projection rejects changed text or a stale index", () => {
  const rendered = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  assert.equal(validateReportProjection({ report: rendered.report, index: rendered.index, reportId: "report-001", intake, evidence, findings }).valid, true);
  assert.equal(validateReportProjection({ report: `${rendered.report}changed`, index: rendered.index, reportId: "report-001", intake, evidence, findings }).diagnostics[0].code, "PI_REPORT_TEXT_MISMATCH");
  assert.equal(validateReportProjection({ report: rendered.report, index: { ...rendered.index, report_digest: `sha256:${"0".repeat(64)}` }, reportId: "report-001", intake, evidence, findings }).diagnostics[0].code, "PI_REPORT_INDEX_INVALID");
});
