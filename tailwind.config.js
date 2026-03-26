/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121212',
          800: '#1C1C1C',
          700: '#2A2A2A',
          600: '#333333',
          500: '#3D3D3D',
          400: '#4A4A4A',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#D4B85C',
          dark: '#B8972F',
          50: 'rgba(201, 168, 76, 0.05)',
          100: 'rgba(201, 168, 76, 0.1)',
          200: 'rgba(201, 168, 76, 0.2)',
          300: 'rgba(201, 168, 76, 0.3)',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          dark: '#E8E0D0',
        },
        muted: {
          DEFAULT: '#A0A0A0',
          dark: '#6B6B6B',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        btn: '10px',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(201, 168, 76, 0.3)',
        'gold-glow-lg': '0 0 40px rgba(201, 168, 76, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'elevated': '0 12px 48px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'pulse-gold': 'pulseGold 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
