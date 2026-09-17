# Family front assets

- Composition: Figma file `TTeZGFcCwl9EdbMapw7MqM`, card `2146:2143`.
- Approved animation source: standalone pattern `2146:4009` (its easing and keyframes differ from the pattern inside the card).
- Separate export copy: `4030:15`, named `Family — website motion export (no title)`. Original nodes are unchanged.
- Pattern scaled uniformly by `964 / 1399`, positioned at `(-174, -174)` in the 618 × 1098 card. Figma `rescale` scales translation keyframes with the artwork.
- `family-motion.mp4`: Figma high-quality H.264 export, 618 × 1098, requested 60 FPS, no title or audio. Source timeline is 3.5 seconds; the exported container includes the boundary frame and reports 3.516667 seconds.
- `family-title.svg`: original outlined title and its mask/stroke extracted from the existing `animated-cards/Family.svg`, preserving card coordinates.
- `family-poster.png`: first decoded frame of the MP4, so video startup does not change the background color.
- MP4 metadata (`moov`) is relocated before the media data with chunk offsets adjusted, enabling progressive startup without re-encoding the Figma render.

The video bakes in the substrate and animated boolean masks. Do not replace it with the existing animated SVG: that export flattens the animated `Subtract` mask into a static path.

The component uses the same centered cover crop for all three layers. Animation starts after the existing flip completes. Reduced motion, playback failure and loading use the poster plus the SVG title.

To regenerate, render the export copy through Figma Motion at the same dimensions and frame rate, then extract its first decoded frame as the poster. Check the mask around the family, the circular reveals, stars and loop boundary before replacing the assets.
