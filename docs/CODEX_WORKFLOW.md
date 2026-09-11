# Developing with Codex / 使用 Codex 继续开发

This repository is structured so a coding agent can discover project rules from the repo itself: `AGENTS.md` is the short instruction entry point and `docs/` contains the deeper architecture/schema knowledge.

## First prompt / 第一个提示词

```text
Read AGENTS.md and docs/*.md. Do not modify anything yet.
Summarize the runtime architecture, story schema, validation commands,
and the safest extension points.
```

## Add a route / 新增路线

```text
Add a new optional route for [character].
Scope the change to one new chapter and one ending.
Reuse existing engine capabilities; do not add a framework.
Create stable node ids with prefix newchar_.
Register any new assets using semantic keys.
After edits, run build/audit_story.py and build/audit_assets.py.
Then start the local server and smoke-test the changed route.
Do not mass-rewrite unrelated nodes.
```

## Fix a story bug / 修剧情 bug

```text
Investigate the story around node/text: "...".
Trace incoming/outgoing references, choices, conditions, and recovery guards.
Reproduce the failure from a valid chapter root if possible.
Make the smallest structural fix, run audit_story.py, and report the exact nodes changed.
```

## Rewrite prose safely / 安全文案改写

```text
Rewrite only chapter X for stronger pacing.
Preserve node ids, graph topology, effects, choices, unlocks, and endings.
Change text only unless a structural change is explicitly justified.
Run audit_story.py afterward.
```

## Add art / 接入图片

```text
Add these image files to the correct asset folders.
Create semantic sprite/background/CG keys.
Update only story nodes that should visibly use the new art.
Keep heroine sprites on the full-size sprite layer, not the portrait-card layer.
Run both audits.
```

## Prepare a release / 发版

```text
Prepare release vX.Y.Z.
Update meta.version, README/changelog, and visible version strings.
Run both audits and a local HTTP smoke test.
Preserve save compatibility unless migration is explicitly requested.
```

## Practical rule

Give Codex narrow, testable, chapter-sized tasks. Avoid prompts like “rewrite the whole game” unless you intentionally want a broad redesign.
