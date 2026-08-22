---
name: project-inventory
description: Create one bounded, evidence-first Project Inventory for exactly one validator-confirmed AGDF run and approved Inventory scope, without creating delivery authority.
---

# AGDF Project Inventory

## Purpose

Guide one decision-oriented Project Inventory from approved scope through a validated Inventory
Report without becoming a second AGDF authority or a second source of truth for the project.

## When To Use

Use this skill when the user asks for a project inventory, current-state assessment, evidence-backed
project status or management view and a local AGDF validator confirms exactly one selected run plus
one approved Project Inventory scope declaration.

Do not start controlled Inventory writes merely because this skill is discoverable or installed.

## Required Resources

- `references/assessment-intake.md`
- `references/evidence-register.md`
- `references/findings-and-gaps-register.md`
- `references/inventory-report.md`
- `references/management-view.md`
- `assets/schemas/`
- `scripts/project-inventory.mjs`

Use `scripts/project-inventory.mjs` for deterministic validation, AGDF preflight and Inventory Run
validation. Treat its diagnostics and validator-confirmed context as control results, not as model
interpretation.

## Workflow

1. Run the local Project Inventory status and AGDF preflight for exactly one selected AGDF run.
2. Stop visibly on missing, incompatible, ambiguous or disallowed AGDF state; create no controlled
   Inventory artefact before preflight passes.
3. Resolve the approved scope declaration, source boundary, confidentiality and allowed outputs
   only from the immutable validator-confirmed authority context. The Inventory skill never creates,
   expands or approves its own scope.
4. Create or validate the Assessment Intake. Ask only for missing information required by the
   approved scope, schema or validation result. Ask only questions returned by the local validator
   and transmit their rendered text verbatim.
5. Register evidence with stable identifiers, provenance, evidence lane, access state, reach and
   limitation. An inaccessible entry records an access attempt, not substantive project evidence.
6. Record each statement as exactly one of `observation`, `interpretation`, `unknown` or
   `recommendation`, with a support state and resolvable evidence references.
7. Keep repository, runtime, external-system and human claims within their evidenced lanes. Do not
   promote repository evidence to runtime or human acceptance.
8. Render the Inventory Report only from validated Intake, Evidence and Findings registers.
9. Render a management view only as an exact subset of report statement projections. The management
   view is a projection, not a summary. Do not paraphrase, merge or add an independent assessment.
10. Show all blockers, retained valid state and exactly one next recovery action. Retry only after a
    visible correction.
11. End with report references, known unknowns, limitations and any separately proposed follow-up.

## Authority Boundary

- AGDF owns gates, approvals, Run State and delivery transitions.
- Project source systems own their original content.
- The Inventory Report owns only the evaluated result of this Inventory Run.
- Host permissions and lifecycle commands are technical actions, never AGDF approval.
- Never write `.agdf/control/` or infer approval from generic consent.
- Compatibility is a validator result, never a model inference.

## Evidence Discipline

Facts, interpretations, unknowns and recommendations remain distinguishable. Conflicting evidence
stays conflicting. Unsupported persuasive prose is a validation failure, not a drafting shortcut.
Templates supply questions and fields only; they never supply conclusions, scores or defaults.
Absence of evidence, inaccessible evidence, evidence of absence and conflicting evidence are
distinct states and must never be collapsed.

## Output

Return the run identifier, effective host state, selected AGDF run, report state, artefact references,
limitations and exactly one next action. Keep automated, installed-host and human UAT evidence
separate in both durable records and chat.
