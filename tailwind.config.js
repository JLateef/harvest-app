/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#2C5F2D',
        moss: '#97BC62',
        accent: '#D9822B',
        cream: '#F9F6F0',
        'cream-dark': '#EEE9DF',
      },
    },
  },
  plugins: [],
}

