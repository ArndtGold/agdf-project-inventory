import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages } from "../../src/package/build.mjs";
import { createSchemaRegistry } from "../../plugin/skills/project-inventory/scripts/lib/validator/schema-validator.mjs";
import { resolveApprovedInventoryContext } from "../../plugin/skills/project-inventory/scripts/lib/agdf-bridge/preflight.mjs";
import { renderInventoryReport } from "../../plugin/skills/project-inventory/scripts/lib/renderers/report.mjs";
import { renderManagementView } from "../../plugin/skills/project-inventory/scripts/lib/renderers/management-view.mjs";
import { runMarketplaceInstall } from "../../src/lifecycle/marketplace-host.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";
import { scope, intake, evidence, findings } from "../helpers/fixtures.mjs";
import { prepareAuthorityFixture } from "../helpers/agdf-context.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T15 local dry-run builds, preflights and renders without real host mutation", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const projectRoot = join(temporary.path, "project");
    const authority = prepareAuthorityFixture(projectRoot);
    const build = buildPackages({ repoRoot, outputRoot });
    const registry = createSchemaRegistry(join(repoRoot, "plugin", "skills", "project-inventory", "assets", "schemas"));
    const preflight = resolveApprovedInventoryContext({ validatorPath: authority.validatorPath, selectedRunId: authority.runId, requestedOutput: "inventory_report", controlRoot: authority.controlRoot, exec: authority.exec });
    assert.equal(preflight.valid, true, JSON.stringify(preflight.diagnostics));
    let listCalls = 0;
    const lifecycle = runMarketplaceInstall({
      host: "codex",
      marketplaceRoot: join(temporary.path, "owned-marketplace"),
      expectedVersion: "0.1.0",
      exec: (_executable, args) => {
        if (args.join(" ") === "plugin marketplace list --json") return JSON.stringify({ marketplaces: [] });
        if (args.join(" ") === "plugin list --json") return JSON.stringify({ installed: listCalls++ === 0 ? [] : [{ pluginId: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", installed: true, enabled: true }] });
        return "synthetic-ok";
      },
    });
    assert.equal(lifecycle.status, "installed_available");
    const report = renderInventoryReport({ reportId: "report-001", intake, evidence, findings });
    assert.equal(registry.validate("report-index", report.index).valid, true);
    assert.equal(renderManagementView({ sourceReport: report.report, reportIndex: report.index, includedIds: ["obs-001"] }).valid, true);
    assert.equal(build.version, "0.1.0");
  } finally {
    temporary.cleanup();
  }
});
