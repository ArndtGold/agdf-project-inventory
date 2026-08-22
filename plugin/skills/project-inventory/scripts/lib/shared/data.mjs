import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { relative } from "node:path";

export function canonicalJson(value) {
  return `${JSON.stringify(sortObject(value), null, 2)}\n`;
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
}

export function sha256(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function listFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  function visit(directory) {
    for (const name of readdirSync(directory).sort()) {
      const path = `${directory}/${name}`;
      const stats = lstatSync(path);
      if (stats.isSymbolicLink()) throw new Error(`Symbolic links are not allowed in deterministic directory traversal: ${path}`);
      if (stats.isDirectory()) visit(path);
      else if (stats.isFile()) files.push(path);
    }
  }
  visit(root);
  return files;
}

export function directoryDigest(root) {
  const hash = createHash("sha256");
  for (const path of listFiles(root)) {
    hash.update(relative(root, path).replaceAll("\\", "/"));
    hash.update("\0");
    hash.update(readFileSync(path));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}
