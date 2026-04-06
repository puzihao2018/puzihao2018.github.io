/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
        },
        // Light theme colors
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
        },
        // Accent colors
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#22d3ee',
          light: '#0891b2',
        },
        // Text colors
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          lightPrimary: '#0f172a',
          lightSecondary: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};