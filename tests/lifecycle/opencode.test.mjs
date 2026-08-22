import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackages } from "../../src/package/build.mjs";
import { inspectOpenCode, installOpenCodeProjection, uninstallOpenCodeProjection } from "../../src/lifecycle/opencode.mjs";
import { directoryDigest } from "../../plugin/skills/project-inventory/scripts/lib/shared/data.mjs";
import { ownershipFile } from "../../src/lifecycle/ownership.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("PI-T12 OpenCode projection is owned, reversible and never claims observation", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(targetRepo, { recursive: true });
    buildPackages({ repoRoot, outputRoot });
    installOpenCodeProjection({ projectionRoot: join(outputRoot, "opencode"), repoRoot: targetRepo, version: "0.1.0" });
    const inspected = inspectOpenCode({ repoRoot: targetRepo, expectedVersion: "0.1.0" });
    assert.equal(inspected.package_present, true);
    assert.equal(inspected.activated, true);
    assert.equal(inspected.runtime_observed, false);
    const installedSkill = join(targetRepo, ".opencode", "skills", "project-inventory");
    assert.equal(
      directoryDigest(installedSkill),
      directoryDigest(join(outputRoot, "opencode", ".opencode", "skills", "project-inventory")),
    );
    assert.equal(existsSync(join(installedSkill, ownershipFile)), false);
    uninstallOpenCodeProjection({ repoRoot: targetRepo });
    assert.equal(existsSync(join(targetRepo, ".opencode", "project-inventory")), false);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T12 OpenCode refuses an unowned existing projection", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(join(targetRepo, ".opencode", "project-inventory"), { recursive: true });
    writeFileSync(join(targetRepo, ".opencode", "project-inventory", "foreign.txt"), "foreign\n");
    buildPackages({ repoRoot, outputRoot });
    assert.throws(() => installOpenCodeProjection({ projectionRoot: join(outputRoot, "opencode"), repoRoot: targetRepo, version: "0.1.0" }), /unowned state/);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T12 OpenCode refuses an incomplete owned projection during uninstall", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(targetRepo, { recursive: true });
    buildPackages({ repoRoot, outputRoot });
    installOpenCodeProjection({ projectionRoot: join(outputRoot, "opencode"), repoRoot: targetRepo, version: "0.1.0" });
    const skillTarget = join(targetRepo, ".opencode", "skills", "project-inventory");
    rmSync(skillTarget, { recursive: true, force: true });
    assert.throws(() => uninstallOpenCodeProjection({ repoRoot: targetRepo }), /unowned OpenCode configuration entry/);
    assert.equal(existsSync(join(targetRepo, ".opencode", "project-inventory")), true);
  } finally {
    temporary.cleanup();
  }
});

test("PI-R3-T05 OpenCode treats a changed installed skill as unowned", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(targetRepo, { recursive: true });
    buildPackages({ repoRoot, outputRoot });
    installOpenCodeProjection({ projectionRoot: join(outputRoot, "opencode"), repoRoot: targetRepo, version: "0.1.0" });
    const skillFile = join(targetRepo, ".opencode", "skills", "project-inventory", "SKILL.md");
    writeFileSync(skillFile, `${readFileSync(skillFile, "utf8")}changed\n`);

    assert.equal(inspectOpenCode({ repoRoot: targetRepo, expectedVersion: "0.1.0" }).conflict, true);
    assert.throws(() => uninstallOpenCodeProjection({ repoRoot: targetRepo }), /unowned OpenCode state/);
    assert.equal(existsSync(join(targetRepo, ".opencode", "project-inventory")), true);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T12 OpenCode upgrades only owned state and reports the new version", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(targetRepo, { recursive: true });
    buildPackages({ repoRoot, outputRoot });
    const projectionRoot = join(outputRoot, "opencode");
    installOpenCodeProjection({ projectionRoot, repoRoot: targetRepo, version: "0.1.0" });
    installOpenCodeProjection({ projectionRoot, repoRoot: targetRepo, version: "0.1.1" });
    assert.equal(inspectOpenCode({ repoRoot: targetRepo, expectedVersion: "0.1.1" }).observed_version, "0.1.1");
  } finally {
    temporary.cleanup();
  }
});

test("PI-T12 OpenCode can reapply an owned current projection without duplicate config", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(targetRepo, { recursive: true });
    buildPackages({ repoRoot, outputRoot });
    const projectionRoot = join(outputRoot, "opencode");
    installOpenCodeProjection({ projectionRoot, repoRoot: targetRepo, version: "0.1.0" });
    installOpenCodeProjection({ projectionRoot, repoRoot: targetRepo, version: "0.1.0" });
    const config = JSON.parse(readFileSync(join(targetRepo, "opencode.json"), "utf8"));
    assert.deepEqual(config.instructions, [".opencode/skills/project-inventory/SKILL.md"]);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T12 OpenCode rejects invalid config before writing projection state", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(targetRepo, { recursive: true });
    writeFileSync(join(targetRepo, "opencode.json"), JSON.stringify({ instructions: "invalid" }));
    buildPackages({ repoRoot, outputRoot });
    assert.throws(() => installOpenCodeProjection({ projectionRoot: join(outputRoot, "opencode"), repoRoot: targetRepo, version: "0.1.0" }), /non-array/);
    assert.equal(existsSync(join(targetRepo, ".opencode", "project-inventory")), false);
  } finally {
    temporary.cleanup();
  }
});

test("PI-T12 OpenCode restores the previous projection when an upgrade copy fails", () => {
  const temporary = temporaryDirectory();
  try {
    const outputRoot = join(temporary.path, "build");
    const targetRepo = join(temporary.path, "project");
    mkdirSync(targetRepo, { recursive: true });
    buildPackages({ repoRoot, outputRoot });
    const projectionRoot = join(outputRoot, "opencode");
    installOpenCodeProjection({ projectionRoot, repoRoot: targetRepo, version: "0.1.0" });
    rmSync(join(projectionRoot, ".opencode", "skills", "project-inventory"), { recursive: true, force: true });
    assert.throws(() => installOpenCodeProjection({ projectionRoot, repoRoot: targetRepo, version: "0.1.1" }));
    const inspected = inspectOpenCode({ repoRoot: targetRepo, expectedVersion: "0.1.0" });
    assert.equal(inspected.package_present, true);
    assert.equal(inspected.observed_version, "0.1.0");
    assert.match(readFileSync(join(targetRepo, "opencode.json"), "utf8"), /project-inventory/);
  } finally {
    temporary.cleanup();
  }
});
