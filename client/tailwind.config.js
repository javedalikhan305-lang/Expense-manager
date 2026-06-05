/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#071822',
          card: '#0f192a',
          primary: '#7dd3fc',
          primaryDark: '#38bdf8',
          success: '#34d399',
          danger: '#fb7185',
          muted: '#94a3b8',
          border: '#1e2e44',
          text: '#e2e8f0',
          white: '#ffffff',
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(10, 25, 47, 0.25)',
      }
    },
  },
  plugins: [],
}
