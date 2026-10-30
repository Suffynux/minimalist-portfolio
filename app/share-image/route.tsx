import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

/** Four-line hero artwork, typeset with the same Archivo face as the website. */
export async function GET() {
  const font = await readFile(join(process.cwd(), "public/fonts/Archivo-Black.ttf"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#11120f", backgroundImage: "radial-gradient(ellipse at 80% 20%, #1b1e15, #11120f)", color: "#f4f3ec", padding: "26px 48px", fontFamily: "Archivo", fontWeight: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, letterSpacing: 1 }}><span>SUFFYNUX*</span><span style={{ fontSize: 11, color: "#a9ab9f" }}>SUFIYAN ALI / INDEPENDENT DEVELOPER</span></div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 32, fontSize: 125, lineHeight: 1.02, letterSpacing: "-7px" }}>
        <span>YOU HAVE</span>
        <div style={{ display: "flex", gap: 24 }}><span>THE</span><span style={{ color: "#d5f46a" }}>WHAT IF.</span></div>
        <span>I BUILD</span>
        <span style={{ color: "#d5f46a" }}>WHAT’S NEXT.</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", fontSize: 12, letterSpacing: 1, color: "#a9ab9f" }}><span>WEBSITES / BUSINESS APPLICATIONS / PRACTICAL AI</span><span>suffynux.com</span></div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: "Archivo", data: font, weight: 900, style: "normal" }] },
  );
}
