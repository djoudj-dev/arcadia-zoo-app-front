/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: '#FFFFFF',
        secondary: '#A3B583',
        tertiary: '#557A46',
        quaternary: '#7A9F61',
        quinary: '#0E1805',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}