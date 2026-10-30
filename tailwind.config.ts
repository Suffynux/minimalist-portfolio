import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bone: "#F4F3EC",
        surface: "#FAFAF7",
        ink: "#11120F",
        // Shared accent tokens retain their existing names for inner-page compatibility.
        olive: "#52651F",
        // Citron for text and focus states on dark surfaces.
        "olive-light": "#D5F46A",
        muted: "#61635E",
        body: "#494C48",
        // Replaces hardcoded #9A9A8C (2.70:1) for small meta text.
        meta: "#61635E",
        // Card / image placeholder tints, previously hardcoded hexes.
        shade: "#E6E8E0",
        "shade-deep": "#D5D8D0",
        // "Available now" status dot - olive-family green, not the stock #3F9E68.
        live: "#50804C",
        // WhatsApp's own brand colours. Deliberately outside the palette:
        // the button has to read as WhatsApp, so these must not be re-tinted.
        whatsapp: "#25D366",
        "whatsapp-ink": "#0B2E17",
        // The quote wall: a dark stage with lit paper cards on it.
        wall: "#11120F",
        "wall-lift": "#1D2116",
        paper: "#F4F3EC",
        "paper-deep": "#EBE8DB",
        "paper-edge": "#C4C1AE",
        // Signature accent. Only used on the dark stage or as a spine,
        // never as small text on bone.
        sand: "#D5F46A",
        line: "rgba(35,37,29,0.09)"
      },
      fontFamily: {
        display: ["var(--font-instrument)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
      },
      keyframes: {
        marqueeX: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marqueeX 38s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
