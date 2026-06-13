# Roder Site

Marketing and documentation site for Roder, a Rust-native coding-agent harness and TUI inspired by OpenAI Codex and the original Gode agent harness.

The site is built with [Astro](https://astro.build/) and is deployed to GitHub Pages from the `master` branch.

## What is here

- `src/pages/` - Astro routes for the homepage, docs, eval dashboard, mission, contact, and other public pages.
- `src/layouts/` - shared page layouts for the main site and documentation pages.
- `src/components/` - reusable Astro components and architecture diagrams.
- `src/data/evalResults.ts` - eval run data rendered by the eval dashboard.
- `src/styles/` - global, page-specific, navigation, diagram, and home-page styles.
- `public/` - static assets, favicons, and logo images.
- `.github/workflows/deploy.yml` - GitHub Pages build and deploy workflow.

## Requirements

- Node.js 20 or newer
- npm

## Getting started

Install dependencies:

```sh
npm ci
```

Start the local development server:

```sh
npm run dev
```

Astro will print the local URL, typically `http://localhost:4321`.

## Scripts

```sh
npm run dev      # Start the Astro development server
npm run start    # Alias for npm run dev
npm run build    # Build the production site into dist/
npm run preview  # Preview the production build locally
npm run astro    # Run the Astro CLI
```

## Building

Run the production build before opening a PR or pushing changes that affect pages, styles, or data:

```sh
npm run build
```

The generated site is written to `dist/`.

## Deployment

Pushing to `master` triggers the `Deploy to GitHub Pages` workflow. The workflow:

1. Checks out the repository.
2. Installs Node.js 20 with npm caching.
3. Runs `npm ci`.
4. Runs `npm run build`.
5. Uploads `dist/` and deploys it with GitHub Pages.

The custom domain is configured through `public/CNAME`.

## Editing notes

- Most content pages live in `src/pages/*.astro` or `src/pages/docs/*.astro`.
- Shared navigation, metadata, and page chrome are managed by the layouts in `src/layouts/`.
- Update `src/data/evalResults.ts` when refreshing eval dashboard results.
- Keep static images and favicons in `public/` so they are served from the site root.
