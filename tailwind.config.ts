 import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        court: {
          orange: "#FF6B2B",
          green: "#2DD4A0",
          dark: "#0F1117",
          panel: "#181C27",
          card: "#1E2333",
          border: "#2A3148",
          muted: "#6B7494",
        },
      },
    },
  },
  plugins: [],
};

export default config;

