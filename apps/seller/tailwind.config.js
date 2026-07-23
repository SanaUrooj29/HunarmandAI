/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '360px',
        '3xl': '1600px',
      },
      colors: {
        terracotta: {
          50: '#fdf3f0', 100: '#fbe4dc', 200: '#f6c9b8', 300: '#f0a78c',
          400: '#e88060', 500: '#E27D60', 600: '#c85c3a', 700: '#a8492e',
          800: '#8a3d28', 900: '#723425',
        },
        teal: {
          50: '#f0f7f9', 100: '#daecf0', 200: '#b5d9e2', 300: '#82bfce',
          400: '#4a9db3', 500: '#1F7A8C', 600: '#1a6478', 700: '#175464',
          800: '#154754', 900: '#133c47',
        },
        cream: {
          50: '#fdfaf6', 100: '#F5EBDD', 200: '#ecd5b8', 300: '#e0ba8e',
          400: '#d49c63', 500: '#c77f3b',
        },
        brown: {
          900: '#2A1F14', 800: '#3d2e1e', 700: '#4f3d28', 600: '#614c32',
        },
        sidebar: {
          bg:      '#f4ede3',   // warm cream — matches screenshot neutral
          border:  '#e6d8cc',
          active:  '#E27D60',
          hover:   '#ede0d4',
          text:    '#2A1F14',
          muted:   '#9a8878',
        },
      },
      fontFamily: {
        urdu:    ['"Noto Nastaliq Urdu"', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      width: {
        sidebar:           '240px',
        'sidebar-collapsed': '64px',
      },
    },
  },
  plugins: [],
}
