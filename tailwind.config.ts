import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pitch: "var(--pitch)",
        accent: "var(--accent)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        "pitch-green": "var(--pitch-green)",
        primary: "var(--primary)",
        ranked: "var(--ranked)",
        caution: "var(--caution)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        slab: ["var(--font-slab)", "Rockwell", "Rockwell Nova", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
