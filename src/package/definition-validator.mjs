import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "../shared/files.mjs";
import { packageDiagnostic as diagnostic, packageValidationResult as validationResult } from "./diagnostics.mjs";

const definitionPath = fileURLToPath(new URL("../../plugin/meta/project-inventory-plugin.definition.json", import.meta.url));

export function repositoryRootFromModule() {
  return resolve(dirname(definitionPath), "../..");
}

export function loadDefinition(repoRoot = repositoryRootFromModule()) {
  const sourcePath = join(repoRoot, "plugin", "meta", "project-inventory-plugin.definition.json");
  const packagedPath = join(repoRoot, "..", "meta", "project-inventory-plugin.definition.json");
  return readJson(existsSync(sourcePath) ? sourcePath : packagedPath);
}

export function validateDefinition(repoRoot = repositoryRootFromModule()) {
  const path = join(repoRoot, "plugin", "meta", "project-inventory-plugin.definition.json");
  let definition;
  try {
    definition = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    return { definition: null, ...validationResult([diagnostic("PI_DEFINITION_JSON_INVALID", "block", path, error.message, "Correct the canonical definition JSON.")]) };
  }
  const diagnostics = [];
  if (definition.schema_version !== "1") diagnostics.push(diagnostic("PI_DEFINITION_SCHEMA_VERSION", "block", path, "Definition schema_version must be 1.", "Use the approved definition schema version."));
  if (definition.id !== "agdf-project-inventory") diagnostics.push(diagnostic("PI_DEFINITION_ID", "block", path, "Canonical product id is inconsistent.", "Restore agdf-project-inventory as the single product id."));
  if (definition.version !== "0.1.0") diagnostics.push(diagnostic("PI_VERSION_DRIFT", "block", path, "Canonical product version must be 0.1.0 for this baseline.", "Align all version surfaces with the approved baseline."));
  if (typeof definition.long_description !== "string" || !definition.long_description.trim()) diagnostics.push(diagnostic("PI_DEFINITION_LONG_DESCRIPTION", "block", path, "Canonical Codex long description is missing.", "Define the long description once in the canonical plugin definition."));
  if (typeof definition.default_prompt !== "string" || !definition.default_prompt.trim()) diagnostics.push(diagnostic("PI_DEFINITION_DEFAULT_PROMPT", "block", path, "Canonical Codex default prompt is missing.", "Define the default prompt once in the canonical plugin definition."));

  const declared = [
    ...(definition.skills ?? []).map((entry) => entry.path),
    ...(definition.resources ?? []),
    ...(definition.schemas ?? []),
    ...(definition.scripts ?? []),
  ];
  const duplicates = declared.filter((entry, index) => declared.indexOf(entry) !== index);
  for (const entry of new Set(duplicates)) diagnostics.push(diagnostic("PI_DEFINITION_DUPLICATE_PATH", "block", entry, "Canonical inventory declares this path more than once.", "Keep every canonical path exactly once."));
  for (const entry of declared) {
    const absolute = resolve(repoRoot, entry);
    if (!absolute.startsWith(`${resolve(repoRoot)}/`) || !existsSync(absolute) || !statSync(absolute).isFile()) {
      diagnostics.push(diagnostic("PI_DEFINITION_PATH_MISSING", "block", entry, "Declared canonical path is missing or escapes the repository.", "Correct the definition or add the canonical file."));
    }
  }

  const expected = new Set(declared);
  for (const root of ["plugin/skills"]) {
    for (const file of filesUnder(join(repoRoot, root))) {
      const repoPath = relative(repoRoot, file).replaceAll("\\", "/");
      if (!expected.has(repoPath)) diagnostics.push(diagnostic("PI_DEFINITION_EXTRA_PATH", "block", repoPath, "Canonical owner directory contains an undeclared file.", "Declare the file once or remove it from the canonical owner directory."));
    }
  }
  return { definition, ...validationResult(diagnostics) };
}

function filesUnder(root) {
  if (!existsSync(root)) return [];
  const result = [];
  for (const entry of readdirSync(root).sort()) {
    const path = join(root, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) result.push(...filesUnder(path));
    else if (stats.isFile()) result.push(path);
  }
  return result;
}
