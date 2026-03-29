# Personal Blog

A minimal Astro blog focused on essays about AI-native companies.

## Stack

- Astro
- Static output
- Markdown content collections
- Cloudflare Pages deployment via GitHub

## Local development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

The production output is written to `dist/`.

## Content

Posts live in `src/content/posts/`.

The current featured essay is:

- `src/content/posts/clarity.md`

To add a new post, create another Markdown file in that directory with frontmatter matching the collection schema in `src/content.config.ts`.

## Cloudflare Pages

Suggested settings for this repo:

- Framework preset: `Astro`
- Production branch: `main`
- Build command: `pnpm build`
- Build output directory: `dist`

If you later add a custom domain, update:

- `astro.config.mjs`
- `src/lib/site.ts`

to use the final site URL.
