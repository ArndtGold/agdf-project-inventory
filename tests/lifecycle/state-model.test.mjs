import assert from "node:assert/strict";
import test from "node:test";
import { classifyHostState, hostStates } from "../../src/lifecycle/state.mjs";

test("PI-T09 host state keeps availability, activation, observation and UAT separate", () => {
  const cases = [
    [{}, "unavailable"],
    [{ package_present: true }, "partial"],
    [{ package_present: true, activated: false, activation_observed: true }, "available_not_activated"],
    [{ package_present: true, activated: true }, "activated_unverified"],
    [{ package_present: true, activated: true, runtime_observed: true }, "ready"],
    [{ partial: true }, "partial"],
    [{ conflict: true }, "conflict"],
  ];
  for (const [input, expected] of cases) assert.equal(classifyHostState({ host: "codex", expected_version: "0.1.0", ...input }).state, expected);
  assert.deepEqual(new Set(hostStates), new Set(cases.map((entry) => entry[1])));
  assert.equal(classifyHostState({ host: "codex", expected_version: "0.1.0", package_present: true, activated: true, runtime_observed: true }).uat_state, "not_performed");
});

test("PI-QA-008 unknown host enablement is not collapsed into inactive", () => {
  const result = classifyHostState({ host: "codex", expected_version: "0.1.0", package_present: true, activated: null, activation_observed: false });
  assert.equal(result.state, "partial");
  assert.equal(result.host_enablement_state, "unknown");
  assert.equal(result.activation_state, "unknown");
  assert.equal(result.runtime_observation_state, "not_observed");
  assert.equal(result.agdf_preflight_state, "not_run");
});

test("PI-R4-T03 lifecycle results identify the product, operation and matching recovery commands", () => {
  const result = classifyHostState({
    product: "agdf-project-inventory",
    host: "opencode",
    expected_version: "0.1.0",
    package_present: true,
    activated: true,
    operation_state: "completed",
    operation_status: "activated_unverified",
  });
  assert.equal(result.product, "agdf-project-inventory");
  assert.equal(result.version, "0.1.0");
  assert.equal(result.operation_state, "completed");
  assert.equal(result.operation_status, "activated_unverified");
  assert.equal(result.status_command, "npm run status:opencode -- --repo <repository>");
  assert.equal(result.uninstall_command, "npm run uninstall:opencode -- --repo <repository>");
  assert.match(result.next_action, /fresh OpenCode session/);
  assert.equal(result.agdf_preflight_state, "not_run");
  assert.equal(result.runtime_observation_state, "not_observed");
  assert.equal(result.uat_state, "not_performed");
});
