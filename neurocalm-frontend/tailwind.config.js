/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F19",
        card: "#111827",
        accent: "#00D4FF",
        purple: "#8B5CF6",
        glow: "#38BDF8",
        healthy: "#10B981",
        warning: "#F43F5E",
        amber: "#F59E0B",
        muted: "#9CA3AF",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 212, 255, 0.3)",
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
        "neon-green": "0 0 20px rgba(16, 185, 129, 0.3)",
        "neon-red": "0 0 20px rgba(244, 63, 94, 0.3)",
      },
    },
  },
  plugins: [],
};
