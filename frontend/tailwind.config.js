module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#2563eb",
          "secondary": "#7c3aed",
          "accent": "#14b8a6",
          "neutral": "#0f172a",
          "base-100": "#fdfcfb",
          "base-200": "#f4f6fb",
          "base-300": "#e5e7ef",
          "info": "#0ea5e9",
          "success": "#16a34a",
          "warning": "#d97706",
          "error": "#dc2626",
        },
      },
      {
        dark: {
          "primary": "#7dd3fc",
          "secondary": "#c084fc",
          "accent": "#34d399",
          "neutral": "#0b1221",
          "base-100": "#0b1221",
          "base-200": "#0f172a",
          "base-300": "#1f2937",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}