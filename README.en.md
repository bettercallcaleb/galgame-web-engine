# Galgame Web Engine — English

A zero-build, open-source visual novel / Galgame starter built with vanilla HTML, CSS and JavaScript.

> No npm. No bundler. No framework. Edit the JSON story graph, replace the assets, and publish as a static site.

## Highlights

- branching JSON story graph
- multiple heroines, routes, and endings
- variables, effects, and conditional branches
- full-size sprites, portraits, backgrounds, CGs
- AUTO, read-only SKIP, rollback, history
- multi-slot save/load + autosave
- gallery, characters, chapters, achievements, music room
- BGM/SFX hooks and procedural rain ambience
- graph/reachability/asset audits
- `AGENTS.md` + Codex development guide

## Run

```bash
./start.sh --port 10000
```

Open `http://127.0.0.1:10000`.

## Start customizing

1. Read `AGENTS.md` and `docs/ARCHITECTURE.md`.
2. Edit `story/story.json`.
3. Replace the inline sample art with your own assets.
4. Register semantic asset keys in `js/engine.js`.
5. Run `python3 build/audit_story.py`.
6. Run `python3 build/audit_assets.py`.
7. Smoke-test the changed route in a browser.

For schema details see `docs/STORY_SCHEMA.md`. For AI-assisted development see `docs/CODEX_WORKFLOW.md`.

## License

MIT. Verify redistribution rights for any third-party assets you add.
