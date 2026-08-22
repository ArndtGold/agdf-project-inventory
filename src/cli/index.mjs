import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { buildPackages } from "../package/build.mjs";
import { loadDefinition, validateDefinition } from "../package/definition-validator.mjs";
import { classifyHostState } from "../lifecycle/state.mjs";
import { prepareLocalMarketplace } from "../lifecycle/local-marketplace.mjs";
import { inspectMarketplaceHost, runMarketplaceInstall, runMarketplaceUninstall } from "../lifecycle/marketplace-host.mjs";
import { inspectOpenCode, installOpenCodeProjection, uninstallOpenCodeProjection } from "../lifecycle/opencode.mjs";
import { ownershipMarker } from "../lifecycle/ownership.mjs";
import { resolveCanonicalSkillRoot } from "../shared/skill-root.mjs";

export async function runCli(argv, { repoRoot, skillRoot, stdout = console.log, stderr = console.error, marketplaceExec, agdfExec } = {}) {
  let command = argv[0] ?? "help";
  let options = {};
  let definition;
  try {
    ({ command, options } = parseArguments(argv));
    definition = loadDefinition(repoRoot);
    if (command === "build") {
      const result = buildPackages({ repoRoot });
      stdout(JSON.stringify({ status: "pass", command, version: result.version, output_digest: result.output_digest, files: result.files.length + 1 }, null, 2));
      return 0;
    }
    if (command === "validate") {
      const capability = await loadCapability(skillRoot ?? resolveCanonicalSkillRoot(repoRoot));
      const skillResult = await capability.runProjectInventoryCommand(command, options, { skillRoot: skillRoot ?? resolveCanonicalSkillRoot(repoRoot) });
      const packageResult = existsSync(join(repoRoot, "plugin", "meta", "project-inventory-plugin.definition.json"))
        ? validateDefinition(repoRoot)
        : { diagnostics: [] };
      const diagnostics = [...packageResult.diagnostics, ...skillResult.diagnostics];
      const result = {
        ...skillResult,
        product: definition.id,
        version: definition.version,
        valid: !diagnostics.some((item) => ["block", "revise"].includes(item.severity)),
        status: diagnostics.some((item) => ["block", "revise"].includes(item.severity)) ? "block" : "pass",
        diagnostics,
      };
      stdout(JSON.stringify(result, null, 2));
      return result.valid ? 0 : 1;
    }
    if (["preflight", "validate-run"].includes(command)) {
      const resolvedSkillRoot = skillRoot ?? resolveCanonicalSkillRoot(repoRoot);
      const capability = await loadCapability(resolvedSkillRoot);
      const result = await capability.runProjectInventoryCommand(command, options, { skillRoot: resolvedSkillRoot, ...(agdfExec ? { agdfExec } : {}) });
      stdout(JSON.stringify({
        ...result,
      }, null, 2));
      return result.valid ? 0 : 1;
    }
    if (command === "status") {
      const host = requiredHost(options);
      const repo = host === "opencode" ? requiredRepository(options) : repoRoot;
      const evidence = host === "opencode"
        ? inspectOpenCode({ repoRoot: repo, expectedVersion: definition.version })
        : inspectMarketplaceHost({ host, expectedVersion: definition.version, ...(marketplaceExec ? { exec: marketplaceExec } : {}) });
      stdout(JSON.stringify(classifyHostState({ product: definition.id, host, expected_version: definition.version, operation_state: "inspected", operation_status: "status", ...evidence }), null, 2));
      return evidence.conflict ? 2 : 0;
    }
    if (command === "install") {
      const host = requiredHost(options);
      buildPackages({ repoRoot });
      if (host === "opencode") {
        const repo = requiredRepository(options);
        const result = installOpenCodeProjection({ projectionRoot: join(repoRoot, "generated", "opencode"), repoRoot: repo, version: definition.version });
        stdout(JSON.stringify(classifyHostState({
          product: definition.id,
          host,
          expected_version: definition.version,
          observed_version: definition.version,
          package_present: true,
          activated: true,
          operation_state: "completed",
          operation_status: result.status,
          retained_valid_state: result.retained ?? [],
          evidence: [result.target, result.skill_target, result.config_path],
          operation_evidence: result,
        }), null, 2));
        return 0;
      }
      const marketplaceRoot = resolve(options["data-root"] ?? join(defaultDataRoot(), "marketplaces", definition.id));
      const transaction = prepareLocalMarketplace({ root: marketplaceRoot, builtPluginRoot: join(repoRoot, "generated", "plugins", definition.id), definition });
      try {
        const result = runMarketplaceInstall({ host, marketplaceRoot, expectedVersion: definition.version, ...(marketplaceExec ? { exec: marketplaceExec } : {}) });
        transaction.commit();
        stdout(JSON.stringify(classifyHostState({
          product: definition.id,
          host,
          expected_version: definition.version,
          observed_version: result.observed_version,
          package_present: true,
          activated: result.activated,
          activation_observed: result.activation_observed,
          operation_state: "completed",
          operation_status: result.status,
          evidence: result.output,
          operation_evidence: result,
        }), null, 2));
        return 0;
      } catch (error) {
        transaction.rollback();
        throw error;
      }
    }
    if (command === "uninstall") {
      const host = requiredHost(options);
      if (host === "opencode") {
        const result = uninstallOpenCodeProjection({ repoRoot: requiredRepository(options) });
        stdout(JSON.stringify(classifyHostState({
          product: definition.id,
          host,
          expected_version: definition.version,
          operation_state: "completed",
          operation_status: result.status,
          retained_valid_state: result.retained ?? [],
          evidence: result.removed ?? [],
          operation_evidence: result,
        }), null, 2));
        return 0;
      }
      const marketplaceRoot = resolve(options["data-root"] ?? join(defaultDataRoot(), "marketplaces", definition.id));
      if (!ownershipMarker(marketplaceRoot)) throw new Error(`Refusing uninstall without a local ownership marker: ${marketplaceRoot}`);
      const result = runMarketplaceUninstall({ host, marketplaceRoot, expectedVersion: definition.version, ...(marketplaceExec ? { exec: marketplaceExec } : {}) });
      stdout(JSON.stringify(classifyHostState({
        product: definition.id,
        host,
        expected_version: definition.version,
        operation_state: "completed",
        operation_status: result.status,
        retained_valid_state: result.retained ?? [],
        evidence: result.output,
        operation_evidence: result,
      }), null, 2));
      return 0;
    }
    stderr(usage());
    return 2;
  } catch (error) {
    const failure = lifecycleFailure({ command, options, definition, error });
    stderr(JSON.stringify(failure ?? { status: "block", code: "PI_CLI_OPERATION_FAILED", command, message: error.message, ...(error.evidence ? { evidence: error.evidence } : {}) }, null, 2));
    return 1;
  }
}

export function parseArguments(argv) {
  const [command = "help", ...rest] = argv;
  const contract = commandOptionContracts[command] ?? { values: [], booleans: [] };
  const allowed = new Set([...contract.values, ...contract.booleans]);
  const booleans = new Set(contract.booleans);
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (!allowed.has(key)) throw new Error(`Unknown option for ${command}: --${key}`);
    if (Object.hasOwn(options, key)) throw new Error(`Duplicate option for ${command}: --${key}`);
    if (booleans.has(key)) {
      options[key] = true;
      continue;
    }
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Option --${key} requires a value.`);
    options[key] = value;
    index += 1;
  }
  validateLifecycleOptions(command, options);
  return { command, options };
}

const commandOptionContracts = Object.freeze({
  build: { values: [], booleans: [] },
  validate: { values: [], booleans: [] },
  preflight: { values: ["validator", "run", "output", "control-root", "scope", "scope-declaration", "compatibility", "approval"], booleans: [] },
  "validate-run": { values: ["validator", "run", "output", "control-root", "run-dir", "locale", "scope", "scope-declaration", "compatibility", "approval"], booleans: [] },
  status: { values: ["host", "repo"], booleans: ["json"] },
  install: { values: ["host", "repo", "data-root"], booleans: [] },
  uninstall: { values: ["host", "repo", "data-root"], booleans: [] },
  help: { values: [], booleans: [] },
});

function validateLifecycleOptions(command, options) {
  if (!["install", "status", "uninstall"].includes(command)) return;
  const host = requiredHost(options);
  if (host === "opencode") {
    if (typeof options.repo !== "string") throw new Error("--repo is required for the OpenCode repository projection.");
    if (options["data-root"] !== undefined) throw new Error(`--data-root is not supported for ${host}.`);
    return;
  }
  if (options.repo !== undefined) throw new Error(`--repo is not supported for ${host}.`);
}

function requiredHost(options) {
  if (!["codex", "claude", "opencode"].includes(options.host)) throw new Error("--host must be codex, claude or opencode.");
  return options.host;
}

function requiredRepository(options) {
  if (typeof options.repo !== "string") throw new Error("--repo is required for the OpenCode repository projection.");
  return resolve(options.repo);
}

function defaultDataRoot() {
  if (process.env.AGDF_PROJECT_INVENTORY_DATA_DIR) return resolve(process.env.AGDF_PROJECT_INVENTORY_DATA_DIR);
  if (process.platform === "darwin") return join(homedir(), "Library", "Application Support", "agdf-project-inventory");
  if (process.platform === "win32") return join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "agdf-project-inventory");
  return join(process.env.XDG_DATA_HOME || join(homedir(), ".local", "share"), "agdf-project-inventory");
}

function lifecycleFailure({ command, options, definition, error }) {
  if (!["install", "status", "uninstall"].includes(command) || !["codex", "claude", "opencode"].includes(options.host)) return null;
  const operationState = error.evidence?.operation_state ?? "blocked";
  const partial = operationState === "partial";
  const conflict = !partial && /refus|conflict|foreign|unowned|ambiguous|incomplete/i.test(error.message);
  const blockers = [
    { code: "PI_CLI_OPERATION_FAILED", message: error.message },
    ...(error.evidence?.rollback_errors ?? []).map((item) => ({
      code: "PI_CLI_ROLLBACK_FAILED",
      phase: item.phase,
      message: item.message,
    })),
  ];
  return classifyHostState({
    product: definition?.id ?? "agdf-project-inventory",
    host: options.host,
    expected_version: definition?.version ?? null,
    operation_state: operationState,
    operation_status: "blocked",
    partial,
    conflict,
    blockers,
    retained_valid_state: error.evidence?.retained ?? [],
    evidence: error.evidence?.output ?? [],
    operation_evidence: error.evidence ?? null,
    next_action: partial
      ? "Inspect the retained operation state, complete the reported recovery step and retry explicitly."
      : `Resolve the reported ${options.host} blocker and retry the explicit ${command} command.`,
  });
}

function usage() {
  return [
    "Usage:",
    "  agdf-project-inventory build",
    "  agdf-project-inventory validate",
    "  agdf-project-inventory preflight --validator <absolute-path> --run <run-id> --output <output> --control-root <path>",
    "  agdf-project-inventory validate-run --validator <absolute-path> --run <run-id> --output <output> --control-root <path> --run-dir <path> [--locale <de|en>]",
    "  agdf-project-inventory status --host <codex|claude> [--json]",
    "  agdf-project-inventory status --host opencode --repo <path> [--json]",
    "  agdf-project-inventory install --host <codex|claude> [--data-root <path>]",
    "  agdf-project-inventory install --host opencode --repo <path>",
    "  agdf-project-inventory uninstall --host <codex|claude> [--data-root <path>]",
    "  agdf-project-inventory uninstall --host opencode --repo <path>",
  ].join("\n");
}

async function loadCapability(skillRoot) {
  return import(pathToFileURL(join(skillRoot, "scripts", "project-inventory.mjs")).href);
}
