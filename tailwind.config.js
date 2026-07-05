/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        anton: ["Anton", "sans-serif"],
        baston:["Bebas Neue", "sans-serif"],
        caston: ["Oswald", "sans-serif"],
      },
    },
  },
  plugins: [],
};
