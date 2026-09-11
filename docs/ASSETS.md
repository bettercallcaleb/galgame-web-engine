# Assets

The open-source starter keeps demo art inline as SVG data inside `js/engine.js`, so the repository remains lightweight and immediately runnable.

## Suggested folders

```text
assets/backgrounds/
assets/sprites/
assets/portraits/
assets/cg/
assets/audio/bgm/
assets/audio/sfx/
assets/title/
```

## Runtime registration

Backgrounds, sprites, portraits, BGM, and SFX are registered near the top of `js/engine.js`. Story nodes should reference semantic keys such as `office_day`, `suqing`, or `rainy_night`, not hard-coded presentation logic.

## Heroine sprites vs portraits

Use the full-size sprite layer for heroines during dialogue. Portrait cards are intended for profile/supporting UI unless the scene deliberately calls for them.

## Art checks

Run:

```bash
python3 build/audit_assets.py
```

The audit detects exact duplicate assets and near-duplicate raster images when external asset files are present.

## Licensing

Only commit assets you have permission to redistribute.
