import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, relative, resolve } from "node:path";
import { copyDirectory, directoryDigest, listFiles, readJson, resetDirectory, sha256, writeJson } from "../shared/files.mjs";
import { validateDefinition } from "./definition-validator.mjs";
import { renderClaudeManifest, renderCodexManifest } from "./manifests.mjs";

export function buildPackages({ repoRoot, outputRoot = join(repoRoot, "generated") }) {
  assertSafeBuildOutput(repoRoot, outputRoot);
  const sourceBefore = canonicalSourceDigest(repoRoot);
  const checked = validateDefinition(repoRoot);
  if (!checked.valid) throw new Error(`Canonical definition invalid: ${checked.diagnostics.map((item) => item.code).join(", ")}`);
  validateCanonicalSkill(repoRoot);
  const definition = checked.definition;
  resetDirectory(outputRoot);

  const pluginRoot = join(outputRoot, "plugins", definition.id);
  writeJson(join(pluginRoot, ".codex-plugin", "plugin.json"), renderCodexManifest(definition));
  writeJson(join(pluginRoot, ".claude-plugin", "plugin.json"), renderClaudeManifest(definition));
  copyDirectory(join(repoRoot, "plugin", "skills"), join(pluginRoot, "skills"));
  copyRuntime(repoRoot, join(pluginRoot, "runtime"));
  writeJson(join(pluginRoot, "meta", "project-inventory-plugin.definition.json"), definition);
  writeJson(join(pluginRoot, "meta", "capability-matrix.json"), readJson(join(repoRoot, "plugin", "meta", "capability-matrix.json")));
  writeJson(join(pluginRoot, "meta", "generation.json"), {
    schema_version: "1",
    generated_from: "plugin/meta/project-inventory-plugin.definition.json",
    version: definition.version,
  });

  const openCodeRoot = join(outputRoot, "opencode");
  copyDirectory(join(repoRoot, "plugin", "skills", "project-inventory"), join(openCodeRoot, ".opencode", "skills", "project-inventory"));
  copyRuntime(repoRoot, join(openCodeRoot, ".opencode", "project-inventory", "runtime"));
  writeJson(join(openCodeRoot, ".opencode", "project-inventory", "meta", "project-inventory-plugin.definition.json"), definition);
  writeJson(join(openCodeRoot, ".opencode", "project-inventory", "ownership.json"), {
    schema_version: "1",
    owner: definition.ownership_marker,
    version: definition.version,
    generated_from: "plugin/meta/project-inventory-plugin.definition.json",
  });

  const sourceAfter = canonicalSourceDigest(repoRoot);
  if (sourceAfter !== sourceBefore) throw new Error("Build changed canonical source bytes.");
  const inventory = listFiles(outputRoot).map((path) => ({
    path: relative(outputRoot, path).replaceAll("\\", "/"),
    digest: sha256(readFileSync(path)),
  }));
  const report = {
    schema_version: "1",
    product: definition.id,
    version: definition.version,
    source_digest_before: sourceBefore,
    source_digest_after: sourceAfter,
    package_payload_digest: directoryDigest(outputRoot),
    host_skill_digests: {
      codex: directoryDigest(join(pluginRoot, "skills", "project-inventory")),
      claude: directoryDigest(join(pluginRoot, "skills", "project-inventory")),
      opencode: directoryDigest(join(openCodeRoot, ".opencode", "skills", "project-inventory")),
    },
    files: inventory,
  };
  writeJson(join(outputRoot, "BUILD_REPORT.json"), report);
  return { ...report, output_digest: directoryDigest(outputRoot), output_root: resolve(outputRoot) };
}

export function assertSafeBuildOutput(repoRoot, outputRoot) {
  const candidate = resolve(outputRoot);
  const canonicalGenerated = resolve(repoRoot, "generated");
  const generatedRelative = relative(canonicalGenerated, candidate);
  if (candidate === canonicalGenerated || (!generatedRelative.startsWith("..") && !isAbsolute(generatedRelative))) return candidate;

  const temporaryRelative = relative(resolve(tmpdir()), candidate);
  const [temporaryOwner] = temporaryRelative.split(/[\\/]/);
  if (!temporaryRelative.startsWith("..") && !isAbsolute(temporaryRelative) && temporaryOwner?.startsWith("agdf-project-inventory-")) return candidate;
  throw new Error(`Refusing unsafe build output path: ${candidate}`);
}

export function canonicalSourceDigest(repoRoot) {
  const roots = ["plugin/meta", "plugin/skills", "src", "bin", "scripts"];
  const records = [];
  for (const root of roots) {
    for (const path of listFiles(join(repoRoot, root))) {
      records.push(`${relative(repoRoot, path).replaceAll("\\", "/")}\0${sha256(readFileSync(path))}`);
    }
  }
  return sha256(records.sort().join("\0"));
}

function copyRuntime(repoRoot, runtimeRoot) {
  copyDirectory(join(repoRoot, "src"), join(runtimeRoot, "src"));
  copyDirectory(join(repoRoot, "bin"), join(runtimeRoot, "bin"));
  const packageManifest = readJson(join(repoRoot, "package.json"));
  writeJson(join(runtimeRoot, "package.json"), {
    name: `${packageManifest.name}-runtime`,
    version: packageManifest.version,
    private: true,
    type: "module",
    dependencies: {},
  });
}

function validateCanonicalSkill(repoRoot) {
  const entrypoint = join(repoRoot, "plugin", "skills", "project-inventory", "scripts", "project-inventory.mjs");
  const execution = spawnSync(process.execPath, [entrypoint, "validate"], { encoding: "utf8", stdio: "pipe" });
  if (execution.error) throw new Error(`Canonical skill validation failed: ${execution.error.message}`);
  const output = execution.stdout;
  if (!output) throw new Error(`Canonical skill validation failed: ${execution.stderr || `exit ${execution.status}`}`);
  let result;
  try {
    result = JSON.parse(output);
  } catch {
    throw new Error("Canonical skill validation returned an unsupported result.");
  }
  if (!result.valid) throw new Error(`Canonical skill invalid: ${result.diagnostics.map((item) => item.code).join(", ")}`);
}
