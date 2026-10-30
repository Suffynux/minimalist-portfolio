/** All connected sections reveal against the same point in the document. */
export function threadProgressAt(scrollTop: number, top: number, height: number, viewport: number) {
  const y = Math.max(0, scrollTop);
  const horizon = y + Math.min(y * .5, viewport * .5);
  return Math.max(0, Math.min(1, (horizon - top) / Math.max(1, height)));
}
