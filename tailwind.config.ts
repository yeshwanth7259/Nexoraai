import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        primary: "var(--primary)",
        accent: "var(--accent)",
        highlight: "var(--highlight)",
        cards: "var(--cards)",
        borders: "var(--borders)",
        bgDarker: "var(--bg-darker)",
        textMuted: "var(--text-muted)",
        hoverBg: "var(--hover-bg)",
      },
    },
  },
  plugins: [],
};
export default config;
