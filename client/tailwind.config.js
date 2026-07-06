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
          dark: '#0a0a0a',
          card: '#111111',
          primary: '#f5c518',
          primaryDark: '#e0b000',
          success: '#34d399',
          danger: '#fb7185',
          warning: '#f5c518',
          muted: '#888888',
          border: '#2a2a2a',
          text: '#e8e8e8',
          white: '#ffffff',
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(0, 0, 0, 0.5)',
        yellow: '0 0 30px rgba(245, 197, 24, 0.15)',
      }
    },
  },
  plugins: [],
}
