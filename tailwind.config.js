/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif TC"', 'serif'],
        sans: ['"Noto Sans TC"', 'sans-serif'],
      },
      colors: {
        gemini: {
          dark: '#0f172a', // Slate 900
          light: '#f8fafc', // Slate 50
          accent: '#3b82f6', // Blue 500
          purple: '#8b5cf6', // Violet 500
          pink: '#ec4899', // Pink 500
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
