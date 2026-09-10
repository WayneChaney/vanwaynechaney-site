# Remotion Build

This folder is a standalone Remotion composition. It is intentionally separate from the static website so video tooling never affects the live site build.

## Files to add

Place generated assets in `public/media/` using these names:

- `wayne-talking.mp4` - Wayne's direct-to-camera footage
- `lead-waiting.mp4` - Prompt 01
- `broken-handoff.mp4` - Prompt 02
- `systems-moving.mp4` - Prompt 03
- `real-estate-flow.mp4` - Prompt 04
- `trade-response.mp4` - Prompt 05
- `municipal-ops.mp4` - Prompt 06
- `music.mp3` - licensed instrumental track, optional

The composition previews without the assets. In `src/Root.jsx`, change `assetsReady` to `true` after the assets are in place.

## Run

```powershell
cd C:\Users\Wayne\Projects\NEBULA-TRANSFER\vanwaynechaney-site\commercial\automation-optimization-promo\remotion
npm install
npm run studio
```

Render after the footage is in place:

```powershell
npm run render
```

Output: `out/automation-optimization-promo.mp4`.

## Production Notes

- Captions are burned into the composition.
- The 8x response-time claim is shown only as a small sourced proof card, not spoken as a guarantee.
- Keep the actual client-result card disabled until the exact testimonial and result are confirmed.
