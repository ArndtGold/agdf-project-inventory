import { diagnostic, validationResult } from "./diagnostics.mjs";

const reviewedPrompts = {
  de: {
    "scope.source_boundary": "Welche im freigegebenen Scope enthaltene Quellenabgrenzung soll im Assessment Intake bestätigt werden?",
    "schema.review_owner": "Wer ist für die fachliche Prüfung dieser Bestandsaufnahme verantwortlich?",
    "schema.required_field": "Welcher Wert soll für das erforderliche Feld {field_path} erfasst werden?",
    "validation.evidence_reference": "Welche vorhandene Evidenz-ID soll die Aussage {statement_id} referenzieren?",
  },
  en: {
    "scope.source_boundary": "Which source boundary from the approved scope should be confirmed in the Assessment Intake?",
    "schema.review_owner": "Who owns the substantive review of this Project Inventory?",
    "schema.required_field": "What value should be recorded for the required field {field_path}?",
    "validation.evidence_reference": "Which existing evidence ID should statement {statement_id} reference?",
  },
};

const validationPromptMap = new Map([
  ["PI_EVIDENCE_REFERENCE_UNKNOWN", "validation.evidence_reference"],
]);

export function questionRequirements({ approvedScope, document = {}, schemaDiagnostics = [], validationDiagnostics = [] }) {
  const questions = [];
  const diagnostics = [];
  if (approvedScope?.source_boundary && !document.source_boundary) questions.push(requirement("approved_scope", "/source_boundary", "/source_boundary", "scope.source_boundary", {}));

  for (const item of schemaDiagnostics) {
    if (item.code !== "PI_SCHEMA_INVALID") continue;
    const fieldPath = jsonPointerFromPath(item.path);
    const key = fieldPath === "/review_owner" ? "schema.review_owner" : "schema.required_field";
    questions.push(requirement("schema", item.path, fieldPath, key, { field_path: fieldPath }));
  }
  for (const item of validationDiagnostics) {
    const promptKey = validationPromptMap.get(item.code);
    if (!promptKey) continue;
    questions.push(requirement("validation", item.code, `/${item.path}`, promptKey, { statement_id: item.path }));
  }
  const unique = new Map();
  for (const question of questions) {
    if (!reviewedPrompts.en[question.prompt_key]) diagnostics.push(diagnostic("PI_QUESTION_PROVENANCE_INVALID", "block", question.question_id, "Question prompt has no reviewed local resource.", "Use a reviewed scope, schema or validation prompt mapping."));
    else unique.set(question.question_id, question);
  }
  const result = validationResult(diagnostics);
  return { ...result, questions: [...unique.values()].sort((a, b) => a.question_id.localeCompare(b.question_id)) };
}

export function renderQuestionRequirement(question, locale = "en") {
  const pack = reviewedPrompts[locale];
  if (!pack) throw new Error(`Unsupported Project Inventory question locale: ${locale}`);
  const template = pack[question.prompt_key];
  if (!template) throw new Error(`Unreviewed Project Inventory prompt key: ${question.prompt_key}`);
  return template.replace(/\{([a-z_]+)\}/g, (_match, key) => String(question.prompt_args?.[key] ?? ""));
}

function requirement(requiredBy, sourceRef, fieldPath, promptKey, promptArgs) {
  const normalized = `${requiredBy}-${sourceRef}-${promptKey}-${fieldPath}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return { question_id: normalized, required_by: requiredBy, source_ref: sourceRef, field_path: fieldPath, prompt_key: promptKey, prompt_args: promptArgs };
}

function jsonPointerFromPath(path) {
  const value = String(path ?? "");
  const slash = value.indexOf("/");
  return slash >= 0 ? value.slice(slash) : "/";
}
