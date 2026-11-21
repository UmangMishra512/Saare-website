/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FCFBF7',
          100: '#FAF7F0',
          200: '#F3EFE4',
          300: '#EAE4D4',
          400: '#DFD7C1',
        },
        gold: {
          300: '#EBD892',
          400: '#DFCA76',
          500: '#C8A951',
          600: '#A98934',
        },
        crimson: {
          800: '#751B24',
          900: '#541219',
        },
        emerald: {
          800: '#144634',
          900: '#0E3326',
        },
        obsidian: {
          800: '#1A1C20',
          900: '#0F1114',
          950: '#090A0C',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
