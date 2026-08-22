export const scope = {
  schema_version: "1",
  scope_id: "scope-001",
  agdf_run_id: "agdf-run-001",
  approval_ref: ".agdf/control/artefacts/demo/UR.md#project-inventory-scope",
  approval_gate: "UR",
  approval_revision_id: "11111111-1111-4111-8111-111111111111",
  decision_context: "Decide whether the project is ready for a bounded modernization phase.",
  allowed_outputs: ["assessment_intake", "evidence_register", "findings_register", "inventory_report", "management_view"],
  source_boundary: { repository_roots: ["."], external_systems: [], exclusions: ["production credentials"] },
  confidentiality: "internal",
};

export const inventoryRun = {
  schema_version: "1",
  inventory_run_id: "inventory-run-001",
  product_version: "0.1.0",
  agdf_run_id: "agdf-run-001",
  authority_context_ref: ".agdf/control/artefacts/demo/PROJECT_INVENTORY_SCOPE.json",
  authority_context_digest: `sha256:${"f".repeat(64)}`,
  status: "report_ready",
  created_at: "2026-08-21T12:00:00.000Z",
  artifacts: {
    assessment_intake: "ASSESSMENT_INTAKE.json",
    evidence_register: "EVIDENCE_REGISTER.json",
    findings_register: "FINDINGS_AND_GAPS.json",
    inventory_report: "INVENTORY_REPORT.md",
    report_index: "INVENTORY_REPORT.index.json",
    management_view: "MANAGEMENT_VIEW.md",
    management_view_index: "MANAGEMENT_VIEW.index.json",
    validation_report: "VALIDATION_REPORT.json"
  }
};

export const intake = {
  schema_version: "1",
  intake_id: "intake-001",
  decision: "Decide whether modernization planning can start.",
  audience: ["Decision owner", "Technical reviewer"],
  scope: ["Repository structure", "Automated verification"],
  exclusions: ["Production runtime"],
  source_boundary: ["Current repository"],
  time_boundary: "Repository state captured on 2026-08-21",
  review_owner: "Technical reviewer",
  permitted_unknowns: ["Production runtime behavior"],
  confidentiality: "internal"
};

export const evidence = {
  schema_version: "1",
  register_id: "evidence-register-001",
  entries: [
    {
      evidence_id: "ev-repo-001",
      source_type: "repository_file",
      locator: "package.json",
      captured_at: "2026-08-21T12:00:00.000Z",
      lane: "repository",
      reach: "Declares project scripts and dependencies.",
      limitation: "Does not prove runtime execution.",
      confidentiality: "internal",
      access_state: "obtained",
      content_digest: `sha256:${"a".repeat(64)}`
    },
    {
      evidence_id: "ev-runtime-001",
      source_type: "command_output",
      locator: "npm test",
      captured_at: "2026-08-21T12:05:00.000Z",
      lane: "runtime",
      reach: "Automated repository test execution.",
      limitation: "Does not prove authenticated host behavior or human acceptance.",
      confidentiality: "internal",
      access_state: "obtained"
    }
  ]
};

export const findings = {
  schema_version: "1",
  register_id: "findings-register-001",
  statements: [
    {
      statement_id: "obs-001",
      class: "observation",
      claim_type: "presence",
      text: "The repository declares a deterministic automated test command.",
      support_state: "supported",
      claim_lane: "repository",
      evidence_refs: ["ev-repo-001"],
      impact: "medium",
      review_state: "reviewed"
    },
    {
      statement_id: "int-001",
      class: "interpretation",
      claim_type: "other",
      text: "The current automated baseline is suitable for bounded implementation review.",
      support_state: "partial",
      claim_lane: "runtime",
      evidence_refs: ["ev-runtime-001"],
      impact: "medium",
      review_state: "draft"
    },
    {
      statement_id: "unk-001",
      class: "unknown",
      claim_type: "other",
      text: "Authenticated fresh-session host behavior has not been observed.",
      support_state: "missing",
      claim_lane: "human",
      evidence_refs: [],
      impact: "unknown",
      review_state: "draft",
      unknown_reason: "not_checked"
    },
    {
      statement_id: "rec-001",
      class: "recommendation",
      claim_type: "other",
      text: "Perform separate fresh-session UAT before claiming host readiness.",
      support_state: "partial",
      claim_lane: "runtime",
      evidence_refs: ["ev-runtime-001"],
      impact: "medium",
      review_state: "draft"
    }
  ]
};

export const uatRecord = {
  schema_version: "1",
  host: "codex",
  product_version: "0.1.0",
  host_version: "0.145.0",
  agdf_version: "0.13.5",
  activation_scope: "repository with approved Project Inventory scope",
  invoked_intent: "Create a bounded project inventory.",
  observed_behavior: "The skill was discovered and produced the expected preflight state.",
  human_decision: "accept",
  observer: "UAT reviewer",
  observed_at: "2026-08-21T14:00:00.000Z"
};

export function clone(value) {
  return structuredClone(value);
}
