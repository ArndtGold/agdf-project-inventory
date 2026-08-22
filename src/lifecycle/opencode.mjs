import { cpSync, existsSync, readFileSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { directoryDigest, readJson, writeJsonAtomic } from "../shared/files.mjs";
import { assertOwnedOrAbsent, ownershipMarker, writeOwnership } from "./ownership.mjs";

export function installOpenCodeProjection({ projectionRoot, repoRoot, version }) {
  const target = join(resolve(repoRoot), ".opencode", "project-inventory");
  const skillTarget = join(resolve(repoRoot), ".opencode", "skills", "project-inventory");
  assertOwnedOrAbsent(target);
  const previousMarker = ownershipMarker(target);
  assertSkillOwnedOrAbsent(skillTarget, previousMarker);
  const configPath = join(resolve(repoRoot), "opencode.json");
  const config = existsSync(configPath) ? readJson(configPath) : {};
  if (config.instructions !== undefined && !Array.isArray(config.instructions)) throw new Error(`Refusing non-array OpenCode instructions: ${configPath}`);
  const ownedInstruction = ".opencode/skills/project-inventory/SKILL.md";
  const instructionPresent = (config.instructions ?? []).includes(ownedInstruction);
  if (instructionPresent && !previousMarker) {
    throw new Error(`Refusing unowned OpenCode configuration entry: ${ownedInstruction}`);
  }
  const backups = [];
  try {
    for (const [source, destination, surface] of [
      [join(projectionRoot, ".opencode", "project-inventory"), target, "opencode-runtime"],
      [join(projectionRoot, ".opencode", "skills", "project-inventory"), skillTarget, "opencode-skill"],
    ]) {
      const backup = `${destination}.backup`;
      if (existsSync(backup)) {
        if (surface === "opencode-runtime") assertOwnedOrAbsent(backup);
        else throw new Error(`Refusing retained unverified OpenCode skill backup: ${backup}`);
        rmSync(backup, { recursive: true, force: true });
      }
      if (existsSync(destination)) renameSync(destination, backup);
      backups.push({ destination, backup });
      cpSync(source, destination, { recursive: true });
    }
    writeOwnership(target, version, "opencode-runtime", {
      config_entry_owned: true,
      skill_target: skillTarget,
      skill_digest: directoryDigest(skillTarget),
    });
    const instructions = [...(config.instructions ?? [])];
    if (!instructions.includes(ownedInstruction)) instructions.push(ownedInstruction);
    writeJsonAtomic(configPath, { ...config, instructions });
    const retained = [];
    for (const entry of backups) {
      try {
        if (existsSync(entry.backup)) rmSync(entry.backup, { recursive: true, force: true });
      } catch {
        retained.push(entry.backup);
      }
    }
    return { host: "opencode", status: "activated_unverified", target, skill_target: skillTarget, config_path: configPath, retained };
  } catch (error) {
    for (const entry of backups.reverse()) {
      if (existsSync(entry.destination)) rmSync(entry.destination, { recursive: true, force: true });
      if (existsSync(entry.backup)) renameSync(entry.backup, entry.destination);
    }
    throw error;
  }
}

export function uninstallOpenCodeProjection({ repoRoot }) {
  const target = join(resolve(repoRoot), ".opencode", "project-inventory");
  const skillTarget = join(resolve(repoRoot), ".opencode", "skills", "project-inventory");
  const targets = [target, skillTarget];
  const marker = ownershipMarker(target);
  if (existsSync(target) && !marker) throw new Error(`Refusing to remove unowned OpenCode state: ${target}`);
  if (existsSync(skillTarget) && !skillMatchesMarker(skillTarget, marker)) throw new Error(`Refusing to remove unowned OpenCode state: ${skillTarget}`);
  const configPath = join(resolve(repoRoot), "opencode.json");
  const config = existsSync(configPath) ? readJson(configPath) : {};
  if (config.instructions !== undefined && !Array.isArray(config.instructions)) throw new Error(`Refusing non-array OpenCode instructions: ${configPath}`);
  const ownedInstruction = ".opencode/skills/project-inventory/SKILL.md";
  const instructionPresent = (config.instructions ?? []).includes(ownedInstruction);
  const owned = Boolean(marker && skillMatchesMarker(skillTarget, marker));
  if (instructionPresent && !owned) throw new Error(`Refusing unowned OpenCode configuration entry: ${ownedInstruction}`);
  if (!existsSync(target) && !existsSync(skillTarget) && !instructionPresent) return { host: "opencode", status: "already_absent", removed: [] };
  if (!owned || !existsSync(target) || !existsSync(skillTarget)) throw new Error("Refusing incomplete owned OpenCode projection state.");

  const backups = [];
  try {
    for (const target of targets) {
      const backup = `${target}.uninstall-backup`;
      if (existsSync(backup)) {
        if (target === targets[0]) assertOwnedOrAbsent(backup);
        else throw new Error(`Refusing retained unverified OpenCode skill backup: ${backup}`);
        rmSync(backup, { recursive: true, force: true });
      }
      renameSync(target, backup);
      backups.push({ target, backup });
    }
    if (marker.config_entry_owned && existsSync(configPath)) {
      writeJsonAtomic(configPath, { ...config, instructions: config.instructions.filter((entry) => entry !== ownedInstruction) });
    }
  } catch (error) {
    for (const entry of backups.reverse()) if (existsSync(entry.backup) && !existsSync(entry.target)) renameSync(entry.backup, entry.target);
    throw error;
  }
  const retained = [];
  for (const entry of backups) {
    try {
      rmSync(entry.backup, { recursive: true, force: true });
    } catch {
      retained.push(entry.backup);
    }
  }
  return { host: "opencode", status: "uninstalled", removed: targets, retained };
}

export function inspectOpenCode({ repoRoot, expectedVersion }) {
  const target = join(resolve(repoRoot), ".opencode", "project-inventory");
  const skillTarget = join(resolve(repoRoot), ".opencode", "skills", "project-inventory");
  const marker = ownershipMarker(target);
  const configPath = join(resolve(repoRoot), "opencode.json");
  let activated = false;
  try {
    const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf8")) : {};
    activated = Array.isArray(config.instructions) && config.instructions.includes(".opencode/skills/project-inventory/SKILL.md");
  } catch {
    return { package_present: existsSync(target) || existsSync(skillTarget), activated: false, runtime_observed: false, observed_version: null, conflict: true, evidence: ["OpenCode config is unreadable"] };
  }
  const owned = skillMatchesMarker(skillTarget, marker);
  return {
    package_present: owned,
    activated,
    runtime_observed: false,
    observed_version: marker?.version ?? null,
    conflict: (existsSync(target) || existsSync(skillTarget)) && !owned || Boolean(marker && marker.version !== expectedVersion),
    evidence: [target, skillTarget, configPath],
  };
}

function assertSkillOwnedOrAbsent(skillTarget, marker) {
  if (!existsSync(skillTarget)) return;
  if (!skillMatchesMarker(skillTarget, marker)) throw new Error(`Refusing to mutate unowned state: ${skillTarget}`);
}

function skillMatchesMarker(skillTarget, marker) {
  if (!marker || !existsSync(skillTarget) || resolve(marker.skill_target ?? "") !== resolve(skillTarget) || typeof marker.skill_digest !== "string") return false;
  try {
    return directoryDigest(skillTarget) === marker.skill_digest;
  } catch {
    return false;
  }
}
