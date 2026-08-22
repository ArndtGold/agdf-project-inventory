import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readJson, writeJson } from "../shared/files.mjs";

export const ownershipFile = ".agdf-project-inventory-owned.json";

export function ownershipMarker(root) {
  const path = join(root, ownershipFile);
  if (!existsSync(path)) return null;
  try {
    const marker = readJson(path);
    return marker.owner === "agdf-project-inventory" && marker.schema_version === "1" ? marker : null;
  } catch {
    return null;
  }
}

export function assertOwnedOrAbsent(root) {
  if (!existsSync(root)) return;
  if (!ownershipMarker(root)) throw new Error(`Refusing to mutate unowned state: ${root}`);
}

export function writeOwnership(root, version, surface, extra = {}) {
  writeJson(join(root, ownershipFile), {
    schema_version: "1",
    owner: "agdf-project-inventory",
    version,
    surface,
    ...extra,
  });
}
