export const hostStates = Object.freeze([
  "unavailable",
  "available_not_activated",
  "activated_unverified",
  "ready",
  "partial",
  "conflict",
]);

export function classifyHostState({
  product = "agdf-project-inventory",
  host,
  expected_version,
  observed_version = null,
  package_present = false,
  activated = null,
  activation_observed = null,
  runtime_observed = false,
  uat_state = "not_performed",
  conflict = false,
  partial = false,
  operation_state = "inspected",
  operation_status = "status",
  blockers = [],
  retained_valid_state = [],
  evidence = [],
  operation_evidence = null,
  next_action = null,
}) {
  const enablementKnown = package_present
    && typeof activated === "boolean"
    && activation_observed !== false;
  const enablementUnknown = package_present && !enablementKnown;
  let state;
  if (conflict) state = "conflict";
  else if (partial || enablementUnknown) state = "partial";
  else if (!package_present) state = "unavailable";
  else if (activated === false) state = "available_not_activated";
  else if (!runtime_observed) state = "activated_unverified";
  else state = "ready";
  const hostName = { codex: "Codex", claude: "Claude Code", opencode: "OpenCode" }[host] ?? host;
  const next = next_action ?? (enablementUnknown
    ? `Inspect the structured ${hostName} plugin listing and resolve the unknown host enablement state.`
    : {
    unavailable: `Run the explicit local install command for ${hostName}.`,
    available_not_activated: `Enable the installed project-inventory plugin in ${hostName}.`,
    activated_unverified: `Start a fresh ${hostName} session and record the observed project-inventory identity and version.`,
    ready: uat_state === "accepted" ? "Run the approved Inventory workflow." : "Perform and record human UAT separately.",
    partial: "Inspect the operation journal, resolve retained items and retry explicitly.",
    conflict: "Resolve or remove the unowned state before retrying.",
    }[state]);
  const commandSuffix = host === "opencode" ? " -- --repo <repository>" : "";
  const effectiveBlockers = [...blockers];
  if (enablementUnknown && !effectiveBlockers.some((item) => item.code === "PI_HOST_ENABLEMENT_UNKNOWN")) {
    effectiveBlockers.push({ code: "PI_HOST_ENABLEMENT_UNKNOWN", message: `${hostName} reports the package but not whether it is enabled.` });
  }
  const activationState = !package_present ? "not_applicable" : enablementKnown ? (activated ? "active" : "inactive") : "unknown";
  const hostEnablementState = !package_present ? "not_applicable" : enablementKnown ? (activated ? "enabled" : "disabled") : "unknown";
  return {
    schema_version: "1",
    product,
    version: expected_version,
    host,
    operation_state,
    operation_status,
    state,
    expected_version,
    observed_version,
    package_state: package_present ? "present" : "absent",
    host_enablement_state: hostEnablementState,
    activation_state: activationState,
    agdf_preflight_state: "not_run",
    runtime_observation_state: runtime_observed ? "observed" : "not_observed",
    uat_state,
    blockers: effectiveBlockers,
    retained_valid_state,
    evidence,
    ...(operation_evidence ? { operation_evidence } : {}),
    status_command: `npm run status:${host}${commandSuffix}`,
    uninstall_command: `npm run uninstall:${host}${commandSuffix}`,
    next_action: next,
  };
}
