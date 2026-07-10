# SEO and OG Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete SEO/social metadata and branded static Open Graph images for Roder pages and changelog articles, then deploy through the existing GitHub Pages workflow.

**Architecture:** Centralize SEO metadata helpers in `src/lib/seo.ts`, render branded cards with `@vercel/og` from `src/lib/ogImage.ts`, and generate static PNG endpoints under `src/pages/og`. Existing layouts receive SEO props and emit canonical, Open Graph, and Twitter tags. Changelog articles use content collection data for article metadata and per-release images.

**Tech Stack:** Astro 7 static endpoints, TypeScript, `@vercel/og`, GitHub Pages workflow

---

### Task 1: Add SEO Metadata Helpers

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/layouts/DocsLayout.astro`

- [ ] Add `src/lib/seo.ts` with site constants, canonical URL helpers, default page metadata, docs route metadata, changelog OG URL helpers, and a `buildSeo()` function.
- [ ] Extend `Layout.astro` props with `canonicalPath`, `image`, `type`, `publishedTime`, `modifiedTime`, `tags`, and `noindex`, then emit description, canonical, robots, Open Graph, Twitter, and article tags.
- [ ] Update `DocsLayout.astro` to pass `canonicalPath` and docs-specific OG image URLs based on the active pathname.

### Task 2: Generate Static Branded OG Images

**Files:**
- Create: `src/lib/ogImage.ts`
- Create: `src/pages/og/[...slug].png.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Install `@vercel/og@latest`.
- [ ] Add a renderer helper that returns `ImageResponse` with a branded 1200x630 Roder card using plain element objects so no React runtime is required.
- [ ] Add a catch-all static endpoint that creates `/og/default.png`, top-level page images, docs images, `/og/changelog.png`, and `/og/changelog/<version>.png`.

### Task 3: Wire Page Metadata

**Files:**
- Modify: `src/pages/changelog.astro`
- Modify: `src/pages/changelog/[version].astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/font-lab.astro`

- [ ] Pass explicit SEO image paths to the changelog index and each changelog article.
- [ ] Add article metadata to changelog release pages using `releaseDate`, tag, and version.
- [ ] Add SEO tags to the standalone Tally contact page.
- [ ] Give the font lab a description and noindex flag so it has complete metadata without competing with product pages.

### Task 4: Verify and Deploy

**Files:**
- Verify: `dist/`
- Deploy: GitHub `master`

- [ ] Run `npm run build`, `git diff --check`, and route-file checks for representative OG images.
- [ ] Inspect metadata and an OG image in the in-app browser.
- [ ] Commit the scoped site changes on `master`.
- [ ] Push `master` to `origin`, then verify the GitHub Pages workflow status.
