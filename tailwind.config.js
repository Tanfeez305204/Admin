/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        panel: "#0f1220",
        panelSoft: "#171b2e",
        panelMuted: "#20263d",
        accent: "#ef4444",
        accentSoft: "#7f1d1d",
        success: "#10b981",
        warning: "#f59e0b",
        stroke: "#2a314d"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};
