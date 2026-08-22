import assert from "node:assert/strict";
import test from "node:test";
import { classifyMarketplaceRegistration, inspectMarketplaceHost, installedVersionMatches, marketplaceCommands, runMarketplaceInstall, runMarketplaceUninstall } from "../../src/lifecycle/marketplace-host.mjs";

test("PI-T10 Codex uses local marketplace commands and does not infer repository activation", () => {
  const calls = [];
  let listCalls = 0;
  const exec = (executable, args) => {
    calls.push([executable, args]);
    if (args.join(" ") === "plugin marketplace list --json") return JSON.stringify({ marketplaces: [] });
    if (args.join(" ") === "plugin list --json") return JSON.stringify({ installed: listCalls++ === 0 ? [] : [{ pluginId: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", installed: true, enabled: true }] });
    return "ok\n";
  };
  const result = runMarketplaceInstall({ host: "codex", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec });
  assert.equal(result.status, "installed_available");
  assert.equal(result.verification_status, "healthy");
  assert.deepEqual(calls[2], ["codex", ["plugin", "marketplace", "add", "/owned/marketplace", "--json"]]);
  const inspected = inspectMarketplaceHost({ host: "codex", expectedVersion: "0.1.0", exec });
  assert.equal(inspected.package_present, true);
  assert.equal(inspected.activated, true);
  assert.equal(inspected.activation_observed, true);
  assert.equal(inspected.runtime_observed, false);
});

test("PI-QA-008 Codex preserves enabled, disabled and unknown host states", () => {
  const inspect = (entry) => inspectMarketplaceHost({
    host: "codex",
    expectedVersion: "0.1.0",
    exec: () => JSON.stringify({ installed: [entry] }),
  });
  const identity = { pluginId: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", installed: true };
  assert.deepEqual(
    { activated: inspect({ ...identity, enabled: true }).activated, observed: inspect({ ...identity, enabled: true }).activation_observed },
    { activated: true, observed: true },
  );
  assert.deepEqual(
    { activated: inspect({ ...identity, enabled: false }).activated, observed: inspect({ ...identity, enabled: false }).activation_observed },
    { activated: false, observed: true },
  );
  assert.deepEqual(
    { activated: inspect(identity).activated, observed: inspect(identity).activation_observed },
    { activated: null, observed: false },
  );
});

test("PI-T10 Codex command plan scopes uninstall to owned identifiers", () => {
  const commands = marketplaceCommands("codex", "/owned/marketplace");
  assert.deepEqual(commands.uninstall, ["plugin", "remove", "agdf-project-inventory@agdf-project-inventory"]);
  assert.deepEqual(commands.remove_marketplace, ["plugin", "marketplace", "remove", "agdf-project-inventory", "--json"]);
});

test("PI-T10 Codex leaves an existing owned current installation unchanged", () => {
  const calls = [];
  const exec = (_executable, args) => {
    const command = args.join(" ");
    calls.push(command);
    if (command === "plugin marketplace list --json") return JSON.stringify({ marketplaces: [{ name: "agdf-project-inventory", marketplaceSource: { sourceType: "local", source: "/owned/marketplace" } }] });
    if (command === "plugin list --json") return JSON.stringify({ installed: [{ pluginId: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", installed: true, enabled: true }] });
    throw new Error(`unexpected mutation: ${command}`);
  };
  const result = runMarketplaceInstall({ host: "codex", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec });
  assert.equal(result.status, "already_available");
  assert.equal(result.activated, true);
  assert.deepEqual(calls, ["plugin marketplace list --json", "plugin list --json"]);
});

test("PI-QA-009 Codex accepts only its cachebuster for the same canonical product version", () => {
  const cachebusterVersion = "0.1.0+codex.local-20260822-103028";
  const calls = [];
  const exec = (_executable, args) => {
    const command = args.join(" ");
    calls.push(command);
    if (command === "plugin marketplace list --json") return JSON.stringify({ marketplaces: [{ name: "agdf-project-inventory", marketplaceSource: { sourceType: "local", source: "/owned/marketplace" } }] });
    if (command === "plugin list --json") return JSON.stringify({ installed: [{ pluginId: "agdf-project-inventory@agdf-project-inventory", version: cachebusterVersion, installed: true, enabled: true }] });
    return "ok";
  };

  const installed = runMarketplaceInstall({ host: "codex", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec });
  assert.equal(installed.status, "already_available");
  assert.equal(inspectMarketplaceHost({ host: "codex", expectedVersion: "0.1.0", exec }).conflict, false);
  assert.equal(runMarketplaceUninstall({ host: "codex", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec }).status, "uninstalled");
  assert.equal(installedVersionMatches(cachebusterVersion, "0.1.0", { allowCodexCachebuster: true }), true);
  assert.equal(installedVersionMatches("0.1.1+codex.local-20260822-103028", "0.1.0", { allowCodexCachebuster: true }), false);
  assert.equal(installedVersionMatches("0.1.0+other.local", "0.1.0", { allowCodexCachebuster: true }), false);
  assert.equal(installedVersionMatches("0.1.0+codex.", "0.1.0", { allowCodexCachebuster: true }), false);
  assert.equal(installedVersionMatches("0.1.0+codex.local..broken", "0.1.0", { allowCodexCachebuster: true }), false);
  assert.deepEqual(calls.slice(-2), [
    "plugin remove agdf-project-inventory@agdf-project-inventory",
    "plugin marketplace remove agdf-project-inventory --json",
  ]);
});

test("PI-T10 Codex refuses a foreign marketplace with the product identifier", () => {
  const output = JSON.stringify({ marketplaces: [{ name: "agdf-project-inventory", marketplaceSource: { sourceType: "local", source: "/foreign" } }] });
  assert.equal(classifyMarketplaceRegistration("codex", output, "/owned/marketplace").state, "conflict");
  assert.throws(() => runMarketplaceInstall({ host: "codex", marketplaceRoot: "/owned/marketplace", exec: (_command, args) => args.includes("list") ? output : "ok" }), /non-owned/);
});

test("PI-T10 Codex rolls back only state attempted by the failed install", () => {
  const calls = [];
  const exec = (_executable, args) => {
    const command = args.join(" ");
    calls.push(command);
    if (command === "plugin marketplace list --json") return JSON.stringify({ marketplaces: [] });
    if (command === "plugin list --json") return JSON.stringify({ installed: [] });
    if (command === "plugin add agdf-project-inventory --marketplace agdf-project-inventory") throw new Error("install failed");
    return "ok";
  };
  assert.throws(
    () => runMarketplaceInstall({ host: "codex", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec }),
    (error) => error.evidence.operation_state === "rolled_back",
  );
  assert.deepEqual(calls.slice(-2), [
    "plugin remove agdf-project-inventory@agdf-project-inventory",
    "plugin marketplace remove agdf-project-inventory --json",
  ]);
});

test("PI-T10 Codex reports a partial uninstall without hiding retained native state", () => {
  const exec = (_executable, args) => {
    const command = args.join(" ");
    if (command === "plugin marketplace list --json") return JSON.stringify({ marketplaces: [{ name: "agdf-project-inventory", marketplaceSource: { sourceType: "local", source: "/owned/marketplace" } }] });
    if (command === "plugin list --json") return JSON.stringify({ installed: [{ pluginId: "agdf-project-inventory@agdf-project-inventory", version: "0.1.0", installed: true, enabled: true }] });
    if (command === "plugin marketplace remove agdf-project-inventory --json") throw new Error("remove failed");
    return "ok";
  };
  assert.throws(
    () => runMarketplaceUninstall({ host: "codex", marketplaceRoot: "/owned/marketplace", expectedVersion: "0.1.0", exec }),
    (error) => error.evidence.operation_state === "partial" && error.evidence.retained.includes("native_marketplace_registration"),
  );
});
