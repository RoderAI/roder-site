# Roder site update - November 3, 2026

## Scope and source boundary

Integrate the user-approved harness/Desktop positioning iteration, the existing
CLI 0.4.6 browser update, and the next published CLI release, 0.4.7.
Desktop remains at published v0.1.11 with embedded harness 0.4.1.
Do not promote dirty application experiments.

- [x] Keep the harness-first homepage, dedicated Harness page, practical Desktop
  workflows, CLI narrative, real captures, navigation, and installer behavior.
- [x] Integrate the existing browser docs and CLI 0.4.6 article, retaining the
  opt-in irreversible-action gate and native-evaluation/fallback limitations.
- [x] Add the CLI 0.4.7 article and explain native custom Chat Completions setup.
- [x] Document API-root URLs, environment-backed credentials, explicit/discovered
  model IDs, deployed context budgets, and tool-schema filtering.
- [x] Distinguish schema filtering from execution policy; retain Responses defaults.
- [x] Update the extension directory to describe custom Chat Completions wiring.
- [x] Explain the released DeepSeek V4.1 Flash 1017 OpenRouter snapshot and
  client-side compaction; keep OpenRouter's Grok 4.6 default distinct from the
  direct xAI/SuperGrok Grok 4.7 default.
- [x] Verify production build, internal references, and representative browser flows.
- [x] Integrate on current remote master without changing the dirty original checkout.
- [x] Merge, deploy, and verify live routes and content.

## Sources

- Published [CLI 0.4.6](https://github.com/RoderAI/roder/releases/tag/roder/v0.4.6)
  and [CLI 0.4.7](https://github.com/RoderAI/roder/releases/tag/roder/v0.4.7).
- Released [custom provider contract](https://github.com/RoderAI/roder/blob/roder/v0.4.7/docs/custom-responses-providers.md),
  `ProviderConfig`, the extension host's custom Chat Completions adapter, and
  `custom_chat_provider` integration tests at the same release tag.
- Browser 0.4.6 sources and scoped verification are recorded in
  `site-update-2026-11-01.md`. Positioning sources and preservation rules are in
  `site-positioning-iteration.md`.

## Release safeguards

Use a fresh worktree based on current remote `master`. Copy actual approved
files: older released additions remain untracked in the original checkout and
must not be inferred as deletions from a Git diff. Exclude local browser artifacts,
dependency directories, credentials, and machine-specific automation state.
Preserve existing remote history and merge through the normal deployment path.

The requested native maintenance automation is configured separately from this
public repository. Its recurring work prepares and verifies updates; future
publishing requires renewed explicit approval.

## Pre-merge verification

- Production builds in the original checkout and release worktree: 124 pages.
- Release HTML scan: 6,447 internal route, fragment, and asset references;
  zero errors.
- Real-browser smoke checks: 12 routes at 360, 390, 900, and 1440 pixels
  (48 checks), all HTTP 200, correct canonical URLs, one H1, no horizontal
  overflow, broken loaded images, or page errors.
- Published CLI release synchronization reports no missing releases.
- `git diff --check` passed. No dependency or lockfile changes.
- Approved content was copied into a fresh remote-master-based release branch,
  with concurrent-upstream checks and no deletion of the original checkout's
  already-released untracked files.

## Released and verified

- [PR #3](https://github.com/RoderAI/roder-site/pull/3) merged as
  `cb24af45229b37097e48e1eaa123cdf104112a3f`.
- [GitHub Pages run 41761194267](https://github.com/RoderAI/roder-site/actions/runs/41761194267)
  built and deployed successfully.
- The same 48 browser checks passed on `https://roder.sh`; seven additional
  content checks confirmed the new homepage, Harness page, CLI 0.4.6/0.4.7
  articles, provider setup, OpenRouter snapshot, and browser gate instructions.
- Native recurring maintenance was saved and read back at 259,200 seconds,
  enabled, with overlapping runs forbidden and missed runs coalesced. The user
  explicitly accepted activation on the next Desktop restart; a fresh app-server
  startup confirmed the enabled persisted scheduler configuration. Existing
  Desktop sessions require that restart, and the owning app must remain running.
  Private machine configuration and automation identifiers are not committed here.
