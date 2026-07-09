/**
 *
 * M3 expresses elevation as a dp value (0-5 "levels" in the spec, but any
 * dp works). This turns that into a CSS box-shadow so every component that
 * needs "float this surface off the page" (Button, Card, Fab, Dialog,
 * Snackbar, Menu, ...) stops hand-rolling the same shadow string.
 */

/** Builds a box-shadow string for a given elevation in dp. 0 = "none". */
export function ElevationShadow(dp: number, alpha = 0.3): string {
  if (dp <= 0) return "none";
  const blur = dp * 2;
  const spread = Math.max(0, +(dp * 0.4).toFixed(1));
  return `0 ${dp}px ${blur}px ${spread}px rgba(0, 0, 0, ${alpha})`;
}
