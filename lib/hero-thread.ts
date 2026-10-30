export type HeroThreadBox = { left: number; right: number; bottom: number; height: number };

/** Route through measured headline gaps; the mobile tail skirts the stacked CTAs. */
export function heroThreadGeometry({ width, height, titleLeft, question, questionRow, buildRow, nextRow, nextText, brand }: {
  width: number;
  height: number;
  titleLeft: number;
  question: HeroThreadBox;
  questionRow: HeroThreadBox;
  buildRow: HeroThreadBox;
  nextRow: HeroThreadBox;
  nextText: HeroThreadBox;
  brand: HeroThreadBox;
}) {
  const mobile = width <= 700;
  const radius = mobile ? 12 : 30;
  const rail = Math.min(width - radius - 8, Math.max(question.right, nextText.right) + radius);
  const left = Math.max(8, titleLeft - (mobile ? 9 : 20));
  const start = { x: brand.left + (brand.right - brand.left) * .5, y: brand.bottom + 8 };
  const entry = { x: question.left + question.height * .12, y: questionRow.bottom + questionRow.height * .035 };
  const approach = Math.max(start.y + radius * 2, questionRow.bottom - questionRow.height * 2 - radius);
  const middle = buildRow.bottom + buildRow.height * .035;
  const under = nextRow.bottom + Math.max(14, nextRow.height * .14);
  const center = width / 2;
  const finish = Math.max(height, under + radius * 4);
  const d = [
    `M${start.x} ${start.y}`,
    `C${start.x} ${approach} ${left} ${approach-radius} ${left} ${approach+radius}`,
    `V${entry.y-radius}Q${left} ${entry.y} ${left+radius} ${entry.y}H${entry.x}`,
    `C${entry.x+(rail-entry.x)*.4} ${entry.y+3} ${rail-radius} ${entry.y} ${rail} ${entry.y}`,
    `C${rail+radius*.7} ${entry.y} ${rail+radius*.7} ${middle} ${rail} ${middle}`,
    `C${rail-radius*2} ${middle+3} ${left+radius*2} ${middle-3} ${left+radius*.4} ${middle}`,
    `C${left-radius*.25} ${middle} ${left-radius*.25} ${under} ${left+radius*.4} ${under}`,
    mobile
      ? `C${width*.3} ${under+3} ${rail-radius} ${under-3} ${rail} ${under}Q${rail+radius} ${under} ${rail+radius} ${under+radius}V${finish-radius*2}Q${rail+radius} ${finish-radius} ${rail} ${finish-radius}H${center+radius}Q${center} ${finish-radius} ${center} ${finish}`
      : `C${width*.22} ${under+4} ${center-radius} ${under-4} ${center} ${under+radius*.4}C${center+radius} ${under+radius} ${center} ${under+radius*2} ${center} ${under+radius*3}V${finish}`,
  ].join('');
  return { d, start, height: finish };
}
