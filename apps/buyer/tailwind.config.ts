import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: { DEFAULT: '#C8614A', dark: '#A84E3A', light: '#E8896E', muted: '#F5E8E4' },
        teal: { DEFAULT: '#2D7A7A', dark: '#1F5757', light: '#4A9A9A', muted: '#E4F0F0' },
        cream: '#FAF7F2',
        stone: { 100: '#F5F1EA', 200: '#EDE8DF', 300: '#D9D0C4', 400: '#B8AC9B', 500: '#8C7D6B', 600: '#6B5D4E', 700: '#4A3E33', 800: '#2E261E', 900: '#1A150F' },
      },
      fontFamily: { sans: ['DM Sans', 'system-ui', 'sans-serif'], urdu: ['Noto Nastaliq Urdu', 'serif'] },
      maxWidth: { content: '1280px' },
    },
  },
  plugins: [],
}
export default config
