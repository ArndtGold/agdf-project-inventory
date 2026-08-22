# OpenCode Fresh-session UAT Protocol

Status: not_performed
Baseline: Project Inventory 0.1.0, AGDF 0.13.5, OpenCode 1.18.3

1. Record `npm run status:opencode -- --repo <repository>` before projection.
2. Run `npm run install:opencode -- --repo <repository>` to build, validate and explicitly project the owned skill and runtime.
3. Inspect the owned config entry and confirm that no npm plugin, hook or subagent was added.
4. Start a fresh OpenCode session in the target repository.
5. Invoke: “Create a bounded project inventory for the approved decision context.”
6. Record observed identity/version, the validator-confirmed selected AGDF run and approved scope
   reference, blocker or result and capability limits.
7. Verify that `not_checked`, `inaccessible`, `evidence_of_absence` and `conflicting` remain visibly
   distinct and that any management view copies report statements exactly.
8. Have the human reviewer set exactly one decision: `accept`, `revise` or `reject`.
9. Do not treat projected files, config or automation as human acceptance.
10. Recover with `npm run uninstall:opencode -- --repo <repository>` when complete.

The UAT record must validate against `plugin/skills/project-inventory/assets/schemas/uat-record.schema.json`.
