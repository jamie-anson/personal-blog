import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bringing-clarity.org',
  output: 'static',
  prefetch: false,
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
