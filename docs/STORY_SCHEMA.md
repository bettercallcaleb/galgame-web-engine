# Story schema / 剧情格式

The runtime file is `story/story.json` and has two top-level keys:

```json
{
  "meta": {},
  "nodes": {}
}
```

## `meta`

Common fields:

```json
{
  "title": "Your Game",
  "start": "start",
  "version": "1.0.0",
  "characters": [],
  "chapters": [],
  "achievements": []
}
```

`chapters` can expose a `start` node and optional `unlockSeen`, `desc`, and `preset` variables.

## Normal dialogue node / 普通对白

```json
{
  "bg": "room",
  "speaker": "Heroine",
  "text": "Hello.",
  "next": "next_node",
  "sprite": "neutral",
  "spritePosition": "right",
  "spriteShot": "medium",
  "spriteMotion": "soft-in",
  "sfx": "phone_ping"
}
```

Useful fields include `bg`, `speaker`, `text`, `next`, `sprite`, `spritePosition`, `spriteShot`, `spriteMotion`, `hideSprite`, portrait fields, `bgm`, `sfx`, `effects`, and `choice`.

## Choice / 选择

```json
{
  "text": "What do you say?",
  "choice": [
    {
      "text": "Tell the truth",
      "effects": {"honesty": 1},
      "next": "truth_route",
      "primary": true
    },
    {
      "text": "Avoid the question",
      "effects": {"secrecy": 1},
      "next": "avoid_route"
    }
  ]
}
```

## Branch / 条件跳转

A branch node evaluates conditions supported by the engine's `evalWhen()` logic and selects the matching destination. When extending condition syntax, update both the engine and this document.

## Special node types / 特殊节点

### Chapter

```json
{"type":"chapter","chapter":"Chapter 1","title":"Rain","next":"scene_1"}
```

### Cinematic

```json
{"type":"cinematic","bg":"street_night","text":"Later that night...","next":"scene_2"}
```

### Phone

Phone nodes render through the phone-card UI in `engine.js`.

### CG

```json
{
  "type":"cg",
  "asset":"sample_cg",
  "caption":"A memory.",
  "unlock":"example",
  "next":"after_cg"
}
```

For production projects, `asset` can also be a file path that the runtime can load.

### Ending

Ending nodes display the ending card and may unlock entries used by the ending/gallery systems.

## Structural rules / 结构规则

- Every `next`, choice target, and branch target must exist.
- Every chapter root should point to an existing node.
- File-backed CG assets must exist on disk.
- Background/sprite keys must be registered in `js/engine.js`.
- Stable node IDs matter because achievements, chapter unlocks, save/read state, or external tools may refer to them.

Run:

```bash
python3 build/audit_story.py
```

after every structural story edit.
