import { execFileSync } from "node:child_process";
import { isAbsolute, resolve } from "node:path";

export function marketplaceCommands(host, marketplaceRoot, pluginId = "agdf-project-inventory") {
  if (host === "codex") return {
    executable: "codex",
    inspect_marketplaces: ["plugin", "marketplace", "list", "--json"],
    add_marketplace: ["plugin", "marketplace", "add", marketplaceRoot, "--json"],
    install: ["plugin", "add", pluginId, "--marketplace", pluginId],
    list: ["plugin", "list", "--json"],
    uninstall: ["plugin", "remove", `${pluginId}@${pluginId}`],
    remove_marketplace: ["plugin", "marketplace", "remove", pluginId, "--json"],
  };
  if (host === "claude") return {
    executable: "claude",
    inspect_marketplaces: ["plugin", "marketplace", "list", "--json"],
    add_marketplace: ["plugin", "marketplace", "add", marketplaceRoot, "--scope", "user"],
    install: ["plugin", "install", `${pluginId}@${pluginId}`],
    list: ["plugin", "list", "--json"],
    uninstall: ["plugin", "uninstall", `${pluginId}@${pluginId}`],
    remove_marketplace: ["plugin", "marketplace", "remove", pluginId, "--scope", "user"],
  };
  throw new Error(`Unsupported marketplace host: ${host}`);
}

export function runMarketplaceInstall({ host, marketplaceRoot, expectedVersion, exec = execFileSync }) {
  const commands = marketplaceCommands(host, marketplaceRoot);
  const output = [];
  const marketplaceOutput = exec(commands.executable, commands.inspect_marketplaces, { encoding: "utf8", stdio: "pipe" });
  const registration = classifyMarketplaceRegistration(host, marketplaceOutput, marketplaceRoot);
  output.push({ phase: "inspect_marketplaces", args: commands.inspect_marketplaces, registration });
  if (registration.state === "conflict" || registration.state === "unknown") throw new Error(`Refusing non-owned ${host} marketplace registration: ${registration.reason}`);

  const beforeOutput = exec(commands.executable, commands.list, { encoding: "utf8", stdio: "pipe" });
  const before = inspectPackageListing(beforeOutput, expectedVersion, { allowCodexCachebuster: host === "codex" });
  output.push({ phase: "pre_install_list", args: commands.list, package: before });
  if (!before.listing_valid) throw new Error(`Cannot verify ${host} package state from plugin list JSON.`);
  if (before.conflict) throw new Error(`Refusing installed ${host} package version ${before.observed_version}; expected ${expectedVersion}.`);
  if (before.package_present) {
    if (registration.state !== "owned_local_current") throw new Error(`Refusing inconsistent ${host} state: package exists without the owned marketplace.`);
    return {
      host,
      status: "already_available",
      verification_status: before.observed_version && before.activation_observed ? "healthy" : "degraded",
      observed_version: before.observed_version,
      activated: before.activated,
      activation_observed: before.activation_observed,
      output,
    };
  }

  let marketplaceAdded = false;
  let installAttempted = false;
  try {
    if (registration.state === "absent") {
      output.push({ phase: "add_marketplace", args: commands.add_marketplace, output: exec(commands.executable, commands.add_marketplace, { encoding: "utf8", stdio: "pipe" }) });
      marketplaceAdded = true;
    }
    installAttempted = true;
    output.push({ phase: "install", args: commands.install, output: exec(commands.executable, commands.install, { encoding: "utf8", stdio: "pipe" }) });
    const afterOutput = exec(commands.executable, commands.list, { encoding: "utf8", stdio: "pipe" });
    const after = inspectPackageListing(afterOutput, expectedVersion, { allowCodexCachebuster: host === "codex" });
    output.push({ phase: "post_install_list", args: commands.list, package: after });
    if (!after.listing_valid) throw new Error(`${host} returned unsupported plugin list JSON after installation.`);
    if (!after.package_present) throw new Error(`${host} did not report the installed package.`);
    if (after.conflict) throw new Error(`${host} reported package version ${after.observed_version}; expected ${expectedVersion}.`);
    return {
      host,
      status: "installed_available",
      verification_status: after.observed_version && after.activation_observed ? "healthy" : "degraded",
      observed_version: after.observed_version,
      activated: after.activated,
      activation_observed: after.activation_observed,
      output,
    };
  } catch (error) {
    const rollback = [];
    const rollbackErrors = [];
    if (installAttempted) executeRecovery(commands, "uninstall", exec, rollback, rollbackErrors);
    if (marketplaceAdded) executeRecovery(commands, "remove_marketplace", exec, rollback, rollbackErrors);
    throw operationError(`Marketplace install failed: ${error.message}`, {
      operation_state: rollbackErrors.length ? "partial" : "rolled_back",
      output,
      rollback,
      rollback_errors: rollbackErrors,
    });
  }
}

export function runMarketplaceUninstall({ host, marketplaceRoot, expectedVersion, exec = execFileSync }) {
  const commands = marketplaceCommands(host, marketplaceRoot);
  const output = [];
  const marketplaceOutput = exec(commands.executable, commands.inspect_marketplaces, { encoding: "utf8", stdio: "pipe" });
  const registration = classifyMarketplaceRegistration(host, marketplaceOutput, marketplaceRoot);
  output.push({ phase: "inspect_marketplaces", args: commands.inspect_marketplaces, registration });
  if (registration.state !== "owned_local_current") throw new Error(`Refusing uninstall without an owned marketplace registration: ${registration.reason || registration.state}`);
  const beforeOutput = exec(commands.executable, commands.list, { encoding: "utf8", stdio: "pipe" });
  const before = inspectPackageListing(beforeOutput, expectedVersion, { allowCodexCachebuster: host === "codex" });
  output.push({ phase: "pre_uninstall_list", args: commands.list, package: before });
  if (!before.listing_valid) throw new Error(`Cannot verify ${host} package state from plugin list JSON.`);
  if (before.conflict) throw new Error(`Refusing to uninstall ${host} package version ${before.observed_version}; expected ${expectedVersion}.`);
  let pluginRemoved = false;
  try {
    if (before.package_present) {
      output.push({ phase: "uninstall", args: commands.uninstall, output: exec(commands.executable, commands.uninstall, { encoding: "utf8", stdio: "pipe" }) });
      pluginRemoved = true;
    }
    output.push({ phase: "remove_marketplace", args: commands.remove_marketplace, output: exec(commands.executable, commands.remove_marketplace, { encoding: "utf8", stdio: "pipe" }) });
  } catch (error) {
    throw operationError(`Marketplace uninstall failed: ${error.message}`, {
      operation_state: pluginRemoved ? "partial" : "unchanged_or_unknown",
      output,
      retained: pluginRemoved ? ["native_marketplace_registration"] : ["package_and_marketplace_registration"],
    });
  }
  return { host, status: "uninstalled", output };
}

export function inspectPackageListing(output, expectedVersion, { allowCodexCachebuster = false } = {}) {
  let parsed;
  try {
    parsed = typeof output === "string" ? JSON.parse(output) : output;
  } catch {
    return packageListingFailure("invalid_json");
  }
  const entries = Array.isArray(parsed) ? parsed : parsed?.installed;
  if (!Array.isArray(entries)) return packageListingFailure("invalid_shape");
  const entry = entries.find(isProjectInventoryEntry);
  const observedVersion = typeof entry?.version === "string" ? entry.version : null;
  const activated = entry ? inspectEnabledState(entry) : null;
  return {
    listing_valid: true,
    listing_reason: null,
    package_present: Boolean(entry),
    observed_version: observedVersion,
    activated,
    activation_observed: typeof activated === "boolean",
    conflict: Boolean(observedVersion && expectedVersion && !installedVersionMatches(observedVersion, expectedVersion, { allowCodexCachebuster })),
  };
}

export function installedVersionMatches(observedVersion, expectedVersion, { allowCodexCachebuster = false } = {}) {
  if (observedVersion === expectedVersion) return true;
  if (!allowCodexCachebuster || typeof observedVersion !== "string" || typeof expectedVersion !== "string") return false;
  const canonicalVersion = expectedVersion.split("+", 1)[0];
  const prefix = `${canonicalVersion}+codex.`;
  if (!observedVersion.startsWith(prefix)) return false;
  return /^(?:[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)$/.test(observedVersion.slice(prefix.length));
}

export function classifyMarketplaceRegistration(host, output, marketplaceRoot) {
  let parsed;
  try {
    parsed = typeof output === "string" ? JSON.parse(output) : output;
  } catch {
    return { state: "unknown", reason: "invalid_json", source: null };
  }
  const entries = host === "codex" ? parsed?.marketplaces : parsed;
  if (!Array.isArray(entries)) return { state: "unknown", reason: "invalid_shape", source: null };
  const matches = entries.filter((entry) => entry?.name === "agdf-project-inventory");
  if (matches.length === 0) return { state: "absent", reason: null, source: null };
  if (matches.length !== 1) return { state: "unknown", reason: "duplicate_name", source: null };
  const entry = matches[0];
  const source = entry?.marketplaceSource?.source ?? entry?.source?.source ?? entry?.path ?? entry?.source ?? null;
  if (typeof source === "string" && (isAbsolute(source) || entry?.marketplaceSource?.sourceType === "local") && resolve(source) === resolve(marketplaceRoot)) {
    return { state: "owned_local_current", reason: null, source };
  }
  return { state: "conflict", reason: source ? "foreign_source" : "source_missing", source };
}

export function inspectMarketplaceHost({ host, expectedVersion, exec = execFileSync }) {
  const commands = marketplaceCommands(host, "unused");
  try {
    const output = exec(commands.executable, commands.list, { encoding: "utf8", stdio: "pipe" });
    const listing = inspectPackageListing(output, expectedVersion, { allowCodexCachebuster: host === "codex" });
    const activationUnknown = listing.package_present && !listing.activation_observed;
    return {
      package_present: listing.package_present,
      activated: listing.activated,
      activation_observed: listing.activation_observed,
      runtime_observed: false,
      observed_version: listing.observed_version,
      conflict: listing.conflict,
      partial: !listing.listing_valid || activationUnknown,
      evidence: [
        { source: `${commands.executable} plugin list --json`, listing_valid: listing.listing_valid, listing_reason: listing.listing_reason, activation_observed: listing.activation_observed },
        "Host enablement does not prove fresh-session discovery, runtime behavior, AGDF Inventory authority or UAT.",
      ],
    };
  } catch (error) {
    return { package_present: false, activated: null, activation_observed: false, runtime_observed: false, observed_version: null, conflict: false, evidence: [(error.stderr || error.message).toString().trim()] };
  }
}

function packageListingFailure(reason) {
  return {
    listing_valid: false,
    listing_reason: reason,
    package_present: false,
    observed_version: null,
    activated: null,
    activation_observed: false,
    conflict: false,
  };
}

function isProjectInventoryEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  const identity = entry.pluginId ?? entry.id ?? entry.fullName;
  if (identity === "agdf-project-inventory@agdf-project-inventory") return entry.installed !== false;
  return entry.name === "agdf-project-inventory"
    && (entry.marketplaceName === undefined || entry.marketplaceName === "agdf-project-inventory")
    && entry.installed !== false;
}

function inspectEnabledState(entry) {
  if (typeof entry.enabled === "boolean") return entry.enabled;
  if (typeof entry.disabled === "boolean") return !entry.disabled;
  if (typeof entry.status === "string") {
    if (/\bdisabled\b/i.test(entry.status)) return false;
    if (/\benabled\b/i.test(entry.status)) return true;
  }
  return null;
}

function executeRecovery(commands, phase, exec, rollback, rollbackErrors) {
  try {
    rollback.push({ phase, args: commands[phase], output: exec(commands.executable, commands[phase], { encoding: "utf8", stdio: "pipe" }) });
  } catch (error) {
    rollbackErrors.push({ phase, message: error.message });
  }
}

function operationError(message, evidence) {
  const error = new Error(message);
  error.evidence = evidence;
  return error;
}
