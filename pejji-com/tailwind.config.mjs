/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        teal: '#0A8F8F',
        orange: '#F57A1F',
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        light: 'rgb(var(--color-light) / <alpha-value>)',
        subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
