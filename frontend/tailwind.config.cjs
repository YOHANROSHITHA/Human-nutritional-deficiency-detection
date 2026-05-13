/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0ffff',
          100: '#ccffff',
          400: '#80ffff', // Slightly lighter Cyan
          500: '#4dffff', // Main accent color
          600: '#00e6e6',
          700: '#00cccc',
          900: '#004d4d'
        },
        slate: {
          950: '#020617'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
};
