# Astro Changelog Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the TypeScript changelog catalog with typed Markdown articles, a blog index, and one static route per Roder CLI release.

**Architecture:** Astro's content layer loads Markdown files from `src/content/changelog` and validates their frontmatter. A small utility owns ordering and route generation, while the index and detail templates own presentation. Release automation compares GitHub tags against Markdown frontmatter and creates new editorial entries instead of modifying TypeScript.

**Tech Stack:** Astro 5 content collections, TypeScript, Markdown, Node.js, CSS

---

## File Structure

- Create `src/content.config.ts`: define and validate the `changelog` collection.
- Create `src/lib/changelog.ts`: centralize sorting, date formatting, and article URLs.
- Create `src/content/changelog/0.1.1.md` through `0.1.6.md`: one user-facing article per CLI release.
- Modify `src/pages/changelog.astro`: render the sorted blog index from the collection.
- Create `src/pages/changelog/[version].astro`: generate and render article routes.
- Modify `src/styles/global.css`: add article typography and previous/next navigation styles.
- Modify `scripts/sync-roder-cli-changelogs.mjs`: compare fetched releases with Markdown frontmatter.
- Delete `src/data/roderCliChangelog.ts`: remove the obsolete code catalog.
- Modify `/Users/pz/.codex/automations/roder-site-update/automation.toml`: direct future automation to Markdown articles.

### Task 1: Define The Typed Content Boundary

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/changelog.ts`

- [ ] **Step 1: Add the content collection schema**

Create `src/content.config.ts` with a glob loader for Markdown files and a schema that makes demo metadata all-or-nothing:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/changelog" }),
  schema: z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    releaseDate: z.coerce.date(),
    tag: z.string().regex(/^roder\/v\d+\.\d+\.\d+$/),
    githubUrl: z.string().url(),
    headline: z.string().min(1),
    summary: z.string().min(1),
    demo: z
      .object({
        command: z.string().min(1),
        caption: z.string().min(1),
        image: z.string().startsWith("/"),
        alt: z.string().min(1),
      })
      .optional(),
  }),
});

export const collections = { changelog };
```

- [ ] **Step 2: Add shared ordering and formatting helpers**

Create `src/lib/changelog.ts`:

```ts
import type { CollectionEntry } from "astro:content";

export type ChangelogEntry = CollectionEntry<"changelog">;

export function sortChangelog(entries: ChangelogEntry[]): ChangelogEntry[] {
  return [...entries].sort((a, b) => {
    const dateDifference = b.data.releaseDate.valueOf() - a.data.releaseDate.valueOf();
    return dateDifference || b.data.version.localeCompare(a.data.version, undefined, { numeric: true });
  });
}

export function changelogUrl(entry: ChangelogEntry): string {
  return `/changelog/${entry.data.version}/`;
}

export function formatReleaseDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
```

- [ ] **Step 3: Run Astro's type/build check before content exists**

Run: `npm run build`

Expected: the existing page fails because it still imports `src/data/roderCliChangelog.ts`, or the empty collection exposes the migration gap. This confirms the routes have not yet been migrated.

### Task 2: Migrate Every Release Into Markdown

**Files:**
- Create: `src/content/changelog/0.1.1.md`
- Create: `src/content/changelog/0.1.2.md`
- Create: `src/content/changelog/0.1.3.md`
- Create: `src/content/changelog/0.1.4.md`
- Create: `src/content/changelog/0.1.5.md`
- Create: `src/content/changelog/0.1.6.md`

- [ ] **Step 1: Create the latest release article with its real demo metadata**

Use this frontmatter in `0.1.6.md`:

```yaml
---
version: "0.1.6"
releaseDate: 2026-06-26
tag: roder/v0.1.6
githubUrl: https://github.com/RoderAI/roder/releases/tag/roder/v0.1.6
headline: Agent-swarm mode turns one instruction into coordinated parallel agents
summary: Roder now ships a native agent-swarm mode for bounded, rate-limit-aware parallel work with ordered results.
demo:
  command: /agent-swarm status
  caption: Roder's interactive TUI running in Agent Swarm mode inside a compact Ghostty window.
  image: /changelog/agent-swarm-ghostty.png
  alt: Roder interactive TUI in Ghostty showing Agent Swarm mode enabled and the agent-swarm status command
---
```

Follow it with `## What changed`, `## Why it matters`, and `## Using agent-swarm mode` sections. Preserve the existing scheduler, concurrency, cancellation, app-server state, and ordered-result explanations. Include the real commands `/agent-swarm on`, `/agent-swarm status`, and `/agent-swarm <prompt>`.

- [ ] **Step 2: Create the five earlier release articles**

Use the exact version, release date, tag, URL, headline, and summary values from `src/data/roderCliChangelog.ts`. Each body must contain `## What changed` and `## Why it matters`, converting every existing `userImpact` item into prose or bullets. Do not include `demo` frontmatter for versions `0.1.1` through `0.1.5`, because the agent-swarm image does not demonstrate those releases.

- [ ] **Step 3: Validate all frontmatter through Astro**

Run: `npm run build`

Expected: schema validation succeeds for all six Markdown entries; the build may still fail until the index import is migrated in Task 3.

### Task 3: Build The Blog Index And Article Routes

**Files:**
- Modify: `src/pages/changelog.astro`
- Create: `src/pages/changelog/[version].astro`
- Delete: `src/data/roderCliChangelog.ts`

- [ ] **Step 1: Replace the index data import with the content collection**

In `src/pages/changelog.astro`, import `getCollection`, `changelogUrl`, `formatReleaseDate`, and `sortChangelog`. Load and sort entries:

```astro
---
import { getCollection } from "astro:content";
import Layout from "../layouts/Layout.astro";
import { changelogUrl, formatReleaseDate, sortChangelog } from "../lib/changelog";

const entries = sortChangelog(await getCollection("changelog"));
const [latest, ...olderEntries] = entries;
---
```

Render an empty-state paragraph when `latest` is absent. When present, link the latest card and headline to `changelogUrl(latest)`, format its date with `formatReleaseDate`, render its optional demo figure, and give every older entry a `Read release` link to its detail route.

- [ ] **Step 2: Add the static article template**

Create `src/pages/changelog/[version].astro` with static paths from the sorted collection:

```astro
---
import { getCollection, render, type CollectionEntry } from "astro:content";
import Layout from "../../layouts/Layout.astro";
import { changelogUrl, formatReleaseDate, sortChangelog } from "../../lib/changelog";

export async function getStaticPaths() {
  const entries = sortChangelog(await getCollection("changelog"));
  return entries.map((entry, index) => ({
    params: { version: entry.data.version },
    props: {
      entry,
      newer: entries[index - 1],
      older: entries[index + 1],
    },
  }));
}

interface Props {
  entry: CollectionEntry<"changelog">;
  newer?: CollectionEntry<"changelog">;
  older?: CollectionEntry<"changelog">;
}

const { entry, newer, older } = Astro.props;
const { Content } = await render(entry);
---
```

Render a breadcrumb back to `/changelog/`, release metadata, headline, summary, optional demo, `<Content />` inside `.changelog-article__body`, GitHub release link, and previous/next links using `changelogUrl`.

- [ ] **Step 3: Remove the obsolete catalog**

Delete `src/data/roderCliChangelog.ts`, then run:

```bash
rg -n "roderCliChangelog|RoderCliChangelogEntry" src scripts
```

Expected: no matches.

- [ ] **Step 4: Build all routes**

Run: `npm run build`

Expected: Astro reports `/changelog/index.html` and routes for versions `0.1.1` through `0.1.6` with no schema or import errors.

### Task 4: Style Article Reading And Navigation

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add focused article styles**

Add styles for `.changelog-article`, `.changelog-article__header`, `.changelog-article__body`, `.changelog-article__footer`, and `.changelog-pagination`. Constrain prose to a readable width, preserve 8px-or-less radii, use existing color tokens, make article images full width, and switch previous/next links to a single column under `560px`.

- [ ] **Step 2: Verify CSS and markup integrity**

Run:

```bash
git diff --check
npm run build
```

Expected: both commands exit successfully.

### Task 5: Migrate Release Sync And Daily Automation

**Files:**
- Modify: `scripts/sync-roder-cli-changelogs.mjs`
- Modify: `/Users/pz/.codex/automations/roder-site-update/automation.toml`

- [ ] **Step 1: Make the sync helper inspect Markdown frontmatter**

Import `readFileSync` and `readdirSync` from `node:fs`, resolve `src/content/changelog`, and extract existing tags with a frontmatter regex anchored to `tag:`. Add `isNew` to each fetched `roder/` release and print only actionable missing releases after the full JSON summary. Update instructions to create `src/content/changelog/<version>.md`, write user-facing article prose, capture a real Ghostty demonstration when relevant, and verify the detail route.

- [ ] **Step 2: Run the helper against GitHub releases**

Run: `node scripts/sync-roder-cli-changelogs.mjs`

Expected: releases `roder/v0.1.1` through `roder/v0.1.6` are marked existing and no current CLI release is reported missing.

- [ ] **Step 3: Update the recurring automation prompt**

Replace references to `src/data/roderCliChangelog.ts` with `src/content/changelog/*.md`. Require one Markdown article and one `/changelog/<version>/` route for each new `roder/` release. Remove permission to fabricate a colorized terminal transcript; require the screenshot, when included, to show the real Roder interactive TUI driven in Ghostty.

### Task 6: End-To-End Verification

**Files:**
- Verify: `dist/changelog/index.html`
- Verify: `dist/changelog/0.1.1/index.html` through `dist/changelog/0.1.6/index.html`

- [ ] **Step 1: Run static verification**

Run:

```bash
npm run build
git diff --check
for version in 0.1.1 0.1.2 0.1.3 0.1.4 0.1.5 0.1.6; do test -f "dist/changelog/$version/index.html"; done
test -f dist/changelog/index.html
```

Expected: every command exits with status 0.

- [ ] **Step 2: Run the site and inspect desktop and mobile layouts**

Start `npm run dev -- --host 127.0.0.1`, then verify `/changelog/` and `/changelog/0.1.6/` at desktop width and `390x844`. Confirm article links work, the image is nonblank, prose does not overflow, mobile navigation remains usable, and the browser console has no errors.

- [ ] **Step 3: Confirm the final change set is scoped**

Run:

```bash
git status --short
git diff --stat
```

Expected: changelog migration files and automation changes are present; unrelated dirty files remain untouched.

