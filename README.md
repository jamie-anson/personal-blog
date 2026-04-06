# Personal Blog

A minimal Astro blog focused on essays about AI-native companies.

## Stack

- Astro
- Static output
- Markdown content collections
- GitHub-triggered Cloudflare Pages deployment

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

## Deployment

This site deploys through `GitHub -> Cloudflare Pages`.

The deployment flow is:

1. Push changes to GitHub.
2. Cloudflare Pages builds the site from the connected repository.
3. Pushes to `main` deploy to production.
4. Other branches can create preview deployments if Cloudflare Pages preview builds are enabled.

Cloudflare Pages project settings for this repo:

- Framework preset: `Astro`
- Production branch: `main`
- Build command: `pnpm build`
- Build output directory: `dist`

Important:

- This repo does not use Cloudflare Workers for deployment.
- This repo does not need `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc`.
- Do not use `wrangler deploy` as the primary deployment path for this site.
- The source of truth for production is the GitHub-connected Cloudflare Pages project.

If you later add a custom domain, update:

- `astro.config.mjs`
- `src/lib/site.ts`

to use the final site URL.
