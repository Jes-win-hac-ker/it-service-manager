/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-grey': {
          DEFAULT: '#454545',
          'light': '#5a5a5a',
          'dark': '#3a3a3a',
        },
      },
    },
  },
  plugins: [],
}
