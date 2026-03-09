/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#86a69e',
        primaryOrange: '#f28783',
      },
      fontFamily: {
        ranchers: ['Ranchers'],
      },
    },
  },
  plugins: [],
};
