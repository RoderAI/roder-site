# Astro Changelog Blog Design

## Objective

Replace the TypeScript-backed Roder CLI changelog with an Astro blog-style content collection. Each `roder/` CLI release becomes a Markdown article with its own canonical route, while `/changelog/` remains the release index.

## Content Model

Create a `changelog` content collection under `src/content/changelog/`. Each release is a plain Markdown file named by version, for example `0.1.6.md`.

Frontmatter is validated with an Astro content schema and contains:

- `version`: display version without the `v` prefix
- `releaseDate`: release date
- `tag`: exact GitHub tag, restricted operationally to `roder/` releases
- `githubUrl`: canonical GitHub release URL
- `headline`: user-facing release title
- `summary`: short index-page excerpt
- `demo`: optional image path, command, caption, and alt text

The Markdown body contains the full user-facing article. It explains what changed, why it matters, practical usage, setup implications, and reliability or ergonomics impact. Shared layout elements such as release metadata and GitHub links remain in Astro templates rather than being duplicated in every article.

Plain Markdown is the default because current articles do not need interactive components. The collection can accept MDX later if a release genuinely requires embedded Astro components.

## Routes And Rendering

`src/pages/changelog.astro` becomes the blog index. It loads the collection, sorts releases by date and semantic version descending, features the newest entry, and lists older releases with links to their article routes.

`src/pages/changelog/[version].astro` generates one static page per collection entry:

- `/changelog/0.1.6/`
- `/changelog/0.1.5/`
- `/changelog/0.1.4/`
- `/changelog/0.1.3/`
- `/changelog/0.1.2/`
- `/changelog/0.1.1/`

The article template renders the frontmatter, optional Ghostty figure, Markdown body, GitHub release link, and previous/next release navigation. Existing global changelog styles are reused and extended only where article typography or navigation requires it.

## Migration

Migrate all six entries from `src/data/roderCliChangelog.ts` into individual Markdown files. Preserve the existing user-facing detail while restructuring each entry into readable article sections. The agent-swarm image remains at `public/changelog/agent-swarm-ghostty.png` and is referenced only by the release that it demonstrates.

Delete `src/data/roderCliChangelog.ts` after no imports remain. Older releases must not reuse the agent-swarm image as a generic placeholder.

## Release Automation

Update `scripts/sync-roder-cli-changelogs.mjs` and the `roder-site-update` automation so they:

1. Fetch only GitHub tags beginning with `roder/`.
2. Compare release versions against Markdown entries in `src/content/changelog/`.
3. Create one new Markdown article per new CLI release.
4. Rewrite raw notes around practical user impact rather than copying them verbatim.
5. Capture a real, feature-specific Roder session in Ghostty when a useful visual demonstration exists.
6. Build and verify both the index and generated detail route.

## Error Handling

Astro schema validation should fail the build when required frontmatter is missing or malformed. The index should render a clear empty state if the collection has no entries, although the migrated repository will begin with six entries. Optional demo metadata is all-or-nothing at the schema level so an incomplete figure cannot render.

## Verification

- `npm run build` succeeds.
- The build emits `/changelog/index.html` and all six version detail pages.
- The index is ordered newest first and links to every article.
- The latest article renders its real Ghostty image with meaningful alt text and caption.
- Older articles do not show the agent-swarm image.
- Desktop and mobile changelog layouts have no overflow or overlapping text.
- `git diff --check` succeeds.

