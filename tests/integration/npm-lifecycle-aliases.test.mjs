import assert from "node:assert/strict";
import test from "node:test";
import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { delimiter, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-R4-T04 Codex and Claude npm aliases work from an isolated checkout without node_modules", () => {
  for (const host of ["codex", "claude"]) {
    const temporary = temporaryDirectory(`agdf-project-inventory-${host}-alias-`);
    try {
      const sourceRoot = isolatedSource(temporary.path);
      const shimRoot = join(temporary.path, "bin");
      const statePath = join(temporary.path, `${host}-state.json`);
      const dataRoot = join(temporary.path, "data");
      writeHostShim(shimRoot, host);
      const environment = {
        ...process.env,
        PATH: `${shimRoot}${delimiter}${process.env.PATH}`,
        PI_HOST_SHIM_STATE: statePath,
        PI_SOURCE_ROOT: sourceRoot,
        AGDF_PROJECT_INVENTORY_DATA_DIR: dataRoot,
      };

      const installed = runNpm(sourceRoot, ["run", `install:${host}`], environment);
      assert.equal(installed.product, "agdf-project-inventory");
      assert.equal(installed.version, "0.1.0");
      assert.equal(installed.host, host);
      assert.equal(installed.operation_state, "completed");
      assert.equal(installed.state, "activated_unverified");
      assert.equal(installed.host_enablement_state, "enabled");
      assert.equal(installed.runtime_observation_state, "not_observed");
      assert.equal(installed.uat_state, "not_performed");
      assert.equal(installed.status_command, `npm run status:${host}`);
      assert.equal(installed.uninstall_command, `npm run uninstall:${host}`);
      assert.equal(typeof installed.next_action, "string");
      assert.equal(existsSync(join(sourceRoot, "node_modules")), false);

      const status = runNpm(sourceRoot, ["run", `status:${host}`], environment);
      assert.equal(status.state, "activated_unverified");
      assert.equal(status.host_enablement_state, "enabled");
      const uninstalled = runNpm(sourceRoot, ["run", `uninstall:${host}`], environment);
      assert.equal(uninstalled.operation_status, "uninstalled");

      const shimState = JSON.parse(readFileSync(statePath, "utf8"));
      assert.ok(shimState.calls.length >= 7);
      assert.equal(shimState.build_report_seen_before_every_call, true);

      if (host === "codex") {
        writeFileSync(statePath, JSON.stringify({ marketplace: "/foreign/marketplace", installed: false, calls: [], build_report_seen_before_every_call: true }));
        const conflict = runNpmOutcome(sourceRoot, ["run", "install:codex"], environment);
        assert.equal(conflict.exit_status, 1);
        assert.equal(conflict.output.operation_status, "blocked");
        assert.equal(conflict.output.state, "conflict");
        assert.equal(conflict.output.blockers.length, 1);
        assert.equal(conflict.output.retained_valid_state.length, 0);
        assert.equal(typeof conflict.output.next_action, "string");
        assert.equal(conflict.output.status_command, "npm run status:codex");
        assert.equal(conflict.output.uninstall_command, "npm run uninstall:codex");
        const conflictState = JSON.parse(readFileSync(statePath, "utf8"));
        assert.equal(conflictState.build_report_seen_before_every_call, true);

        writeFileSync(statePath, JSON.stringify({ marketplace: null, installed: false, calls: [], build_report_seen_before_every_call: true }));
        const partial = runNpmOutcome(sourceRoot, ["run", "install:codex"], { ...environment, PI_HOST_SHIM_FAILURE: "install_and_rollback" });
        assert.equal(partial.exit_status, 1);
        assert.equal(partial.output.operation_state, "partial");
        assert.equal(partial.output.operation_status, "blocked");
        assert.equal(partial.output.state, "partial");
        assert.deepEqual(partial.output.blockers.map((item) => item.code), [
          "PI_CLI_OPERATION_FAILED",
          "PI_CLI_ROLLBACK_FAILED",
          "PI_CLI_ROLLBACK_FAILED",
        ]);
        assert.equal(typeof partial.output.next_action, "string");
      }
    } finally {
      temporary.cleanup();
    }
  }
});

test("PI-R4-T06 OpenCode npm aliases use only the explicit temporary repository", () => {
  const temporary = temporaryDirectory("agdf-project-inventory-opencode-alias-");
  try {
    const sourceRoot = isolatedSource(temporary.path);
    const targetRepo = join(temporary.path, "target-repository");
    mkdirSync(targetRepo, { recursive: true });
    const repoArgs = ["--", "--repo", targetRepo];

    const installed = runNpm(sourceRoot, ["run", "install:opencode", ...repoArgs], process.env);
    assert.equal(installed.product, "agdf-project-inventory");
    assert.equal(installed.host, "opencode");
    assert.equal(installed.operation_state, "completed");
    assert.equal(installed.state, "activated_unverified");
    assert.equal(installed.runtime_observation_state, "not_observed");
    assert.equal(installed.uat_state, "not_performed");
    assert.equal(existsSync(join(sourceRoot, "node_modules")), false);
    assert.equal(existsSync(join(targetRepo, ".opencode", "skills", "project-inventory", "SKILL.md")), true);

    const status = runNpm(sourceRoot, ["run", "status:opencode", ...repoArgs], process.env);
    assert.equal(status.state, "activated_unverified");
    const uninstalled = runNpm(sourceRoot, ["run", "uninstall:opencode", ...repoArgs], process.env);
    assert.equal(uninstalled.operation_status, "uninstalled");
    assert.equal(existsSync(join(targetRepo, ".opencode", "project-inventory")), false);
  } finally {
    temporary.cleanup();
  }
});

function isolatedSource(temporaryRoot) {
  const target = join(temporaryRoot, "source");
  mkdirSync(target, { recursive: true });
  for (const path of ["package.json", "bin", "plugin", "src", "scripts"]) {
    cpSync(join(repoRoot, path), join(target, path), { recursive: true });
  }
  return target;
}

function runNpm(cwd, args, environment) {
  const result = runNpmOutcome(cwd, args, environment);
  assert.equal(result.exit_status, 0, `${result.stdout}\n${result.stderr}`);
  return result.output;
}

function runNpmOutcome(cwd, args, environment) {
  const result = spawnSync("npm", args, { cwd, env: environment, encoding: "utf8", stdio: "pipe" });
  const stream = result.status === 0 ? result.stdout : result.stderr;
  const start = stream.indexOf("{");
  assert.notEqual(start, -1, `${result.stdout}\n${result.stderr}`);
  return { exit_status: result.status, output: JSON.parse(stream.slice(start)), stdout: result.stdout, stderr: result.stderr };
}

function writeHostShim(root, host) {
  mkdirSync(root, { recursive: true });
  const path = join(root, host);
  writeFileSync(path, `#!/usr/bin/env node
const { existsSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const host = ${JSON.stringify(host)};
const statePath = process.env.PI_HOST_SHIM_STATE;
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { marketplace: null, installed: false, calls: [], build_report_seen_before_every_call: true };
const args = process.argv.slice(2);
state.calls.push(args);
state.build_report_seen_before_every_call &&= existsSync(join(process.env.PI_SOURCE_ROOT, "generated", "BUILD_REPORT.json"));
const command = args.join(" ");
let output = "ok\\n";
if (process.env.PI_HOST_SHIM_FAILURE === "install_and_rollback" && (
  (args[0] === "plugin" && args[1] === "add") ||
  (args[0] === "plugin" && ["remove", "uninstall"].includes(args[1])) ||
  (args[0] === "plugin" && args[1] === "marketplace" && args[2] === "remove")
)) {
  writeFileSync(statePath, JSON.stringify(state));
  process.stderr.write("synthetic lifecycle failure\\n");
  process.exit(7);
}
if (command === "plugin marketplace list --json") {
  if (host === "codex") output = JSON.stringify({ marketplaces: state.marketplace ? [{ name: "agdf-project-inventory", marketplaceSource: { sourceType: "local", source: state.marketplace } }] : [] });
  else output = JSON.stringify(state.marketplace ? [{ name: "agdf-project-inventory", source: state.marketplace }] : []);
} else if (args[0] === "plugin" && args[1] === "marketplace" && args[2] === "add") {
  state.marketplace = args[3];
} else if (command === "plugin list --json") {
  const entry = host === "codex"
    ? { pluginId: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", installed: true, enabled: true }
    : { id: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", enabled: true };
  output = JSON.stringify(state.installed ? (host === "codex" ? { installed: [entry] } : [entry]) : (host === "codex" ? { installed: [] } : []));
} else if ((host === "codex" && args[0] === "plugin" && args[1] === "add") || (host === "claude" && args[0] === "plugin" && args[1] === "install")) {
  state.installed = true;
} else if (args[0] === "plugin" && ["remove", "uninstall"].includes(args[1])) {
  state.installed = false;
} else if (args[0] === "plugin" && args[1] === "marketplace" && args[2] === "remove") {
  state.marketplace = null;
}
writeFileSync(statePath, JSON.stringify(state));
process.stdout.write(output);
`, "utf8");
  chmodSync(path, 0o755);
}
