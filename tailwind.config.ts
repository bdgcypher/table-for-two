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
        primary: "#C95D64",
        "secondary-accent": "#629390",
        light: {
          bg: "#FFFFFF",
          gray: "#E7E7E7",
          text: "#3C3C3C",
        },
        dark: {
          bg: "#000000",
          surface: "#212121",
          gray: "#3C3C3C",
          text: "#E7E7E7",
        },
      },
      fontFamily: {
        heading: ["var(--font-berkshire)", "serif"],
        paragraph: ["var(--font-lora)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
