import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui semantic tokens — mapped to CSS variables defined in globals.css
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Sri Lanka brand palette — direct utilities, e.g. bg-ocean-500, text-forest-600
        ocean: {
          50: "#EAF6F9",
          100: "#D2EDF3",
          300: "#7FC3D4",
          500: "#0A6E8C",
          600: "#085C77",
          700: "#074A5F",
          900: "#04303F",
        },
        forest: {
          50: "#EAF6EE",
          100: "#D1EBDA",
          300: "#7FC299",
          500: "#3E9463",
          600: "#2E7D4F",
          700: "#23623E",
          900: "#173F29",
        },
        sand: {
          50: "#FCF6EA",
          100: "#F7EAD0",
          300: "#EBCC8B",
          500: "#D9A441",
          600: "#BC8A2E",
          700: "#8F6A23",
          900: "#5C4517",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
