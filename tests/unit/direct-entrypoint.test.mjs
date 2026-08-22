import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runProjectInventoryCommand } from "../../plugin/skills/project-inventory/scripts/project-inventory.mjs";
import { runCli } from "../../src/cli/index.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-R3-T03 direct entrypoint and repository wrapper validate the same capability", async () => {
  const direct = await runProjectInventoryCommand("validate");
  const output = [];
  const exitCode = await runCli(["validate"], { repoRoot, stdout: (value) => output.push(value) });
  const wrapped = JSON.parse(output[0]);

  assert.equal(exitCode, 0);
  assert.deepEqual(
    { valid: wrapped.valid, status: wrapped.status, schemas: wrapped.schemas },
    { valid: direct.valid, status: direct.status, schemas: direct.schemas },
  );
});

test("PI-R3-T04 direct entrypoint and wrapper reject caller-created authority identically", async () => {
  const argv = ["preflight", "--scope", "invented"];
  const direct = await runProjectInventoryCommand("preflight", { scope: "invented" });
  const output = [];
  const exitCode = await runCli(argv, { repoRoot, stdout: (value) => output.push(value) });
  const wrapped = JSON.parse(output[0]);

  assert.equal(exitCode, 1);
  assert.equal(direct.next_recovery_action_code, "PI_CLI_AUTHORITY_INPUT_FORBIDDEN");
  assert.deepEqual(wrapped, direct);
});
