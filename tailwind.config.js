/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
module.exports = {
  content: ["./src/**/*.{html,ts,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "#FFFFFF",
        secondary: "#A3B583",
        tertiary: "#557A46",
        quaternary: "#7A9F61",
        quinary: "#0E1805",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      zIndex: {
        9999: "9999",
      },
    },
  },
  plugins: [typography],
  variants: {
    extend: {
      backgroundColor: ["active"],
      opacity: ["disabled"],
    },
  },
};
