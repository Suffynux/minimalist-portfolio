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
        bone: "#F2F0E9",
        surface: "#FAF9F4",
        ink: "#23251D",
        // Darkened from #6E7A45 (4.06:1) to pass WCAG AA on light backgrounds.
        olive: "#5F6B3A",
        // Lightened counterpart for olive text/badges sitting on ink.
        "olive-light": "#9DAB6B",
        muted: "#5E5F52",
        body: "#494C3E",
        // Replaces hardcoded #9A9A8C (2.70:1) for small meta text.
        meta: "#5E5F52",
        // Card / image placeholder tints, previously hardcoded hexes.
        shade: "#E7E6DD",
        "shade-deep": "#D6D6CB",
        // "Available now" status dot - olive-family green, not the stock #3F9E68.
        live: "#4F7D42",
        // WhatsApp's own brand colours. Deliberately outside the palette:
        // the button has to read as WhatsApp, so these must not be re-tinted.
        whatsapp: "#25D366",
        "whatsapp-ink": "#0B2E17",
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
