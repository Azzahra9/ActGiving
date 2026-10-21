/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        navy: {
          darkest: '#070C1E',
          sidebar: '#0B132B',
          card: '#131D3B',
          header: '#0E1A38',
          border: '#1E294B',
        },
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-light': '#EFF6FF',
          'blue-border': '#BFDBFE',
          green: '#059669',
          'green-hover': '#047857',
          'green-light': '#ECFDF5',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
      },
    },
  },
  plugins: [],
};
