import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { directoryDigest, readJson, writeJson } from "../shared/files.mjs";
import { assertOwnedOrAbsent, writeOwnership } from "./ownership.mjs";

export function prepareLocalMarketplace({ root, builtPluginRoot, definition }) {
  assertBuiltPluginCompatible(builtPluginRoot, definition);
  const stage = `${root}.stage`;
  const backup = `${root}.backup`;
  assertOwnedOrAbsent(root);
  if (existsSync(stage)) {
    assertOwnedOrAbsent(stage);
    rmSync(stage, { recursive: true, force: true });
  }
  if (existsSync(backup)) {
    assertOwnedOrAbsent(backup);
    if (existsSync(root)) throw new Error(`Refusing ambiguous interrupted marketplace state: ${root} and ${backup}`);
    renameSync(backup, root);
  }
  mkdirSync(stage, { recursive: true });
  writeOwnership(stage, definition.version, "local-marketplace", { state: "building" });
  cpSync(builtPluginRoot, join(stage, "plugins", definition.id), { recursive: true });
  writeJson(join(stage, ".agents", "plugins", "marketplace.json"), {
    name: definition.id,
    interface: { displayName: definition.display_name },
    plugins: [{ name: definition.id, source: { source: "local", path: `./plugins/${definition.id}` }, policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" }],
  });
  writeJson(join(stage, ".claude-plugin", "marketplace.json"), {
    name: definition.id,
    owner: { name: "Arndt Gold", email: "" },
    metadata: { description: definition.description },
    plugins: [{ name: definition.id, source: `./plugins/${definition.id}`, description: definition.description, category: "Productivity" }],
  });
  writeOwnership(stage, definition.version, "local-marketplace", { state: "ready", plugin_digest: directoryDigest(join(stage, "plugins", definition.id)) });
  if (existsSync(root)) renameSync(root, backup);
  try {
    renameSync(stage, root);
  } catch (error) {
    if (existsSync(backup) && !existsSync(root)) renameSync(backup, root);
    throw error;
  }
  let closed = false;
  return {
    root,
    commit() {
      if (closed) return;
      if (existsSync(backup)) rmSync(backup, { recursive: true, force: true });
      closed = true;
    },
    rollback() {
      if (closed) return;
      if (existsSync(root)) {
        assertOwnedOrAbsent(root);
        rmSync(root, { recursive: true, force: true });
      }
      if (existsSync(backup)) renameSync(backup, root);
      closed = true;
    },
  };
}

export function assertBuiltPluginCompatible(builtPluginRoot, definition) {
  const requiredJson = [
    ["meta/project-inventory-plugin.definition.json", definition.id],
    ["meta/generation.json", undefined],
    [".codex-plugin/plugin.json", definition.id],
    [".claude-plugin/plugin.json", definition.id],
    ["runtime/package.json", undefined],
  ];
  for (const [relativePath, expectedName] of requiredJson) {
    const path = join(builtPluginRoot, relativePath);
    if (!existsSync(path)) throw new Error(`Built plugin is incomplete: ${relativePath}`);
    let value;
    try {
      value = readJson(path);
    } catch {
      throw new Error(`Built plugin contains invalid JSON: ${relativePath}`);
    }
    const observedName = value.id ?? value.name;
    if (expectedName && observedName !== expectedName) throw new Error(`Built plugin identity mismatch in ${relativePath}`);
    if (value.version !== definition.version) throw new Error(`Built plugin version mismatch in ${relativePath}`);
  }
  if (!existsSync(join(builtPluginRoot, "runtime", "bin", "agdf-project-inventory.mjs"))) {
    throw new Error("Built plugin runtime launcher is missing.");
  }
}
