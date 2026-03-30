import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://personal-blog-wc2.pages.dev',
  output: 'static',
  prefetch: false,
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
