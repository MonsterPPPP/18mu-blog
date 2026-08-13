import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://18mu-blog.workers.dev',
  integrations: [react(), sitemap()],
  output: 'static'
});
