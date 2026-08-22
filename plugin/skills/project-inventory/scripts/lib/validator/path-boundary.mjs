import { isAbsolute, normalize, relative, resolve, sep } from "node:path";

export function normalizedRepositoryPath(value) {
  if (typeof value !== "string" || value.trim() === "" || isAbsolute(value) || value.includes("\0")) return null;
  const normalized = normalize(value).replaceAll("\\", "/");
  if (normalized === ".." || normalized.startsWith("../") || normalized.includes("/../")) return null;
  return normalized.replace(/^\.\//, "");
}

export function pathWithinRoot(root, candidate) {
  const target = resolve(root, candidate);
  const relation = relative(resolve(root), target);
  return relation !== ".." && !relation.startsWith(`..${sep}`) && !isAbsolute(relation);
}
