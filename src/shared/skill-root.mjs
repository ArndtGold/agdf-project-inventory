import { existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

export function resolveCanonicalSkillRoot(distributionRoot) {
  const candidates = [
    join(resolve(distributionRoot), "plugin", "skills", "project-inventory"),
    join(resolve(distributionRoot), "..", "skills", "project-inventory"),
    join(resolve(distributionRoot), "..", "..", "skills", "project-inventory"),
  ].filter((path) => existsSync(join(path, "SKILL.md")) && statSync(path).isDirectory());
  const unique = [...new Set(candidates.map((path) => resolve(path)))];
  if (unique.length !== 1) {
    throw new Error(`PI_SKILL_ROOT_UNRESOLVED: expected exactly one canonical project-inventory skill, observed ${unique.length}.`);
  }
  return unique[0];
}
