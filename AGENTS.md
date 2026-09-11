# Repository instructions for coding agents

This repository is a static visual-novel engine plus a JSON story graph.

## Read first

- `docs/ARCHITECTURE.md`
- `docs/STORY_SCHEMA.md`
- `docs/CODEX_WORKFLOW.md`
- `docs/ASSETS.md`

## Invariants

1. Preserve save compatibility unless a task explicitly requests a save-key migration.
2. Treat node IDs as stable API: they are graph references and may be used by unlocks or achievements.
3. Register new asset keys in `js/engine.js` before referencing them from story JSON.
4. Keep heroine art on the full-size sprite layer; portrait cards are for profiles/supporting UI unless a task says otherwise.
5. After story changes run `python3 build/audit_story.py`.
6. After asset changes run `python3 build/audit_assets.py`.
7. After runtime/UI changes start the local server and smoke-test the affected flow.
8. Prefer small reviewable diffs. Do not mass-rewrite unrelated story nodes.
9. Keep the default runtime dependency-light: no JS framework or build step unless explicitly requested.

## Definition of done

- audits pass
- no broken story references
- new route is reachable from a valid root
- required assets exist
- browser console has no new errors
- docs are updated when public behavior changes
