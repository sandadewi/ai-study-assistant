/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f5f4f0',
          100: '#e8e6df',
          200: '#cdc9bc',
          300: '#b0ab98',
          400: '#918b75',
          500: '#726c58',
          600: '#5a5444',
          700: '#433f33',
          800: '#2c2a22',
          900: '#171611',
        },
        sage: {
          400: '#7aaa8a',
          500: '#5d9470',
          600: '#447558',
        },
        amber: {
          400: '#f0a840',
          500: '#e09228',
        },
        sky: {
          400: '#60a5c0',
          500: '#4888a8',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
