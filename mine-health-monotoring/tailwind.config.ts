import type { Config } from "tailwindcss";
import flowbite from "flowbite/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      important: true,
      boxShadow: {
        'inner': 'inset 0 3px 10px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        primaryDark: "var(--primary-dark)",
        primaryLight: "var(--primary-light)",
        secondary: "var(--secondary)",
        secondaryDark: "var(--secondary-dark)",
        secondaryLight: "var(--secondary-light)",
        accent: "var(--accent)",
        accentDark: "var(--accent-dark)",
        accentLight: "var(--accent-light)",
      },
      fontFamily:{
        nunito: ["Nunito", "sans-serif"],
      },
      screens: {
        'sm': '425px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '2560px',
      }
    },
  },
  plugins: [
    flowbite,
  ],
} satisfies Config;
