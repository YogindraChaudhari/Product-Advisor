/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "var(--text-main)",
        muted: "var(--text-muted)",
        bright: "var(--text-bright)",
        "app-bg": "var(--bg-app-plain)",
      },
    },
  },
  plugins: [],
};
