import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, writeFileSync } from "node:fs";
import { resolveApprovedInventoryContext } from "../../plugin/skills/project-inventory/scripts/lib/agdf-bridge/preflight.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";
import { prepareAuthorityFixture } from "../helpers/agdf-context.mjs";

test("PI-R2-T02 returns one immutable validator-confirmed authority context", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    const result = resolveApprovedInventoryContext({
      validatorPath: fixture.validatorPath,
      selectedRunId: fixture.runId,
      requestedOutput: "inventory_report",
      controlRoot: fixture.controlRoot,
      exec: fixture.exec,
    });
    assert.equal(result.valid, true, JSON.stringify(result.diagnostics));
    assert.equal(result.authority_context.selected_run.run_id, fixture.runId);
    assert.equal(result.authority_context.scope.scope_ref, fixture.scopeRef);
    assert.equal(result.authority_context.validator.compatibility, "confirmed");
    assert.equal(Object.isFrozen(result.authority_context), true);
    assert.equal(result.approved_scope.source_boundary.repository_roots[0], ".");
    assert.equal(Object.isFrozen(result.approved_scope), true);
    assert.throws(() => { result.authority_context.requested_output = "management_view"; }, TypeError);
    assert.throws(() => { result.approved_scope.source_boundary.repository_roots.push("other"); }, TypeError);
  } finally {
    temporary.cleanup();
  }
});

test("PI-R2-T02 rejects an unbound legacy scope", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    const legacy = JSON.parse(readFileSync(fixture.scopePath, "utf8"));
    delete legacy.approval_gate;
    delete legacy.approval_revision_id;
    writeFileSync(fixture.scopePath, `${JSON.stringify(legacy)}\n`);
    const result = resolveApprovedInventoryContext({ validatorPath: fixture.validatorPath, selectedRunId: fixture.runId, requestedOutput: "inventory_report", controlRoot: fixture.controlRoot, exec: fixture.exec });
    assert.equal(result.valid, false);
    assert.equal(result.diagnostics.some((item) => item.code === "PI_SCHEMA_INVALID"), true);
  } finally {
    temporary.cleanup();
  }
});
