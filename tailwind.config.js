/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,scss,sass}'],
  theme: {
    extend: {
      backgroundImage: {
        'ram-slot': 'url("assets/img/ram.svg")',
        'ssd-drive': 'url("assets/img/ssd.png")',
        'hdd-drive': 'url("assets/img/hdd.png")',
      },
    },
  },
  plugins: [],
}
