/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,scss,sass}'],
  theme: {
    extend: {
      backgroundImage: {
        'cpu-page': 'url("assets/img/cpu.jpg")',
      },
    },
  },
  plugins: [],
}
