/** @type {import('tailwindcss').Config} */
function cv(name) {
  return `rgb(var(${name}) / <alpha-value>)`;
}

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        tactical: {
          50:  cv('--t-50'),
          100: cv('--t-100'),
          200: cv('--t-200'),
          300: cv('--t-300'),
          400: cv('--t-400'),
          500: cv('--t-500'),
          600: cv('--t-600'),
          700: cv('--t-700'),
          800: cv('--t-800'),
          900: cv('--t-900'),
          950: cv('--t-950'),
        },
        dark: {
          50:  cv('--s-50'),
          100: cv('--s-100'),
          200: cv('--s-200'),
          300: cv('--s-300'),
          400: cv('--s-400'),
          500: cv('--s-500'),
          600: cv('--s-600'),
          700: cv('--s-700'),
          800: cv('--s-800'),
          900: cv('--s-900'),
          950: cv('--s-950'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
