import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Solo para IntelliSense: los valores reales están en app/globals.css (@theme inline)
        // Backgrounds
        cream: "#faf5ef",
        card: "#fffdf9",
        parchment: "#f1e5d5",
        // Decorative / borders
        silver: {
          DEFAULT: "#c49a4e",
          light: "#e6d7c6",
          dark: "#6f5c50",
        },
        // Typography
        charcoal: "#4a3830",
        espresso: "#4a3830",
        muted: "#6f5c50",
        taupe: "#9c8a7d",
        // Gold accent
        gold: {
          DEFAULT: "#c49a4e",
          dark: "#8a6a2f",
        },
        // Paleta nude
        ivory: "#faf5ef",
        beige: "#d8c3a6",
        nude: { DEFAULT: "#ebcfc3", light: "#f6e6de" },
        champagne: { DEFAULT: "#e2cdb2", light: "#f1e5d5" },
        blush: "#e2ada5",
        cacao: { DEFAULT: "#4a3830", deep: "#3a2b24" },
        night: "#1f1a17",
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
