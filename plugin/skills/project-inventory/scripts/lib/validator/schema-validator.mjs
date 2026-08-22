import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { diagnostic, validationResult } from "./diagnostics.mjs";
import { listFiles, sha256 } from "../shared/data.mjs";
import { schemaDigests, validators } from "./generated-schema-validators.mjs";

export function createSchemaRegistry(schemaRoot) {
  const registry = new Map();
  for (const path of listFiles(schemaRoot).filter((candidate) => candidate.endsWith(".schema.json"))) {
    const name = basename(path).replace(".schema.json", "");
    const expectedDigest = schemaDigests[name];
    if (!validators[name] || sha256(readFileSync(path)) !== expectedDigest) {
      throw new Error(`Generated schema validator is missing or stale: ${name}`);
    }
    registry.set(name, validators[name]);
  }
  const missing = Object.keys(validators).filter((name) => !registry.has(name));
  if (missing.length) throw new Error(`Canonical schemas are missing for generated validators: ${missing.join(", ")}`);
  return {
    names: [...registry.keys()].sort(),
    validate(name, value, sourcePath = name) {
      const validator = registry.get(name);
      if (!validator) {
        return validationResult([diagnostic("PI_SCHEMA_UNKNOWN", "block", sourcePath, `Unknown schema: ${name}`, "Use one declared Project Inventory schema.")]);
      }
      if (validator(value)) return validationResult();
      return validationResult((validator.errors ?? []).map((error) => diagnostic(
        "PI_SCHEMA_INVALID",
        "block",
        `${sourcePath}${schemaErrorPointer(error)}`,
        error.message ?? "Schema validation failed.",
        "Correct the candidate to match schema version 1.",
      )));
    },
  };
}

function schemaErrorPointer(error) {
  const base = error.instancePath || "";
  if (error.keyword === "required" && error.params?.missingProperty) {
    const escaped = String(error.params.missingProperty).replaceAll("~", "~0").replaceAll("/", "~1");
    return `${base}/${escaped}`;
  }
  return base || "/";
}

export function defaultSchemaRoot(skillRoot) {
  return join(skillRoot, "assets", "schemas");
}
