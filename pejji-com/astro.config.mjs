import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), sitemap(), react()],
  site: 'https://pejji.com',
});