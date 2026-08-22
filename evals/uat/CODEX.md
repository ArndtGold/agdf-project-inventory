# Codex Fresh-session UAT Protocol

Status: not_performed
Baseline: Project Inventory 0.1.0, AGDF 0.13.5, Codex CLI 0.145.0

1. Record `npm run status:codex` before installation.
2. Run `npm run install:codex`; the command builds and validates before using the owned local marketplace.
3. Confirm package availability separately from repository AGDF scope activation.
4. Open a new Codex conversation in the target repository.
5. Invoke: “Create a bounded project inventory for the approved decision context.”
6. Record observed plugin identity/version, the validator-confirmed selected AGDF run and approved
   scope reference, visible blocker or result and whether repository, runtime, external-system and
   human evidence remained distinct.
7. Verify that `not_checked`, `inaccessible`, `evidence_of_absence` and `conflicting` remain visibly
   distinct and that any management view copies report statements exactly.
8. Have the human reviewer set exactly one decision: `accept`, `revise` or `reject`.
9. Do not derive that decision from automated tests or package presence.
10. Recover with `npm run uninstall:codex` when the local test is complete.

The UAT record must validate against `plugin/skills/project-inventory/assets/schemas/uat-record.schema.json`.
