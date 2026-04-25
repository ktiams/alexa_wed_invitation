import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        cream: "#f7f1e8",
        card: "#fffdf8",
        parchment: "#efe4d3",
        // Decorative / borders
        silver: {
          DEFAULT: "#b99b6b",
          light: "#d8c9b8",
          dark: "#7a6a5b",
        },
        // Typography
        charcoal: "#2a2521",
        espresso: "#1f1a17",
        muted: "#7a6a5b",
        taupe: "#9a8a7a",
        // Gold accent
        gold: {
          DEFAULT: "#b99b6b",
          dark: "#a98d61",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      boxShadow: {
        warm: "0 4px 24px rgba(42, 37, 33, 0.07)",
        "warm-sm": "0 2px 12px rgba(42, 37, 33, 0.05)",
        "warm-lg": "0 8px 40px rgba(42, 37, 33, 0.10)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "slide-left": "slideLeft 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
