# Claude Code Fresh-session UAT Protocol

Status: not_performed
Baseline: Project Inventory 0.1.0, AGDF 0.13.5, Claude Code 2.1.193

1. Record `npm run status:claude` before installation.
2. Run `npm run install:claude`; the command builds and validates before using the owned local marketplace.
3. Record the enabled project or user scope without treating plugin-list output as discovery proof.
4. Start a fresh Claude Code session for the intended repository.
5. Invoke: “Create a bounded project inventory for the approved decision context.”
6. Record observed identity/version, the validator-confirmed selected AGDF run and approved scope
   reference, blocker or result and capability limits.
7. Verify that `not_checked`, `inaccessible`, `evidence_of_absence` and `conflicting` remain visibly
   distinct and that any management view copies report statements exactly.
8. Have the human reviewer set exactly one decision: `accept`, `revise` or `reject`.
9. Do not use permission prompts, automation or package evidence as the human decision.
10. Recover with `npm run uninstall:claude` when complete.

The UAT record must validate against `plugin/skills/project-inventory/assets/schemas/uat-record.schema.json`.
