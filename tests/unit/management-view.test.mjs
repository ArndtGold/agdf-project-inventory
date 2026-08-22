import assert from "node:assert/strict";
import test from "node:test";
import { renderManagementView, validateManagementProjection } from "../../plugin/skills/project-inventory/scripts/lib/renderers/management-view.mjs";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { intake, evidence, findings } from "../helpers/fixtures.mjs";

test("PI-T06 management view is an exact report subset", () => {
  const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  const result = renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["obs-001", "rec-001"] });
  assert.equal(result.valid, true);
  assert.match(result.view, /Source report: report-001/);
  assert.equal(result.selected[0].rendered_text, report.index.statement_projections.find((item) => item.statement_id === "obs-001").rendered_text);
  assert.equal(validateManagementProjection({ sourceReport: report.report, reportIndex: report.index, view: result.view, index: result.index }).valid, true);
  const paraphrased = result.view.replace("deterministic automated test command", "strong automated test command");
  assert.equal(validateManagementProjection({ sourceReport: report.report, reportIndex: report.index, view: paraphrased, index: result.index }).diagnostics[0].code, "PI_MANAGEMENT_PARAPHRASE");
});

test("PI-R2-T07 blocks a stale report digest and unknown statement ID", () => {
  const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  const stale = renderManagementView({ sourceReport: `${report.report}changed`, reportIndex: report.index, includedIds: ["obs-001"] });
  assert.equal(stale.diagnostics[0].code, "PI_MANAGEMENT_REPORT_STALE");
  const unknown = renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["missing-001"] });
  assert.equal(unknown.diagnostics[0].code, "PI_MANAGEMENT_SOURCE_UNKNOWN");
});

test("PI-R2-T07 blocks reordered or merged statement bytes", () => {
  const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
  const management = renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["obs-001", "rec-001"] });
  const [observation, recommendation] = management.selected.map((entry) => entry.rendered_text);
  const reordered = management.view.replace(`${observation}\n${recommendation}`, `${recommendation}\n${observation}`);
  const merged = management.view.replace(`${observation}\n${recommendation}`, `${observation} ${recommendation}`);
  assert.equal(validateManagementProjection({ sourceReport: report.report, reportIndex: report.index, view: reordered, index: management.index }).diagnostics[0].code, "PI_MANAGEMENT_PARAPHRASE");
  assert.equal(validateManagementProjection({ sourceReport: report.report, reportIndex: report.index, view: merged, index: management.index }).diagnostics[0].code, "PI_MANAGEMENT_PARAPHRASE");
});
