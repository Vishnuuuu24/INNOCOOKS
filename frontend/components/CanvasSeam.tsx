/** The breathing canvas, made safe: dusk ↔ parchment melts happen in
 *  text-free seam bands between sections, so copy always sits on its
 *  own solid background. The gradients are smoothstep-eased and blended
 *  in oklab (see globals.css) so the melt has no visible edges. */
export default function CanvasSeam({
  direction,
  compact = false,
}: {
  direction: "dusk-to-parch" | "parch-to-dusk";
  /** Shorter band — use when the next section already carries its own
   *  generous top padding, so the melt doesn't pile into empty space. */
  compact?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full ${
        compact ? "h-[20vh] md:h-[26vh]" : "h-[32vh] md:h-[44vh]"
      } ${direction === "dusk-to-parch" ? "seam-to-parch" : "seam-to-dusk"}`}
    />
  );
}
