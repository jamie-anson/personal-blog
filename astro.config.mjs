import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://personal-blog.freelancejamie.workers.dev',
  output: 'static',
  prefetch: false,
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
