#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { listFiles } from "./lib/shared/data.mjs";
import { diagnostic, validationResult } from "./lib/validator/diagnostics.mjs";
import { normalizedRepositoryPath, pathWithinRoot } from "./lib/validator/path-boundary.mjs";

const canonicalSkillRoot = fileURLToPath(new URL("..", import.meta.url));

export async function runProjectInventoryCommand(command, options = {}, { agdfExec, skillRoot = canonicalSkillRoot } = {}) {
  if (command === "validate") return validateSkillSource(skillRoot);
  if (!["preflight", "validate-run"].includes(command)) {
    return operationResult("PI_SKILL_COMMAND_UNSUPPORTED", command, `Unsupported direct Project Inventory command: ${command}.`, "Use validate, preflight or validate-run.");
  }
  if (options.scope || options["scope-declaration"] || options.compatibility || options.approval) {
    return operationResult("PI_CLI_AUTHORITY_INPUT_FORBIDDEN", command, "Caller-supplied scope, approval or compatibility values cannot grant Inventory authority.", "Remove caller-supplied authority values and use the validator-selected run and scope.");
  }

  let runtime;
  try {
    runtime = await loadRuntime();
  } catch (error) {
    return operationResult("PI_SKILL_DEPENDENCY_UNAVAILABLE", "skill_runtime", error.message, "Install the dependencies declared by the Project Inventory plugin and retry.");
  }

  const preflight = runtime.resolveApprovedInventoryContext({
    validatorPath: requiredString(options, "validator"),
    selectedRunId: requiredString(options, "run"),
    requestedOutput: requiredString(options, "output"),
    controlRoot: resolve(requiredString(options, "control-root")),
    ...(agdfExec ? { exec: agdfExec } : {}),
  });
  if (command === "preflight" || !preflight.valid) return preflight;

  const loaded = loadInventoryRun(resolve(requiredString(options, "run-dir")));
  const registry = runtime.createSchemaRegistry(runtime.defaultSchemaRoot(skillRoot));
  const artifactValidation = runtime.validateInventoryRunArtifacts({
    ...loaded.artifacts,
    authorityContext: preflight.authority_context,
    approvedScope: preflight.approved_scope,
    registry,
  });
  const requirements = runtime.questionRequirements({
    approvedScope: preflight.approved_scope,
    document: loaded.artifacts.intake ?? {},
    schemaDiagnostics: artifactValidation.diagnostics.filter((item) => item.code === "PI_SCHEMA_INVALID"),
    validationDiagnostics: artifactValidation.diagnostics,
  });
  const diagnostics = [...loaded.diagnostics, ...artifactValidation.diagnostics, ...requirements.diagnostics];
  const locale = options.locale ?? "en";
  let questions = [];
  try {
    questions = requirements.questions.map((question) => ({ ...question, rendered_text: runtime.renderQuestionRequirement(question, locale) }));
  } catch (error) {
    diagnostics.push(diagnostic("PI_QUESTION_LOCALE_UNSUPPORTED", "block", "locale", error.message, "Use one reviewed Project Inventory locale: de or en."));
  }
  return {
    ...validationResult(diagnostics, { retainedValidState: artifactValidation.retained_valid_state }),
    authority_context: preflight.authority_context,
    approved_scope: preflight.approved_scope,
    agdf_evidence: preflight.evidence,
    questions,
  };
}

export async function validateSkillSource(skillRoot = canonicalSkillRoot) {
  const diagnostics = [];
  const required = [
    "SKILL.md",
    "references/assessment-intake.md",
    "references/evidence-register.md",
    "references/findings-and-gaps-register.md",
    "references/inventory-report.md",
    "references/management-view.md",
    "scripts/project-inventory.mjs",
  ];
  for (const path of required) {
    if (!existsSync(join(skillRoot, path))) diagnostics.push(diagnostic("PI_SKILL_ASSET_MISSING", "block", path, `Required skill path is missing: ${path}.`, "Restore the canonical skill asset and retry."));
  }

  const skill = existsSync(join(skillRoot, "SKILL.md")) ? readFileSync(join(skillRoot, "SKILL.md"), "utf8") : "";
  for (const match of skill.matchAll(/`([^`]+\.(?:md|json|mjs))`/g)) {
    const path = match[1];
    if (path.includes("..") || !pathWithinRoot(skillRoot, join(skillRoot, path))) diagnostics.push(diagnostic("PI_SKILL_REFERENCE_ESCAPE", "block", path, "Skill reference escapes the canonical skill root.", "Use one shallow skill-root-relative path."));
    else if (!existsSync(join(skillRoot, path))) diagnostics.push(diagnostic("PI_SKILL_REFERENCE_MISSING", "block", path, "Skill reference does not resolve to a canonical file.", "Restore the referenced skill file."));
  }

  for (const file of listFiles(join(skillRoot, "scripts")).filter((path) => path.endsWith(".mjs"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\()["'](\.[^"']+)["']/g)) {
      const target = resolve(dirname(file), match[1]);
      if (!pathWithinRoot(skillRoot, target)) diagnostics.push(diagnostic("PI_SKILL_IMPORT_ESCAPE", "block", relative(skillRoot, file), `Relative import escapes the skill root: ${match[1]}.`, "Move the dependency beneath the canonical skill scripts directory."));
      else if (!existsSync(target)) diagnostics.push(diagnostic("PI_SKILL_IMPORT_MISSING", "block", relative(skillRoot, file), `Relative import is missing: ${match[1]}.`, "Restore the imported skill module."));
    }
  }

  let schemas = [];
  try {
    const { createSchemaRegistry, defaultSchemaRoot } = await import("./lib/validator/schema-validator.mjs");
    schemas = createSchemaRegistry(defaultSchemaRoot(skillRoot)).names;
  } catch (error) {
    diagnostics.push(diagnostic(error.code === "ERR_MODULE_NOT_FOUND" ? "PI_SKILL_DEPENDENCY_UNAVAILABLE" : "PI_SCHEMA_COMPILE_FAILED", "block", "assets/schemas", error.message, "Restore the declared dependency or correct the canonical schemas and retry."));
  }
  const result = validationResult(diagnostics);
  return { schema_version: "1", product: "project-inventory", schemas, ...result };
}

async function loadRuntime() {
  const [preflight, schema, inventory, questions] = await Promise.all([
    import("./lib/agdf-bridge/preflight.mjs"),
    import("./lib/validator/schema-validator.mjs"),
    import("./lib/validator/index.mjs"),
    import("./lib/validator/question-requirements.mjs"),
  ]);
  return { ...preflight, ...schema, ...inventory, ...questions };
}

function operationResult(code, path, message, nextAction) {
  return validationResult([diagnostic(code, "block", path, message, nextAction)]);
}

function requiredString(options, key) {
  if (typeof options[key] !== "string" || options[key].length === 0) throw new Error(`--${key} is required.`);
  return options[key];
}

function parseArguments(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) options[key] = true;
    else {
      options[key] = value;
      index += 1;
    }
  }
  return { command, options };
}

function loadInventoryRun(runRoot) {
  const diagnostics = [];
  const run = readRunArtifact(runRoot, "INVENTORY_RUN.json", true, diagnostics);
  const artifacts = { run };
  for (const [key, target, json] of [
    ["assessment_intake", "intake", true],
    ["evidence_register", "evidence", true],
    ["findings_register", "findings", true],
    ["inventory_report", "report", false],
    ["report_index", "reportIndex", true],
    ["management_view", "managementView", false],
    ["management_view_index", "managementViewIndex", true],
  ]) {
    const path = run?.artifacts?.[key];
    if (typeof path === "string") artifacts[target] = readRunArtifact(runRoot, path, json, diagnostics);
  }
  return { artifacts, diagnostics };
}

function readRunArtifact(runRoot, artifactPath, json, diagnostics) {
  const normalized = normalizedRepositoryPath(artifactPath);
  if (!normalized) {
    diagnostics.push(diagnostic("PI_RUN_ARTEFACT_PATH_INVALID", "block", String(artifactPath), "Inventory Run artefact path is not normalized and repository-relative.", "Use one normalized path inside the Inventory Run directory."));
    return undefined;
  }
  try {
    const root = realpathSync(runRoot);
    const candidatePath = resolve(root, normalized);
    const realCandidate = realpathSync(candidatePath);
    const stats = lstatSync(candidatePath);
    if (!pathWithinRoot(root, realCandidate) || stats.isSymbolicLink() || !stats.isFile()) throw new Error("Artefact must be one regular file inside the Inventory Run directory.");
    const bytes = readFileSync(realCandidate, "utf8");
    return json ? JSON.parse(bytes) : bytes;
  } catch (error) {
    diagnostics.push(diagnostic("PI_RUN_ARTEFACT_READ_FAILED", "block", normalized, error.message, "Restore the declared Inventory Run artefact inside the run directory and retry validation."));
    return undefined;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const { command, options } = parseArguments(process.argv.slice(2));
  try {
    const result = await runProjectInventoryCommand(command, options);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = result.valid ? 0 : 1;
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ status: "block", code: "PI_SKILL_OPERATION_FAILED", command, message: error.message }, null, 2)}\n`);
    process.exitCode = 1;
  }
}
