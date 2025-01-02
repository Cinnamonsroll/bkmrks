import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        woodsmoke: {
          "50": "#7e7e7e",
          "100": "#707070",
          "200": "#505050",
          "300": "#3e3e3e",
          "400": "#343434",
          "500": "#2e2e2e",
          "600": "#282828",
          "700": "#232323",
          "800": "#1c1c1c",
          "900": "#161616",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
