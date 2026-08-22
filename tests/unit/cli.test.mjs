import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { parseArguments, runCli } from "../../src/cli/index.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";
import { prepareAuthorityFixture } from "../helpers/agdf-context.mjs";
import { inventoryRun, intake, evidence, findings, clone } from "../helpers/fixtures.mjs";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { renderManagementView } from "../../plugin/skills/project-inventory/scripts/lib/renderers/management-view.mjs";
import { canonicalJson, sha256 } from "../../plugin/skills/project-inventory/scripts/lib/shared/data.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T09 CLI parses stable command options", () => {
  assert.deepEqual(parseArguments(["status", "--host", "opencode", "--repo", "/tmp/project", "--json"]), { command: "status", options: { host: "opencode", repo: "/tmp/project", json: true } });
});

test("PI-R4-T01 CLI rejects unknown, missing, duplicate and host-inappropriate lifecycle options", () => {
  assert.throws(() => parseArguments(["install", "--host", "codex", "--unknown", "value"]), /unknown option/i);
  assert.throws(() => parseArguments(["install", "--host", "opencode", "--repo"]), /requires a value/i);
  assert.throws(() => parseArguments(["install", "--host", "codex", "--repo", "/tmp/project"]), /not supported for codex/i);
  assert.throws(() => parseArguments(["install", "--host", "opencode", "--data-root", "/tmp/data", "--repo", "/tmp/project"]), /not supported for opencode/i);
  assert.throws(() => parseArguments(["status", "--host", "codex", "--host", "claude"]), /duplicate option/i);
});

test("PI-R4-T03 OpenCode status requires an explicit repository", async () => {
  const output = [];
  const exit = await runCli(["status", "--host", "opencode"], { repoRoot, stdout: (value) => output.push(value), stderr: (value) => output.push(value) });
  assert.equal(exit, 1);
  assert.match(JSON.parse(output[0]).message, /--repo is required/);
});

test("PI-R2-T09 CLI validate-run preserves authority, artefact validation and question planes", async () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(join(temporary.path, "project"));
    const preflightOutput = [];
    const preflightExit = await runCli(["preflight", "--validator", fixture.validatorPath, "--run", fixture.runId, "--output", "inventory_report", "--control-root", fixture.controlRoot], { repoRoot, agdfExec: fixture.exec, stdout: (value) => preflightOutput.push(value), stderr: (value) => preflightOutput.push(value) });
    assert.equal(preflightExit, 0);
    const authorityContext = JSON.parse(preflightOutput[0]).authority_context;
    const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
    const management = renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["obs-001"] });
    const run = { ...clone(inventoryRun), authority_context_digest: sha256(canonicalJson(authorityContext)) };
    const runDir = join(temporary.path, "inventory-run");
    mkdirSync(runDir, { recursive: true });
    for (const [path, value, json = true] of [
      ["INVENTORY_RUN.json", run],
      ["ASSESSMENT_INTAKE.json", intake],
      ["EVIDENCE_REGISTER.json", evidence],
      ["FINDINGS_AND_GAPS.json", findings],
      ["INVENTORY_REPORT.md", report.report, false],
      ["INVENTORY_REPORT.index.json", report.index],
      ["MANAGEMENT_VIEW.md", management.view, false],
      ["MANAGEMENT_VIEW.index.json", management.index],
    ]) writeFileSync(join(runDir, path), json ? canonicalJson(value) : value);

    const output = [];
    const exit = await runCli(["validate-run", "--validator", fixture.validatorPath, "--run", fixture.runId, "--output", "inventory_report", "--control-root", fixture.controlRoot, "--run-dir", runDir, "--locale", "de"], { repoRoot, agdfExec: fixture.exec, stdout: (value) => output.push(value), stderr: (value) => output.push(value) });
    assert.equal(exit, 0, output.join("\n"));
    const result = JSON.parse(output[0]);
    assert.equal(result.authority_context.selected_run.run_id, fixture.runId);
    assert.equal(result.approved_scope.scope_id, "scope-001");
    assert.deepEqual(result.questions, []);
    assert.equal(result.valid, true);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T09 validate is machine-readable and side-effect free", async () => {
  const output = [];
  const exit = await runCli(["validate"], { repoRoot, stdout: (value) => output.push(value), stderr: (value) => output.push(value) });
  assert.equal(exit, 0, output.join("\n"));
  assert.equal(JSON.parse(output[0]).status, "pass");
});

test("PI-R2-T09 CLI preflight resolves authority without accepting direct scope input", async () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    const output = [];
    const exit = await runCli(["preflight", "--validator", fixture.validatorPath, "--run", fixture.runId, "--output", "inventory_report", "--control-root", fixture.controlRoot], { repoRoot, agdfExec: fixture.exec, stdout: (value) => output.push(value), stderr: (value) => output.push(value) });
    assert.equal(exit, 0, output.join("\n"));
    assert.equal(JSON.parse(output[0]).authority_context.scope.scope_id, "scope-001");
    const forbidden = await runCli(["preflight", "--scope", "invented.json"], { repoRoot, stdout: (value) => output.push(value), stderr: (value) => output.push(value) });
    assert.equal(forbidden, 1);
    assert.equal(JSON.parse(output.at(-1)).blockers[0].code, "PI_CLI_AUTHORITY_INPUT_FORBIDDEN");
  } finally {
    temporary.cleanup();
  }
});
