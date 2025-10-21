/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'puppy-yellow': '#FCD34D',
        'puppy-orange': '#FB923C',
        'puppy-pink': '#EC4899',
        'puppy-blue': '#3B82F6',
        'puppy-purple': '#A855F7',
      },
      animation: {
        'tail-wag': 'tailWag 0.6s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        tailWag: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'puppy': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'puppy-lg': '0 20px 40px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
