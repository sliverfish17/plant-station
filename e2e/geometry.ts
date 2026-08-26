/**
 * Slack allowed on a geometry comparison, in CSS pixels.
 *
 * Chromium computes a transformed element's box as floats, so a drawer that is
 * exactly as wide as a 360px viewport comes back from `boundingBox()` as
 * 360.00001525878906. That excess is 1/65536 of a pixel and it arrives through
 * the slide-in animation's transform matrix, not from any layout overflow — the
 * drawer is `w-full` inside a `fixed inset-0` parent, so it cannot be wider than
 * the viewport by construction.
 *
 * An assertion that means "never wider than the screen" is not interested in a
 * sixty-five-thousandth of a pixel, so box comparisons carry one sub-pixel of
 * tolerance. Half a pixel rather than a whole one: comfortably clear of the
 * float error, and still under anything a person could see or a real regression
 * would produce.
 */
export const SUBPIXEL = 0.5
