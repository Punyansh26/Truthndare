/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08080F',
        surface: '#12121E',
        surfaceHover: '#1A1A2E',
        neonPink: '#FF2D78',
        neonPurple: '#9D00FF',
        neonCyan: '#00F5FF',
        neonGold: '#FFD700',
        textPrimary: '#F0F0FF',
        textMuted: '#6B6B8A',
      },
      fontFamily: {
        display: ['Righteous', 'cursive'],
        body: ['Poppins', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
