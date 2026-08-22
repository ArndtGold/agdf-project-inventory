import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { scope } from "./fixtures.mjs";

export function prepareAuthorityFixture(root, overrides = {}) {
  const projectRoot = root;
  const controlRoot = join(projectRoot, ".agdf", "control");
  const validatorPath = join(projectRoot, "agdf-local.mjs");
  const scopeRef = ".agdf/control/artefacts/demo/PROJECT_INVENTORY_SCOPE.json";
  const scopePath = join(projectRoot, scopeRef);
  mkdirSync(join(controlRoot, "artefacts", "demo"), { recursive: true });
  writeFileSync(validatorPath, "// synthetic validator\n");
  const scopeDeclaration = { ...structuredClone(scope), ...(overrides.scope ?? {}) };
  writeFileSync(scopePath, `${JSON.stringify(scopeDeclaration, null, 2)}\n`);

  const revisionId = overrides.revisionId ?? "11111111-1111-4111-8111-111111111111";
  const runId = overrides.runId ?? scopeDeclaration.agdf_run_id;
  const outputs = {
    resolve: { schema_version: "1", machine_validation: "owned_version_matched", surface: "plugin", expected_version: "0.13.5", observed_version: "0.13.5", source: "plugin_bundle", registry_access: false },
    doctor: { schema_version: "1", status: "pass", target_dir: projectRoot },
    gate: {
      schema_version: "1",
      status: "open",
      blocking_reason: "none",
      status_card: { run_id: runId },
      status_presentation: { run_id: runId, revision_id: revisionId },
    },
    delivery: {
      schema_version: "1",
      status: "pass",
      status_card: { run_id: runId },
      artefacts: {
        [scopeDeclaration.approval_gate]: {
          path: scopeDeclaration.approval_ref.split("#")[0],
          status: "approved",
        },
      },
      approvals: {
        [scopeDeclaration.approval_gate]: {
          status: "approved",
          evidence: `exact \`Approval: ${scopeDeclaration.approval_gate}\` at run revision \`${scopeDeclaration.approval_revision_id}\``,
        },
      },
      evidence_refs: [{ evidence: "Project Inventory Scope", source: `\`${scopeRef}\`` }],
    },
    ...overrides.outputs,
  };
  const calls = [];
  const exec = (_command, args) => {
    const operation = args[1];
    calls.push(args.slice(1));
    if (operation === "--resolve-only") return JSON.stringify(outputs.resolve);
    if (operation === "doctor") return JSON.stringify(outputs.doctor);
    if (operation === "gate-check") return JSON.stringify(outputs.gate);
    if (operation === "delivery-map") return JSON.stringify(outputs.delivery);
    throw new Error(`Unexpected operation: ${operation}`);
  };
  return { projectRoot, controlRoot, validatorPath, scopeRef, scopePath, scopeDeclaration, revisionId, runId, outputs, calls, exec };
}
