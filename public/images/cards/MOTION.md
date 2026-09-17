# Animated card fronts

Family's playback component is shared by Love, Yes/No, One Card, Three Cards, Work and Money. Sources are in Figma file `TTeZGFcCwl9EdbMapw7MqM`.

| Asset slug | Card | Standalone motion pattern | Video export copy | Title export copy |
| --- | --- | --- | --- | --- |
| love | 2146:256 | 2146:2449 | 4034:2451 | 4034:2944 |
| yes-no | 2146:504 | 2146:2693 | 4034:3192 | 4034:3735 |
| one-card | 2146:777 | 2146:2962 | 4034:4008 | 4034:4593 |
| three-cards | 2146:1071 | 2146:3252 | 4034:4887 | 4034:5794 |
| work | 2146:1526 | 2146:3703 | 4034:6249 | 4034:6866 |
| money | 2146:1836 | 2146:4284 | 4034:7176 | 4034:7786 |

See `family-motion/README.md` for Family's existing provenance.

## Composition and regeneration

Original Figma nodes are unchanged. Each video copy preserves the card substrate and inner frame, replaces the embedded pattern with a clone of the linked standalone pattern, and removes the title. Use Figma `rescale` on a wrapper to match the original embedded pattern width (964); this also scales translation keyframes. Preserve the original pattern position inside the inner frame. Its global card offsets are Love (-173, -175), Yes/No (-181, -174), One Card (approximately -181, -174), Three Cards (-174, -174), Work (-173, -172), Money (-174, -174).

Export the copy using Figma Motion's high-quality MP4 at 618 × 1098, 60 FPS. These are opaque H.264 renders with the masks, boolean operations and timing baked in. The standalone timelines are 3500 ms, except Three Cards at 3501.269 ms. The exported containers include the boundary frame: 3.516667 s, or 3.533333 s for Three Cards. Inspect the loop boundary when regenerating.

Move the MP4 `moov` box before media data and adjust chunk offsets without re-encoding. Extract the first decoded frame as the PNG poster. Export the title-only copy as SVG with outlined text, preserving stroke and card coordinates; identical path data can be shared with SVG `use` elements. Do not rasterize titles or substitute browser fonts.

Each directory contains `{slug}-motion.mp4`, `{slug}-poster.png` and `{slug}-title.svg`. Video sizes are approximately 3.0–3.6 MB each. The page does not request all videos initially: only mounted, intersecting front faces request a video. Loading, playback failure and reduced motion use poster plus title.

## Integration checks

`CardsFan/AnimatedCardFront.tsx` overlays the three layers using the same centered cover crop. `cardFrontAssets.ts` maps slugs to assets. The existing card transform and navigation remain in CardsFan. Playback starts after its opening flip completes and freezes during the closing flip. Hidden/offscreen videos pause. Check both responsive trees, rapid hover changes, keyboard focus, navigation, reduced motion and media failure when updating this integration.
