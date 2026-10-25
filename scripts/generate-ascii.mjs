import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

// A code-native portrait: sample the supplied photo, then typeset real ASCII.
// The silhouette follows Avator.jpeg; no remote service or runtime photo is needed.
const columns = 144;
const rows = 144;
const silhouette = [
  [0, 1254],
  [12, 1110],
  [80, 965],
  [180, 895],
  [330, 825],
  [419, 791],
  [453, 744],
  [420, 675],
  [407, 600],
  [390, 490],
  [399, 449],
  [397, 365],
  [410, 275],
  [445, 212],
  [500, 166],
  [561, 139],
  [639, 133],
  [715, 149],
  [780, 195],
  [823, 262],
  [845, 360],
  [835, 447],
  [857, 451],
  [855, 494],
  [829, 578],
  [816, 674],
  [784, 730],
  [805, 788],
  [915, 838],
  [1055, 903],
  [1168, 975],
  [1238, 1110],
  [1254, 1254],
];
function inside(x, y) {
  let result = false;
  for (let i = 0, j = silhouette.length - 1; i < silhouette.length; j = i++) {
    const [xi, yi] = silhouette[i],
      [xj, yj] = silhouette[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      result = !result;
  }
  return result;
}
const { data } = await sharp("lib/assessts/Avator.jpeg")
  .resize(columns, rows)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const ramp = " .,:;=+*#%@";
const lines = [];
for (let y = 0; y < rows; y++) {
  let line = "";
  for (let x = 0; x < columns; x++) {
    const i = (y * columns + x) * 3;
    const light =
      (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
    line += inside(((x + 0.5) / columns) * 1254, ((y + 0.5) / rows) * 1254)
      ? ramp[Math.min(10, Math.floor(Math.pow(1 - light, 1.35) * 11))]
      : " ";
  }
  lines.push(line);
}
await mkdir("public/avatar", { recursive: true });
await writeFile("public/avatar/portrait.json", JSON.stringify(lines));
await writeFile("public/avatar/sufiyan-ascii.txt", lines.map((line) => line.trimEnd()).join("\n") + "\n");
const makeSvg = (background, ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><title>Sufiyan Ali — ASCII portrait</title><rect width="1080" height="1080" fill="${background}"/><g fill="${ink}" font-family="monospace" font-size="9" font-weight="700">${lines.map((line, y) => Array.from(line, (char, x) => (char === " " ? "" : `<text x="${36 + x * 7}" y="${36 + y * 7}">${char}</text>`)).join("")).join("")}</g></svg>`;
for (const [name, bg, ink] of [
  ["sufiyan-ascii", "#f5f4ef", "#20211f"],
  ["sufiyan-ascii-blue", "#2455eb", "#f5f4ef"],
]) {
  const svg = makeSvg(bg, ink);
  await writeFile(`public/avatar/${name}.svg`, svg);
  await sharp(Buffer.from(svg)).png().toFile(`public/avatar/${name}.png`);
}
console.log("Generated ASCII data, text, SVG and 1080px profile pictures.");
const portraitSvg = makeSvg("#f5f4ef", "#20211f")
  .replace("<svg ", '<svg x="635" y="15" ')
  .replace('width="1080" height="1080"', 'width="600" height="600"');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f4ef"/><rect x="0" y="0" width="1200" height="10" fill="#2455eb"/>${portraitSvg}<g fill="#20211f" font-family="sans-serif"><text x="62" y="95" font-size="28" font-weight="bold">[s] suffynux.</text><text x="58" y="240" font-size="85" font-weight="bold" letter-spacing="-5">I make</text><text x="58" y="335" font-size="85" font-weight="bold" letter-spacing="-5">ideas work.</text><text x="62" y="414" font-size="25">Sufiyan Ali</text><text x="62" y="453" font-size="21" fill="#61635e">Full-stack developer. AI builder.</text><text x="62" y="555" font-size="17" fill="#2455eb">SUFFYNUX.COM / FROM IDEA TO PRODUCTION</text></g></svg>`;
await sharp(Buffer.from(social)).png().toFile("public/og-ascii.png");
