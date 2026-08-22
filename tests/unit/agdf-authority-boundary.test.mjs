import assert from "node:assert/strict";
import test from "node:test";
import { symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { resolveApprovedInventoryContext } from "../../plugin/skills/project-inventory/scripts/lib/agdf-bridge/preflight.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";
import { prepareAuthorityFixture } from "../helpers/agdf-context.mjs";

test("PI-T07 detects any AGDF control mutation during preflight", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    const originalExec = fixture.exec;
    const exec = (command, args, options) => {
      const result = originalExec(command, args, options);
      if (args[1] === "gate-check") writeFileSync(fixture.scopePath, "{}\n");
      return result;
    };
    const result = resolveApprovedInventoryContext({ validatorPath: fixture.validatorPath, selectedRunId: fixture.runId, requestedOutput: "inventory_report", controlRoot: fixture.controlRoot, exec });
    assert.equal(result.valid, false);
    assert.equal(result.diagnostics.some((item) => item.code === "PI_AGDF_CONTROL_MUTATED"), true);
  } finally {
    temporary.cleanup();
  }
});

test("PI-R2-T03 rejects a scope symlink that escapes AGDF control", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    const outside = `${temporary.path}/outside-scope.json`;
    writeFileSync(outside, JSON.stringify(fixture.scopeDeclaration));
    unlinkSync(fixture.scopePath);
    symlinkSync(outside, fixture.scopePath);
    const result = resolveApprovedInventoryContext({ validatorPath: fixture.validatorPath, selectedRunId: fixture.runId, requestedOutput: "inventory_report", controlRoot: fixture.controlRoot, exec: fixture.exec });
    assert.equal(result.valid, false);
    assert.equal(result.diagnostics.some((item) => item.code === "PI_AGDF_CONTROL_UNSAFE"), true);
  } finally {
    temporary.cleanup();
  }
});
