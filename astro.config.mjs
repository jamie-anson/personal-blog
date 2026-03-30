import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://personal-blog.freelancejamie.workers.dev',
  output: 'static',
  prefetch: false,

  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  },

  adapter: cloudflare()
});