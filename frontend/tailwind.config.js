/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        gravix: ['Gravix', 'Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
