/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00ff66",
        coal: "#050505"
      },
      boxShadow: {
        neon: "0 0 18px rgba(0, 255, 102, 0.45)"
      }
    }
  },
  plugins: []
};
