const defaultTheme = require("tailwindcss/defaultTheme");
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        main: {
          primary: "#fafafa",
          secondary: "#27272a",
          accent: "#ef4444",
          neutral: "#74767c",
          "base-100": "#09090b",
          info: "#67e8f9",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#dc2626",
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        btn: "inset  -20px -50px 36px -28px rgba(0, 0, 0, 0.35), 0 0 20px rgba(255, 0, 0, 0.5);",
      },
      transitionProperty: { size: "width, height" },
      outlineOffset: {
        12: "12px",
      },
      backgroundImage: {
        "base-to-transparent":
          "linear-gradient(180deg, rgba(9,9,0,1) 0%, rgba(3,2,30,1) 84%, rgba(2,0,36,0.6054796918767507) 93%, rgba(9,9,0,0) 100%)",
        "transparent-to-base":
          "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,0,0.7371323529411764) 52%, rgba(9,9,0,0) 100%)",
      },
    },
  },
};

export default config;
