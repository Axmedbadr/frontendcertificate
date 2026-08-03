/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4a55d6', 700: '#3d47b3',
          800: '#333c90', 900: '#2b3273'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        arabic: ['"Noto Sans Arabic"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
