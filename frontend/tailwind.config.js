/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e9eeff",
          200: "#cfd8ff",
          300: "#a9b9ff",
          400: "#7f97f7",
          500: "#6077ec",
          600: "#4c5dd4",
          700: "#3d48b2",
          800: "#313b8d",
          900: "#272f6d"
        },
        ink: {
          950: "#060816",
          900: "#0b1020",
          850: "#11172a",
          800: "#161d33"
        },
        mist: {
          100: "#f6f8fb",
          200: "#edf1f7",
          300: "#dce3ef",
          400: "#8f9cb5",
          500: "#66748f"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(10, 15, 34, 0.14)",
        panel: "0 24px 60px rgba(7, 11, 26, 0.28)",
        insetGlow: "inset 0 1px 0 rgba(255, 255, 255, 0.07)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(96,119,236,0.16), transparent 28%), radial-gradient(circle at 80% 10%, rgba(144,114,255,0.14), transparent 22%), linear-gradient(180deg, rgba(11,16,32,0.98), rgba(6,8,22,1))"
      }
    }
  },
  plugins: []
};
