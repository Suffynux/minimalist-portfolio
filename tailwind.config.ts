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
        olive: "#6E7A45",
        muted: "#6E6F62",
        body: "#494C3E",
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
