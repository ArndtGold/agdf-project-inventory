import { randomUUID } from "node:crypto";
import { cpSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveCanonicalSkillRoot } from "./skill-root.mjs";

const canonical = await import(pathToFileURL(join(
  resolveCanonicalSkillRoot(fileURLToPath(new URL("../..", import.meta.url))),
  "scripts",
  "lib",
  "shared",
  "data.mjs",
)).href);

export const { canonicalJson, sha256, readJson, listFiles, directoryDigest } = canonical;

export function writeText(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

export function writeJson(path, value) {
  writeText(path, canonicalJson(value));
}

export function writeJsonAtomic(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporaryPath, canonicalJson(value), "utf8");
    renameSync(temporaryPath, path);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
}

export function resetDirectory(path) {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

export function copyDirectory(source, target) {
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true, force: true });
}
