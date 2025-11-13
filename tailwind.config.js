/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD1C1',
          300: '#FFBA9F',
          400: '#FFA07A',
        },
        purple: {
          200: '#E8DFF5',
          400: '#B8A1D3',
          700: '#7C6B8F',
        },
        purple: {
          600: '#7B5FA8',
          800: '#4A3364',
          900: '#2E1F42',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
