import assert from "node:assert/strict";
import test from "node:test";
import { classifyMarketplaceRegistration, inspectMarketplaceHost, marketplaceCommands, runMarketplaceInstall } from "../../src/lifecycle/marketplace-host.mjs";

test("PI-T11 Claude keeps native scope mechanics distinct from discovery and UAT", () => {
  const calls = [];
  let listCalls = 0;
  const exec = (executable, args) => {
    calls.push([executable, args]);
    if (args.join(" ") === "plugin marketplace list --json") return JSON.stringify([]);
    if (args.join(" ") === "plugin list --json") return JSON.stringify(listCalls++ === 0 ? [] : [{ id: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", enabled: true }]);
    return "ok\n";
  };
  runMarketplaceInstall({ host: "claude", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec });
  assert.deepEqual(calls[2], ["claude", ["plugin", "marketplace", "add", "/owned/marketplace", "--scope", "user"]]);
  const inspected = inspectMarketplaceHost({ host: "claude", expectedVersion: "0.1.0", exec });
  assert.equal(inspected.package_present, true);
  assert.equal(inspected.activated, true);
  assert.equal(inspected.activation_observed, true);
  assert.equal(inspected.runtime_observed, false);
});

test("PI-QA-008 Claude preserves enabled, disabled and unknown host states", () => {
  const inspect = (entry) => inspectMarketplaceHost({
    host: "claude",
    expectedVersion: "0.1.0",
    exec: () => JSON.stringify([entry]),
  });
  const identity = { id: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0" };
  assert.equal(inspect({ ...identity, enabled: true }).activated, true);
  assert.equal(inspect({ ...identity, enabled: false }).activated, false);
  assert.equal(inspect(identity).activated, null);
  assert.equal(inspect(identity).activation_observed, false);
});

test("PI-T11 Claude command plan uses explicit owned plugin and marketplace identifiers", () => {
  const commands = marketplaceCommands("claude", "/owned/marketplace");
  assert.deepEqual(commands.install, ["plugin", "install", "agdf-project-inventory@agdf-project-inventory"]);
  assert.deepEqual(commands.remove_marketplace, ["plugin", "marketplace", "remove", "agdf-project-inventory", "--scope", "user"]);
});

test("PI-T11 Claude leaves an existing owned current installation unchanged", () => {
  const calls = [];
  const exec = (_executable, args) => {
    const command = args.join(" ");
    calls.push(command);
    if (command === "plugin marketplace list --json") return JSON.stringify([{ name: "agdf-project-inventory", source: "/owned/marketplace" }]);
    if (command === "plugin list --json") return JSON.stringify([{ id: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", enabled: true }]);
    throw new Error(`unexpected mutation: ${command}`);
  };
  const result = runMarketplaceInstall({ host: "claude", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec });
  assert.equal(result.status, "already_available");
  assert.equal(result.activated, true);
  assert.deepEqual(calls, ["plugin marketplace list --json", "plugin list --json"]);
});

test("PI-QA-009 Claude does not accept a Codex-only cachebuster", () => {
  const inspected = inspectMarketplaceHost({
    host: "claude",
    expectedVersion: "0.1.0",
    exec: () => JSON.stringify([{ id: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0+codex.local-20260822-103028", enabled: true }]),
  });
  assert.equal(inspected.conflict, true);
});

test("PI-T11 Claude rejects a wrong-scope marketplace source", () => {
  const output = JSON.stringify([{ name: "agdf-project-inventory", source: "/foreign/marketplace" }]);
  assert.equal(classifyMarketplaceRegistration("claude", output, "/owned/marketplace").state, "conflict");
  assert.throws(
    () => runMarketplaceInstall({ host: "claude", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec: (_command, args) => args.includes("list") ? output : "ok" }),
    /non-owned/,
  );
});

test("PI-T11 Claude command failure rolls back owned package and marketplace identifiers", () => {
  const calls = [];
  const exec = (_executable, args) => {
    const command = args.join(" ");
    calls.push(command);
    if (command === "plugin marketplace list --json") return JSON.stringify([]);
    if (command === "plugin list --json") return JSON.stringify([]);
    if (command === "plugin install agdf-project-inventory@agdf-project-inventory") throw new Error("install failed");
    return "ok";
  };
  assert.throws(
    () => runMarketplaceInstall({ host: "claude", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec }),
    (error) => error.evidence.operation_state === "rolled_back",
  );
  assert.deepEqual(calls.slice(-2), [
    "plugin uninstall agdf-project-inventory@agdf-project-inventory",
    "plugin marketplace remove agdf-project-inventory --scope user",
  ]);
});
