# Contributing

Thanks for helping improve Galgame Web Engine.

## Before coding

Read:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/STORY_SCHEMA.md`
- `docs/ASSETS.md`

## Pull requests

Keep changes focused. Avoid mass-rewriting unrelated story nodes or introducing a JS framework unless the change explicitly requires it.

Before opening a PR:

```bash
python3 build/audit_story.py
python3 build/audit_assets.py
```

Then start a local server and test the affected route in a browser.

## Assets

Only contribute media you have the right to redistribute. Prefer documenting source/license information for nontrivial assets.
