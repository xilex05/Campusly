/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Bright shiny light mode
        pastel: {
          blue: '#5eb8ff',
          lavender: '#b794f6',
          mint: '#48d597',
          cream: '#fff5e6',
          soft: '#f0f9ff',
          coral: '#ff8a80',
          gold: '#ffc107',
        },
        // Dark mode accents (bright on dark) – palette name avoids Tailwind "dark" variant conflict
        darkPalette: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          muted: '#94a3b8',
          accent: '#38bdf8',
          purple: '#a78bfa',
          green: '#34d399',
          pink: '#f472b6',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
