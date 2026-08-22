import assert from "node:assert/strict";
import test from "node:test";
import { resolveApprovedInventoryContext } from "../../plugin/skills/project-inventory/scripts/lib/agdf-bridge/preflight.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";
import { prepareAuthorityFixture } from "../helpers/agdf-context.mjs";

test("PI-T07 runs fixed read-only AGDF preflight calls for one selected run", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    const result = resolveApprovedInventoryContext({ validatorPath: fixture.validatorPath, selectedRunId: fixture.runId, requestedOutput: "inventory_report", controlRoot: fixture.controlRoot, exec: fixture.exec });
    assert.equal(result.valid, true, JSON.stringify(result.diagnostics));
    assert.deepEqual(fixture.calls.map((entry) => entry[0]), ["--resolve-only", "doctor", "gate-check", "delivery-map"]);
    assert.deepEqual(fixture.calls[2], ["gate-check", "--run", fixture.runId, "--json"]);
  } finally {
    temporary.cleanup();
  }
});

test("PI-R2-T03 blocks an output absent from the validator-resolved scope", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    const result = resolveApprovedInventoryContext({ validatorPath: fixture.validatorPath, selectedRunId: fixture.runId, requestedOutput: "unapproved_output", controlRoot: fixture.controlRoot, exec: fixture.exec });
    assert.equal(result.valid, false);
    assert.equal(result.diagnostics.some((item) => item.code === "PI_SCOPE_OUTPUT_DISALLOWED"), true);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T07 blocks a scope reference that is not tied to an approved AGDF artefact", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    fixture.outputs.delivery.approvals.UR.status = "missing";
    const result = resolveApprovedInventoryContext({ validatorPath: fixture.validatorPath, selectedRunId: fixture.runId, requestedOutput: "inventory_report", controlRoot: fixture.controlRoot, exec: fixture.exec });
    assert.equal(result.valid, false);
    assert.equal(result.diagnostics.some((item) => item.code === "PI_SCOPE_APPROVAL_UNVERIFIED"), true);
  } finally {
    temporary.cleanup();
  }
});

test("PI-R2-T03 blocks AGDF evidence from a different repository target", () => {
  const temporary = temporaryDirectory();
  try {
    const fixture = prepareAuthorityFixture(temporary.path);
    fixture.outputs.doctor.target_dir = "/different/project";
    const result = resolveApprovedInventoryContext({ validatorPath: fixture.validatorPath, selectedRunId: fixture.runId, requestedOutput: "inventory_report", controlRoot: fixture.controlRoot, exec: fixture.exec });
    assert.equal(result.valid, false);
    assert.equal(result.diagnostics.some((item) => item.code === "PI_AGDF_TARGET_MISMATCH"), true);
  } finally {
    temporary.cleanup();
  }
});
