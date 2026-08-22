import assert from "node:assert/strict";
import test from "node:test";
import { questionRequirements, renderQuestionRequirement } from "../../plugin/skills/project-inventory/scripts/lib/validator/question-requirements.mjs";
import { diagnostic } from "../../plugin/skills/project-inventory/scripts/lib/validator/diagnostics.mjs";
import { scope } from "../helpers/fixtures.mjs";

test("PI-R2-T06 emits only provenance-backed deterministic questions", () => {
  const requirements = questionRequirements({
    approvedScope: scope,
    document: {},
    schemaDiagnostics: [diagnostic("PI_SCHEMA_INVALID", "block", "ASSESSMENT_INTAKE.json/review_owner", "must have required property", "Correct the candidate.")],
    validationDiagnostics: [diagnostic("PI_EVIDENCE_REFERENCE_UNKNOWN", "block", "obs-001", "Unknown evidence reference.", "Reference an existing evidence identifier.")],
  });
  assert.equal(requirements.valid, true);
  assert.equal(requirements.questions.every((item) => ["approved_scope", "schema", "validation"].includes(item.required_by)), true);
  assert.equal(requirements.questions.every((item) => item.source_ref && item.field_path && item.prompt_key), true);
  const rendered = renderQuestionRequirement(requirements.questions[0], "de");
  assert.equal(typeof rendered, "string");
  assert.ok(rendered.length > 10);
  assert.throws(() => renderQuestionRequirement(requirements.questions[0], "fr"), /Unsupported Project Inventory question locale/);
});

test("PI-R2-T06 rejects model-invented question relevance", () => {
  const result = questionRequirements({
    approvedScope: scope,
    document: {},
    validationDiagnostics: [diagnostic("PI_MODEL_THINKS_RELEVANT", "block", "anything", "Invented.", "Ask a broad question.")],
  });
  assert.equal(result.questions.length, 1);
  assert.equal(result.questions.some((item) => item.source_ref === "PI_MODEL_THINKS_RELEVANT"), false);
});
