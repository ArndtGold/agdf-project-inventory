import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../../plugin/skills/project-inventory/references", import.meta.url));

test("PI-T04 resources contain structure without preselected conclusions", () => {
  for (const name of readdirSync(root)) {
    const content = readFileSync(join(root, name), "utf8");
    assert.doesNotMatch(content, /score:\s*\d|risk:\s*(high|low)|decision:\s*(go|stop)/i, name);
    assert.match(content, /Do not|does not|never/i, name);
  }
});
