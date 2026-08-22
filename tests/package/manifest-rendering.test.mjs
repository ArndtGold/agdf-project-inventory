import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderClaudeManifest, renderCodexManifest } from "../../src/package/manifests.mjs";

const definition = JSON.parse(readFileSync(new URL("../../plugin/meta/project-inventory-plugin.definition.json", import.meta.url), "utf8"));

test("PI-T08 Codex and Claude manifests derive from one definition", () => {
  const codex = renderCodexManifest(definition);
  const claude = renderClaudeManifest(definition);
  assert.equal(codex.name, definition.id);
  assert.equal(claude.name, definition.id);
  assert.equal(codex.version, claude.version);
  assert.equal(codex.skills, "./skills/");
  assert.equal(codex.interface.displayName, definition.display_name);
  assert.equal(codex.interface.longDescription, definition.long_description);
  assert.equal(codex.interface.defaultPrompt, definition.default_prompt);
});
