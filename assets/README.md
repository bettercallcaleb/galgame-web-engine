# Assets

The open-source starter keeps demo art inline as SVG data inside `js/engine.js`, so the repository remains lightweight and immediately runnable.

For a real project, create folders such as:

```text
assets/backgrounds/
assets/sprites/
assets/portraits/
assets/cg/
assets/audio/bgm/
assets/audio/sfx/
```

Then replace the inline demo entries in the `ASSETS`, `SPRITES`, `PORTRAITS`, `BGM`, and `SFX` registries near the top of `js/engine.js` with file paths.
