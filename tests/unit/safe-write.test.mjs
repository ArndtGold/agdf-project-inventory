import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promoteJsonCandidate } from "../../plugin/skills/project-inventory/scripts/lib/validator/safe-write.mjs";
import { temporaryDirectory } from "../helpers/temporary.mjs";
import { validationResult, diagnostic } from "../../plugin/skills/project-inventory/scripts/lib/validator/diagnostics.mjs";
import { sha256 } from "../../plugin/skills/project-inventory/scripts/lib/shared/data.mjs";

test("PI-T05 invalid candidates preserve the last valid target and corrected retry succeeds", () => {
  const temporary = temporaryDirectory();
  try {
    const target = join(temporary.path, "target.json");
    const candidate = join(temporary.path, "candidate.json");
    const targetBytes = Buffer.from('{"state":"valid"}\n');
    writeFileSync(target, targetBytes);
    writeFileSync(candidate, '{"state":"invalid"}\n');
    const validate = (value) => value.state === "valid"
      ? validationResult()
      : validationResult([diagnostic("PI_TEST_INVALID", "block", "state", "invalid", "correct")]);
    const failed = promoteJsonCandidate({ candidatePath: candidate, targetPath: target, validate, expectedTargetDigest: sha256(targetBytes), artifactId: "target-001" });
    assert.equal(failed.valid, false);
    assert.deepEqual(failed.retained_valid_state, ["target-001"]);
    assert.equal(JSON.parse(readFileSync(target, "utf8")).state, "valid");
    writeFileSync(candidate, '{"state":"valid"}\n');
    assert.equal(promoteJsonCandidate({ candidatePath: candidate, targetPath: target, validate, expectedTargetDigest: sha256(targetBytes) }).promoted, true);
  } finally {
    temporary.cleanup();
  }
});

test("PI-R2-T08 retained state requires an exact prior digest and candidate cannot alias target", () => {
  const temporary = temporaryDirectory();
  try {
    const target = join(temporary.path, "target.json");
    const candidate = join(temporary.path, "candidate.json");
    writeFileSync(target, '{"state":"valid"}\n');
    writeFileSync(candidate, '{"state":"invalid"}\n');
    const validate = (value) => value.state === "valid"
      ? validationResult()
      : validationResult([diagnostic("PI_TEST_INVALID", "block", "state", "invalid", "correct")]);
    const staleDigest = promoteJsonCandidate({ candidatePath: candidate, targetPath: target, validate, expectedTargetDigest: `sha256:${"0".repeat(64)}` });
    assert.deepEqual(staleDigest.retained_valid_state, []);
    const alias = promoteJsonCandidate({ candidatePath: target, targetPath: target, validate, expectedTargetDigest: sha256(readFileSync(target)) });
    assert.equal(alias.blockers[0].code, "PI_CANDIDATE_TARGET_ALIAS");
    assert.equal(JSON.parse(readFileSync(target, "utf8")).state, "valid");
  } finally {
    temporary.cleanup();
  }
});

test("PI-R3-T03 safe promotion can never target AGDF control state", () => {
  const temporary = temporaryDirectory();
  try {
    const controlRoot = join(temporary.path, ".agdf", "control");
    mkdirSync(controlRoot, { recursive: true });
    const targetPath = join(controlRoot, "RUN_STATE.json");
    const candidatePath = join(controlRoot, "RUN_STATE.candidate.json");
    writeFileSync(targetPath, `${JSON.stringify({ valid: true })}\n`);
    writeFileSync(candidatePath, `${JSON.stringify({ valid: true })}\n`);

    const result = promoteJsonCandidate({
      candidatePath,
      targetPath,
      validate: () => validationResult(),
      expectedTargetDigest: sha256(readFileSync(targetPath)),
    });

    assert.equal(result.valid, false);
    assert.equal(result.next_recovery_action_code, "PI_AGDF_CONTROL_WRITE_FORBIDDEN");
    assert.equal(existsSync(candidatePath), true);
  } finally {
    temporary.cleanup();
  }
});
