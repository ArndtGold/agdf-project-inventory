import assert from "node:assert/strict";
import test from "node:test";
import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages } from "../../src/package/build.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-R3-T08 build rejects a schema changed without regenerated validators", () => {
  const temporary = temporaryDirectory();
  try {
    const sourceRoot = join(temporary.path, "source");
    for (const path of ["bin", "plugin", "scripts", "src", "package.json"]) {
      cpSync(join(repoRoot, path), join(sourceRoot, path), { recursive: true });
    }
    const schemaPath = join(sourceRoot, "plugin", "skills", "project-inventory", "assets", "schemas", "uat-record.schema.json");
    writeFileSync(schemaPath, `${readFileSync(schemaPath, "utf8")}\n`);
    assert.throws(
      () => buildPackages({ repoRoot: sourceRoot, outputRoot: join(temporary.path, "build") }),
      /canonical skill invalid|stale/i,
    );
  } finally {
    temporary.cleanup();
  }
});
