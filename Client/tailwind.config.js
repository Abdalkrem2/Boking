/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 3s infinite",
      },
      colors: {
        "main-color": "#ffe600",
        "secondary-color": "#ffc800",
        "secondary-text": "#767676",
        "complement-color": "#1f2227",
      },
      fontSize: {
        vs: ["0.8rem  ", "0.25rem"],
      },
    },
  },
  plugins: [import("tailwind-scrollbar-hide")],
};
// ffe600
