import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  prefetch: false,
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
