/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,scss,sass}'],
  theme: {
    extend: {
      backgroundImage: {
        'hardware': 'url("assets/img/hardware.jpg")',
        'ram-slot': 'url("assets/img/ram.svg")',
      },
    },
  },
  plugins: [],
}
