const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./data/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          950: "#031207",
          900: "#071a0f",
          800: "#0c2a18",
          700: "#133b23",
          600: "#1e5631",
          500: "#2d7a46",
          400: "#43a564",
          300: "#6dd793",
          200: "#a5ebc0",
          100: "#d6f8e4",
          50: "#f0fdf4"
        },
        moss: {
          DEFAULT: "#3f5e36",
          light: "#5d7f52",
          dark: "#273a22"
        },
        ember: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#b45309"
        },
        river: {
          DEFAULT: "#0ea5e9",
          dark: "#0369a1"
        },
        earth: {
          DEFAULT: "#8b5a2b",
          dark: "#573616"
        },
        mist: "#94a3b8"
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      animation: {
        "float": "float 8s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out 2s infinite",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "breathe": "breathe 12s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 18s ease infinite",
        "leaf-drift": "leafDrift 24s linear infinite",
        "fog-drift": "fogDrift 30s linear infinite",
        "dust-float": "dustFloat 14s ease-in-out infinite",
        "waveform": "waveform 1.2s ease-in-out infinite alternate"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.015)", opacity: "0.97" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        leafDrift: {
          "0%": { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translate3d(60px, -40px, 0) rotate(25deg)", opacity: "0" }
        },
        fogDrift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(10%)" }
        },
        dustFloat: {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.3" },
          "50%": { transform: "translateY(-20px) translateX(10px)", opacity: "0.7" }
        },
        waveform: {
          "0%": { height: "12%" },
          "100%": { height: "100%" }
        }
      },
      backgroundImage: {
        "forest-glow":
          "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(45,122,70,0.35), transparent), radial-gradient(ellipse 60% 50% at 80% 0%, rgba(14,165,233,0.12), transparent)",
        "hero-vignette":
          "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(3,18,7,0.6) 100%)"
      },
      boxShadow: {
        glow:
          "0 0 40px -10px rgba(45,122,70,0.4), 0 0 80px -20px rgba(14,165,233,0.2)",
        "glow-lg":
          "0 0 60px -12px rgba(45,122,70,0.5), 0 0 120px -30px rgba(245,158,11,0.25)",
        "card-hover":
          "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px -12px rgba(45,122,70,0.3)"
      }
    }
  },
  darkMode: "class",
  plugins: [nextui()]
};
