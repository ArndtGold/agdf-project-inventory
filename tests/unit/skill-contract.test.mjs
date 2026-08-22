import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const skill = readFileSync(new URL("../../plugin/skills/project-inventory/SKILL.md", import.meta.url), "utf8");

test("PI-T04 one skill owns the evidence-first workflow and AGDF boundary", () => {
  assert.match(skill, /^---\nname: project-inventory\n/);
  assert.match(skill, /AGDF owns gates, approvals, Run State and delivery transitions/);
  assert.match(skill, /repository, runtime, external-system and human/);
  assert.match(skill, /never creates,\n\s+expands or approves its own scope/);
  assert.match(skill, /Compatibility is a validator result, never a model inference/);
  assert.match(skill, /required by the\n\s+approved scope, schema or validation result/);
  assert.match(skill, /management\s+view is a projection, not a summary/);
  assert.match(skill, /all blockers, retained valid state and exactly one next recovery action/);
  assert.match(skill, /Absence of evidence, inaccessible evidence, evidence of absence and conflicting evidence/);
  assert.doesNotMatch(skill, /Approval: (UR|PRD|SD|TP|QA|UAT)/);
});
