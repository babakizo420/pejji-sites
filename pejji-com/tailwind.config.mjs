/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        teal: '#0A8F8F',
        orange: '#F57A1F',
        dark: '#0D0D12',
        surface: '#1A1A24',
        light: '#E8E8ED',
        subtle: '#888888',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
