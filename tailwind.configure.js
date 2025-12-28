/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brandYellow: "#f5c400",
        brandBlue: "#7ea9ff",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.85 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out",
        slideUp: "slideUp 0.7s ease-out",
        slideInLeft: "slideInLeft 0.7s ease-out",
        slideInRight: "slideInRight 0.7s ease-out",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
      },
      fontSize: {
        newsroomLg: "1.15rem",
        newsroomXl: "1.35rem",
      },
    },
  },
  plugins: [],
};
