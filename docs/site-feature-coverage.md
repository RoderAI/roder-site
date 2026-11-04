# Site feature coverage TODO

Scope: published CLI releases through `roder/v0.4.7` and Desktop through
`v0.1.11`. Audit the existing site changes as well as missing documentation.
Do not describe uncommitted application work as released.

## Sources and release boundary

- CLI: GitHub release metadata from `RoderAI/roder`, plus
  `../roder/crates/roder-cli/CHANGELOG.md` and implementation/docs.
- Desktop: `RoderAI/roder-desktop` release tags and implementation. Desktop
  v0.1.11 bundles Roder 0.4.1; installing the latest CLI does not upgrade that
  bundled runtime.
- Site: existing worktree changes are preserved and reviewed, not replaced.

## Release notes

- [x] Extend coverage through CLI 0.4.6 browser execution/reporting and CLI 0.4.7
  native custom Chat Completions providers. See `site-update-2026-11-01.md` and
  `site-update-2026-11-03.md` for sources and current release verification.

- [x] Add all 13 missing CLI articles: 0.3.20 through 0.3.26 and 0.4.0 through
  0.4.5. Verify dates and links against published releases.
- [x] Review the existing 0.1.15 through 0.3.19 articles and demo asset references.
- [x] Confirm the release sync reports no missing published CLI releases.

## Terminal and installation

- [x] Document npm installation and current model defaults.
- [x] Explain retained/queued prompts, retry and explicit discard.
- [x] Explain source-preserving response/code copying and terminal image previews.

## Models, tools, and integrations

- [x] Refresh provider model names and custom Responses capability configuration.
- [x] Explain discovery startup, fallback behavior, and provider tool search.
- [x] Replace obsolete ACP status with persistent sessions, auth, MCP, model/mode
  selection, and image handling.
- [x] Review local hooks, code review, media, usage accounting, and remote runners.

## Agents, browser, and runtime

- [x] Explain owned worktree isolation, its limits, and explicit cleanup.
- [x] Review Ultra mode, agent swarm, inheritance, and policy boundaries.
- [x] Review browser decisions, success predicates, viewport behavior, and policy.
- [x] Document paged thread history and current client integration boundaries.

## Desktop workflows

- [x] Replace the generic desktop placeholder and obsolete rename note.
- [x] Explain persistent agents: create paused, enable explicitly, local lifetime,
  budgets, memory, and workspace boundaries.
- [x] Explain projects, issues, archives, chat configuration, updates, and history.
- [x] Explain Cloud Machines setup and remote ownership without implying local
  automation runs after the desktop exits.
- [x] Keep unreleased desktop experiments out of shipped feature claims.

## Findability and verification

- [x] Categorize the docs landing page and sidebar by user workflow.
- [x] Add metadata and navigation for every new guide.
- [x] Build the production site and check local route/fragment/asset links.
- [x] Smoke-test new guides and changelog pages in a browser.
- [x] Review the release diff and exclude local browser artifacts.
- [x] Release via GitHub Pages and verify the deployed commit and public routes.

## Release authority

The user requested release of the updated site. The repository deploys on pushes
to `master`; release must use that existing workflow. Never discard unrelated
work, rewrite remote history, or claim deployment before GitHub reports success.

## Verification evidence

- `npm run build`: 121 generated pages.
- Generated HTML scan: 6,389 internal route, fragment, and asset references;
  zero errors. Fixed the Cursor and service-tier heading anchors found by the scan.
- Browser checks: 14 representative routes at 390px and 1280px, all HTTP 200,
  no horizontal overflow, broken images, or page errors. Lazy-loaded marketing
  images were explicitly loaded before inspection, including remote desktop images.
- Mobile navigation: opens and closes by its summary control, reopens on desktop
  resize, and places the article heading near the top of a mobile viewport.
- `git diff --check`: passed.
- `node scripts/sync-roder-cli-changelogs.mjs`: no missing published releases.
- Current remote `master` and this checkout have different histories. Their
  tracked trees differ only in the provider page, whose newer catalog content is
  preserved by this update. Release from a separate worktree based on remote
  `master`; do not force-push or rewrite the user's checkout.
- Site release commit: `7d4dfe615ac23e0da0b83268b57e00375a52f744`.
  [GitHub Pages deployment 41153664216](https://github.com/RoderAI/roder-site/actions/runs/41153664216)
  completed successfully.
- Live `https://roder.sh` verification: the same 28 route/viewport checks passed
  with no broken images, horizontal overflow, or page errors. Mobile navigation
  toggles correctly. Seven targeted content probes confirmed the new guides,
  current ACP instructions, and CLI 0.4.5 release text rather than stale pages.
