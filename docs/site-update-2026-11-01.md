# Roder site update — November 1, 2026

## Source and release boundary

- Fetched `origin/master` without tags in `/Users/pz/w/roder`; inspected committed source at `be44fedd36d636cda52ca2f966b3e2702bf3d275`.
- October 31, 2026 America/Los_Angeles (00:00 through November 1 00:00) contains no upstream commits. Browser improvements landed October 30 at 23:12 Pacific, in `f3adfcca` and release rollup `be44fedd`.
- GitHub published `roder/v0.4.6` October 31 at 06:13:13 UTC. It was the only missing CLI article. Existing 0.3.20–0.4.5 articles and unrelated site work were preserved.
- Fresh paginated GitHub release comparison: all 63 published `roder/` CLI releases have articles. Crate and extension releases were excluded.

## Current shipped understanding

CLI 0.4.6 ships Jev request-aware settling, installed observation scripts, leaner decision requests, bounded cross-origin frame reads, download evidence, temporary-interstitial handling and shared form-value generation. Downloads include saved paths and bounded text previews, with limits for file start URLs and unadopted new tabs. Cross-origin frame reading does not imply general frame interaction.

The irreversible-action gate remains **off by default**; built-in tools enable it with `JEV_CONFIRM_IRREVERSIBLE=1`. Its broader checks apply only with that gate enabled and are not a guarantee. Confidence-based consult and light recovery remain off by default. Full fallback remains production policy. The older native Decisions research evaluation is identified as the retained 0.4.5 evaluation, not a fresh 0.4.6 result.

Sources: [published CLI release](https://github.com/RoderAI/roder/releases/tag/roder/v0.4.6), [released browser contract](https://github.com/RoderAI/roder/blob/roder/v0.4.6/docs/jev-browser.md), and committed `crates/roder-ext-jev/src/irreversible.rs` / `src/page/frames.rs`.

## Site changes and verification

- Added `src/content/changelog/0.4.6.md` with user-facing impact, setup, limits and scoped evaluation results.
- Updated browser-decisions docs, CLI feature copy and Jev extension description. No roadmap claims added.
- No new Ghostty image: this release changes browser execution/reporting rather than introducing a new visual CLI interface.
- `npm run build` passed: 123 generated pages and validated changelog frontmatter.
- `git diff --check` passed; release helper reports no missing CLI releases.
- Playwright checked `/changelog/`, `/changelog/0.4.6/`, `/docs/browser-decisions/`, `/cli/` and `/extensions/` at 1280 and 390 pixels: all HTTP 200, correct headings, no horizontal overflow or broken loaded images. Browser console had zero errors/warnings.
- Visually inspected `/tmp/roder-site-0.4.6-mobile-20261101.png`; article text and navigation fit the viewport.
- This was a local, unpublished draft at the end of the November 1 pass. The user
  subsequently approved its integration with the positioning iteration and next
  update; see `site-update-2026-11-03.md` for release evidence. Existing unrelated
  work was preserved.
