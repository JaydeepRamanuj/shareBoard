/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        primary: '#BB86FC',
        'primary-variant': '#3700B3',
        secondary: '#03DAC6',
        text: '#FFFFFF',
        'text-secondary': '#B0B0B0',
        error: '#CF6679',
        border: '#2C2C2C',
        card: '#252525',
      },
    },
  },
  plugins: [],
}
