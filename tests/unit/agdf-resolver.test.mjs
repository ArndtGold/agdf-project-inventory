import assert from "node:assert/strict";
import test from "node:test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { resolveAgdfValidator } from "../../plugin/skills/project-inventory/scripts/lib/agdf-bridge/resolver.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

test("PI-T07 resolves exactly one explicit version-matched local validator", () => {
  const temporary = temporaryDirectory();
  try {
    const validator = join(temporary.path, "agdf-local.mjs");
    writeFileSync(validator, "// test double\n");
    const exec = (_command, args) => {
      assert.deepEqual(args.slice(-2), ["--resolve-only", "--json"]);
      return JSON.stringify({ schema_version: "1", machine_validation: "owned_version_matched", surface: "plugin", expected_version: "0.13.5", observed_version: "0.13.5", source: "plugin_bundle", registry_access: false });
    };
    const result = resolveAgdfValidator({ explicitValidatorPath: validator, expectedVersion: "0.13.5", exec });
    assert.equal(result.valid, true);
    assert.equal(result.validator.version, "0.13.5");
  } finally {
    temporary.cleanup();
  }
});

test("PI-T07 rejects incompatible and ambiguous validators", () => {
  const temporary = temporaryDirectory();
  try {
    const first = join(temporary.path, "first.mjs");
    const second = join(temporary.path, "second.mjs");
    writeFileSync(first, "// first\n");
    writeFileSync(second, "// second\n");
    assert.equal(resolveAgdfValidator({ hostValidatorPath: first, explicitValidatorPath: second, expectedVersion: "0.13.5" }).diagnostics[0].code, "PI_AGDF_AMBIGUOUS");
    const result = resolveAgdfValidator({ explicitValidatorPath: first, expectedVersion: "0.13.5", exec: () => JSON.stringify({ schema_version: "1", machine_validation: "version_mismatch", surface: "plugin", expected_version: "0.13.5", observed_version: "0.14.0", source: "plugin_bundle", registry_access: false }) });
    assert.equal(result.diagnostics[0].code, "PI_AGDF_INCOMPATIBLE");
  } finally {
    temporary.cleanup();
  }
});
